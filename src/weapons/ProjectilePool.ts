import * as THREE from 'three';
import { ARENA_WIDTH, ARENA_DEPTH } from '../core/Constants';

export type ProjectileType = 'bullet' | 'rocket' | 'grenade' | 'fireball';

export interface Projectile {
  id: number;
  type: ProjectileType;
  active: boolean;
  x: number;
  y: number;
  z: number;
  dirX: number;
  dirZ: number;
  vx: number;
  vy: number;
  vz: number;
  speed: number;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  bounces: number;
  knockback?: number;
  mesh: THREE.Object3D;
}

export const PROJECTILE_CAPACITIES: Record<ProjectileType, number> = {
  bullet: 300,
  rocket: 40,
  grenade: 40,
  fireball: 60,
};

export class ProjectilePool {
  readonly group: THREE.Group;
  private pools: Record<ProjectileType, Projectile[]> = {
    bullet: [],
    rocket: [],
    grenade: [],
    fireball: [],
  };
  private freeLists: Record<ProjectileType, Projectile[]> = {
    bullet: [],
    rocket: [],
    grenade: [],
    fireball: [],
  };
  private activeList: Projectile[] = [];

  constructor(scene?: THREE.Scene | THREE.Group) {
    this.group = new THREE.Group();
    this.group.name = 'projectilePool';
    if (scene) {
      scene.add(this.group);
    }

    this.initPools();
  }

  get totalCapacity(): number {
    return (
      PROJECTILE_CAPACITIES.bullet +
      PROJECTILE_CAPACITIES.rocket +
      PROJECTILE_CAPACITIES.grenade +
      PROJECTILE_CAPACITIES.fireball
    );
  }

  private initPools(): void {
    let nextId = 1;

    // Shared geometries and materials per projectile type
    const bulletGeo = new THREE.BoxGeometry(0.12, 0.12, 0.4);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xF1C40F });

    const rocketGeo = new THREE.BoxGeometry(0.22, 0.22, 0.7);
    const rocketMat = new THREE.MeshBasicMaterial({ color: 0xE74C3C });

    const grenadeGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const grenadeMat = new THREE.MeshBasicMaterial({ color: 0x27AE60 });

    const fireballGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xE67E22 });

    const typeConfigs: Record<
      ProjectileType,
      { count: number; geo: THREE.BufferGeometry; mat: THREE.Material }
    > = {
      bullet: { count: PROJECTILE_CAPACITIES.bullet, geo: bulletGeo, mat: bulletMat },
      rocket: { count: PROJECTILE_CAPACITIES.rocket, geo: rocketGeo, mat: rocketMat },
      grenade: { count: PROJECTILE_CAPACITIES.grenade, geo: grenadeGeo, mat: grenadeMat },
      fireball: { count: PROJECTILE_CAPACITIES.fireball, geo: fireballGeo, mat: fireballMat },
    };

    for (const [typeKey, config] of Object.entries(typeConfigs) as [
      ProjectileType,
      { count: number; geo: THREE.BufferGeometry; mat: THREE.Material },
    ][]) {
      for (let i = 0; i < config.count; i++) {
        const mesh = new THREE.Mesh(config.geo, config.mat);
        mesh.visible = false;
        mesh.name = `${typeKey}_${i}`;
        this.group.add(mesh);

        const projectile: Projectile = {
          id: nextId++,
          type: typeKey,
          active: false,
          x: 0,
          y: 0,
          z: 0,
          dirX: 0,
          dirZ: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          speed: 0,
          damage: 0,
          radius: 0.2,
          life: 0,
          maxLife: 1.0,
          bounces: 0,
          mesh,
        };

        this.pools[typeKey].push(projectile);
        this.freeLists[typeKey].push(projectile);
      }
    }
  }

  spawn(
    type: ProjectileType,
    x: number,
    z: number,
    dirX: number,
    dirZ: number,
    damage: number,
    speed: number,
    knockback: number = 1.5
  ): Projectile | null {
    const freeList = this.freeLists[type];
    if (freeList.length === 0) {
      return null;
    }

    const p = freeList.pop()!;
    p.active = true;
    p.x = x;
    p.z = z;
    p.damage = damage;
    p.speed = speed;
    p.knockback = knockback;
    p.life = 0;
    p.bounces = 0;

    const len = Math.hypot(dirX, dirZ);
    const ndX = len > 0.0001 ? dirX / len : 1;
    const ndZ = len > 0.0001 ? dirZ / len : 0;
    p.dirX = ndX;
    p.dirZ = ndZ;
    p.vx = ndX * speed;
    p.vz = ndZ * speed;

    switch (type) {
      case 'bullet':
        p.y = 0.8;
        p.vy = 0;
        p.radius = 0.2;
        p.maxLife = 1.5;
        break;
      case 'rocket':
        p.y = 0.8;
        p.vy = 0;
        p.radius = 0.35;
        p.maxLife = 3.0;
        break;
      case 'grenade':
        p.y = 0.8;
        p.vy = 4.5;
        p.radius = 0.3;
        p.maxLife = 2.0;
        break;
      case 'fireball':
        p.y = 0.8;
        p.vy = 0;
        p.radius = 0.4;
        p.maxLife = 4.0;
        break;
    }

    p.mesh.position.set(p.x, p.y, p.z);
    p.mesh.rotation.set(0, Math.atan2(ndX, ndZ), 0);
    p.mesh.visible = true;

    this.activeList.push(p);
    return p;
  }

  update(dt: number, onHit?: (p: Projectile) => void): void {
    for (let i = this.activeList.length - 1; i >= 0; i--) {
      const p = this.activeList[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;

      if (p.type === 'grenade') {
        p.vy -= 16.0 * dt;
        p.y += p.vy * dt;
        if (p.y <= 0.15) {
          p.y = 0.15;
          p.vy = -p.vy * 0.45;
          if (Math.abs(p.vy) < 0.3) {
            p.vy = 0;
          }
          p.vx *= 0.88;
          p.vz *= 0.88;
          p.bounces++;
        }
        const hSpeed = Math.hypot(p.vx, p.vz);
        p.mesh.rotation.x += dt * hSpeed * 0.4;
        p.mesh.rotation.z += dt * hSpeed * 0.4;
      } else {
        p.y += p.vy * dt;
      }

      p.mesh.position.set(p.x, p.y, p.z);

      let shouldRecycle = false;
      let triggeredHit = false;

      // Expiration check
      if (p.life >= p.maxLife) {
        shouldRecycle = true;
        if (p.type === 'grenade' || p.type === 'rocket') {
          triggeredHit = true;
        }
      }

      // Out of bounds check using arena boundary constants
      const maxBoundX = ARENA_WIDTH / 2 + 4;
      const maxBoundZ = ARENA_DEPTH / 2 + 4;
      if (Math.abs(p.x) > maxBoundX || Math.abs(p.z) > maxBoundZ) {
        shouldRecycle = true;
      }

      if (shouldRecycle) {
        if (triggeredHit && onHit) {
          onHit(p);
        }
        this.recycleIndex(i);
      }
    }
  }

  recycle(p: Projectile): void {
    if (!p.active) return;
    const index = this.activeList.indexOf(p);
    if (index !== -1) {
      this.recycleIndex(index);
    }
  }

  private recycleIndex(index: number): void {
    const p = this.activeList[index];
    p.active = false;
    p.mesh.visible = false;

    // Fast swap with last element
    const last = this.activeList.pop()!;
    if (index < this.activeList.length) {
      this.activeList[index] = last;
    }

    this.freeLists[p.type].push(p);
  }

  clear(): void {
    while (this.activeList.length > 0) {
      this.recycleIndex(this.activeList.length - 1);
    }
  }

  getActive(): readonly Projectile[] {
    return this.activeList;
  }

  getActiveCount(type?: ProjectileType): number {
    if (!type) {
      return this.activeList.length;
    }
    let count = 0;
    for (let i = 0; i < this.activeList.length; i++) {
      if (this.activeList[i].type === type) {
        count++;
      }
    }
    return count;
  }

  getAvailableCount(type: ProjectileType): number {
    return this.freeLists[type].length;
  }

  getPoolSize(type: ProjectileType): number {
    return this.pools[type].length;
  }
}
