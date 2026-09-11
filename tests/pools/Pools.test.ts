import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { ProjectilePool } from '../../src/weapons/ProjectilePool';
import { ParticlePool } from '../../src/fx/ParticlePool';
import { DamageNumberPool } from '../../src/ui/DamageNumberPool';

describe('Task 4: High-Performance Object Pooling & Particle Systems', () => {
  describe('ProjectilePool', () => {
    let scene: THREE.Scene;
    let pool: ProjectilePool;

    beforeEach(() => {
      scene = new THREE.Scene();
      pool = new ProjectilePool(scene);
    });

    it('should pre-allocate exactly 300 bullets, 40 rockets, 40 grenades, and 60 fireballs (440 total)', () => {
      expect(pool.getPoolSize('bullet')).toBe(300);
      expect(pool.getPoolSize('rocket')).toBe(40);
      expect(pool.getPoolSize('grenade')).toBe(40);
      expect(pool.getPoolSize('fireball')).toBe(60);
      expect(pool.totalCapacity).toBe(440);

      // Parent group should be added to the scene
      expect(scene.children.includes(pool.group)).toBe(true);

      // All 440 meshes should be pre-allocated inside the parent group
      expect(pool.group.children.length).toBe(440);

      // Inactive meshes must have visible = false
      for (const child of pool.group.children) {
        expect(child.visible).toBe(false);
      }

      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getAvailableCount('bullet')).toBe(300);
      expect(pool.getAvailableCount('rocket')).toBe(40);
      expect(pool.getAvailableCount('grenade')).toBe(40);
      expect(pool.getAvailableCount('fireball')).toBe(60);
    });

    it('should spawn a projectile from the pool and set its properties and visibility', () => {
      const p = pool.spawn('bullet', 5, -2, 1, 0, 15, 55);
      expect(p).not.toBeNull();
      if (!p) return;

      expect(p.active).toBe(true);
      expect(p.type).toBe('bullet');
      expect(p.x).toBe(5);
      expect(p.z).toBe(-2);
      expect(p.damage).toBe(15);
      expect(p.speed).toBe(55);
      expect(p.dirX).toBeCloseTo(1);
      expect(p.dirZ).toBeCloseTo(0);
      expect(p.vx).toBeCloseTo(55);
      expect(p.vz).toBeCloseTo(0);

      // Mesh should become visible and positioned at (x, y, z)
      expect(p.mesh.visible).toBe(true);
      expect(p.mesh.position.x).toBe(5);
      expect(p.mesh.position.z).toBe(-2);

      expect(pool.getActiveCount()).toBe(1);
      expect(pool.getAvailableCount('bullet')).toBe(299);
    });

    it('should normalize direction vectors on spawn', () => {
      const p = pool.spawn('bullet', 0, 0, 3, 4, 15, 50);
      expect(p).not.toBeNull();
      if (!p) return;

      // 3-4-5 triangle -> normalized dir: 0.6, 0.8; velocity: 30, 40
      expect(p.dirX).toBeCloseTo(0.6);
      expect(p.dirZ).toBeCloseTo(0.8);
      expect(p.vx).toBeCloseTo(30);
      expect(p.vz).toBeCloseTo(40);
    });

    it('should update active projectile positions and meshes over time', () => {
      const p = pool.spawn('bullet', 0, 0, 1, 0, 15, 10);
      expect(p).not.toBeNull();
      if (!p) return;

      pool.update(0.5);

      expect(p.x).toBeCloseTo(5);
      expect(p.z).toBeCloseTo(0);
      expect(p.mesh.position.x).toBeCloseTo(5);
      expect(p.mesh.position.z).toBeCloseTo(0);
    });

    it('should handle grenade bouncing physics and detonate when fuse timer expires', () => {
      const onHit = vi.fn();
      const grenade = pool.spawn('grenade', 0, 0, 1, 0, 140, 10);
      expect(grenade).not.toBeNull();
      if (!grenade) return;

      expect(grenade.y).toBeGreaterThan(0);
      expect(grenade.vy).toBeGreaterThan(0);

      // Simulate a few physics steps: grenade arcs up, falls under gravity, bounces
      pool.update(0.2);
      expect(grenade.active).toBe(true);
      expect(grenade.mesh.position.y).toBe(grenade.y);

      // Fast forward past fuse timer (maxLife = 2.0s)
      pool.update(1.9, onHit);
      expect(onHit).toHaveBeenCalledWith(grenade);
      expect(grenade.active).toBe(false);
      expect(grenade.mesh.visible).toBe(false);
      expect(pool.getAvailableCount('grenade')).toBe(40);
    });

    it('should recycle projectiles and reuse the exact same mesh object without re-allocation', () => {
      const p1 = pool.spawn('bullet', 0, 0, 1, 0, 15, 55);
      expect(p1).not.toBeNull();
      if (!p1) return;

      const originalMesh = p1.mesh;
      expect(originalMesh.visible).toBe(true);

      pool.recycle(p1);
      expect(p1.active).toBe(false);
      expect(originalMesh.visible).toBe(false);
      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getAvailableCount('bullet')).toBe(300);

      // Re-spawn bullet from pool: should yield the recycled instance and same mesh
      const p2 = pool.spawn('bullet', 10, 20, 0, 1, 15, 55);
      expect(p2).not.toBeNull();
      if (!p2) return;

      expect(p2.mesh).toBe(originalMesh);
      expect(p2.mesh.visible).toBe(true);
      expect(p2.x).toBe(10);
      expect(p2.z).toBe(20);
    });

    it('should return null without error when pool capacity for a type is exhausted', () => {
      const spawned: any[] = [];
      for (let i = 0; i < 40; i++) {
        const r = pool.spawn('rocket', 0, 0, 1, 0, 160, 28);
        expect(r).not.toBeNull();
        spawned.push(r);
      }
      expect(pool.getAvailableCount('rocket')).toBe(0);

      // 41st rocket should return null
      const overflow = pool.spawn('rocket', 0, 0, 1, 0, 160, 28);
      expect(overflow).toBeNull();

      // Recycling one rocket allows spawning again
      pool.recycle(spawned[0]);
      expect(pool.getAvailableCount('rocket')).toBe(1);
      const recycledSpawn = pool.spawn('rocket', 1, 1, 0, 1, 160, 28);
      expect(recycledSpawn).not.toBeNull();
    });

    it('should recycle out of bounds projectiles during update', () => {
      const onHit = vi.fn();
      const p = pool.spawn('bullet', 30, 0, 1, 0, 15, 50); // will exit bounds (|x| > 32)
      expect(p).not.toBeNull();
      if (!p) return;

      pool.update(0.2, onHit);
      expect(p.active).toBe(false);
      expect(p.mesh.visible).toBe(false);
      expect(pool.getActiveCount()).toBe(0);
    });

    it('should clear all active projectiles on clear()', () => {
      pool.spawn('bullet', 0, 0, 1, 0, 15, 55);
      pool.spawn('rocket', 0, 0, 1, 0, 160, 28);
      pool.spawn('grenade', 0, 0, 1, 0, 140, 10);
      pool.spawn('fireball', 0, 0, 1, 0, 25, 14);

      expect(pool.getActiveCount()).toBe(4);
      pool.clear();

      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getAvailableCount('bullet')).toBe(300);
      expect(pool.getAvailableCount('rocket')).toBe(40);
      expect(pool.getAvailableCount('grenade')).toBe(40);
      expect(pool.getAvailableCount('fireball')).toBe(60);
    });
  });

  describe('ParticlePool', () => {
    let scene: THREE.Scene;
    let pool: ParticlePool;

    beforeEach(() => {
      scene = new THREE.Scene();
      pool = new ParticlePool(scene);
    });

    it('should pre-allocate exactly 400 cube particles with visible = false', () => {
      expect(pool.capacity).toBe(400);
      expect(pool.getFreeCount()).toBe(400);
      expect(pool.getActiveCount()).toBe(0);

      expect(scene.children.includes(pool.group)).toBe(true);
      expect(pool.group.children.length).toBe(400);

      for (const child of pool.group.children) {
        expect(child.visible).toBe(false);
        expect(child).toBeInstanceOf(THREE.Mesh);
      }
    });

    it('should spawn a burst of particles with correct colors, positions, and upward velocities', () => {
      pool.spawnBurst(10, -5, 20, 0x8B0000, 8);

      expect(pool.getActiveCount()).toBe(20);
      expect(pool.getFreeCount()).toBe(380);

      const activeParticles = pool.getActiveParticles();
      expect(activeParticles.length).toBe(20);

      for (const p of activeParticles) {
        expect(p.active).toBe(true);
        expect(p.mesh.visible).toBe(true);
        expect(p.vy).toBeGreaterThan(0); // Upward velocity
        expect(p.mesh.position.x).toBeCloseTo(10, 0);
        expect(p.mesh.position.z).toBeCloseTo(-5, 0);

        // Color matches requested hex
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        expect(mat.color.getHex()).toBe(0x8B0000);
      }
    });

    it('should update particle physics: gravity, floor bouncing, and scale shrinking', () => {
      pool.spawnBurst(0, 0, 1, 0xFF0000, 5, 1.0);
      const [particle] = pool.getActiveParticles();
      const initialVy = particle.vy;

      // Update with dt
      pool.update(0.1);

      // Gravity should decrease vy
      expect(particle.vy).toBeLessThan(initialVy);
      // Scale should shrink over time
      expect(particle.mesh.scale.x).toBeLessThan(1.0);
    });

    it('should automatically recycle particles when lifespan expires', () => {
      pool.spawnBurst(0, 0, 5, 0xFF0000, 5);
      expect(pool.getActiveCount()).toBe(5);

      // Update past max lifespan (~1.0s)
      pool.update(2.0);

      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getFreeCount()).toBe(400);

      for (const child of pool.group.children) {
        expect(child.visible).toBe(false);
      }
    });

    it('should reuse recycled particles in subsequent bursts without allocating new meshes', () => {
      pool.spawnBurst(0, 0, 10, 0xFF0000, 5);
      const initialMeshes = pool.getActiveParticles().map((p) => p.mesh);

      // Fast forward to recycle all
      pool.update(2.0);
      expect(pool.getActiveCount()).toBe(0);

      // Spawn again
      pool.spawnBurst(5, 5, 10, 0x00FF00, 5);
      expect(pool.getActiveCount()).toBe(10);
      const newActiveMeshes = pool.getActiveParticles().map((p) => p.mesh);

      // Every mesh used now should come from the original pre-allocated group and include recycled meshes
      expect(newActiveMeshes.every((m) => pool.group.children.includes(m))).toBe(true);
      expect(newActiveMeshes.some((m) => initialMeshes.includes(m))).toBe(true);
      expect(pool.group.children.length).toBe(400);
    });

    it('should clear all active particles on clear()', () => {
      pool.spawnBurst(0, 0, 50, 0xFFFFFF, 5);
      expect(pool.getActiveCount()).toBe(50);

      pool.clear();
      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getFreeCount()).toBe(400);
    });
  });

  describe('DamageNumberPool', () => {
    let pool: DamageNumberPool;

    beforeEach(() => {
      pool = new DamageNumberPool();
    });

    it('should pre-allocate 60 floating damage numbers with 0 active items initially', () => {
      expect(pool.capacity).toBe(60);
      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getFreeCount()).toBe(60);
    });

    it('should spawn floating damage numbers with amount, crit flag, and position', () => {
      const item = pool.spawn(12, -4, 45, false);
      expect(item).not.toBeNull();
      if (!item) return;

      expect(item.active).toBe(true);
      expect(item.x).toBe(12);
      expect(item.z).toBe(-4);
      expect(item.amount).toBe(45);
      expect(item.isCrit).toBe(false);
      expect(item.vy).toBeGreaterThan(0); // Upward float

      expect(pool.getActiveCount()).toBe(1);
      expect(pool.getFreeCount()).toBe(59);
    });

    it('should support critical hit formatting and distinctive attributes', () => {
      const crit = pool.spawn(0, 0, 120, true);
      expect(crit).not.toBeNull();
      if (!crit) return;

      expect(crit.isCrit).toBe(true);
      expect(crit.amount).toBe(120);
    });

    it('should update damage numbers upward and automatically recycle when expired', () => {
      const item = pool.spawn(0, 0, 50);
      expect(item).not.toBeNull();
      if (!item) return;

      const initialY = item.y;
      pool.update(0.1);
      expect(item.y).toBeGreaterThan(initialY);

      // Fast forward past max life (~0.8s)
      pool.update(1.0);
      expect(item.active).toBe(false);
      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getFreeCount()).toBe(60);
    });

    it('should support DOM container overlay if provided', () => {
      // Mock DOM container
      const mockContainer = {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      } as unknown as HTMLElement;

      // Mock document.createElement
      const mockElement = {
        style: {} as Record<string, string>,
        textContent: '',
      } as unknown as HTMLElement;

      const originalCreate = (globalThis as any).document?.createElement;
      const docSpy = vi.fn().mockReturnValue(mockElement);
      if (typeof (globalThis as any).document === 'undefined') {
        (globalThis as any).document = { createElement: docSpy };
      } else {
        (globalThis as any).document.createElement = docSpy;
      }

      try {
        const domPool = new DamageNumberPool(mockContainer);
        expect(mockContainer.appendChild).toHaveBeenCalledTimes(60);

        const spawned = domPool.spawn(5, 5, 75, true);
        expect(spawned?.element).toBeDefined();
        if (spawned?.element) {
          expect(spawned.element.textContent).toContain('75');
          expect(spawned.element.style.display).toBe('block');
        }

        // Updating with mock camera
        const camera = new THREE.PerspectiveCamera();
        domPool.update(0.1, camera, 800, 600);

        // Recycle after expiration
        domPool.update(1.0);
        if (spawned?.element) {
          expect(spawned.element.style.display).toBe('none');
        }
      } finally {
        if (originalCreate) {
          (globalThis as any).document.createElement = originalCreate;
        } else {
          delete (globalThis as any).document;
        }
      }
    });

    it('should reuse recycled items without re-allocation', () => {
      const item1 = pool.spawn(1, 1, 10);
      expect(item1).not.toBeNull();
      pool.update(1.5); // Expires item1

      expect(pool.getActiveCount()).toBe(0);

      const item2 = pool.spawn(2, 2, 20);
      expect(item2).toBe(item1); // Exact same pooled object reused
      expect(item2?.amount).toBe(20);
      expect(pool.getActiveCount()).toBe(1);
    });

    it('should clear all active damage numbers on clear()', () => {
      pool.spawn(1, 1, 10);
      pool.spawn(2, 2, 20);
      pool.spawn(3, 3, 30);

      expect(pool.getActiveCount()).toBe(3);
      pool.clear();
      expect(pool.getActiveCount()).toBe(0);
      expect(pool.getFreeCount()).toBe(60);
    });
  });
});
