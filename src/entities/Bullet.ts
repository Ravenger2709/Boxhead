import * as THREE from 'three';
import {
  AABB,
  ZOMBIE_MASS,
  DEVIL_MASS,
} from '../core/Constants';

export interface HitscanTargets {
  enemies?: any[];
  obstacles?: AABB[];
  barrels?: any[];
  fakeWalls?: any[];
  player?: any;
  players?: any[];
  shooter?: any;
  friendlyFire?: boolean;
  bloodCanvas?: any;
  particlePool?: any;
  damageNumberPool?: any;
  scene?: THREE.Scene | THREE.Group;
  projectilePool?: any;
}

export interface HitscanHitResult {
  hit: boolean;
  point: { x: number; z: number };
  distance: number;
  targetType: 'enemy' | 'barrel' | 'fakewall' | 'obstacle' | 'player' | 'none';
  target?: any;
  normalX?: number;
  normalZ?: number;
}

/**
 * 2-Frame fading tracer line mesh.
 * Authentic Flash Boxhead tracer that fades out over exactly 2 frames (~0.033s at 60 FPS).
 */
export class BulletTracer {
  public line: THREE.Line;
  public active: boolean = false;
  public life: number = 0;
  public maxLife: number = 2 / 60; // 2 frames at 60 FPS (~0.0333s)
  private material: THREE.LineBasicMaterial;
  private geometry: THREE.BufferGeometry;

  constructor(scene?: THREE.Scene | THREE.Group) {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 vertices: (x1, y1, z1) -> (x2, y2, z2)
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.LineBasicMaterial({
      color: 0xF1C40F, // Iconic yellow tracer
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    this.line = new THREE.Line(this.geometry, this.material);
    this.line.name = 'bulletTracer';
    this.line.visible = false;
    if (scene) {
      scene.add(this.line);
    }
  }

  public spawn(x1: number, z1: number, x2: number, z2: number, y: number = 0.8): void {
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    arr[0] = x1;
    arr[1] = y;
    arr[2] = z1;
    arr[3] = x2;
    arr[4] = y;
    arr[5] = z2;
    posAttr.needsUpdate = true;

    this.material.opacity = 1.0;
    this.line.visible = true;
    this.active = true;
    this.life = 0;
  }

  public update(dt: number): boolean {
    if (!this.active) return false;
    this.life += dt;
    if (this.life >= this.maxLife) {
      this.active = false;
      this.line.visible = false;
      this.material.opacity = 0;
      return false;
    }
    this.material.opacity = Math.max(0, 1.0 - this.life / this.maxLife);
    return true;
  }

  public dispose(): void {
    if (this.line.parent) {
      this.line.parent.remove(this.line);
    }
    this.geometry.dispose();
    this.material.dispose();
  }
}

export class BulletTracerPool {
  private pool: BulletTracer[] = [];
  public scene?: THREE.Scene | THREE.Group;

  constructor(scene?: THREE.Scene | THREE.Group, initialCount: number = 40) {
    this.scene = scene;
    for (let i = 0; i < initialCount; i++) {
      this.pool.push(new BulletTracer(scene));
    }
  }

  public spawn(x1: number, z1: number, x2: number, z2: number, y: number = 0.8): BulletTracer {
    let tracer = this.pool.find((t) => !t.active);
    if (!tracer) {
      tracer = new BulletTracer(this.scene);
      this.pool.push(tracer);
    }
    tracer.spawn(x1, z1, x2, z2, y);
    return tracer;
  }

  public update(dt: number): void {
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        this.pool[i].update(dt);
      }
    }
  }

  public clear(): void {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].active = false;
      this.pool[i].line.visible = false;
    }
  }

  public getActiveCount(): number {
    return this.pool.filter((t) => t.active).length;
  }
}

/**
 * Intersects a 2D ray from (x1, z1) along unit direction (dirX, dirZ) with a circle at (cx, cz) with radius.
 * Returns distance t >= 0 along ray to entry point, or null if no intersection within maxDist.
 */
export function intersectRayCircle(
  x1: number,
  z1: number,
  dirX: number,
  dirZ: number,
  maxDist: number,
  cx: number,
  cz: number,
  radius: number
): number | null {
  const vx = cx - x1;
  const vz = cz - z1;
  const tProj = vx * dirX + vz * dirZ;
  const perpSq = vx * vx + vz * vz - tProj * tProj;
  if (perpSq > radius * radius) {
    return null;
  }
  const halfChord = Math.sqrt(Math.max(0, radius * radius - perpSq));
  let tEntry = tProj - halfChord;
  if (tEntry < 0) {
    tEntry = tProj + halfChord;
  }
  if (tEntry >= 0 && tEntry <= maxDist) {
    return tEntry;
  }
  return null;
}

/**
 * Intersects a 2D ray from (x1, z1) along unit direction (dirX, dirZ) with an AABB.
 * Returns distance t >= 0 along ray to entry point, or null if no intersection within maxDist.
 */
export function intersectRayAABB(
  x1: number,
  z1: number,
  dirX: number,
  dirZ: number,
  maxDist: number,
  box: AABB
): number | null {
  let tMin = 0;
  let tMax = maxDist;

  if (Math.abs(dirX) > 1e-9) {
    let t1 = (box.minX - x1) / dirX;
    let t2 = (box.maxX - x1) / dirX;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  } else if (x1 < box.minX || x1 > box.maxX) {
    return null;
  }

  if (Math.abs(dirZ) > 1e-9) {
    let t1 = (box.minZ - z1) / dirZ;
    let t2 = (box.maxZ - z1) / dirZ;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  } else if (z1 < box.minZ || z1 > box.maxZ) {
    return null;
  }

  if (tMin <= maxDist && tMax >= 0) {
    return Math.max(0, tMin);
  }
  return null;
}

/**
 * Collide_Line: Instant ray trace matching Flash ActionScript 2 bytecode.
 * Traces from (x1, z1) to (x2, z2) checking obstacles, barrels, fake walls, and enemies.
 * Returns closest hit point, target, and distance.
 */
export function Collide_Line(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  targets: HitscanTargets = {}
): HitscanHitResult {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const totalDist = Math.hypot(dx, dz);
  if (totalDist < 1e-6) {
    return {
      hit: false,
      point: { x: x1, z: z1 },
      distance: 0,
      targetType: 'none',
    };
  }

  const dirX = dx / totalDist;
  const dirZ = dz / totalDist;

  let closestDist = totalDist;
  let closestTarget: any = null;
  let closestType: 'enemy' | 'barrel' | 'fakewall' | 'obstacle' | 'player' | 'none' = 'none';

  // 1. Static obstacles (walls & pillars)
  if (targets.obstacles) {
    for (let i = 0; i < targets.obstacles.length; i++) {
      const box = targets.obstacles[i];
      const t = intersectRayAABB(x1, z1, dirX, dirZ, closestDist, box);
      if (t !== null && t < closestDist) {
        closestDist = t;
        closestTarget = box;
        closestType = 'obstacle';
      }
    }
  }

  // 2. Barrels
  if (targets.barrels) {
    for (let i = 0; i < targets.barrels.length; i++) {
      const b = targets.barrels[i];
      if (!b.alive || b.exploded) continue;
      const bRad = (b as any).physicalRadius ?? 0.6;
      const t = intersectRayCircle(x1, z1, dirX, dirZ, closestDist, b.pos.x, b.pos.z, bRad);
      if (t !== null && t < closestDist) {
        closestDist = t;
        closestTarget = b;
        closestType = 'barrel';
      }
    }
  }

  // 3. Fake walls
  if (targets.fakeWalls) {
    for (let i = 0; i < targets.fakeWalls.length; i++) {
      const fw = targets.fakeWalls[i];
      if (!fw.alive) continue;
      const box = fw.getAABB ? fw.getAABB() : fw.aabb;
      if (box) {
        const t = intersectRayAABB(x1, z1, dirX, dirZ, closestDist, box);
        if (t !== null && t < closestDist) {
          closestDist = t;
          closestTarget = fw;
          closestType = 'fakewall';
        }
      }
    }
  }

  // 4. Enemies
  if (targets.enemies) {
    for (let i = 0; i < targets.enemies.length; i++) {
      const enemy = targets.enemies[i];
      if (enemy.alive === false || (typeof enemy.hp === 'number' && enemy.hp <= 0)) continue;
      const ex = enemy.pos ? enemy.pos.x : (enemy.x ?? 0);
      const ez = enemy.pos ? enemy.pos.z : (enemy.z ?? 0);
      const eradius = enemy.radius ?? 0.65;
      const t = intersectRayCircle(x1, z1, dirX, dirZ, closestDist, ex, ez, eradius);
      if (t !== null && t < closestDist) {
        closestDist = t;
        closestTarget = enemy;
        closestType = 'enemy';
      }
    }
  }

  // 5. Player(s) (if targetable)
  const candidatePlayers: any[] = [];
  if (targets.players && Array.isArray(targets.players)) {
    candidatePlayers.push(...targets.players);
  } else if (targets.player) {
    candidatePlayers.push(targets.player);
  }

  for (let i = 0; i < candidatePlayers.length; i++) {
    const player = candidatePlayers[i];
    if (!player || (typeof player.hp === 'number' && player.hp <= 0)) continue;
    // Bullet never damages the shooter who fired it
    if (targets.shooter && player === targets.shooter) continue;
    // If fired by a player and friendly fire is disabled, ignore other player
    if (targets.shooter && targets.friendlyFire === false) continue;

    const px = player.pos ? player.pos.x : (player.x ?? 0);
    const pz = player.pos ? player.pos.z : (player.z ?? 0);
    const pradius = player.radius ?? 0.7;
    const t = intersectRayCircle(x1, z1, dirX, dirZ, closestDist, px, pz, pradius);
    if (t !== null && t < closestDist) {
      closestDist = t;
      closestTarget = player;
      closestType = 'player';
    }
  }

  const hit = closestType !== 'none';
  return {
    hit,
    point: {
      x: x1 + dirX * closestDist,
      z: z1 + dirZ * closestDist,
    },
    distance: closestDist,
    targetType: closestType,
    target: closestTarget,
  };
}

/**
 * Fires an instant hitscan bullet.
 * Resolves damage and knockback on the frame of fire; draws a 2-frame fading tracer line.
 */
export function fireHitscanBullet(
  originX: number,
  originZ: number,
  dirX: number,
  dirZ: number,
  damage: number,
  range: number = 60,
  knockback: number = 1.5,
  targets: HitscanTargets = {},
  speed: number = 55
): HitscanHitResult {
  const len = Math.hypot(dirX, dirZ);
  const ndx = len > 1e-6 ? dirX / len : 0;
  const ndz = len > 1e-6 ? dirZ / len : 1;

  const targetX = originX + ndx * range;
  const targetZ = originZ + ndz * range;

  const result = Collide_Line(originX, originZ, targetX, targetZ, targets);
  const hitX = result.point.x;
  const hitZ = result.point.z;

  // 1. Resolve damage, knockback, and effects on frame of fire
  if (result.hit && result.target) {
    if (result.targetType === 'enemy') {
      const enemy = result.target;
      enemy.takeDamage(damage);

      // Knockback impulse = damage / 5 * 2 / mass (Zombie mass = 1, Devil mass = 5)
      const mass = enemy.mass ?? (enemy.type === 'devil' ? DEVIL_MASS : ZOMBIE_MASS);
      const impulse = (damage / 5) * 2 / mass;

      if (typeof enemy.applyKnockback === 'function') {
        enemy.applyKnockback(ndx, ndz, damage);
      } else {
        enemy.pos.x += ndx * impulse * 0.1;
        enemy.pos.z += ndz * impulse * 0.1;
      }

      // Decals and FX
      targets.bloodCanvas?.addSplatter(enemy.pos.x, enemy.pos.z, 0.9, 8);
      targets.particlePool?.spawnBurst(hitX, hitZ, 10, 0x8B0000, 4.5);
      targets.damageNumberPool?.spawn?.(hitX, hitZ, damage, false);
    } else if (result.targetType === 'barrel') {
      const barrel = result.target;
      const explosionContext = {
        enemies: targets.enemies,
        player: targets.player,
        barrels: targets.barrels,
        fakeWalls: targets.fakeWalls,
        particlePool: targets.particlePool,
        bloodCanvas: targets.bloodCanvas,
      };
      barrel.takeDamage(damage, explosionContext);
      targets.particlePool?.spawnBurst(hitX, hitZ, 6, 0xE74C3C, 3.5);
    } else if (result.targetType === 'fakewall') {
      const wall = result.target;
      wall.takeDamage(damage);
      targets.particlePool?.spawnBurst(hitX, hitZ, 6, 0x8D6E63, 3.0);
    } else if (result.targetType === 'obstacle') {
      targets.particlePool?.spawnBurst(hitX, hitZ, 4, 0xCCCCCC, 2.5);
    } else if (result.targetType === 'player') {
      const player = result.target;
      player.takeDamage(damage, ndx, ndz);
    }
  }

  // 2. Draw 2-frame fading tracer line
  if (targets.scene) {
    const sceneObj = targets.scene as any;
    if (!sceneObj._bulletTracerPool) {
      sceneObj._bulletTracerPool = new BulletTracerPool(targets.scene);
    }
    sceneObj._bulletTracerPool.spawn(originX, originZ, hitX, hitZ);
  }

  // 3. Maintain projectilePool backward compatibility (2-frame life, marked as tracer)
  if (targets.projectilePool) {
    const p = targets.projectilePool.spawn(
      'bullet',
      originX,
      originZ,
      ndx,
      ndz,
      damage,
      speed,
      knockback,
      2 / 60
    );
    if (p) {
      (p as any).isHitscanTracer = true;
    }
  }

  return result;
}

/**
 * Bullet representation object.
 */
export class Bullet {
  public x: number;
  public z: number;
  public dirX: number;
  public dirZ: number;
  public damage: number;
  public range: number;
  public speed: number;
  public knockback: number;
  public active: boolean = true;

  constructor(
    x: number = 0,
    z: number = 0,
    dirX: number = 0,
    dirZ: number = 1,
    damage: number = 15,
    range: number = 60,
    speed: number = 55,
    knockback: number = 1.5
  ) {
    this.x = x;
    this.z = z;
    this.dirX = dirX;
    this.dirZ = dirZ;
    this.damage = damage;
    this.range = range;
    this.speed = speed;
    this.knockback = knockback;
  }

  public fire(targets: HitscanTargets = {}): HitscanHitResult {
    return fireHitscanBullet(
      this.x,
      this.z,
      this.dirX,
      this.dirZ,
      this.damage,
      this.range,
      this.knockback,
      targets
    );
  }
}
