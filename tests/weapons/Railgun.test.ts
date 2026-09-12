import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { RailgunBeam } from '../../src/weapons/Railgun';

describe('Railgun Piercing Hitscan Beam', () => {
  let railgun: RailgunBeam;

  beforeEach(() => {
    railgun = new RailgunBeam();
  });

  describe('Basic Trace & Damage Scaling (Brief Specs)', () => {
    it('detects all enemies intersecting the 60m ray in sequence', () => {
      // Firing along +X axis from (0, 0)
      const enemies = [
        { id: 1, x: 10, z: 0.2, radius: 0.65, isDead: false }, // Hit
        { id: 2, x: 25, z: -0.3, radius: 0.65, isDead: false }, // Hit
        { id: 3, x: 15, z: 5.0, radius: 0.65, isDead: false },  // Miss
        { id: 4, x: 45, z: 0.0, radius: 0.65, isDead: false },  // Hit
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(3);
      expect(hitEnemies.map(e => e.id)).toEqual([1, 2, 4]);
    });

    it('scales beam damage when Long Shot upgrade is applied', () => {
      railgun.setDamage(100);
      expect(railgun.damage).toBe(100);

      railgun.setDamage(200); // Long Shot (x125)
      expect(railgun.damage).toBe(200);
    });
  });

  describe('Multi-Angle Hitscan Tracing', () => {
    it('traces along +Z axis (angle = PI / 2)', () => {
      const enemies = [
        { id: 10, x: 0.1, z: 12, radius: 0.65, isDead: false },  // Hit
        { id: 11, x: 5.0, z: 20, radius: 0.65, isDead: false },  // Miss
        { id: 12, x: -0.2, z: 35, radius: 0.65, isDead: false }, // Hit
      ];

      const hitEnemies = railgun.trace(0, 0, Math.PI / 2, 60, enemies as any);
      expect(hitEnemies.length).toBe(2);
      expect(hitEnemies.map(e => e.id)).toEqual([10, 12]);
    });

    it('traces along -X axis (angle = PI)', () => {
      const enemies = [
        { id: 20, x: -15, z: 0.1, radius: 0.65, isDead: false }, // Hit
        { id: 21, x: 15, z: 0.1, radius: 0.65, isDead: false },  // Behind shooter -> Miss
        { id: 22, x: -50, z: 0.0, radius: 0.65, isDead: false }, // Hit
      ];

      const hitEnemies = railgun.trace(0, 0, Math.PI, 60, enemies as any);
      expect(hitEnemies.length).toBe(2);
      expect(hitEnemies.map(e => e.id)).toEqual([20, 22]);
    });

    it('traces along diagonal vector (angle = PI / 4)', () => {
      // Ray along x = z
      // Point at (10, 10) is distance sqrt(200) ~ 14.14 from origin
      const enemies = [
        { id: 30, x: 10, z: 10, radius: 0.65, isDead: false }, // On ray -> Hit
        { id: 31, x: 20, z: 20.3, radius: 0.65, isDead: false }, // Very close to ray -> Hit
        { id: 32, x: 10, z: -10, radius: 0.65, isDead: false }, // Perpendicular -> Miss
        { id: 33, x: 30, z: 30, radius: 0.65, isDead: false }, // On ray -> Hit
      ];

      const hitEnemies = railgun.trace(0, 0, Math.PI / 4, 60, enemies as any);
      expect(hitEnemies.length).toBe(3);
      expect(hitEnemies.map(e => e.id)).toEqual([30, 31, 33]);
    });
  });

  describe('Piercing and Order of Intersections', () => {
    it('pierces through 5 consecutive enemies without terminating', () => {
      const enemies = [
        { id: 5, x: 50, z: 0, radius: 0.65, isDead: false },
        { id: 1, x: 5, z: 0, radius: 0.65, isDead: false },
        { id: 3, x: 25, z: 0, radius: 0.65, isDead: false },
        { id: 2, x: 15, z: 0, radius: 0.65, isDead: false },
        { id: 4, x: 38, z: 0, radius: 0.65, isDead: false },
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(5);
      // Ensure results are ordered strictly by distance from ray origin
      expect(hitEnemies.map(e => e.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles non-zero ray origins accurately', () => {
      const enemies = [
        { id: 1, x: 15, z: 10, radius: 0.65, isDead: false },
        { id: 2, x: 25, z: 10, radius: 0.65, isDead: false },
        { id: 3, x: 5, z: 10, radius: 0.65, isDead: false }, // Behind origin (10, 10)
      ];

      // Firing along +X from (10, 10)
      const hitEnemies = railgun.trace(10, 10, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(2);
      expect(hitEnemies.map(e => e.id)).toEqual([1, 2]);
    });
  });

  describe('Range Boundaries & Endpoint Clamping', () => {
    it('ignores targets located beyond the 60m range', () => {
      const enemies = [
        { id: 1, x: 59, z: 0, radius: 0.65, isDead: false }, // Hit
        { id: 2, x: 62, z: 0, radius: 0.65, isDead: false }, // Beyond 60m -> Miss
        { id: 3, x: 75, z: 0, radius: 0.65, isDead: false }, // Far beyond -> Miss
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(1);
      expect(hitEnemies[0].id).toBe(1);
    });

    it('detects enemy whose circle touches the endpoint within radius', () => {
      // Segment ends at 60. Enemy circle at 60.4 with radius 0.65 covers point 60.0
      const enemies = [
        { id: 1, x: 60.4, z: 0, radius: 0.65, isDead: false },
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(1);
      expect(hitEnemies[0].id).toBe(1);
    });

    it('ignores targets strictly behind origin', () => {
      const enemies = [
        { id: 1, x: -3.0, z: 0, radius: 0.65, isDead: false },
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(0);
    });
  });

  describe('Dead / Inactive Target Filtering & Pos Format Support', () => {
    it('filters out dead enemies with isDead: true, alive: false, or hp <= 0', () => {
      const enemies = [
        { id: 1, x: 10, z: 0, radius: 0.65, isDead: true },
        { id: 2, x: 20, z: 0, radius: 0.65, alive: false },
        { id: 3, x: 30, z: 0, radius: 0.65, hp: 0 },
        { id: 4, x: 40, z: 0, radius: 0.65, isDead: false, alive: true, hp: 50 },
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(1);
      expect(hitEnemies[0].id).toBe(4);
    });

    it('supports enemy objects with nested pos: { x, z } property', () => {
      const enemies = [
        { id: 101, pos: { x: 12, z: 0 }, radius: 0.65, alive: true },
        { id: 102, pos: { x: 28, z: 0.1 }, radius: 0.65, alive: true },
        { id: 103, pos: { x: 15, z: 6.0 }, radius: 0.65, alive: true },
      ];

      const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
      expect(hitEnemies.length).toBe(2);
      expect(hitEnemies.map(e => e.id)).toEqual([101, 102]);
    });
  });

  describe('Obstacle / Barricade Piercing', () => {
    it('pierces through AABB obstacles (barrels, fake walls)', () => {
      const obstacles = [
        {
          id: 'barrel_1',
          getAABB: () => ({ minX: 9.4, maxX: 10.6, minZ: -0.6, maxZ: 0.6 }),
          alive: true,
        },
        {
          id: 'wall_1',
          getAABB: () => ({ minX: 19.25, maxX: 20.75, minZ: -0.75, maxZ: 0.75 }),
          alive: true,
        },
        {
          id: 'miss_wall',
          getAABB: () => ({ minX: 10, maxX: 12, minZ: 5, maxZ: 7 }),
          alive: true,
        },
      ];

      const hitObstacles = railgun.traceObstacles(0, 0, 0, 60, obstacles as any);
      expect(hitObstacles.length).toBe(2);
      expect(hitObstacles.map((o: any) => o.id)).toEqual(['barrel_1', 'wall_1']);
    });
  });

  describe('Firing Action (fire)', () => {
    it('applies damage and knockback to hit targets', () => {
      const target1 = {
        id: 1,
        x: 10,
        z: 0,
        radius: 0.65,
        isDead: false,
        hp: 100,
        takeDamage: vi.fn(),
        applyKnockback: vi.fn(),
      };
      const target2 = {
        id: 2,
        x: 20,
        z: 0,
        radius: 0.65,
        isDead: false,
        hp: 150,
        takeDamage: vi.fn(),
        applyKnockback: vi.fn(),
      };

      railgun.setDamage(100);
      const result = railgun.fire(0, 0, 0, 60, [target1, target2] as any);

      expect(target1.takeDamage).toHaveBeenCalledWith(100);
      expect(target2.takeDamage).toHaveBeenCalledWith(100);

      // Knockback along angle 0 (cos = 1, sin = 0)
      expect(target1.applyKnockback).toHaveBeenCalledWith(railgun.knockback, 0);
      expect(target2.applyKnockback).toHaveBeenCalledWith(railgun.knockback, 0);
      expect(result.length).toBe(2);
    });

    it('triggers particle ionization trail and laser audio when provided in options', () => {
      const particlePool = {
        spawnBurst: vi.fn(),
      };
      const audioManager = {
        playRailgunLaser: vi.fn(),
      };

      railgun.fire(0, 0, 0, 60, [], {
        particlePool: particlePool as any,
        audioManager: audioManager as any,
      });

      expect(audioManager.playRailgunLaser).toHaveBeenCalledTimes(1);
      expect(particlePool.spawnBurst).toHaveBeenCalled();
      // Check cyan ionization burst color #00FFFF (65535)
      const firstBurstCall = particlePool.spawnBurst.mock.calls[0];
      expect(firstBurstCall[3]).toBe(0x00FFFF);
    });

    it('damages obstacles when passed in fire options', () => {
      const barrel = {
        id: 'barrel_1',
        getAABB: () => ({ minX: 14.4, maxX: 15.6, minZ: -0.6, maxZ: 0.6 }),
        alive: true,
        takeDamage: vi.fn(),
      };

      railgun.fire(0, 0, 0, 60, [], {
        obstacles: [barrel as any],
      });

      expect(barrel.takeDamage).toHaveBeenCalledWith(100);
    });
  });

  describe('Visual Beam & Fade Lifecycle', () => {
    it('activates visual beam on fire and positions mesh correctly', () => {
      expect(railgun.mesh.visible).toBe(false);

      railgun.fire(0, 0, 0, 60, []);

      expect(railgun.mesh.visible).toBe(true);
      expect(railgun.fadeTimer).toBeCloseTo(0.12);
      expect(railgun.material.opacity).toBeCloseTo(1.0);

      // Mesh center is at midpoint: (30, 0.5, 0)
      expect(railgun.mesh.position.x).toBeCloseTo(30);
      expect(railgun.mesh.position.z).toBeCloseTo(0);
    });

    it('fades out opacity over 0.12s and hides mesh when timer expires', () => {
      railgun.fire(0, 0, 0, 60, []);

      // Halfway through fade (0.06s)
      railgun.update(0.06);
      expect(railgun.mesh.visible).toBe(true);
      expect(railgun.material.opacity).toBeCloseTo(0.5, 1);

      // Finish fade (remaining 0.06s + margin)
      railgun.update(0.07);
      expect(railgun.mesh.visible).toBe(false);
      expect(railgun.fadeTimer).toBe(0);
      expect(railgun.material.opacity).toBe(0);
    });

    it('increases beam thickness when Long Shot damage is set', () => {
      const initialWidth = railgun.beamWidth;
      railgun.setDamage(200);
      expect(railgun.beamWidth).toBeGreaterThan(initialWidth);
    });
  });

  describe('Three.js Resource Caching', () => {
    it('shares geometries and materials across multiple RailgunBeam instances', () => {
      const railgun1 = new RailgunBeam();
      const railgun2 = new RailgunBeam();

      expect(railgun1.mesh.geometry).toBe(railgun2.mesh.geometry);
      expect(railgun1.mesh.material).toBe(railgun2.mesh.material);
    });

    it('adds beam mesh to parent scene when scene is passed to constructor', () => {
      const scene = new THREE.Scene();
      const beam = new RailgunBeam(scene);

      expect(scene.children.includes(beam.mesh)).toBe(true);
    });
  });
});
