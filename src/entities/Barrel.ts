import * as THREE from 'three';
import {
  AABB,
  COLOR_BARREL_BODY,
  COLOR_BARREL_STRIPE,
  COLOR_OUTLINE,
} from '../core/Constants';
import type { ParticlePool } from '../fx/ParticlePool';
import type { BloodCanvas } from '../render/BloodCanvas';

export interface ExplosionContext {
  enemies?: Array<{
    id?: number;
    pos: { x: number; z: number };
    radius: number;
    alive?: boolean;
    takeDamage(amount: number): boolean;
  }>;
  player?: {
    pos: { x: number; z: number };
    radius: number;
    takeDamage(amount: number): boolean;
  };
  barrels?: Barrel[];
  fakeWalls?: Array<{
    pos: { x: number; z: number };
    alive?: boolean;
    takeDamage(amount: number): boolean;
  }>;
  particlePool?: ParticlePool;
  bloodCanvas?: BloodCanvas;
  onExplosionRing?: (x: number, z: number, damage: number, radius: number, isBiggerBang: boolean) => void;
}

// Module-level static geometries & materials to avoid GPU buffer leaks
let sharedBarrelBodyGeo: THREE.BoxGeometry | null = null;
let sharedBarrelBodyMat: THREE.MeshLambertMaterial | null = null;
let sharedBarrelBandGeo: THREE.BoxGeometry | null = null;
let sharedBarrelBandMat: THREE.MeshLambertMaterial | null = null;
let sharedBarrelEdgesGeo: THREE.EdgesGeometry | null = null;
let sharedBarrelLineMat: THREE.LineBasicMaterial | null = null;

interface BarrelResources {
  bodyGeo: THREE.BoxGeometry;
  bodyMat: THREE.MeshLambertMaterial;
  bandGeo: THREE.BoxGeometry;
  bandMat: THREE.MeshLambertMaterial;
  edgesGeo: THREE.EdgesGeometry;
  lineMat: THREE.LineBasicMaterial;
}

function getBarrelResources(): BarrelResources {
  if (!sharedBarrelBodyGeo || !sharedBarrelBodyMat || !sharedBarrelBandGeo || !sharedBarrelBandMat || !sharedBarrelEdgesGeo || !sharedBarrelLineMat) {
    sharedBarrelBodyGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    sharedBarrelBodyMat = new THREE.MeshLambertMaterial({
      color: COLOR_BARREL_BODY,
      flatShading: true,
    });
    sharedBarrelBandGeo = new THREE.BoxGeometry(1.22, 0.35, 1.22);
    sharedBarrelBandMat = new THREE.MeshLambertMaterial({
      color: COLOR_BARREL_STRIPE,
      flatShading: true,
    });
    sharedBarrelEdgesGeo = new THREE.EdgesGeometry(sharedBarrelBodyGeo);
    sharedBarrelLineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
  }
  return {
    bodyGeo: sharedBarrelBodyGeo,
    bodyMat: sharedBarrelBodyMat,
    bandGeo: sharedBarrelBandGeo,
    bandMat: sharedBarrelBandMat,
    edgesGeo: sharedBarrelEdgesGeo,
    lineMat: sharedBarrelLineMat,
  };
}

/**
 * Detonates a radial explosion dealing damage to all entities within radius.
 * Chains nearby explosive barrels, damages enemies/player/barricades,
 * spawns fiery particle bursts, and splatters blood if enemies are hit.
 */
export function detonateExplosion(
  x: number,
  z: number,
  radius: number,
  damage: number,
  context?: ExplosionContext
): void {
  // 1. Particle pool explosion bursts
  if (context?.particlePool) {
    context.particlePool.spawnBurst(x, z, 30, COLOR_BARREL_BODY, 12);
    context.particlePool.spawnBurst(x, z, 20, COLOR_BARREL_STRIPE, 9);
    context.particlePool.spawnBurst(x, z, 15, 0x444444, 6);
  }

  // 2. Damage nearby enemies & paint blood decals
  if (context?.enemies) {
    for (let i = 0; i < context.enemies.length; i++) {
      const enemy = context.enemies[i];
      if (enemy.alive === false) continue;
      const dist = Math.hypot(enemy.pos.x - x, enemy.pos.z - z);
      if (dist <= radius + enemy.radius) {
        enemy.takeDamage(damage);
        if (context.bloodCanvas) {
          context.bloodCanvas.addSplatter(enemy.pos.x, enemy.pos.z, 1.2, 10);
        }
      }
    }
  }

  // 3. Damage player if caught in blast
  if (context?.player) {
    const player = context.player;
    const dist = Math.hypot(player.pos.x - x, player.pos.z - z);
    if (dist <= radius + player.radius) {
      player.takeDamage(damage);
    }
  }

  // 4. Damage barricades / fake walls
  if (context?.fakeWalls) {
    for (let i = 0; i < context.fakeWalls.length; i++) {
      const wall = context.fakeWalls[i];
      if (wall.alive === false) continue;
      const dist = Math.hypot(wall.pos.x - x, wall.pos.z - z);
      if (dist <= radius + 0.75) {
        wall.takeDamage(damage);
      }
    }
  }

  // 5. Chain detonate nearby barrels
  if (context?.barrels) {
    for (let i = 0; i < context.barrels.length; i++) {
      const otherBarrel = context.barrels[i];
      if (!otherBarrel.alive || otherBarrel.exploded) continue;
      const dist = Math.hypot(otherBarrel.pos.x - x, otherBarrel.pos.z - z);
      const bRad = (otherBarrel as any).physicalRadius ?? 0.6;
      if (dist <= radius + bRad) {
        otherBarrel.takeDamage(damage, context);
      }
    }
  }
}

export class Barrel {
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public hp: number = 1;
  public maxHp: number = 1;
  public damage: number = 150;
  public radius: number = 4.5;
  public physicalRadius: number = 0.6;
  public alive: boolean = true;
  public exploded: boolean = false;
  public hasBigBang: boolean = false;
  public hasBiggerBang: boolean = false;
  public aabb?: AABB;
  public onDestroy?: (barrel: Barrel) => void;

  constructor(x: number = 0, z: number = 0) {
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'barrel';

    const res = getBarrelResources();

    // Red main body: 1.2 x 1.2 x 1.2
    const bodyMesh = new THREE.Mesh(res.bodyGeo, res.bodyMat);
    bodyMesh.position.set(0, 0.6, 0);
    group.add(bodyMesh);

    // Iconic hazard yellow band (#F1C40F)
    const bandMesh = new THREE.Mesh(res.bandGeo, res.bandMat);
    bandMesh.position.set(0, 0.6, 0);
    group.add(bandMesh);

    // Outlines: EdgesGeometry + LineSegments with #111111 per visual constraints
    const outline = new THREE.LineSegments(res.edgesGeo, res.lineMat);
    outline.position.set(0, 0.6, 0);
    group.add(outline);

    return group;
  }

  public getAABB(): AABB {
    const half = this.physicalRadius;
    return {
      minX: this.pos.x - half,
      maxX: this.pos.x + half,
      minZ: this.pos.z - half,
      maxZ: this.pos.z + half,
    };
  }

  public takeDamage(amount: number, context?: ExplosionContext): boolean {
    if (amount <= 0 || !this.alive || this.exploded) {
      return this.exploded;
    }

    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.explode(context);
    }
    return this.exploded;
  }

  public explode(context?: ExplosionContext): void {
    if (this.exploded) return;

    this.hp = 0;
    this.alive = false;
    this.exploded = true;
    this.mesh.visible = false;

    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }

    if (this.onDestroy) {
      this.onDestroy(this);
    }

    detonateExplosion(this.pos.x, this.pos.z, this.radius, this.damage, context);

    if (this.hasBigBang || this.hasBiggerBang) {
      context?.onExplosionRing?.(this.pos.x, this.pos.z, this.damage, this.radius, this.hasBiggerBang);
    }
  }
}
