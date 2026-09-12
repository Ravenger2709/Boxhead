import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { Claymore } from '../../src/entities/Claymore';

describe('Claymore Proximity Mine', () => {
  let claymore: Claymore;

  beforeEach(() => {
    claymore = new Claymore();
  });

  describe('Lifecycle and Arming State', () => {
    it('starts in arming state and becomes armed after 0.5s', () => {
      claymore.init(0, 0, { damage: 150, radius: 4.0 });
      expect(claymore.state).toBe('arming');

      claymore.update(0.3, []);
      expect(claymore.state).toBe('arming');

      claymore.update(0.25, []);
      expect(claymore.state).toBe('armed');
    });

    it('does not trigger while still in arming state even if enemy is close', () => {
      const onBeep = vi.fn();
      claymore.init(0, 0, { damage: 150, radius: 4.0, onBeep });

      const mockEnemy = { x: 0.2, z: 0.2, radius: 0.65, isDead: false };
      claymore.update(0.2, [mockEnemy as any]);

      expect(claymore.state).toBe('arming');
      expect(onBeep).not.toHaveBeenCalled();
    });

    it('initializes with default options when none are provided', () => {
      claymore.init(10, -5);
      expect(claymore.x).toBe(10);
      expect(claymore.z).toBe(-5);
      expect(claymore.damage).toBe(100);
      expect(claymore.radius).toBe(4.0);
      expect(claymore.hasCluster).toBe(false);
      expect(claymore.state).toBe('arming');
      expect(claymore.mesh.position.x).toBe(10);
      expect(claymore.mesh.position.z).toBe(-5);
    });
  });

  describe('Proximity Detection & Warning Beep', () => {
    it('trips when an enemy comes within trigger range and calls onBeep', () => {
      const onBeep = vi.fn();
      claymore.init(0, 0, { damage: 150, radius: 4.0, onBeep });
      claymore.update(0.55, []); // arm it

      const mockEnemy = { x: 0.8, z: 0.5, radius: 0.65, isDead: false };
      claymore.update(0.016, [mockEnemy as any]);

      expect(claymore.state).toBe('tripped');
      expect(onBeep).toHaveBeenCalledTimes(1);
    });

    it('does not trip when enemy is outside the trigger radius', () => {
      const onBeep = vi.fn();
      claymore.init(0, 0, { damage: 150, radius: 4.0, onBeep });
      claymore.update(0.55, []); // armed

      const farEnemy = { x: 2.5, z: 2.5, radius: 0.65, isDead: false };
      claymore.update(0.016, [farEnemy as any]);

      expect(claymore.state).toBe('armed');
      expect(onBeep).not.toHaveBeenCalled();
    });

    it('ignores dead enemies (isDead: true or alive: false or hp <= 0)', () => {
      const onBeep = vi.fn();
      claymore.init(0, 0, { damage: 150, radius: 4.0, onBeep });
      claymore.update(0.55, []); // armed

      const deadEnemy1 = { x: 0.2, z: 0.2, radius: 0.65, isDead: true };
      const deadEnemy2 = { pos: { x: 0.2, z: 0.2 }, radius: 0.65, alive: false };
      const deadEnemy3 = { x: 0.2, z: 0.2, radius: 0.65, hp: 0 };

      claymore.update(0.016, [deadEnemy1 as any, deadEnemy2 as any, deadEnemy3 as any]);

      expect(claymore.state).toBe('armed');
      expect(onBeep).not.toHaveBeenCalled();
    });

    it('detects enemies with pos: { x, z } format', () => {
      const onBeep = vi.fn();
      claymore.init(5, 5, { damage: 150, radius: 4.0, onBeep });
      claymore.update(0.55, []); // armed

      const enemyWithPos = { pos: { x: 5.4, z: 5.3 }, radius: 0.65, alive: true };
      claymore.update(0.016, [enemyWithPos as any]);

      expect(claymore.state).toBe('tripped');
      expect(onBeep).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fuse Countdown & Radial Detonation', () => {
    it('detonates after fuse delay and calls onExplode with correct arguments', () => {
      const onExplode = vi.fn();
      claymore.init(2, -3, { damage: 200, radius: 5.5, onExplode });
      claymore.update(0.55, []); // armed

      const mockEnemy = { x: 2.2, z: -2.8, radius: 0.65, isDead: false };
      claymore.update(0.016, [mockEnemy as any]); // tripped

      expect(claymore.state).toBe('tripped');

      // Partial fuse countdown (1.0s out of 2.0s)
      claymore.update(1.0, [mockEnemy as any]);
      expect(claymore.state).toBe('tripped');
      expect(onExplode).not.toHaveBeenCalled();

      // Fuse expires (remaining 1.05s)
      claymore.update(1.05, [mockEnemy as any]);
      expect(claymore.state).toBe('detonated');
      expect(onExplode).toHaveBeenCalledTimes(1);
      expect(onExplode).toHaveBeenCalledWith(2, -3, 200, 5.5, false);
    });

    it('hides mesh and removes from parent upon detonation', () => {
      const scene = new THREE.Scene();
      claymore.init(0, 0, { damage: 150, radius: 4.0 });
      scene.add(claymore.mesh);

      expect(scene.children.includes(claymore.mesh)).toBe(true);
      expect(claymore.mesh.visible).toBe(true);

      claymore.detonate();

      expect(claymore.state).toBe('detonated');
      expect(claymore.mesh.visible).toBe(false);
      expect(scene.children.includes(claymore.mesh)).toBe(false);
    });

    it('does not explode multiple times if detonate is called again', () => {
      const onExplode = vi.fn();
      claymore.init(0, 0, { damage: 150, radius: 4.0, onExplode });
      claymore.detonate();
      expect(onExplode).toHaveBeenCalledTimes(1);

      claymore.detonate();
      expect(onExplode).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cluster Explosion Sub-blasts', () => {
    it('triggers 4 radial sub-explosions when hasCluster is true', () => {
      const onExplode = vi.fn();
      const onSpawnSubExplosion = vi.fn();
      claymore.init(10, 20, {
        damage: 150,
        radius: 4.0,
        hasCluster: true,
        onExplode,
        onSpawnSubExplosion,
      });

      claymore.detonate();

      expect(onExplode).toHaveBeenCalledWith(10, 20, 150, 4.0, true);
      expect(onSpawnSubExplosion).toHaveBeenCalledTimes(4);

      // Verify the 4 sub-explosion points are ~1.5 units radially outward from (10, 20)
      const calls = onSpawnSubExplosion.mock.calls;
      const offsets = calls.map(([x, z]) => ({ dx: x - 10, dz: z - 20 }));

      // Check distance of each sub-explosion point is ~1.5 units
      for (const { dx, dz } of offsets) {
        const dist = Math.hypot(dx, dz);
        expect(dist).toBeCloseTo(1.5, 1);
      }
    });

    it('does not trigger sub-explosions when hasCluster is false or undefined', () => {
      const onSpawnSubExplosion = vi.fn();
      claymore.init(0, 0, {
        damage: 150,
        radius: 4.0,
        hasCluster: false,
        onSpawnSubExplosion,
      });

      claymore.detonate();

      expect(onSpawnSubExplosion).not.toHaveBeenCalled();
    });
  });

  describe('Object Pooling and Mesh Caching', () => {
    it('supports recycling and re-initialization', () => {
      claymore.init(0, 0, { damage: 150, radius: 4.0 });
      claymore.update(0.6, []);
      claymore.trip();
      claymore.update(2.1, []);
      expect(claymore.state).toBe('detonated');

      claymore.recycle();
      expect(claymore.state).toBe('recycled');
      expect(claymore.active).toBe(false);

      // Re-init with new coordinates and stats
      claymore.init(5, 5, { damage: 220, radius: 5.5, hasCluster: true });
      expect(claymore.state).toBe('arming');
      expect(claymore.active).toBe(true);
      expect(claymore.x).toBe(5);
      expect(claymore.z).toBe(5);
      expect(claymore.damage).toBe(220);
      expect(claymore.radius).toBe(5.5);
      expect(claymore.hasCluster).toBe(true);
      expect(claymore.mesh.visible).toBe(true);
    });

    it('shares geometries and materials across multiple Claymore instances', () => {
      const claymore1 = new Claymore();
      const claymore2 = new Claymore();

      // Ensure instances don't allocate separate Three.js geometries/materials
      const mesh1Children = claymore1.mesh.children as THREE.Mesh[];
      const mesh2Children = claymore2.mesh.children as THREE.Mesh[];

      expect(mesh1Children.length).toBeGreaterThan(0);
      expect(mesh2Children.length).toBe(mesh1Children.length);

      for (let i = 0; i < mesh1Children.length; i++) {
        expect(mesh1Children[i].geometry).toBe(mesh2Children[i].geometry);
        expect(mesh1Children[i].material).toBe(mesh2Children[i].material);
      }
    });

    it('calculates bounding AABB correctly', () => {
      claymore.init(10, 20);
      const aabb = claymore.getAABB();
      expect(aabb.minX).toBeLessThan(10);
      expect(aabb.maxX).toBeGreaterThan(10);
      expect(aabb.minZ).toBeLessThan(20);
      expect(aabb.maxZ).toBeGreaterThan(20);
    });
  });
});
