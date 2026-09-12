import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { ChargePack } from '../../src/entities/ChargePack';

describe('ChargePack Remote Explosive', () => {
  let chargePack: ChargePack;

  beforeEach(() => {
    chargePack = new ChargePack();
  });

  describe('Lifecycle and Active State', () => {
    it('initializes with active state on the field', () => {
      chargePack.init(5, 5, { damage: 180, radius: 5.0 });
      expect(chargePack.isActive).toBe(true);
      expect(chargePack.x).toBe(5);
      expect(chargePack.z).toBe(5);
    });

    it('initializes with default options when none are provided', () => {
      chargePack.init(10, -5);
      expect(chargePack.x).toBe(10);
      expect(chargePack.z).toBe(-5);
      expect(chargePack.damage).toBe(180);
      expect(chargePack.radius).toBe(5.0);
      expect(chargePack.hasCluster).toBe(false);
      expect(chargePack.isActive).toBe(true);
      expect(chargePack.mesh.position.x).toBe(10);
      expect(chargePack.mesh.position.z).toBe(-5);
      expect(chargePack.mesh.visible).toBe(true);
    });

    it('updates position correctly when modifying x and z setters', () => {
      chargePack.init(0, 0);
      chargePack.x = 8;
      chargePack.z = -12;
      expect(chargePack.x).toBe(8);
      expect(chargePack.z).toBe(-12);
      expect(chargePack.mesh.position.x).toBe(8);
      expect(chargePack.mesh.position.z).toBe(-12);
    });
  });

  describe('Remote Detonation Trigger', () => {
    it('detonates only when explicitly triggered and not on regular updates', () => {
      const onDetonate = vi.fn();
      chargePack.init(5, 5, { damage: 180, radius: 5.0, onDetonate });

      // Regular updates do not detonate
      chargePack.update(1.0);
      expect(chargePack.isActive).toBe(true);
      expect(onDetonate).not.toHaveBeenCalled();

      // Longer updates still do not detonate
      chargePack.update(10.0);
      expect(chargePack.isActive).toBe(true);
      expect(onDetonate).not.toHaveBeenCalled();

      // Trigger command
      chargePack.detonate();
      expect(chargePack.isActive).toBe(false);
      expect(onDetonate).toHaveBeenCalledTimes(1);
      expect(onDetonate).toHaveBeenCalledWith(5, 5, 180, 5.0, false);
    });

    it('hides mesh and removes from parent upon detonation', () => {
      const scene = new THREE.Scene();
      chargePack.init(0, 0, { damage: 180, radius: 5.0 });
      scene.add(chargePack.mesh);

      expect(scene.children.includes(chargePack.mesh)).toBe(true);
      expect(chargePack.mesh.visible).toBe(true);

      chargePack.detonate();

      expect(chargePack.isActive).toBe(false);
      expect(chargePack.mesh.visible).toBe(false);
      expect(scene.children.includes(chargePack.mesh)).toBe(false);
    });

    it('does not explode multiple times if detonate is called repeatedly', () => {
      const onDetonate = vi.fn();
      chargePack.init(0, 0, { damage: 180, radius: 5.0, onDetonate });

      chargePack.detonate();
      expect(onDetonate).toHaveBeenCalledTimes(1);

      chargePack.detonate();
      expect(onDetonate).toHaveBeenCalledTimes(1);
    });

    it('calls onDestroy callback if provided', () => {
      const onDestroy = vi.fn();
      chargePack.init(2, 3, { onDestroy });

      chargePack.detonate();
      expect(onDestroy).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledWith(chargePack);
    });

    it('blinks the indicator LED during update', () => {
      chargePack.init(0, 0);
      expect(chargePack.ledMesh).toBeDefined();

      const initialVisibility = chargePack.ledMesh.visible;
      // Step through time to verify blinking toggles
      let toggled = false;
      for (let t = 0; t < 1.0; t += 0.1) {
        chargePack.update(0.1);
        if (chargePack.ledMesh.visible !== initialVisibility) {
          toggled = true;
          break;
        }
      }
      expect(toggled).toBe(true);
    });
  });

  describe('Cluster Explode Mode', () => {
    it('supports cluster explode mode generating 4 radial sub-explosions', () => {
      const onDetonate = vi.fn();
      const subExplosions: { x: number; z: number }[] = [];
      chargePack.init(0, 0, {
        damage: 180,
        radius: 5.0,
        hasCluster: true,
        onDetonate,
        onSpawnSubExplosion: (x, z) => subExplosions.push({ x, z }),
      });

      chargePack.detonate();
      expect(onDetonate).toHaveBeenCalledWith(0, 0, 180, 5.0, true);
      expect(subExplosions.length).toBe(4);

      // Verify offsets are radially distributed around origin
      for (const sub of subExplosions) {
        const dist = Math.hypot(sub.x, sub.z);
        expect(dist).toBeGreaterThan(0.5);
        expect(dist).toBeLessThanOrEqual(3.0);
      }
    });

    it('does not trigger sub-explosions when hasCluster is false or undefined', () => {
      const onSpawnSubExplosion = vi.fn();
      chargePack.init(0, 0, {
        damage: 180,
        radius: 5.0,
        hasCluster: false,
        onSpawnSubExplosion,
      });

      chargePack.detonate();
      expect(onSpawnSubExplosion).not.toHaveBeenCalled();
    });
  });

  describe('Object Pooling and Mesh Caching', () => {
    it('supports recycling and re-use via init()', () => {
      chargePack.init(1, 2, { damage: 180, radius: 5.0 });
      chargePack.detonate();
      expect(chargePack.isActive).toBe(false);

      chargePack.recycle();
      expect(chargePack.isActive).toBe(false);
      expect(chargePack.mesh.visible).toBe(false);

      // Re-init with new coordinates and cluster mode
      chargePack.init(15, -20, { damage: 260, radius: 7.0, hasCluster: true });
      expect(chargePack.isActive).toBe(true);
      expect(chargePack.x).toBe(15);
      expect(chargePack.z).toBe(-20);
      expect(chargePack.damage).toBe(260);
      expect(chargePack.radius).toBe(7.0);
      expect(chargePack.hasCluster).toBe(true);
      expect(chargePack.mesh.visible).toBe(true);
    });

    it('shares geometries and materials across multiple ChargePack instances', () => {
      const chargePack1 = new ChargePack();
      const chargePack2 = new ChargePack();

      const mesh1Children = chargePack1.mesh.children as THREE.Mesh[];
      const mesh2Children = chargePack2.mesh.children as THREE.Mesh[];

      expect(mesh1Children.length).toBeGreaterThan(0);
      expect(mesh2Children.length).toBe(mesh1Children.length);

      for (let i = 0; i < mesh1Children.length; i++) {
        expect(mesh1Children[i].geometry).toBe(mesh2Children[i].geometry);
        expect(mesh1Children[i].material).toBe(mesh2Children[i].material);
      }
    });

    it('calculates bounding AABB correctly', () => {
      chargePack.init(10, 20);
      const aabb = chargePack.getAABB();
      expect(aabb.minX).toBeCloseTo(9.65, 2);
      expect(aabb.maxX).toBeCloseTo(10.35, 2);
      expect(aabb.minZ).toBeCloseTo(19.65, 2);
      expect(aabb.maxZ).toBeCloseTo(20.35, 2);
    });
  });
});
