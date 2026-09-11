import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  WEAPONS,
  WeaponId,
  WEAPON_DEFINITIONS,
} from '../../src/weapons/WeaponTypes';
import {
  WeaponInventory,
  FireContext,
} from '../../src/weapons/WeaponInventory';
import {
  Barrel,
  detonateExplosion,
} from '../../src/entities/Barrel';
import { FakeWall } from '../../src/entities/FakeWall';
import { ProjectilePool } from '../../src/weapons/ProjectilePool';
import { ParticlePool } from '../../src/fx/ParticlePool';
import { BloodCanvas } from '../../src/render/BloodCanvas';
import { InputManagerImpl } from '../../src/core/Input';
import {
  COLOR_BARREL_BODY,
  COLOR_BARREL_STRIPE,
  COLOR_OUTLINE,
  COLOR_FAKE_WALL,
  AABB,
} from '../../src/core/Constants';

describe('Task 7: Weapons Arsenal & Explosive Props', () => {
  describe('Weapon Types & Arsenal Definitions', () => {
    it('should define all 7 classic Boxhead weapons with authentic specs', () => {
      expect(WEAPON_DEFINITIONS.length).toBe(7);

      // 1. Pistol (1x): infinite ammo (-1), cooldown 0.22s, speed 55, damage 15, zero spread
      const pistol = WEAPONS[WeaponId.Pistol];
      expect(pistol).toBeDefined();
      expect(pistol.name).toBe('Pistol');
      expect(pistol.slot).toBe(1);
      expect(pistol.unlockMultiplier).toBe(1);
      expect(pistol.maxAmmo).toBe(-1);
      expect(pistol.cooldown).toBeCloseTo(0.22);
      expect(pistol.fireRate).toBeCloseTo(0.22);
      expect(pistol.damage).toBe(15);
      expect(pistol.speed).toBe(55);
      expect(pistol.spread).toBe(0);
      expect(pistol.isPlaceable).toBe(false);
      expect(pistol.isAutomatic).toBe(false);

      // 2. Uzi (4x): max ammo 200, cooldown 0.08s, auto-fire, spread ±0.12 rad, damage 10, speed 50
      const uzi = WEAPONS[WeaponId.Uzi];
      expect(uzi).toBeDefined();
      expect(uzi.name).toBe('Uzi');
      expect(uzi.slot).toBe(2);
      expect(uzi.unlockMultiplier).toBe(4);
      expect(uzi.maxAmmo).toBe(200);
      expect(uzi.cooldown).toBeCloseTo(0.08);
      expect(uzi.damage).toBe(10);
      expect(uzi.speed).toBe(50);
      expect(uzi.spread).toBeCloseTo(0.12);
      expect(uzi.isPlaceable).toBe(false);
      expect(uzi.isAutomatic).toBe(true);

      // 3. Shotgun (8x): max ammo 50, cooldown 0.65s, 5 pellets cone ±0.25 rad, damage 12/pellet, speed 45
      const shotgun = WEAPONS[WeaponId.Shotgun];
      expect(shotgun).toBeDefined();
      expect(shotgun.name).toBe('Shotgun');
      expect(shotgun.slot).toBe(3);
      expect(shotgun.unlockMultiplier).toBe(8);
      expect(shotgun.maxAmmo).toBe(50);
      expect(shotgun.cooldown).toBeCloseTo(0.65);
      expect(shotgun.damage).toBe(12);
      expect(shotgun.speed).toBe(45);
      expect(shotgun.spread).toBeCloseTo(0.25);
      expect(shotgun.count).toBe(5);
      expect(shotgun.isPlaceable).toBe(false);

      // 4. Explosive Barrel (12x): max 10 count, placeable prop, 35 HP, radius 4.5, 120 damage
      const barrel = WEAPONS[WeaponId.Barrel];
      expect(barrel).toBeDefined();
      expect(barrel.name).toBe('Explosive Barrel');
      expect(barrel.slot).toBe(4);
      expect(barrel.unlockMultiplier).toBe(12);
      expect(barrel.maxAmmo).toBe(10);
      expect(barrel.isPlaceable).toBe(true);
      expect(barrel.damage).toBe(120);
      expect(barrel.explosionRadius).toBeCloseTo(4.5);
      expect(barrel.hp).toBe(35);

      // 5. Hand Grenade (16x): max 15 count, thrown with bounce, radius 4.5, 140 damage
      const grenade = WEAPONS[WeaponId.Grenade];
      expect(grenade).toBeDefined();
      expect(grenade.name).toBe('Hand Grenade');
      expect(grenade.slot).toBe(5);
      expect(grenade.unlockMultiplier).toBe(16);
      expect(grenade.maxAmmo).toBe(15);
      expect(grenade.damage).toBe(140);
      expect(grenade.explosionRadius).toBeCloseTo(4.5);
      expect(grenade.isPlaceable).toBe(false);

      // 6. Fake Wall (20x): max 15 count, placeable barricade, 150 HP
      const fakeWall = WEAPONS[WeaponId.FakeWall];
      expect(fakeWall).toBeDefined();
      expect(fakeWall.name).toBe('Fake Wall');
      expect(fakeWall.slot).toBe(6);
      expect(fakeWall.unlockMultiplier).toBe(20);
      expect(fakeWall.maxAmmo).toBe(15);
      expect(fakeWall.hp).toBe(150);
      expect(fakeWall.isPlaceable).toBe(true);

      // 7. Rocket Launcher (40x): max 20 ammo, cooldown 1.0s, straight rocket, speed 28, radius 4.0, 160 damage
      const rocket = WEAPONS[WeaponId.RocketLauncher];
      expect(rocket).toBeDefined();
      expect(rocket.name).toBe('Rocket Launcher');
      expect(rocket.slot).toBe(7);
      expect(rocket.unlockMultiplier).toBe(40);
      expect(rocket.maxAmmo).toBe(20);
      expect(rocket.cooldown).toBeCloseTo(1.0);
      expect(rocket.damage).toBe(160);
      expect(rocket.speed).toBe(28);
      expect(rocket.explosionRadius).toBeCloseTo(4.0);
      expect(rocket.isPlaceable).toBe(false);
    });
  });

  describe('WeaponInventory Initialization & Milestones', () => {
    let inventory: WeaponInventory;

    beforeEach(() => {
      inventory = new WeaponInventory();
    });

    it('should initialize with Pistol permanently unlocked and other weapons locked', () => {
      expect(inventory.isUnlocked(WeaponId.Pistol)).toBe(true);
      expect(inventory.activeWeaponId).toBe(WeaponId.Pistol);
      expect(inventory.getAmmo(WeaponId.Pistol)).toBe(-1); // Infinite ammo

      expect(inventory.isUnlocked(WeaponId.Uzi)).toBe(false);
      expect(inventory.isUnlocked(WeaponId.Shotgun)).toBe(false);
      expect(inventory.isUnlocked(WeaponId.Barrel)).toBe(false);
      expect(inventory.isUnlocked(WeaponId.Grenade)).toBe(false);
      expect(inventory.isUnlocked(WeaponId.FakeWall)).toBe(false);
      expect(inventory.isUnlocked(WeaponId.RocketLauncher)).toBe(false);
    });

    it('should unlock weapons at multiplier milestones (4, 8, 12, 16, 20, 40)', () => {
      // At multiplier 3: nothing unlocks
      expect(inventory.unlockMilestone(3)).toEqual([]);
      expect(inventory.isUnlocked(WeaponId.Uzi)).toBe(false);

      // At multiplier 4: Uzi unlocks with full ammo (200)
      expect(inventory.unlockMilestone(4)).toEqual([WeaponId.Uzi]);
      expect(inventory.isUnlocked(WeaponId.Uzi)).toBe(true);
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(200);

      // Re-reaching 4 doesn't re-unlock
      expect(inventory.unlockMilestone(4)).toEqual([]);

      // Jumping to multiplier 15 unlocks Shotgun (8x) and Barrels (12x)
      const unlocked = inventory.unlockMilestone(15);
      expect(unlocked).toEqual([WeaponId.Shotgun, WeaponId.Barrel]);
      expect(inventory.isUnlocked(WeaponId.Shotgun)).toBe(true);
      expect(inventory.isUnlocked(WeaponId.Barrel)).toBe(true);
      expect(inventory.getAmmo(WeaponId.Shotgun)).toBe(50);
      expect(inventory.getAmmo(WeaponId.Barrel)).toBe(10);

      // Reaching multiplier 40 unlocks Grenades, Fake Walls, Rocket Launcher
      const finalBatch = inventory.unlockMilestone(40);
      expect(finalBatch).toEqual([
        WeaponId.Grenade,
        WeaponId.FakeWall,
        WeaponId.RocketLauncher,
      ]);
      expect(inventory.isUnlocked(WeaponId.Grenade)).toBe(true);
      expect(inventory.isUnlocked(WeaponId.FakeWall)).toBe(true);
      expect(inventory.isUnlocked(WeaponId.RocketLauncher)).toBe(true);
      expect(inventory.getAmmo(WeaponId.RocketLauncher)).toBe(20);
    });

    it('should keep unlocks permanent even if multiplier decays to 1', () => {
      inventory.unlockMilestone(40);
      expect(inventory.isUnlocked(WeaponId.RocketLauncher)).toBe(true);

      // Multiplier decays back to 1
      inventory.unlockMilestone(1);
      expect(inventory.isUnlocked(WeaponId.RocketLauncher)).toBe(true);
      expect(inventory.isUnlocked(WeaponId.Uzi)).toBe(true);
      expect(inventory.isUnlocked(WeaponId.Pistol)).toBe(true);
    });
  });

  describe('Weapon Switching & Input Synchronization', () => {
    let inventory: WeaponInventory;

    beforeEach(() => {
      inventory = new WeaponInventory();
      // Unlock up to Barrels (Pistol, Uzi, Shotgun, Barrel)
      inventory.unlockMilestone(12);
    });

    it('should switch between unlocked weapons via selectWeapon and selectSlot', () => {
      expect(inventory.selectWeapon(WeaponId.Uzi)).toBe(true);
      expect(inventory.activeWeaponId).toBe(WeaponId.Uzi);

      expect(inventory.selectSlot(3)).toBe(true); // Shotgun
      expect(inventory.activeWeaponId).toBe(WeaponId.Shotgun);

      // Switching to a locked weapon (e.g. Rocket Launcher) should fail and keep active weapon
      expect(inventory.selectWeapon(WeaponId.RocketLauncher)).toBe(false);
      expect(inventory.activeWeaponId).toBe(WeaponId.Shotgun);
    });

    it('should cycle nextWeapon() through unlocked weapons in order and wrap around', () => {
      expect(inventory.activeWeaponId).toBe(WeaponId.Pistol); // 1

      expect(inventory.nextWeapon()).toBe(WeaponId.Uzi); // 2
      expect(inventory.nextWeapon()).toBe(WeaponId.Shotgun); // 3
      expect(inventory.nextWeapon()).toBe(WeaponId.Barrel); // 4
      // Grenade (5), FakeWall (6), Rocket (7) are locked, so wraps to Pistol (1)
      expect(inventory.nextWeapon()).toBe(WeaponId.Pistol);
    });

    it('should cycle previousWeapon() through unlocked weapons backwards and wrap around', () => {
      expect(inventory.activeWeaponId).toBe(WeaponId.Pistol); // 1

      // Backwards wraps to last unlocked weapon: Barrel (4)
      expect(inventory.previousWeapon()).toBe(WeaponId.Barrel);
      expect(inventory.previousWeapon()).toBe(WeaponId.Shotgun);
      expect(inventory.previousWeapon()).toBe(WeaponId.Uzi);
      expect(inventory.previousWeapon()).toBe(WeaponId.Pistol);
    });

    it('should sync with InputManager activeSlot and ignore locked slots', () => {
      const input = new InputManagerImpl();
      input.activeSlot = 2; // Uzi is unlocked
      inventory.update(0.016, input);
      expect(inventory.activeWeaponId).toBe(WeaponId.Uzi);

      // User presses key '7' (Rocket Launcher, currently locked)
      input.activeSlot = 7;
      inventory.update(0.016, input);
      // Should reject locked weapon and revert activeSlot to current unlocked weapon
      expect(inventory.activeWeaponId).toBe(WeaponId.Uzi);
      expect(input.activeSlot).toBe(WeaponId.Uzi);
    });
  });

  describe('Firing Cooldowns & Ammo Consumption', () => {
    let inventory: WeaponInventory;
    let pool: ProjectilePool;
    let context: FireContext;

    beforeEach(() => {
      inventory = new WeaponInventory();
      inventory.unlockMilestone(40); // Unlock all weapons
      pool = new ProjectilePool();
      context = { projectilePool: pool };
    });

    it('should fire Pistol with infinite ammo and enforce cooldown timer (0.22s)', () => {
      const playerPos = { x: 0, z: 0 };
      const aimAngle = 0; // facing +Z

      // First shot succeeds
      const fired1 = inventory.fire(playerPos, aimAngle, context);
      expect(fired1).toBe(true);
      expect(inventory.getAmmo(WeaponId.Pistol)).toBe(-1); // Infinite
      expect(inventory.cooldownTimer).toBeCloseTo(0.22);
      expect(pool.getActiveCount('bullet')).toBe(1);

      // Immediate second shot fails because cooldown is active
      const fired2 = inventory.fire(playerPos, aimAngle, context);
      expect(fired2).toBe(false);
      expect(pool.getActiveCount('bullet')).toBe(1);

      // Advance time by 0.1s -> still on cooldown (0.12s left)
      inventory.updateCooldown(0.1);
      expect(inventory.fire(playerPos, aimAngle, context)).toBe(false);

      // Advance time by another 0.15s -> cooldown expired (<= 0)
      inventory.updateCooldown(0.15);
      expect(inventory.fire(playerPos, aimAngle, context)).toBe(true);
      expect(pool.getActiveCount('bullet')).toBe(2);
    });

    it('should fire Uzi with rapid cooldown (0.08s) and consume 1 ammo per shot', () => {
      inventory.selectWeapon(WeaponId.Uzi);
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(200);

      const playerPos = { x: 0, z: 0 };
      const aimAngle = Math.PI / 2; // facing +X

      const fired = inventory.fire(playerPos, aimAngle, context);
      expect(fired).toBe(true);
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(199);
      expect(inventory.cooldownTimer).toBeCloseTo(0.08);

      const bullets = pool.getActive();
      expect(bullets.length).toBe(1);
      expect(bullets[0].damage).toBe(10);
      expect(bullets[0].speed).toBe(50);
    });

    it('should fire Shotgun with 5 pellets in a spread cone (±0.25 rad) consuming 1 ammo', () => {
      inventory.selectWeapon(WeaponId.Shotgun);
      expect(inventory.getAmmo(WeaponId.Shotgun)).toBe(50);

      const playerPos = { x: 5, z: -5 };
      const aimAngle = 0; // facing +Z

      const fired = inventory.fire(playerPos, aimAngle, context);
      expect(fired).toBe(true);
      expect(inventory.getAmmo(WeaponId.Shotgun)).toBe(49);
      expect(inventory.cooldownTimer).toBeCloseTo(0.65);

      // Shotgun spawns 5 pellets simultaneously
      expect(pool.getActiveCount('bullet')).toBe(5);
      for (const p of pool.getActive()) {
        expect(p.damage).toBe(12);
        expect(p.speed).toBe(45);
      }
    });

    it('should fire Rocket Launcher spawning rocket projectile', () => {
      inventory.selectWeapon(WeaponId.RocketLauncher);
      expect(inventory.getAmmo(WeaponId.RocketLauncher)).toBe(20);

      const fired = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(fired).toBe(true);
      expect(inventory.getAmmo(WeaponId.RocketLauncher)).toBe(19);
      expect(inventory.cooldownTimer).toBeCloseTo(1.0);
      expect(pool.getActiveCount('rocket')).toBe(1);

      const rocket = pool.getActive()[0];
      expect(rocket.damage).toBe(160);
      expect(rocket.speed).toBe(28);
    });

    it('should throw Grenade spawning grenade projectile with bouncing fuse', () => {
      inventory.selectWeapon(WeaponId.Grenade);
      expect(inventory.getAmmo(WeaponId.Grenade)).toBe(15);

      const fired = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(fired).toBe(true);
      expect(inventory.getAmmo(WeaponId.Grenade)).toBe(14);
      expect(pool.getActiveCount('grenade')).toBe(1);

      const grenade = pool.getActive()[0];
      expect(grenade.damage).toBe(140);
    });

    it('should prevent firing when ammo is depleted (0 count)', () => {
      inventory.selectWeapon(WeaponId.RocketLauncher);
      // Drain ammo to 0
      inventory.ammo.set(WeaponId.RocketLauncher, 0);

      const fired = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(fired).toBe(false);
      expect(pool.getActiveCount('rocket')).toBe(0);
      expect(inventory.cooldownTimer).toBe(0);
    });
  });

  describe('Ammo Refill via addAmmo(fraction)', () => {
    let inventory: WeaponInventory;

    beforeEach(() => {
      inventory = new WeaponInventory();
      inventory.unlockMilestone(40); // Unlock all weapons
    });

    it('should refill secondary ammo by specified fraction without exceeding max capacity', () => {
      // Set ammo partially depleted
      inventory.ammo.set(WeaponId.Uzi, 100); // 100 / 200 (missing 100)
      inventory.ammo.set(WeaponId.Shotgun, 20); // 20 / 50 (missing 30)
      inventory.ammo.set(WeaponId.RocketLauncher, 5); // 5 / 20 (missing 15)

      // +35% refill
      inventory.addAmmo(0.35);

      // Uzi: 100 + ceil(200 * 0.35 = 70) = 170
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(170);

      // Shotgun: 20 + ceil(50 * 0.35 = 17.5 -> 18) = 38
      expect(inventory.getAmmo(WeaponId.Shotgun)).toBe(38);

      // Rocket: 5 + ceil(20 * 0.35 = 7) = 12
      expect(inventory.getAmmo(WeaponId.RocketLauncher)).toBe(12);

      // Pistol remains infinite (-1)
      expect(inventory.getAmmo(WeaponId.Pistol)).toBe(-1);

      // Additional large refill clamps at maxAmmo
      inventory.addAmmo(1.0);
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(200);
      expect(inventory.getAmmo(WeaponId.Shotgun)).toBe(50);
      expect(inventory.getAmmo(WeaponId.RocketLauncher)).toBe(20);
    });
  });

  describe('Prop Placement (Barrels & Fake Walls)', () => {
    let inventory: WeaponInventory;
    let scene: THREE.Scene;
    let barrels: Barrel[];
    let fakeWalls: FakeWall[];
    let obstacles: AABB[];
    let context: FireContext;

    beforeEach(() => {
      inventory = new WeaponInventory();
      inventory.unlockMilestone(20);
      scene = new THREE.Scene();
      barrels = [];
      fakeWalls = [];
      obstacles = [];
      context = {
        scene,
        barrels,
        fakeWalls,
        obstacles,
      };
    });

    it('should place an Explosive Barrel in front of player along aim angle', () => {
      inventory.selectWeapon(WeaponId.Barrel);
      expect(inventory.getAmmo(WeaponId.Barrel)).toBe(10);

      const playerPos = { x: 0, z: 0 };
      const aimAngle = 0; // facing +Z

      const placed = inventory.fire(playerPos, aimAngle, context);
      expect(placed).toBe(true);
      expect(inventory.getAmmo(WeaponId.Barrel)).toBe(9);
      expect(barrels.length).toBe(1);

      const barrel = barrels[0];
      expect(barrel.pos.x).toBeCloseTo(0);
      expect(barrel.pos.z).toBeGreaterThan(1.0); // Offset in front of player (+Z)
      expect(scene.children.includes(barrel.mesh)).toBe(true);
      expect(barrel.alive).toBe(true);
    });

    it('should place a Fake Wall in front of player and add its AABB to obstacles', () => {
      inventory.selectWeapon(WeaponId.FakeWall);
      expect(inventory.getAmmo(WeaponId.FakeWall)).toBe(15);

      const playerPos = { x: 2, z: 2 };
      const aimAngle = Math.PI / 2; // facing +X

      const placed = inventory.fire(playerPos, aimAngle, context);
      expect(placed).toBe(true);
      expect(inventory.getAmmo(WeaponId.FakeWall)).toBe(14);
      expect(fakeWalls.length).toBe(1);

      const wall = fakeWalls[0];
      expect(wall.pos.x).toBeGreaterThan(playerPos.x);
      expect(wall.pos.z).toBeCloseTo(playerPos.z);
      expect(scene.children.includes(wall.mesh)).toBe(true);

      const aabb = wall.getAABB();
      expect(aabb.maxX - aabb.minX).toBeCloseTo(1.5);
      expect(aabb.maxZ - aabb.minZ).toBeCloseTo(1.5);
    });

    it('should reject prop placement if target position overlaps an existing wall', () => {
      inventory.selectWeapon(WeaponId.Barrel);
      // Obstacle block directly in front of player
      obstacles.push({ minX: -2, maxX: 2, minZ: 1.0, maxZ: 3.0 });

      const playerPos = { x: 0, z: 0 };
      const aimAngle = 0; // facing straight into the wall (+Z)

      const placed = inventory.fire(playerPos, aimAngle, context);
      // Placement should fail because it overlaps wall
      expect(placed).toBe(false);
      // Ammo must NOT be consumed on failure
      expect(inventory.getAmmo(WeaponId.Barrel)).toBe(10);
      expect(barrels.length).toBe(0);
      expect(inventory.cooldownTimer).toBe(0);
    });
  });

  describe('Explosive Barrel Entity & Chain Detonation', () => {
    it('should construct visual mesh with red body, yellow band, and EdgesGeometry outline (#111111)', () => {
      const barrel = new Barrel(5, -5);
      expect(barrel.hp).toBe(35);
      expect(barrel.maxHp).toBe(35);
      expect(barrel.radius).toBe(0.6);
      expect(barrel.alive).toBe(true);
      expect(barrel.exploded).toBe(false);

      const aabb = barrel.getAABB();
      expect(aabb.maxX - aabb.minX).toBeCloseTo(1.2);
      expect(aabb.maxZ - aabb.minZ).toBeCloseTo(1.2);

      let foundRedBody = false;
      let foundYellowBand = false;
      let foundEdgeOutline = false;

      barrel.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshLambertMaterial;
          if (mat.color.getHex() === COLOR_BARREL_BODY) {
            foundRedBody = true;
          }
          if (mat.color.getHex() === COLOR_BARREL_STRIPE) {
            foundYellowBand = true;
          }
        }
        if (child instanceof THREE.LineSegments) {
          const lineMat = child.material as THREE.LineBasicMaterial;
          if (lineMat.color.getHex() === COLOR_OUTLINE) {
            foundEdgeOutline = true;
          }
        }
      });

      expect(foundRedBody).toBe(true);
      expect(foundYellowBand).toBe(true);
      expect(foundEdgeOutline).toBe(true);
    });

    it('should survive non-fatal damage and detonate on fatal damage', () => {
      const barrel = new Barrel(0, 0);

      // Non-fatal bullet (15 damage)
      barrel.takeDamage(15);
      expect(barrel.hp).toBe(20);
      expect(barrel.alive).toBe(true);
      expect(barrel.exploded).toBe(false);

      // Fatal damage (25 damage -> hp <= 0)
      barrel.takeDamage(25);
      expect(barrel.hp).toBe(0);
      expect(barrel.alive).toBe(false);
      expect(barrel.exploded).toBe(true);
      expect(barrel.mesh.visible).toBe(false);
    });

    it('should chain detonate nearby barrels within radius 4.5 dealing 120 damage', () => {
      const b1 = new Barrel(0, 0);
      const b2 = new Barrel(2.5, 0); // Distance 2.5 <= 4.5 -> should detonate
      const b3 = new Barrel(5.0, 0); // Distance from b2 is 2.5 <= 4.5 -> should detonate in chain
      const farBarrel = new Barrel(20, 20); // Far away -> unaffected

      const barrels = [b1, b2, b3, farBarrel];
      const enemies = [
        {
          id: 101,
          pos: { x: 1, z: 0 },
          radius: 0.65,
          alive: true,
          hp: 100,
          takeDamage(amt: number) {
            this.hp -= amt;
            return this.hp <= 0;
          },
        },
      ];
      const player = {
        pos: { x: -3, z: 0 },
        radius: 0.7,
        hp: 100,
        takeDamage(amt: number) {
          this.hp -= amt;
          return this.hp <= 0;
        },
      };

      const particlePool = new ParticlePool();
      const bloodCanvas = new BloodCanvas(52, 36, 256);
      const splatterSpy = vi.spyOn(bloodCanvas, 'addSplatter');

      // Detonate b1
      b1.explode({
        barrels,
        enemies,
        player,
        particlePool,
        bloodCanvas,
      });

      // b1, b2, and b3 should all have detonated in chain
      expect(b1.exploded).toBe(true);
      expect(b2.exploded).toBe(true);
      expect(b3.exploded).toBe(true);

      // Far barrel remains intact
      expect(farBarrel.exploded).toBe(false);
      expect(farBarrel.alive).toBe(true);

      // Enemy in blast radius took 120 damage and blood splatter spawned
      expect(enemies[0].hp).toBeLessThanOrEqual(0);
      expect(splatterSpy).toHaveBeenCalled();

      // Player at distance 3.0 <= 4.5 + 0.7 took 120 damage
      expect(player.hp).toBeLessThan(100);

      // Particles spawned from explosions
      expect(particlePool.getActiveCount()).toBeGreaterThan(0);
    });
  });

  describe('FakeWall Barricade Entity', () => {
    it('should construct visual mesh with wooden block and EdgesGeometry outline (#111111)', () => {
      const wall = new FakeWall(10, 10);
      expect(wall.hp).toBe(150);
      expect(wall.maxHp).toBe(150);
      expect(wall.alive).toBe(true);

      let foundWoodMesh = false;
      let foundEdgeOutline = false;

      wall.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshLambertMaterial;
          if (mat.color.getHex() === COLOR_FAKE_WALL) {
            foundWoodMesh = true;
          }
        }
        if (child instanceof THREE.LineSegments) {
          const lineMat = child.material as THREE.LineBasicMaterial;
          if (lineMat.color.getHex() === COLOR_OUTLINE) {
            foundEdgeOutline = true;
          }
        }
      });

      expect(foundWoodMesh).toBe(true);
      expect(foundEdgeOutline).toBe(true);
    });

    it('should take damage from enemy attacks and become destroyed when HP reaches 0', () => {
      const wall = new FakeWall(0, 0);

      // Zombie hit (15 damage)
      const destroyed1 = wall.takeDamage(15);
      expect(destroyed1).toBe(false);
      expect(wall.hp).toBe(135);
      expect(wall.alive).toBe(true);

      // Heavy damage destroying the wall
      const destroyed2 = wall.takeDamage(150);
      expect(destroyed2).toBe(true);
      expect(wall.hp).toBe(0);
      expect(wall.alive).toBe(false);
      expect(wall.mesh.visible).toBe(false);
    });
  });

  describe('Rocket & Grenade Detonations via detonateExplosion', () => {
    it('should apply radial damage to enemies and player in 4.0 radius for rockets', () => {
      const enemies = [
        {
          pos: { x: 2, z: 0 },
          radius: 0.65,
          hp: 150,
          takeDamage(amt: number) {
            this.hp -= amt;
            return this.hp <= 0;
          },
        },
        {
          pos: { x: 10, z: 0 }, // Out of range
          radius: 0.65,
          hp: 150,
          takeDamage(amt: number) {
            this.hp -= amt;
            return this.hp <= 0;
          },
        },
      ];
      const fakeWalls = [new FakeWall(1, 1)];

      detonateExplosion(0, 0, 4.0, 160, {
        enemies,
        fakeWalls,
      });

      // Close enemy takes 160 damage
      expect(enemies[0].hp).toBeLessThanOrEqual(0);
      // Far enemy unaffected
      expect(enemies[1].hp).toBe(150);
      // Fake wall took 160 damage and is destroyed
      expect(fakeWalls[0].hp).toBe(0);
      expect(fakeWalls[0].alive).toBe(false);
    });
  });

  describe('Post-Review Fixes & Edge Cases', () => {
    it('should fire semi-automatic weapons on click edge and auto-fire Uzi continuously in update()', () => {
      const inventory = new WeaponInventory();
      inventory.unlockMilestone(4); // Unlock Uzi as well
      const pool = new ProjectilePool();
      const context: FireContext = { projectilePool: pool };
      const input = new InputManagerImpl();
      const playerPos = { x: 0, z: 0 };
      const aimAngle = 0;

      // 1. Pistol (semi-automatic):
      inventory.selectWeapon(WeaponId.Pistol);
      input.isMouseDown = true; // Click down

      // First tick: click edge triggers fire
      const fired1 = inventory.update(0.016, input, playerPos, aimAngle, context);
      expect(fired1).toBe(true);
      expect(pool.getActiveCount('bullet')).toBe(1);

      // Cooldown elapses while mouse is STILL held down
      inventory.update(0.3, input, playerPos, aimAngle, context);
      // Even though cooldown is 0, semi-auto must NOT re-fire because mouse was held without a new click
      expect(pool.getActiveCount('bullet')).toBe(1);

      // Release mouse
      input.isMouseDown = false;
      inventory.update(0.016, input, playerPos, aimAngle, context);

      // Click down again -> new click edge fires second bullet
      input.isMouseDown = true;
      const fired2 = inventory.update(0.016, input, playerPos, aimAngle, context);
      expect(fired2).toBe(true);
      expect(pool.getActiveCount('bullet')).toBe(2);

      // 2. Uzi (automatic):
      input.activeSlot = WeaponId.Uzi;
      inventory.selectWeapon(WeaponId.Uzi);
      inventory.updateCooldown(1.0); // Reset cooldown
      pool.clear();

      input.isMouseDown = true;
      // First tick fires
      expect(inventory.update(0.016, input, playerPos, aimAngle, context)).toBe(true);
      expect(pool.getActiveCount('bullet')).toBe(1);

      // Tick while still on cooldown
      expect(inventory.update(0.02, input, playerPos, aimAngle, context)).toBe(false);

      // Tick past 0.08s cooldown while mouse is still held down -> automatically fires!
      expect(inventory.update(0.08, input, playerPos, aimAngle, context)).toBe(true);
      expect(pool.getActiveCount('bullet')).toBe(2);
    });

    it('should unregister FakeWall from obstacles upon destruction to prevent ghost collisions', () => {
      const inventory = new WeaponInventory();
      inventory.unlockMilestone(20);
      const obstacles: AABB[] = [];
      const fakeWalls: FakeWall[] = [];
      const context: FireContext = { obstacles, fakeWalls };

      // Place fake wall
      inventory.selectWeapon(WeaponId.FakeWall);
      const placed = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(placed).toBe(true);
      expect(obstacles.length).toBe(1);
      expect(fakeWalls.length).toBe(1);

      const wall = fakeWalls[0];
      expect(obstacles[0]).toBe(wall.aabb);

      // Wall takes partial damage -> still in obstacles
      wall.takeDamage(50);
      expect(wall.alive).toBe(true);
      expect(obstacles.length).toBe(1);

      // Fatal damage destroys wall -> removes AABB from obstacles
      wall.takeDamage(100);
      expect(wall.alive).toBe(false);
      expect(obstacles.length).toBe(0);
    });

    it('should register Barrel in obstacles on placement, prevent overlapping placement, and unregister on detonation', () => {
      const inventory = new WeaponInventory();
      inventory.unlockMilestone(12);
      const obstacles: AABB[] = [];
      const barrels: Barrel[] = [];
      const context: FireContext = { obstacles, barrels };

      inventory.selectWeapon(WeaponId.Barrel);

      // 1. Place first barrel
      const placed1 = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(placed1).toBe(true);
      expect(barrels.length).toBe(1);
      expect(obstacles.length).toBe(1); // Registered as obstacle

      const barrel1 = barrels[0];
      expect(obstacles[0]).toBe(barrel1.aabb);

      // 2. Attempt to place second barrel at same position -> rejected (prevent overlap)
      inventory.updateCooldown(1.0);
      const placed2 = inventory.fire({ x: 0, z: 0 }, 0, context);
      expect(placed2).toBe(false);
      expect(barrels.length).toBe(1);
      expect(inventory.getAmmo(WeaponId.Barrel)).toBe(9); // Not consumed

      // 3. Detonate first barrel -> removed from obstacles
      barrel1.explode();
      expect(barrel1.exploded).toBe(true);
      expect(obstacles.length).toBe(0);
    });

    it('should share static geometries and materials across multiple Barrel and FakeWall instances', () => {
      const b1 = new Barrel(0, 0);
      const b2 = new Barrel(5, 5);

      let b1Mesh: THREE.Mesh | null = null;
      let b2Mesh: THREE.Mesh | null = null;

      b1.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && !b1Mesh) b1Mesh = child;
      });
      b2.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && !b2Mesh) b2Mesh = child;
      });

      expect(b1Mesh).not.toBeNull();
      expect(b2Mesh).not.toBeNull();
      // Geometry and Material instances should be strictly identical references (zero GPU leaks)
      expect(b1Mesh!.geometry).toBe(b2Mesh!.geometry);
      expect(b1Mesh!.material).toBe(b2Mesh!.material);

      const w1 = new FakeWall(0, 0);
      const w2 = new FakeWall(10, 10);

      let w1Mesh: THREE.Mesh | null = null;
      let w2Mesh: THREE.Mesh | null = null;

      w1.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && !w1Mesh) w1Mesh = child;
      });
      w2.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && !w2Mesh) w2Mesh = child;
      });

      expect(w1Mesh).not.toBeNull();
      expect(w2Mesh).not.toBeNull();
      expect(w1Mesh!.geometry).toBe(w2Mesh!.geometry);
      expect(w1Mesh!.material).toBe(w2Mesh!.material);
    });
  });
});
