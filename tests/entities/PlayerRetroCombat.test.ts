import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Player } from '../../src/entities/Player';
import { Zombie } from '../../src/entities/Zombie';
import { Barrel } from '../../src/entities/Barrel';
import { FakeWall } from '../../src/entities/FakeWall';
import {
  Collide_Line,
  fireHitscanBullet,
  BulletTracerPool,
} from '../../src/entities/Bullet';
import { InputManagerImpl } from '../../src/core/Input';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import {
  PLAYER_MAX_HP,
  PLAYER_MASS,
  AABB,
} from '../../src/core/Constants';

describe('Player Retro Option A Combat, Hitstun, Knockback & Hitscan Bullets', () => {
  let player: Player;
  let input: InputManagerImpl;

  beforeEach(() => {
    player = new Player(0, 0);
    input = new InputManagerImpl();
  });

  describe('1. Option A Retro Keyboard Aiming & Controls', () => {
    it('should have mouseAimEnabled = false by default', () => {
      expect(player.mouseAimEnabled).toBe(false);
      expect(input.mouseAimEnabled).toBe(false);
    });

    it('should ignore mouse pointer ground position when mouseAimEnabled is false', () => {
      // Point mouse to East (+X)
      input.pointerGroundPos = { x: 100, z: 0 };
      player.update(0.016, input, []);

      // Facing angle should remain at 0 (initial facing South)
      expect(player.rotationAngle).toBe(0);
      expect(player.mesh.rotation.y).toBe(0);
    });

    it('should enable mouse aiming when mouseAimEnabled is explicitly set to true', () => {
      player.mouseAimEnabled = true;
      input.pointerGroundPos = { x: 50, z: 0 };
      player.update(0.016, input, []);

      expect(player.rotationAngle).toBeCloseTo(Math.PI / 2);
      expect(player.mesh.rotation.y).toBeCloseTo(Math.PI / 2);
    });

    it('should aim strictly along all 8 keyboard directions using WASD and Arrow keys', () => {
      // 1. South (+Z): Key S
      input.keys.clear();
      input.keys.add('s');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(0);

      // 2. North (-Z): Key W
      input.keys.clear();
      input.keys.add('w');
      player.update(0.016, input, []);
      expect(Math.abs(player.rotationAngle)).toBeCloseTo(Math.PI);

      // 3. East (+X): Key D
      input.keys.clear();
      input.keys.add('d');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.PI / 2);

      // 4. West (-X): Key A
      input.keys.clear();
      input.keys.add('a');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(-Math.PI / 2);

      // 5. North-East (+X, -Z): W + D
      input.keys.clear();
      input.keys.add('w');
      input.keys.add('d');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.atan2(1, -1)); // 3*PI/4

      // 6. North-West (-X, -Z): W + A
      input.keys.clear();
      input.keys.add('w');
      input.keys.add('a');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.atan2(-1, -1)); // -3*PI/4

      // 7. South-East (+X, +Z): S + D
      input.keys.clear();
      input.keys.add('s');
      input.keys.add('d');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.PI / 4);

      // 8. South-West (-X, +Z): S + A
      input.keys.clear();
      input.keys.add('s');
      input.keys.add('a');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(-Math.PI / 4);

      // Arrow keys (e.g. ArrowUp + ArrowRight)
      input.keys.clear();
      input.keys.add('arrowup');
      input.keys.add('arrowright');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.atan2(1, -1));
    });

    it('should snap to last facing angle when player becomes stationary', () => {
      // First move East (+X)
      input.keys.add('d');
      player.update(0.016, input, []);
      expect(player.rotationAngle).toBeCloseTo(Math.PI / 2);

      // Release all keys (stationary)
      input.keys.clear();
      input.pointerGroundPos = { x: -100, z: -100 }; // mouse pointer moved elsewhere
      player.update(0.016, input, []);

      // Facing angle must strictly snap to last facing angle (+PI/2)
      expect(player.rotationAngle).toBeCloseTo(Math.PI / 2);
      expect(player.mesh.rotation.y).toBeCloseTo(Math.PI / 2);
    });

    it('should support firing key with Spacebar or Slash (/)', () => {
      input.handleKeyDown(' ');
      expect(input.keys.has(' ')).toBe(true);
      expect(input.keys.has('space')).toBe(true);

      input.handleKeyUp(' ');
      expect(input.keys.has(' ')).toBe(false);

      input.handleKeyDown('/', 'Slash');
      expect(input.keys.has('/')).toBe(true);
      expect(input.keys.has('slash')).toBe(true);

      input.handleKeyUp('/', 'Slash');
      expect(input.keys.has('/')).toBe(false);
    });

    it('should fire along current 8-way facing vector with firing key', () => {
      const inventory = new WeaponInventory();
      // Face North (-Z)
      input.keys.add('w');
      player.update(0.016, input, []);
      expect(Math.abs(player.rotationAngle)).toBeCloseTo(Math.PI);

      // Press Space to fire
      input.keys.add(' ');
      const scene = new THREE.Scene();
      const zombie = new Zombie(0, -5); // North of player
      const didFire = inventory.update(0.016, input, player.pos, player.rotationAngle, {
        enemies: [zombie],
        scene,
      });

      expect(didFire).toBe(true);
      // Zombie directly North should take hitscan damage
      expect(zombie.hp).toBeLessThan(100);
    });
  });

  describe('2. Player Health & Passive Regeneration', () => {
    it('should initialize player with maxHp = 200 and mass = 2', () => {
      expect(player.hp).toBe(200);
      expect(player.maxHp).toBe(200);
      expect(player.mass).toBe(2);
      expect(PLAYER_MAX_HP).toBe(200);
      expect(PLAYER_MASS).toBe(2);
    });

    it('should passively regenerate health over 30s: hp += (maxHp / (60 * 30)) * dt * 60', () => {
      player.hp = 100;

      // Over 15 seconds, should regenerate 50% of maxHp (100 HP) -> 200 HP
      const dt = 15;
      player.update(dt, input, []);

      expect(player.hp).toBeCloseTo(200, 3);
    });

    it('should regenerate incrementally per frame and clamp at maxHp (200)', () => {
      player.hp = 190;

      // 1 frame at 60 FPS (dt = 1/60)
      player.update(1 / 60, input, []);
      // expected gain: 200 / (1800) * 1 = 0.1111 HP
      expect(player.hp).toBeCloseTo(190.111, 2);

      // Large dt should clamp strictly at maxHp
      player.update(60, input, []);
      expect(player.hp).toBe(200);
    });

    it('should not regenerate when player is dead (hp <= 0)', () => {
      player.hp = 0;
      player.update(1.0, input, []);
      expect(player.hp).toBe(0);
      expect(player.isDead).toBe(true);
    });
  });

  describe('3. Hitscan Bullets (Pistol, UZI, Shotgun)', () => {
    it('should resolve hitscan bullet damage and knockback on frame of fire matching Collide_Line', () => {
      const zombie = new Zombie(5, 0); // Zombie at (5, 0) with mass 1
      const initialHp = zombie.hp;
      const initialX = zombie.pos.x;

      // Fire hitscan from (0, 0) towards +X (dirX: 1, dirZ: 0)
      const result = fireHitscanBullet(0, 0, 1, 0, 15, 60, 1.5, {
        enemies: [zombie],
      });

      expect(result.hit).toBe(true);
      expect(result.targetType).toBe('enemy');
      expect(result.target).toBe(zombie);
      expect(result.point.x).toBeCloseTo(5 - zombie.radius);

      // Damage resolved on frame of fire
      expect(zombie.hp).toBe(initialHp - 15);

      // Knockback resolved on frame of fire: (damage / 5) * 2 / mass * 0.1 = (15 / 5) * 2 / 1 * 0.1 = 0.6
      expect(zombie.pos.x).toBeCloseTo(initialX + 0.6);
    });

    it('should hit obstacle and not penetrate behind it', () => {
      const wall: AABB = { minX: 3, maxX: 5, minZ: -2, maxZ: 2 };
      const zombie = new Zombie(8, 0); // Zombie behind the wall

      const result = Collide_Line(0, 0, 10, 0, {
        obstacles: [wall],
        enemies: [zombie],
      });

      expect(result.hit).toBe(true);
      expect(result.targetType).toBe('obstacle');
      expect(result.point.x).toBeCloseTo(3); // Front face of wall
      expect(zombie.hp).toBe(100); // Zombie was protected by the wall!
    });

    it('should damage explosive barrels and fake walls on frame of fire', () => {
      const barrel = new Barrel(4, 0);
      const fakeWall = new FakeWall(0, 4);

      const hitBarrel = fireHitscanBullet(0, 0, 1, 0, 15, 50, 1.5, {
        barrels: [barrel],
      });
      expect(hitBarrel.hit).toBe(true);
      expect(hitBarrel.targetType).toBe('barrel');
      expect(barrel.hp).toBe(0);
      expect(barrel.exploded).toBe(true);

      const hitWall = fireHitscanBullet(0, 0, 0, 1, 30, 50, 1.5, {
        fakeWalls: [fakeWall],
      });
      expect(hitWall.hit).toBe(true);
      expect(hitWall.targetType).toBe('fakewall');
      expect(fakeWall.hp).toBe(fakeWall.maxHp - 30);
    });

    it('should spawn a 2-frame fading tracer line with BulletTracerPool', () => {
      const scene = new THREE.Scene();
      const pool = new BulletTracerPool(scene, 5);

      const tracer = pool.spawn(0, 0, 10, 0);
      expect(tracer.active).toBe(true);
      expect(tracer.maxLife).toBeCloseTo(2 / 60);

      // Frame 1: dt = 1/60s -> still active, fading
      pool.update(1 / 60);
      expect(tracer.active).toBe(true);

      // Frame 2: dt = 1/60s -> 2 frames elapsed -> recycled
      pool.update(1 / 60);
      expect(tracer.active).toBe(false);
      expect(tracer.line.visible).toBe(false);
    });
  });

  describe('4. Combat Hitstun & Knockback (State_BulletHit & State_Sleep)', () => {
    it('should calculate knockback impulse = damage / 5 * 2 / mass for Player (mass = 2)', () => {
      // Impulse for 20 damage = 20 / 5 * 2 / 2 = 4.0
      player.applyKnockback(1, 0, 20);

      expect(player.vx).toBeCloseTo(4.0);
      expect(player.vz).toBe(0);
      expect(player.state).toBe(Player.State_BulletHit);
      expect(player.flinchTilt).toBeCloseTo(-0.25);
      expect(player.isInputLocked).toBe(true);
      expect(player.canMove).toBe(false);
      expect(player.canShoot).toBe(false);
    });

    it('should enforce 0.65 velocity damping factor per frame', () => {
      player.applyKnockback(1, 0, 20); // vx = 4.0

      // First frame tick (dt = 1/60)
      player.update(1 / 60, input, []);

      // Damped by 0.65: 4.0 * 0.65 = 2.6
      expect(player.vx).toBeCloseTo(2.6);
      // State transitions to State_Sleep for pure stun recovery
      expect(player.state).toBe(Player.State_Sleep);
      expect(player.mesh.rotation.x).toBeCloseTo(-0.25); // Flinch tilt maintained
    });

    it('should lockout movement and shooting input during hitstun', () => {
      player.applyKnockback(0, 1, 20);
      expect(player.isInputLocked).toBe(true);

      // Try to move West while in hitstun
      input.keys.add('a');
      const startX = player.pos.x;
      player.update(1 / 60, input, []);

      // X movement must be completely locked out!
      expect(player.pos.x).toBe(startX);

      // Weapon firing must be blocked
      const inventory = new WeaponInventory();
      const fired = inventory.fire(player.pos, player.rotationAngle, { player });
      expect(fired).toBe(false);
    });

    it('should recover control after exactly 3 frames (~0.05s) pure stun delay', () => {
      player.applyKnockback(1, 0, 15);
      expect(player.state).toBe(Player.State_BulletHit);
      expect(player.stunFrames).toBe(3);

      // Frame 1: Hit resolution -> enters State_Sleep
      player.update(1 / 60, input, []);
      expect(player.state).toBe(Player.State_Sleep);
      expect(player.isInputLocked).toBe(true);

      // Frame 2: Sleep tick
      player.update(1 / 60, input, []);
      expect(player.state).toBe(Player.State_Sleep);
      expect(player.isInputLocked).toBe(true);

      // Frame 3: Final sleep tick -> regains control!
      player.update(1 / 60, input, []);
      expect(player.state).toBe(Player.State_Normal);
      expect(player.isInputLocked).toBe(false);
      expect(player.canMove).toBe(true);
      expect(player.canShoot).toBe(true);
      expect(player.flinchTilt).toBe(0);
      expect(player.mesh.rotation.x).toBe(0);
    });

    it('should stop knockback against arena walls and slide', () => {
      const wall: AABB = { minX: 1.0, maxX: 3.0, minZ: -5, maxZ: 5 };
      player.pos.x = 0.5; // Near wall at x = 1.0 (radius = 0.7, max reach = 1.0 - 0.7 = 0.3)
      player.applyKnockback(1, 0, 50); // Large knockback towards wall (+X)

      player.update(1 / 60, input, [wall]);

      // Clamped outside wall at minX - radius = 1.0 - 0.7 = 0.3
      expect(player.pos.x).toBeLessThanOrEqual(0.301);
    });
  });
});
