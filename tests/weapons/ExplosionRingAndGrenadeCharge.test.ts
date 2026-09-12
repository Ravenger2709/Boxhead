import { describe, it, expect, vi } from 'vitest';
import { createExplosionRing } from '../../src/weapons/ExplosionRing';
import { WeaponInventory, FireContext } from '../../src/weapons/WeaponInventory';
import { ProjectilePool } from '../../src/weapons/ProjectilePool';
import { InputManagerImpl } from '../../src/core/Input';
import { Barrel } from '../../src/entities/Barrel';
import { Claymore } from '../../src/entities/Claymore';
import { ChargePack } from '../../src/entities/ChargePack';

describe('ExplosionRing & Grenade Hold-to-Charge Mechanics', () => {
  describe('createExplosionRing', () => {
    it('generates 1 ring of 6 sub-explosions for BigBang', () => {
      const centerX = 10;
      const centerZ = 20;
      const baseDamage = 150;
      const baseRadius = 4.5;

      const subExplosions = createExplosionRing(centerX, centerZ, baseDamage, baseRadius, false);

      expect(subExplosions.length).toBe(6);
      const expectedDist = baseRadius * 0.65;
      const expectedDamage = Math.round(baseDamage * 0.45);

      for (const sub of subExplosions) {
        expect(sub.delay).toBeCloseTo(0.1);
        expect(sub.damage).toBe(expectedDamage);
        expect(sub.radius).toBeCloseTo(baseRadius * 0.5);
        const dist = Math.hypot(sub.x - centerX, sub.z - centerZ);
        expect(dist).toBeCloseTo(expectedDist);
      }
    });

    it('generates 2 concentric rings (6 + 8 = 14 sub-explosions) for BiggerBang', () => {
      const centerX = 0;
      const centerZ = 0;
      const baseDamage = 250;
      const baseRadius = 4.0;

      const subExplosions = createExplosionRing(centerX, centerZ, baseDamage, baseRadius, true);

      expect(subExplosions.length).toBe(14);

      // First ring: 6 sub-explosions at delay 0.08
      const ring1 = subExplosions.filter((s) => Math.abs(s.delay - 0.08) < 0.001);
      expect(ring1.length).toBe(6);
      const expectedDist1 = baseRadius * 0.5;
      for (const sub of ring1) {
        expect(sub.damage).toBe(Math.round(baseDamage * 0.4));
        const dist = Math.hypot(sub.x, sub.z);
        expect(dist).toBeCloseTo(expectedDist1);
      }

      // Second ring: 8 sub-explosions at delay 0.16
      const ring2 = subExplosions.filter((s) => Math.abs(s.delay - 0.16) < 0.001);
      expect(ring2.length).toBe(8);
      const expectedDist2 = baseRadius * 0.9;
      for (const sub of ring2) {
        expect(sub.damage).toBe(Math.round(baseDamage * 0.35));
        const dist = Math.hypot(sub.x, sub.z);
        expect(dist).toBeCloseTo(expectedDist2);
      }
    });
  });

  describe('Grenade Hold-to-Charge Mechanics', () => {
    it('calculates throw speed scaling between 10.0 and 26.0 for hold times between 0.25s and 0.75s', () => {
      const inv = new WeaponInventory();

      // Minimum clamp (<= 0.25s)
      expect(inv.getGrenadeThrowSpeed(0)).toBeCloseTo(10.0);
      expect(inv.getGrenadeThrowSpeed(0.1)).toBeCloseTo(10.0);
      expect(inv.getGrenadeThrowSpeed(0.25)).toBeCloseTo(10.0);

      // Maximum clamp (>= 0.75s)
      expect(inv.getGrenadeThrowSpeed(0.75)).toBeCloseTo(26.0);
      expect(inv.getGrenadeThrowSpeed(1.5)).toBeCloseTo(26.0);

      // Midpoint (0.50s)
      expect(inv.getGrenadeThrowSpeed(0.5)).toBeCloseTo(18.0);
    });

    it('charges grenade hold time while mouse button is held down and fires upon release', () => {
      const inv = new WeaponInventory();
      inv.unlockMilestone(16); // Grenade unlocked
      inv.selectWeaponBySlot(5);

      const pool = new ProjectilePool();
      const context: FireContext = { projectilePool: pool };
      const input = new InputManagerImpl();
      input.activeSlot = 5; // keep grenade active
      const playerPos = { x: 0, z: 0 };
      const aimAngle = 0;

      // Mouse pressed down: starts charging
      input.isMouseDown = true;
      inv.update(0.3, input, playerPos, aimAngle, context);
      expect(pool.getActiveCount('grenade')).toBe(0); // Not released yet

      // Continue holding for total 0.5s
      inv.update(0.2, input, playerPos, aimAngle, context);
      expect(pool.getActiveCount('grenade')).toBe(0);

      // Release mouse: fires grenade with charged speed
      input.isMouseDown = false;
      const fired = inv.update(0.016, input, playerPos, aimAngle, context);
      expect(fired).toBe(true);
      expect(pool.getActiveCount('grenade')).toBe(1);

      const grenade = pool.getActive()[0];
      expect(grenade.speed).toBeCloseTo(18.0, 1);
    });
  });

  describe('Prop Multi-Explosion Ring Integration', () => {
    it('Barrel triggers onExplosionRing callback upon exploding when hasBigBang is active', () => {
      const barrel = new Barrel(5, 5);
      barrel.hasBigBang = true;

      const ringCallback = vi.fn();
      barrel.explode({
        onExplosionRing: ringCallback,
      });

      expect(ringCallback).toHaveBeenCalledTimes(1);
      expect(ringCallback).toHaveBeenCalledWith(5, 5, 150, 4.5, false);
    });

    it('Claymore spawns sub-explosions upon detonate when hasBiggerBang is active', () => {
      const spawnSubSpy = vi.fn();
      const claymore = new Claymore();
      claymore.init(10, -5, {
        damage: 100,
        radius: 4.0,
        hasBiggerBang: true,
        onSpawnSubExplosion: spawnSubSpy,
      });

      claymore.detonate();
      // BiggerBang generates 14 sub-explosions
      expect(spawnSubSpy).toHaveBeenCalledTimes(14);
      expect(claymore.subExplosions.length).toBe(14);
    });

    it('ChargePack spawns sub-explosions upon detonate when hasBigBang is active', () => {
      const spawnSubSpy = vi.fn();
      const charge = new ChargePack();
      charge.init(0, 0, {
        damage: 150,
        radius: 5.0,
        hasBigBang: true,
        onSpawnSubExplosion: spawnSubSpy,
      });

      charge.detonate();
      // BigBang generates 6 sub-explosions
      expect(spawnSubSpy).toHaveBeenCalledTimes(6);
      expect(charge.subExplosions.length).toBe(6);
    });
  });
});
