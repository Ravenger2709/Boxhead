import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../../src/entities/Player';
import { Devil, lineIntersectsAABB } from '../../src/entities/Devil';
import { Game } from '../../src/core/Game';
import { HUD } from '../../src/ui/HUD';
import { SpatialGrid } from '../../src/physics/SpatialGrid';
import { AABB } from '../../src/core/Constants';

describe('Combat Polish & Balancing Verification', () => {
  describe('1. Player Spawn Invulnerability', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player(0, 0);
    });

    it('should initialize invincibilityTimer to 0 by default', () => {
      expect(player.invincibilityTimer).toBe(0);
      expect(player.mesh.visible).toBe(true);
    });

    it('should set invincibilityTimer to 8.0s on triggerSpawnInvincibility()', () => {
      player.triggerSpawnInvincibility();
      expect(player.invincibilityTimer).toBe(8.0);
      expect(player.mesh.visible).toBe(true);

      player.triggerSpawnInvincibility(5.0);
      expect(player.invincibilityTimer).toBe(5.0);
    });

    it('should take 0 damage and return false from takeDamage when invincibilityTimer > 0', () => {
      player.triggerSpawnInvincibility(8.0);
      const initialHp = player.hp;

      const survived = player.takeDamage(50, 1, 0);
      expect(survived).toBe(false);
      expect(player.hp).toBe(initialHp);
      // Stun/knockback should not apply
      expect(player.vx).toBe(0);
      expect(player.vz).toBe(0);
      expect(player.state).toBe(Player.State_Normal);
    });

    it('should update invincibilityTimer and toggle mesh visibility for blinking effect in update()', () => {
      player.triggerSpawnInvincibility(8.0);

      // dt = 0.05 -> timer becomes 7.95
      // Math.floor(7.95 / 0.1) = 79 (odd -> false)
      player.update(0.05);
      expect(player.invincibilityTimer).toBeCloseTo(7.95);
      expect(player.mesh.visible).toBe(false);

      // dt = 0.1 -> timer becomes 7.85
      // Math.floor(7.85 / 0.1) = 78 (even -> true)
      player.update(0.1);
      expect(player.invincibilityTimer).toBeCloseTo(7.85);
      expect(player.mesh.visible).toBe(true);
    });

    it('should restore visibility and allow normal damage once invincibility expires', () => {
      player.triggerSpawnInvincibility(0.5);

      // Advance 0.5s to expire invincibility
      player.update(0.5);
      expect(player.invincibilityTimer).toBe(0);
      expect(player.mesh.visible).toBe(true);

      // Now player should take damage normally
      const initialHp = player.hp;
      player.takeDamage(40);
      expect(player.hp).toBe(initialHp - 40);
    });

    it('should grant 8.0s invincibility on player.respawn()', () => {
      player.hp = 10;
      player.takeDamage(20);
      expect(player.isDead).toBe(true);

      player.respawn(5, 5);
      expect(player.hp).toBe(player.maxHp);
      expect(player.pos.x).toBe(5);
      expect(player.pos.z).toBe(5);
      expect(player.invincibilityTimer).toBe(8.0);
      expect(player.takeDamage(50)).toBe(false);
      expect(player.hp).toBe(player.maxHp);
    });

    it('should grant invincibility when Game starts, restarts, or loads a room', () => {
      const game = new Game({ container: null, autoStart: false });
      expect(game.player.invincibilityTimer).toBe(0);

      game.start();
      expect(game.player.invincibilityTimer).toBe(8.0);

      game.player.invincibilityTimer = 0;
      game.restart();
      expect(game.player.invincibilityTimer).toBe(8.0);

      game.player.invincibilityTimer = 0;
      game.loadRoom('BOXY');
      expect(game.player.invincibilityTimer).toBe(8.0);
    });
  });

  describe('2. Devil Line-of-Sight & Range Check', () => {
    it('lineIntersectsAABB should accurately detect ray-box intersection', () => {
      const box: AABB = { minX: -1, maxX: 1, minZ: 3, maxZ: 5 };

      // Ray directly through box center
      expect(lineIntersectsAABB(0, 0, 0, 10, box)).toBe(true);

      // Ray misses box to the side
      expect(lineIntersectsAABB(2, 0, 2, 10, box)).toBe(false);

      // Ray stops before reaching box
      expect(lineIntersectsAABB(0, 0, 0, 2, box)).toBe(false);

      // Ray starts after box
      expect(lineIntersectsAABB(0, 6, 0, 10, box)).toBe(false);

      // Ray pointing in opposite direction
      expect(lineIntersectsAABB(0, 0, 0, -10, box)).toBe(false);

      // Diagonal ray intersecting box corner
      expect(lineIntersectsAABB(-2, 2, 2, 6, box)).toBe(true);
    });

    it('hasLineOfSight should verify unblocked vision against obstacles', () => {
      const devil = new Devil(0, 0);
      const wall: AABB = { minX: -2, maxX: 2, minZ: 2, maxZ: 3 };

      // Clear line of sight when no obstacles
      expect(devil.hasLineOfSight({ x: 0, z: 4 }, [])).toBe(true);

      // Blocked line of sight with intervening wall
      expect(devil.hasLineOfSight({ x: 0, z: 4 }, [wall])).toBe(false);

      // Clear line of sight when wall is behind target
      const wallBehind: AABB = { minX: -2, maxX: 2, minZ: 6, maxZ: 7 };
      expect(devil.hasLineOfSight({ x: 0, z: 4 }, [wallBehind])).toBe(true);
    });

    it('canShootTarget should enforce distance <= 5 cells (default attackRange)', () => {
      const devil = new Devil(0, 0);
      devil.rotationAngle = 0; // facing +Z

      // Within 5 cells (dist = 4.0 <= 5.0)
      expect(devil.canShootTarget({ x: 0, z: 4 }, [])).toBe(true);

      // Boundary 5 cells (dist = 5.0 <= 5.0)
      expect(devil.canShootTarget({ x: 0, z: 5 }, [])).toBe(true);

      // Outside 5 cells (dist = 5.5 > 5.0)
      expect(devil.canShootTarget({ x: 0, z: 5.5 }, [])).toBe(false);
    });

    it('canShootTarget should enforce facing angle alignment with player', () => {
      const devil = new Devil(0, 0);

      // Target is directly in +Z direction (angle = 0)
      const targetPos = { x: 0, z: 4 };

      // Devil facing directly towards player (rotation = 0)
      devil.rotationAngle = 0;
      expect(devil.canShootTarget(targetPos, [])).toBe(true);

      // Devil facing within 45 degrees frontal cone (rotation = PI/6)
      devil.rotationAngle = Math.PI / 6;
      expect(devil.canShootTarget(targetPos, [])).toBe(true);

      // Devil facing perpendicular (90 degrees / PI/2) -> should NOT shoot
      devil.rotationAngle = Math.PI / 2;
      expect(devil.canShootTarget(targetPos, [])).toBe(false);

      // Devil facing completely opposite direction (180 degrees / PI) -> should NOT shoot
      devil.rotationAngle = Math.PI;
      expect(devil.canShootTarget(targetPos, [])).toBe(false);
    });

    it('canShootTarget should require clear line of sight', () => {
      const devil = new Devil(0, 0);
      devil.rotationAngle = 0;
      const targetPos = { x: 0, z: 4 };
      const blockingWall: AABB = { minX: -1, maxX: 1, minZ: 1.5, maxZ: 2.5 };

      expect(devil.canShootTarget(targetPos, [blockingWall])).toBe(false);
    });

    it('should only cast and shoot fireball when in range and line of sight is clear', () => {
      const devil = new Devil(0, 0);
      const grid = new SpatialGrid(4.0);
      grid.insert(devil.id, devil.pos.x, devil.pos.z);
      const shootSpy = vi.fn();
      devil.onShootFireball = shootSpy;

      const blockingWall: AABB = { minX: -1, maxX: 1, minZ: 1.5, maxZ: 2.5 };
      const targetPos = { x: 0, z: 4 };

      // 1. Blocked by wall: reaches cooldown time (3.1s), but should NOT start casting
      devil.update(3.1, targetPos, [blockingWall], grid);
      expect(devil.isCasting).toBe(false);
      expect(shootSpy).not.toHaveBeenCalled();

      // 2. Clear wall: target is now visible and in range -> starts casting!
      devil.update(0.1, targetPos, [], grid);
      expect(devil.isCasting).toBe(true);

      // 3. Finish casting (0.5s total cast time) -> fireball fired!
      devil.update(0.5, targetPos, [], grid);
      expect(shootSpy).toHaveBeenCalled();
      expect(devil.isCasting).toBe(false);
    });
  });

  describe('3. Game Speed Multiplier', () => {
    it('should initialize with gameSpeed 1.0 by default', () => {
      const game = new Game({ container: null, autoStart: false });
      expect(game.gameSpeed).toBe(1.0);
      expect(game.hud.currentGameSpeed).toBe(1.0);
    });

    it('should allow setting gameSpeed to 0.5, 1.0, 2.0 and sync with HUD', () => {
      const game = new Game({ container: null, autoStart: false });

      game.setGameSpeed(0.5);
      expect(game.gameSpeed).toBe(0.5);
      expect(game.hud.currentGameSpeed).toBe(0.5);

      game.setGameSpeed(2.0);
      expect(game.gameSpeed).toBe(2.0);
      expect(game.hud.currentGameSpeed).toBe(2.0);

      game.setGameSpeed(1.0);
      expect(game.gameSpeed).toBe(1.0);
      expect(game.hud.currentGameSpeed).toBe(1.0);
    });

    it('should scale simulation dt by gameSpeed in update()', () => {
      const game = new Game({ container: null, autoStart: false });

      // Test player movement scaling with gameSpeed
      game.inputManager.keys.add('w'); // moves in -Z direction (speed = 9.0)

      // Test at gameSpeed = 0.5
      game.setGameSpeed(0.5);
      game.player.pos.z = 0;
      game.update(0.1); // effective dt = 0.05 -> move = 9.0 * 0.05 = 0.45
      expect(game.player.pos.z).toBeCloseTo(-0.45);

      // Test at gameSpeed = 2.0
      game.setGameSpeed(2.0);
      game.player.pos.z = 0;
      game.update(0.1); // effective dt = 0.2 -> move = 9.0 * 0.2 = 1.8
      expect(game.player.pos.z).toBeCloseTo(-1.8);

      // Test at gameSpeed = 1.0
      game.setGameSpeed(1.0);
      game.player.pos.z = 0;
      game.update(0.1); // effective dt = 0.1 -> move = 9.0 * 0.1 = 0.9
      expect(game.player.pos.z).toBeCloseTo(-0.9);
    });

    it('HUD should render game speed selector and respond to change events', () => {
      const onSelectSpeedSpy = vi.fn();
      const hud = new HUD({
        gameSpeed: 1.0,
        onSelectGameSpeed: onSelectSpeedSpy,
      });

      expect(hud.gameSpeedSelectEl).toBeDefined();
      expect(hud.currentGameSpeed).toBe(1.0);

      // Simulate UI selection change to 2.0
      if (hud.gameSpeedSelectEl) {
        hud.gameSpeedSelectEl.value = '2';
        hud.gameSpeedSelectEl.dispatchEvent({ type: 'change' });
      }

      expect(onSelectSpeedSpy).toHaveBeenCalledWith(2.0);
      expect(hud.currentGameSpeed).toBe(2.0);

      // Set via setter
      hud.setGameSpeed(0.5);
      expect(hud.currentGameSpeed).toBe(0.5);
      expect(hud.gameSpeedSelectEl?.value).toBe('0.5');
    });
  });
});
