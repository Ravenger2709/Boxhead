import * as THREE from 'three';
import { AABB } from '../core/Constants';
import { segmentIntersectsAABB } from '../physics/Collision2D';

export const COLOR_RAILGUN_CYAN = 0x00FFFF;
export const COLOR_RAILGUN_CORE = 0xE0FFFF;
export const RAILGUN_RANGE = 60;
export const RAILGUN_DEFAULT_DAMAGE = 100;
export const RAILGUN_LONG_SHOT_DAMAGE = 200;
export const RAILGUN_FADE_DURATION = 0.12;

export interface RailgunEnemyTarget {
  id?: number | string;
  x?: number;
  z?: number;
  pos?: { x: number; z: number };
  radius?: number;
  isDead?: boolean;
  alive?: boolean;
  hp?: number;
  vx?: number;
  vz?: number;
  takeDamage?: (amount: number) => boolean | void;
  applyKnockback?: (kx: number, kz: number) => void;
}

export interface RailgunObstacleTarget {
  id?: number | string;
  x?: number;
  z?: number;
  pos?: { x: number; z: number };
  size?: number;
  aabb?: AABB;
  getAABB?: () => AABB;
  alive?: boolean;
  hp?: number;
  takeDamage?: (amount: number) => boolean | void;
}

export interface RailgunFireOptions {
  obstacles?: RailgunObstacleTarget[];
  barricades?: RailgunObstacleTarget[];
  barrels?: RailgunObstacleTarget[];
  fakeWalls?: RailgunObstacleTarget[];
  particlePool?: {
    spawnBurst: (x: number, z: number, count: number, colorHex: number, speed: number, y?: number) => void;
  };
  audioManager?: {
    playRailgunLaser?: () => void;
  };
  scene?: THREE.Scene | THREE.Group;
}

export type RailgunFireResult = RailgunEnemyTarget[] & {
  hitEnemies: RailgunEnemyTarget[];
  hitObstacles: RailgunObstacleTarget[];
};

// Module-level cached shared geometries & materials to avoid GPU buffer allocations
let sharedRailgunGeo: THREE.BoxGeometry | null = null;
let sharedRailgunMat: THREE.MeshBasicMaterial | null = null;

function getRailgunResources(): { geo: THREE.BoxGeometry; mat: THREE.MeshBasicMaterial } {
  if (!sharedRailgunGeo || !sharedRailgunMat) {
    // 1x1x1 unit box scaled along Z for beam length, X/Y for beam thickness
    sharedRailgunGeo = new THREE.BoxGeometry(1, 1, 1);
    sharedRailgunMat = new THREE.MeshBasicMaterial({
      color: COLOR_RAILGUN_CYAN,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
  }
  return { geo: sharedRailgunGeo, mat: sharedRailgunMat };
}

/**
 * Railgun piercing laser hitscan action.
 * Instant line trace across 60m piercing all enemies and barricades in line.
 */
export class RailgunBeam {
  public damage: number = RAILGUN_DEFAULT_DAMAGE;
  public range: number = RAILGUN_RANGE;
  public fadeDuration: number = RAILGUN_FADE_DURATION;
  public fadeTimer: number = 0;
  public beamWidth: number = 0.2;
  public beamRadius: number = 0;
  public knockback: number = 20;

  public mesh: THREE.Mesh;
  public material: THREE.MeshBasicMaterial;

  constructor(scene?: THREE.Scene | THREE.Group) {
    const { geo, mat } = getRailgunResources();
    this.material = mat.clone();
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.name = 'railgunBeam';
    this.mesh.visible = false;

    if (scene) {
      scene.add(this.mesh);
    }
  }

  /**
   * Sets damage property and dynamically adjusts beam width for Long Shot upgrade.
   */
  public setDamage(damage: number): void {
    this.damage = damage;
    if (damage >= RAILGUN_LONG_SHOT_DAMAGE) {
      this.beamWidth = 0.38;
    } else {
      this.beamWidth = 0.2;
    }
  }

  /**
   * Line trace detecting all living enemies intersecting the ray segment.
   * Piercing: does not stop on first hit; returns all pierced enemies ordered by distance from origin.
   */
  public trace(
    originX: number,
    originZ: number,
    angle: number,
    range: number = this.range,
    enemies: RailgunEnemyTarget[] = []
  ): RailgunEnemyTarget[] {
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    const hits: Array<{ enemy: RailgunEnemyTarget; distance: number }> = [];

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];

      // Filter out dead or inactive enemies
      if (e.isDead === true) continue;
      if (e.alive === false) continue;
      if (typeof e.hp === 'number' && e.hp <= 0) continue;

      const ex = typeof e.x === 'number' ? e.x : (e.pos ? e.pos.x : 0);
      const ez = typeof e.z === 'number' ? e.z : (e.pos ? e.pos.z : 0);
      const eradius = typeof e.radius === 'number' ? e.radius : 0.65;

      const vx = ex - originX;
      const vz = ez - originZ;

      // Projection along ray direction
      const t = vx * dirX + vz * dirZ;
      const tClamped = Math.max(0, Math.min(range, t));

      const qx = originX + dirX * tClamped;
      const qz = originZ + dirZ * tClamped;

      const distSq = (ex - qx) * (ex - qx) + (ez - qz) * (ez - qz);
      const maxDist = eradius + this.beamRadius;

      if (distSq <= maxDist * maxDist) {
        hits.push({ enemy: e, distance: t });
      }
    }

    // Sequence ordered by distance along the ray from origin
    hits.sort((a, b) => a.distance - b.distance);
    return hits.map((h) => h.enemy);
  }

  /**
   * Tests segment-AABB intersection against all living barricades and obstacles.
   * Returns all pierced obstacles ordered by distance along the ray.
   */
  public traceObstacles(
    originX: number,
    originZ: number,
    angle: number,
    range: number = this.range,
    obstacles: RailgunObstacleTarget[] = []
  ): RailgunObstacleTarget[] {
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);
    const endX = originX + dirX * range;
    const endZ = originZ + dirZ * range;

    const hits: Array<{ obstacle: RailgunObstacleTarget; distance: number }> = [];

    for (let i = 0; i < obstacles.length; i++) {
      const obs = obstacles[i];
      if (obs.alive === false) continue;
      if (typeof obs.hp === 'number' && obs.hp <= 0) continue;

      let aabb: AABB;
      if (obs.getAABB) {
        aabb = obs.getAABB();
      } else if (obs.aabb) {
        aabb = obs.aabb;
      } else {
        const ox = typeof obs.x === 'number' ? obs.x : (obs.pos ? obs.pos.x : 0);
        const oz = typeof obs.z === 'number' ? obs.z : (obs.pos ? obs.pos.z : 0);
        const halfSize = (obs.size ?? 1.2) * 0.5;
        aabb = {
          minX: ox - halfSize,
          maxX: ox + halfSize,
          minZ: oz - halfSize,
          maxZ: oz + halfSize,
        };
      }

      if (segmentIntersectsAABB(originX, originZ, endX, endZ, aabb)) {
        const cx = (aabb.minX + aabb.maxX) * 0.5;
        const cz = (aabb.minZ + aabb.maxZ) * 0.5;
        const t = (cx - originX) * dirX + (cz - originZ) * dirZ;
        hits.push({ obstacle: obs, distance: t });
      }
    }

    hits.sort((a, b) => a.distance - b.distance);
    return hits.map((h) => h.obstacle);
  }

  /**
   * Activates visual glowing laser beam mesh.
   */
  public activateBeam(
    originX: number,
    originZ: number,
    angle: number,
    range: number = this.range,
    scene?: THREE.Scene | THREE.Group
  ): void {
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    // Position mesh at midpoint between origin and ray endpoint
    this.mesh.position.set(
      originX + dirX * range * 0.5,
      0.5,
      originZ + dirZ * range * 0.5
    );
    this.mesh.rotation.set(0, Math.atan2(dirX, dirZ), 0);
    this.mesh.scale.set(this.beamWidth, this.beamWidth, range);

    this.material.opacity = 1.0;
    this.mesh.visible = true;
    this.fadeTimer = this.fadeDuration;

    if (scene && this.mesh.parent !== scene) {
      scene.add(this.mesh);
    }
  }

  /**
   * Performs hitscan trace, activates visual beam, triggers particle ionization trail,
   * audio effect, and applies damage & knockback to all pierced entities.
   */
  public fire(
    originX: number,
    originZ: number,
    angle: number,
    range: number = this.range,
    targets: RailgunEnemyTarget[] = [],
    options?: RailgunFireOptions
  ): RailgunFireResult {
    const hitEnemies = this.trace(originX, originZ, angle, range, targets);

    const allObstacles: RailgunObstacleTarget[] = [
      ...(options?.obstacles ?? []),
      ...(options?.barricades ?? []),
      ...(options?.barrels ?? []),
      ...(options?.fakeWalls ?? []),
    ];

    const hitObstacles =
      allObstacles.length > 0
        ? this.traceObstacles(originX, originZ, angle, range, allObstacles)
        : [];

    const kx = Math.cos(angle) * this.knockback;
    const kz = Math.sin(angle) * this.knockback;

    for (let i = 0; i < hitEnemies.length; i++) {
      const enemy = hitEnemies[i];
      if (enemy.takeDamage) {
        enemy.takeDamage(this.damage);
      } else if (typeof enemy.hp === 'number') {
        enemy.hp -= this.damage;
      }

      if (enemy.applyKnockback) {
        enemy.applyKnockback(kx, kz);
      } else if (typeof enemy.vx === 'number' && typeof enemy.vz === 'number') {
        enemy.vx += kx;
        enemy.vz += kz;
      }
    }

    for (let i = 0; i < hitObstacles.length; i++) {
      const obs = hitObstacles[i];
      if (obs.takeDamage) {
        obs.takeDamage(this.damage);
      } else if (typeof obs.hp === 'number') {
        obs.hp -= this.damage;
      }
    }

    // Audio effect
    options?.audioManager?.playRailgunLaser?.();

    // Particle ionization trail
    if (options?.particlePool) {
      const step = 3.0;
      for (let d = 2.0; d < range; d += step) {
        const px = originX + Math.cos(angle) * d;
        const pz = originZ + Math.sin(angle) * d;
        options.particlePool.spawnBurst(px, pz, 2, COLOR_RAILGUN_CYAN, 1.5, 0.5);
      }
    }

    // Visual beam activation
    this.activateBeam(originX, originZ, angle, range, options?.scene);

    return Object.assign([...hitEnemies], {
      hitEnemies,
      hitObstacles,
    });
  }

  /**
   * Updates visual beam opacity fading out over 0.12s.
   */
  public update(dt: number): void {
    if (this.fadeTimer > 0) {
      this.fadeTimer -= dt;
      if (this.fadeTimer <= 0) {
        this.fadeTimer = 0;
        this.mesh.visible = false;
        this.material.opacity = 0;
      } else {
        this.material.opacity = Math.max(0, this.fadeTimer / this.fadeDuration);
      }
    }
  }
}

export { RailgunBeam as Railgun };
