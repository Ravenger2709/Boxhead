import * as THREE from 'three';
import {
  AABB,
  ARENA_WIDTH,
  ARENA_DEPTH,
} from '../core/Constants';
import { SpatialGrid } from '../physics/SpatialGrid';
import { Zombie } from './Zombie';
import { Devil } from './Devil';
import type { Player } from './Player';
import type { ProjectilePool } from '../weapons/ProjectilePool';

export interface Enemy {
  id: number;
  mesh: THREE.Group;
  pos: { x: number; z: number };
  hp: number;
  speed: number;
  radius: number;
  alive: boolean;
  contactDamage: number;
  update(
    dt: number,
    playerPos: { x: number; z: number },
    obstacles: AABB[],
    spatialGrid: SpatialGrid
  ): void;
  takeDamage(amount: number): boolean;
  canAttack?: () => boolean;
  triggerAttack?: () => void;
  attackCooldown?: number;
}

export class EnemyManager {
  public enemies: Enemy[] = [];
  public spatialGrid: SpatialGrid;
  public scene?: THREE.Scene | THREE.Group;
  public projectilePool?: ProjectilePool;
  public onEnemyKilled?: (enemy: Enemy, byPlayer: boolean) => void;

  constructor(
    scene?: THREE.Scene | THREE.Group,
    projectilePool?: ProjectilePool,
    spatialGrid?: SpatialGrid
  ) {
    this.scene = scene;
    this.projectilePool = projectilePool;
    this.spatialGrid = spatialGrid ?? new SpatialGrid(4.0);
  }

  public spawnZombie(x: number, z: number): Zombie {
    const zombie = new Zombie(x, z);
    this.enemies.push(zombie);
    if (this.scene) {
      this.scene.add(zombie.mesh);
    }
    return zombie;
  }

  public spawnDevil(x: number, z: number): Devil {
    const devil = new Devil(x, z);
    if (this.projectilePool) {
      devil.projectilePool = this.projectilePool;
    }
    this.enemies.push(devil);
    if (this.scene) {
      this.scene.add(devil.mesh);
    }
    return devil;
  }

  public spawnAtPerimeter(type: 'zombie' | 'devil' = 'zombie'): Enemy {
    const halfW = ARENA_WIDTH / 2;
    const halfD = ARENA_DEPTH / 2;
    const margin = 2.0;

    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let z = 0;

    switch (edge) {
      case 0: // North edge
        x = (Math.random() * 2 - 1) * (halfW - margin);
        z = -halfD + margin;
        break;
      case 1: // South edge
        x = (Math.random() * 2 - 1) * (halfW - margin);
        z = halfD - margin;
        break;
      case 2: // West edge
        x = -halfW + margin;
        z = (Math.random() * 2 - 1) * (halfD - margin);
        break;
      case 3: // East edge
      default:
        x = halfW - margin;
        z = (Math.random() * 2 - 1) * (halfD - margin);
        break;
    }

    if (type === 'devil') {
      return this.spawnDevil(x, z);
    }
    return this.spawnZombie(x, z);
  }

  public update(
    dt: number,
    player: Player | { pos: { x: number; z: number }; radius: number; hp?: number; takeDamage?: (dmg: number) => boolean },
    obstacles: AABB[] = []
  ): void {
    // 1. Spatial Grid update: clear and insert all active enemies
    this.spatialGrid.clear();
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.alive) {
        this.spatialGrid.insert(enemy.id, enemy.pos.x, enemy.pos.z);
      }
    }

    // 2. Update each enemy
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.alive) {
        enemy.update(dt, player.pos, obstacles, this.spatialGrid);
      }
    }

    // 3. Contact damage check against player
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (!enemy.alive) continue;

      const dist = Math.hypot(player.pos.x - enemy.pos.x, player.pos.z - enemy.pos.z);
      if (dist <= enemy.radius + player.radius) {
        const canAtk = enemy.canAttack ? enemy.canAttack() : true;
        if (canAtk) {
          player.takeDamage?.(enemy.contactDamage);
          if (enemy.triggerAttack) {
            enemy.triggerAttack();
          }
        }
      }
    }

    // 4. ProjectilePool fireball collisions against player
    if (this.projectilePool) {
      const projectiles = this.projectilePool.getActive();
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (p.type === 'fireball' && p.active) {
          const pDist = Math.hypot(player.pos.x - p.x, player.pos.z - p.z);
          if (pDist <= p.radius + player.radius) {
            player.takeDamage?.(p.damage);
            this.projectilePool.recycle(p);
          }
        }
      }
    }

    // 5. Remove dead enemies from active list and scene
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy.alive || enemy.hp <= 0) {
        enemy.alive = false;
        if (this.scene && enemy.mesh.parent === this.scene) {
          this.scene.remove(enemy.mesh);
        }
        if (this.onEnemyKilled) {
          this.onEnemyKilled(enemy, true);
        }
        this.enemies.splice(i, 1);
      }
    }
  }

  public clear(): void {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (this.scene && enemy.mesh.parent === this.scene) {
        this.scene.remove(enemy.mesh);
      }
    }
    this.enemies = [];
    this.spatialGrid.clear();
  }
}
