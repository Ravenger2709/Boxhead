import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Zombie } from '../../src/entities/Zombie';
import { Devil } from '../../src/entities/Devil';
import { EnemyManager } from '../../src/entities/EnemyManager';
import { SpatialGrid } from '../../src/physics/SpatialGrid';
import {
  ZOMBIE_HP,
  ZOMBIE_RADIUS,
  ZOMBIE_SPEED,
  ZOMBIE_CONTACT_DAMAGE,
  ZOMBIE_ATTACK_COOLDOWN,
  DEVIL_HP,
  DEVIL_RADIUS,
  DEVIL_SPEED,
  DEVIL_FIREBALL_COOLDOWN,
  COLOR_ZOMBIE_TORSO,
  COLOR_ZOMBIE_SKIN,
  COLOR_DEVIL_BODY,
  COLOR_DEVIL_EYES,
  AABB,
} from '../../src/core/Constants';
import { Player } from '../../src/entities/Player';
import { ProjectilePool } from '../../src/weapons/ProjectilePool';

describe('Task 6: Zombie Horde AI & Devil Entities', () => {
  describe('Zombie Entity Initialization & Mesh', () => {
    it('should initialize zombie with correct default stats and Boxhead mesh', () => {
      const zombie = new Zombie(5, 10);
      expect(zombie.pos.x).toBe(5);
      expect(zombie.pos.z).toBe(10);
      expect(zombie.hp).toBe(ZOMBIE_HP);
      expect(zombie.radius).toBe(ZOMBIE_RADIUS);
      expect(zombie.speed).toBe(ZOMBIE_SPEED);
      expect(zombie.alive).toBe(true);
      expect(zombie.contactDamage).toBe(ZOMBIE_CONTACT_DAMAGE);

      // Verify mesh structure
      expect(zombie.mesh).toBeInstanceOf(THREE.Group);
      expect(zombie.mesh.position.x).toBe(5);
      expect(zombie.mesh.position.z).toBe(10);

      const meshes: THREE.Mesh[] = [];
      zombie.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      });

      // Must have torso, head, and at least 2 outstretched arms
      expect(meshes.length).toBeGreaterThanOrEqual(4);

      // Verify flatShading: true on all materials
      meshes.forEach((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        expect(mat.flatShading).toBe(true);
      });

      // Find torso with COLOR_ZOMBIE_TORSO (#BDC3C7)
      const torso = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return mat.color.getHex() === COLOR_ZOMBIE_TORSO;
      });
      expect(torso).toBeDefined();

      // Find dull greenish head with COLOR_ZOMBIE_SKIN (#7F8C8D)
      const head = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return (
          mat.color.getHex() === COLOR_ZOMBIE_SKIN &&
          (m.geometry as THREE.BoxGeometry).parameters.height >= 0.5
        );
      });
      expect(head).toBeDefined();

      // Verify forward-outstretched arms
      const arms = meshes.filter((m) => m !== torso && m !== head);
      expect(arms.length).toBeGreaterThanOrEqual(2);
    });

    it('should take damage, reduce hp, and die when hp reaches 0', () => {
      const zombie = new Zombie(0, 0);
      const dead1 = zombie.takeDamage(10);
      expect(zombie.hp).toBe(20);
      expect(dead1).toBe(false);
      expect(zombie.alive).toBe(true);

      const dead2 = zombie.takeDamage(20);
      expect(zombie.hp).toBe(0);
      expect(dead2).toBe(true);
      expect(zombie.alive).toBe(false);

      // Overkill should stay at 0
      const dead3 = zombie.takeDamage(50);
      expect(zombie.hp).toBe(0);
      expect(dead3).toBe(true);
    });

    it('should handle attack cooldown for contact damage', () => {
      const zombie = new Zombie(0, 0);
      expect(zombie.canAttack()).toBe(true);

      zombie.triggerAttack();
      expect(zombie.canAttack()).toBe(false);
      expect(zombie.attackCooldown).toBeCloseTo(ZOMBIE_ATTACK_COOLDOWN);

      // Advance time halfway
      zombie.updateCooldown(ZOMBIE_ATTACK_COOLDOWN * 0.5);
      expect(zombie.canAttack()).toBe(false);

      // Advance remaining time
      zombie.updateCooldown(ZOMBIE_ATTACK_COOLDOWN * 0.6);
      expect(zombie.canAttack()).toBe(true);
    });
  });

  describe('Flocking & Separation Steering Behavior', () => {
    it('should steer a single zombie directly toward the player when unhindered', () => {
      const zombie = new Zombie(0, 0);
      const grid = new SpatialGrid(4.0);
      grid.insert(zombie.id, zombie.pos.x, zombie.pos.z);

      const playerPos = { x: 0, z: 10 };
      const dt = 0.1;
      zombie.update(dt, playerPos, [], grid);

      // Should move straight in +Z direction with speed ZOMBIE_SPEED
      expect(zombie.pos.x).toBeCloseTo(0);
      expect(zombie.pos.z).toBeCloseTo(ZOMBIE_SPEED * dt);
      expect(zombie.mesh.position.z).toBeCloseTo(zombie.pos.z);
    });

    it('should calculate repulsive separation vector between two close zombies', () => {
      // Zombie 1 at (0, 0), Zombie 2 at (0.5, 0)
      // Player is straight ahead at (0, 10)
      const z1 = new Zombie(0, 0);
      const z2 = new Zombie(0.5, 0);

      const grid = new SpatialGrid(4.0);
      grid.insert(z1.id, z1.pos.x, z1.pos.z);
      grid.insert(z2.id, z2.pos.x, z2.pos.z);

      const playerPos = { x: 0, z: 10 };
      const dt = 0.1;

      // Update both zombies
      z1.update(dt, playerPos, [], grid);
      z2.update(dt, playerPos, [], grid);

      // Because z2 is to the right (+X) of z1:
      // z1 must experience a repulsive force pushing it to the LEFT (-X)
      // z2 must experience a repulsive force pushing it to the RIGHT (+X)
      expect(z1.pos.x).toBeLessThan(0);
      expect(z2.pos.x).toBeGreaterThan(0.5);

      // Both should still advance towards +Z
      expect(z1.pos.z).toBeGreaterThan(0);
      expect(z2.pos.z).toBeGreaterThan(0);

      // The distance between them along X must have INCREASED due to separation repulsion
      const finalDistX = z2.pos.x - z1.pos.x;
      expect(finalDistX).toBeGreaterThan(0.5);
    });

    it('should slide along obstacles without penetrating walls', () => {
      // Wall from minZ: 4.0 to maxZ: 6.0, spanning X: -10 to 10
      const wall: AABB = { minX: -10, maxX: 10, minZ: 4.0, maxZ: 6.0 };
      // Zombie at (0, 3.5), player at (0, 10) on other side of wall
      const zombie = new Zombie(0, 3.5);
      const grid = new SpatialGrid(4.0);
      grid.insert(zombie.id, zombie.pos.x, zombie.pos.z);

      const playerPos = { x: 0, z: 10 };
      // dt = 0.5 -> without collision, pos.z would advance 4.2 * 0.5 = 2.1 to 5.6 (inside wall!)
      zombie.update(0.5, playerPos, [wall], grid);

      // Zombie radius = 0.65. It must be stopped outside the wall at z <= minZ - radius = 4.0 - 0.65 = 3.35
      expect(zombie.pos.z).toBeLessThanOrEqual(3.3501);
    });

    it('should slide sideways along a wall when moving diagonally toward player', () => {
      // Wall at maxZ: -10
      const wall: AABB = { minX: -20, maxX: 20, minZ: -15, maxZ: -10 };
      // Zombie touching wall at z = -9.35 (radius 0.65), player at (15, -20)
      const zombie = new Zombie(0, -9.35);
      const grid = new SpatialGrid(4.0);
      grid.insert(zombie.id, zombie.pos.x, zombie.pos.z);

      const playerPos = { x: 15, z: -20 };
      zombie.update(0.1, playerPos, [wall], grid);

      // Cannot move north into the wall (z clamped at -9.35)
      expect(zombie.pos.z).toBeCloseTo(-9.35, 2);
      // But slides East (+X) toward the player
      expect(zombie.pos.x).toBeGreaterThan(0);
    });
  });

  describe('Devil Entity Mechanics', () => {
    it('should initialize devil with crimson body, glowing yellow eyes, and correct stats', () => {
      const devil = new Devil(3, -4);
      expect(devil.pos.x).toBe(3);
      expect(devil.pos.z).toBe(-4);
      expect(devil.hp).toBe(DEVIL_HP);
      expect(devil.radius).toBe(DEVIL_RADIUS);
      expect(devil.speed).toBe(DEVIL_SPEED);
      expect(devil.alive).toBe(true);

      // Verify mesh structure
      expect(devil.mesh).toBeInstanceOf(THREE.Group);
      const meshes: THREE.Mesh[] = [];
      devil.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      });

      // Find crimson body mesh (#C0392B)
      const crimsonMesh = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return mat.color && mat.color.getHex() === COLOR_DEVIL_BODY;
      });
      expect(crimsonMesh).toBeDefined();

      // Find glowing yellow eye block (#F1C40F)
      const yellowEyes = meshes.filter((m) => {
        const mat = m.material as THREE.MeshBasicMaterial | THREE.MeshLambertMaterial;
        return mat.color && mat.color.getHex() === COLOR_DEVIL_EYES;
      });
      expect(yellowEyes.length).toBeGreaterThanOrEqual(1);
    });

    it('should pause movement every 3.0s to cast fireball and trigger shoot callback', () => {
      const devil = new Devil(0, 0);
      const grid = new SpatialGrid(4.0);
      grid.insert(devil.id, devil.pos.x, devil.pos.z);

      const shootSpy = vi.fn();
      devil.onShootFireball = shootSpy;

      const playerPos = { x: 0, z: 20 };

      // Update for 2.0 seconds (should be moving, not casting)
      devil.update(2.0, playerPos, [], grid);
      expect(devil.pos.z).toBeGreaterThan(0);
      expect(devil.isCasting).toBe(false);
      expect(shootSpy).not.toHaveBeenCalled();

      // Update for another 1.1 seconds (reaches 3.1s >= 3.0s cooldown -> starts casting!)
      devil.update(1.1, playerPos, [], grid);
      expect(devil.isCasting).toBe(true);

      // During cast, position should NOT advance significantly (movement paused)
      const posDuringCast = devil.pos.z;
      devil.update(0.1, playerPos, [], grid);
      expect(devil.pos.z).toBeCloseTo(posDuringCast, 2);

      // Complete casting duration (0.5s total cast time)
      devil.update(0.5, playerPos, [], grid);
      // Shoot callback should have been triggered
      expect(shootSpy).toHaveBeenCalled();
      // Casting should be finished and cooldown reset
      expect(devil.isCasting).toBe(false);
    });

    it('should be interrupted and staggered when taking damage while casting', () => {
      const devil = new Devil(0, 0);
      const grid = new SpatialGrid(4.0);
      grid.insert(devil.id, devil.pos.x, devil.pos.z);

      const shootSpy = vi.fn();
      devil.onShootFireball = shootSpy;

      const playerPos = { x: 0, z: 20 };

      // Advance to casting state
      devil.update(DEVIL_FIREBALL_COOLDOWN + 0.1, playerPos, [], grid);
      expect(devil.isCasting).toBe(true);

      // Deal damage to interrupt!
      devil.takeDamage(10);

      // Casting should be cancelled and Devil should be staggered
      expect(devil.isCasting).toBe(false);
      expect(devil.isStaggered).toBe(true);

      // Advance time while staggered -> movement is paused, no fireball fired
      const posDuringStagger = devil.pos.z;
      devil.update(0.1, playerPos, [], grid);
      expect(devil.pos.z).toBeCloseTo(posDuringStagger, 2);
      expect(shootSpy).not.toHaveBeenCalled();

      // Advance past stagger duration -> recovers
      devil.update(0.5, playerPos, [], grid);
      expect(devil.isStaggered).toBe(false);
    });
  });

  describe('EnemyManager Horde Management', () => {
    it('should spawn zombies and devils, adding their meshes to the scene', () => {
      const scene = new THREE.Scene();
      const manager = new EnemyManager(scene);

      const z = manager.spawnZombie(10, 5);
      expect(manager.enemies).toHaveLength(1);
      expect(manager.enemies[0]).toBe(z);
      expect(scene.children).toContain(z.mesh);

      const d = manager.spawnDevil(-8, 12);
      expect(manager.enemies).toHaveLength(2);
      expect(manager.enemies[1]).toBe(d);
      expect(scene.children).toContain(d.mesh);
    });

    it('should spawn enemies at arena perimeter boundaries', () => {
      const manager = new EnemyManager();
      const z = manager.spawnAtPerimeter('zombie');
      expect(z).toBeInstanceOf(Zombie);

      // Perimeter coordinates: either abs(x) near 24 or abs(z) near 16
      const nearBorderX = Math.abs(z.pos.x) >= 20;
      const nearBorderZ = Math.abs(z.pos.z) >= 14;
      expect(nearBorderX || nearBorderZ).toBe(true);

      const d = manager.spawnAtPerimeter('devil');
      expect(d).toBeInstanceOf(Devil);
    });

    it('should update spatial grid, apply flocking steering, and deal contact damage to player', () => {
      const manager = new EnemyManager();
      const z1 = manager.spawnZombie(0, 0);
      const z2 = manager.spawnZombie(0.4, 0);

      const player = new Player(0, 5);
      const initialPlayerHp = player.hp;

      // Update manager: z1 and z2 should steer and separate
      manager.update(0.1, player, []);

      expect(z1.pos.x).toBeLessThan(0);
      expect(z2.pos.x).toBeGreaterThan(0.4);

      // Place a zombie right touching player to verify contact damage
      const zContact = manager.spawnZombie(0, 5 + ZOMBIE_RADIUS + player.radius - 0.1);
      expect(zContact.alive).toBe(true);
      manager.update(0.1, player, []);

      // Player must have taken contact damage
      expect(player.hp).toBeLessThan(initialPlayerHp);
      expect(player.hp).toBe(initialPlayerHp - ZOMBIE_CONTACT_DAMAGE);
    });

    it('should remove dead enemies from active list and scene, and invoke onEnemyKilled hook', () => {
      const scene = new THREE.Scene();
      const manager = new EnemyManager(scene);
      const killedSpy = vi.fn();
      manager.onEnemyKilled = killedSpy;

      const z = manager.spawnZombie(0, 0);
      const d = manager.spawnDevil(10, 10);

      expect(manager.enemies).toHaveLength(2);

      // Kill zombie
      z.takeDamage(100);
      expect(z.alive).toBe(false);

      const player = new Player(0, 20);
      manager.update(0.016, player, []);

      // Dead zombie removed from list and scene
      expect(manager.enemies).toHaveLength(1);
      expect(manager.enemies[0]).toBe(d);
      expect(scene.children).not.toContain(z.mesh);
      expect(killedSpy).toHaveBeenCalledWith(z, true);
    });

    it('should integrate with ProjectilePool to shoot fireballs that damage player', () => {
      const scene = new THREE.Scene();
      const projectilePool = new ProjectilePool(scene);
      const manager = new EnemyManager(scene, projectilePool);

      const devil = manager.spawnDevil(0, 5);
      const player = new Player(0, 15);
      const initialHp = player.hp;

      // Trigger devil fireball: first reach cooldown to enter casting state, then complete cast
      devil.update(DEVIL_FIREBALL_COOLDOWN + 0.1, player.pos, [], manager.spatialGrid);
      devil.update(0.5, player.pos, [], manager.spatialGrid);

      // ProjectilePool should have 1 active fireball
      expect(projectilePool.getActiveCount('fireball')).toBe(1);

      // Move player into fireball or advance projectiles
      const fb = projectilePool.getActive().find((p) => p.type === 'fireball')!;
      fb.x = player.pos.x;
      fb.z = player.pos.z;

      // Update manager
      manager.update(0.016, player, []);

      // Player should take fireball damage and fireball should be recycled
      expect(player.hp).toBeLessThan(initialHp);
      expect(projectilePool.getActiveCount('fireball')).toBe(0);
    });

    it('should clear all enemies and remove meshes from scene on clear()', () => {
      const scene = new THREE.Scene();
      const manager = new EnemyManager(scene);
      const z = manager.spawnZombie(0, 0);
      const d = manager.spawnDevil(5, 5);

      expect(manager.enemies).toHaveLength(2);
      expect(scene.children).toContain(z.mesh);
      expect(scene.children).toContain(d.mesh);

      manager.clear();

      expect(manager.enemies).toHaveLength(0);
      expect(scene.children).not.toContain(z.mesh);
      expect(scene.children).not.toContain(d.mesh);
    });
  });
});
