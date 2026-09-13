import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Game } from '../../src/core/Game';
import { InputManager } from '../../src/core/Input';
import { Player } from '../../src/entities/Player';
import { CameraManager } from '../../src/render/CameraManager';
import { COLOR_PLAYER2_TORSO, CAMERA_OFFSET_Z } from '../../src/core/Constants';
import { fireHitscanBullet } from '../../src/entities/Bullet';
import { detonateExplosion } from '../../src/entities/Barrel';
import { Zombie } from '../../src/entities/Zombie';
import * as THREE from 'three';

describe('Local 2-Player Co-op Mode', () => {
  describe('1. Dual Player Input Mapping', () => {
    let input: InputManager;

    beforeEach(() => {
      input = new InputManager();
    });

    afterEach(() => {
      input.dispose();
    });

    it('should map Player 1 movement to Arrow keys', () => {
      // Up
      input.keys.add('arrowup');
      expect(input.getP1Movement()).toEqual({ x: 0, z: -1 });

      // Right
      input.keys.clear();
      input.keys.add('arrowright');
      expect(input.getP1Movement()).toEqual({ x: 1, z: 0 });

      // Down + Left
      input.keys.clear();
      input.keys.add('arrowdown');
      input.keys.add('arrowleft');
      expect(input.getP1Movement()).toEqual({ x: -1, z: 1 });
    });

    it('should map Player 2 movement to W, A, S, D keys', () => {
      // W (Up)
      input.keys.add('w');
      expect(input.getP2Movement()).toEqual({ x: 0, z: -1 });

      // D (Right)
      input.keys.clear();
      input.keys.add('d');
      expect(input.getP2Movement()).toEqual({ x: 1, z: 0 });

      // S + A (Down + Left)
      input.keys.clear();
      input.keys.add('s');
      input.keys.add('a');
      expect(input.getP2Movement()).toEqual({ x: -1, z: 1 });
    });

    it('should map shooting correctly for P1 and P2', () => {
      // P1 shoots with '/' or Space
      input.keys.add('/');
      expect(input.isP1Shooting()).toBe(true);
      expect(input.isP2Shooting()).toBe(false);

      // P2 shoots with Space when P1 uses '/'
      input.keys.add(' ');
      expect(input.isP1Shooting()).toBe(true);
      expect(input.isP2Shooting()).toBe(true);

      input.keys.clear();
      input.keys.add('space');
      expect(input.isP1Shooting()).toBe(true);
      expect(input.isP2Shooting()).toBe(true);
    });

    it('should map weapon cycling keys: P1 (comma/period) and P2 (Q/E)', () => {
      // P1 next/prev via ',' and '.'
      input.keys.add(',');
      expect(input.isP1CyclePrev()).toBe(true);
      input.keys.clear();
      input.keys.add('.');
      expect(input.isP1CycleNext()).toBe(true);

      // P2 next/prev via Q and E
      input.keys.clear();
      input.keys.add('q');
      expect(input.isP2CyclePrev()).toBe(true);
      input.keys.clear();
      input.keys.add('e');
      expect(input.isP2CycleNext()).toBe(true);
    });

    it('should provide consumeP1Cycle and consumeP2Cycle debounced deltas', () => {
      input.p1CycleDelta = 1;
      expect(input.consumeP1Cycle()).toBe(1);
      expect(input.consumeP1Cycle()).toBe(0);

      input.p2CycleDelta = -1;
      expect(input.consumeP2Cycle()).toBe(-1);
      expect(input.consumeP2Cycle()).toBe(0);
    });

    it('should allow P1 quick weapon selection via 1-0 numeric keys', () => {
      input.keys.add('3');
      expect(input.getP1SlotSelect()).toBe(3);

      input.keys.clear();
      input.keys.add('0');
      expect(input.getP1SlotSelect()).toBe(10);
    });

    it('should maintain single-player compatibility when not in co-op mode', () => {
      const player = new Player(0, 0, 1, false);

      // In single player, WASD drives player 1
      input.keys.add('w');
      player.update(0.1, input, [], false);
      expect(player.pos.z).toBeLessThan(0);

      // Arrow keys also drive player 1 in single player
      input.keys.clear();
      input.keys.add('arrowdown');
      player.update(0.1, input, [], false);
      expect(player.pos.z).toBeGreaterThan(-1);
    });
  });

  describe('2. Player 2 Entity & Room Spawning', () => {
    let game: Game;

    afterEach(() => {
      game?.dispose();
    });

    it('should initialize Player 2 with orange torso color and mesh name player2', () => {
      const p2 = new Player(5, 5, 2, true);
      expect(p2.playerIndex).toBe(2);
      expect(p2.isCoop).toBe(true);
      expect(p2.mesh.name).toBe('player2');

      const torsoMesh = p2.mesh.children.find((c) => (c as any).isMesh) as THREE.Mesh;
      const mat = torsoMesh.material as THREE.MeshLambertMaterial;
      expect(mat.color.getHex()).toBe(COLOR_PLAYER2_TORSO);
    });

    it('should spawn P1 at room.player1 and P2 at room.player2 in co-op mode', () => {
      game = new Game({ autoStart: false, coop: true });

      expect(game.isCoop).toBe(true);
      expect(game.player).toBeDefined();
      expect(game.player2).toBeDefined();

      const expectedP1 = game.mapManager.getPlayerStart(1);
      const expectedP2 = game.mapManager.getPlayerStart(2);

      expect(game.player.pos.x).toBeCloseTo(expectedP1.x);
      expect(game.player.pos.z).toBeCloseTo(expectedP1.z);
      expect(game.player2!.pos.x).toBeCloseTo(expectedP2.x);
      expect(game.player2!.pos.z).toBeCloseTo(expectedP2.z);
    });

    it('should reposition both players on loadRoom() in co-op mode', () => {
      game = new Game({ autoStart: false, coop: true });
      game.loadRoom('MAZEY');

      const mazeyP1 = game.mapManager.getPlayerStart(1);
      const mazeyP2 = game.mapManager.getPlayerStart(2);

      expect(game.player.pos.x).toBeCloseTo(mazeyP1.x);
      expect(game.player.pos.z).toBeCloseTo(mazeyP1.z);
      expect(game.player2!.pos.x).toBeCloseTo(mazeyP2.x);
      expect(game.player2!.pos.z).toBeCloseTo(mazeyP2.z);
    });

    it('should reset both players on restart() in co-op mode', () => {
      game = new Game({ autoStart: false, coop: true });
      game.player.pos.x = 99;
      game.player2!.pos.x = -99;
      game.player.hp = 10;
      game.player2!.hp = 20;

      game.restart();

      const expectedP1 = game.mapManager.getPlayerStart(1);
      const expectedP2 = game.mapManager.getPlayerStart(2);

      expect(game.player.pos.x).toBeCloseTo(expectedP1.x);
      expect(game.player2!.pos.x).toBeCloseTo(expectedP2.x);
      expect(game.player.hp).toBe(game.player.maxHp);
      expect(game.player2!.hp).toBe(game.player2!.maxHp);
    });
  });

  describe('3. Camera Midpoint Tracking & Distance Tether', () => {
    let cameraManager: CameraManager;

    beforeEach(() => {
      cameraManager = new CameraManager();
    });

    it('should track the midpoint between P1 and P2 in updateCoop()', () => {
      const p1 = { x: -10, z: -5 };
      const p2 = { x: 20, z: 15 };

      const mid = cameraManager.updateCoop(p1, p2);

      // Midpoint: x = 5, z = 5
      expect(mid.x).toBeCloseTo(5);
      expect(mid.z).toBeCloseTo(5);
      expect(cameraManager.camera.position.x).toBeCloseTo(5);
      expect(cameraManager.camera.position.z).toBeCloseTo(5 + CAMERA_OFFSET_Z);
    });

    it('should enforce keepDistance tethering when players exceed maxDistance', () => {
      const p1 = { pos: { x: 0, z: 0 }, mesh: new THREE.Object3D() };
      const p2 = { pos: { x: 30, z: 0 }, mesh: new THREE.Object3D() };

      // Distance is 30, maxDistance is 20 -> each pulled in by 5
      cameraManager.keepDistance(p1, p2, 20);

      const dx = p2.pos.x - p1.pos.x;
      const dz = p2.pos.z - p1.pos.z;
      const dist = Math.hypot(dx, dz);

      expect(dist).toBeCloseTo(20, 1);
      expect(p1.pos.x).toBeCloseTo(5);
      expect(p2.pos.x).toBeCloseTo(25);
    });

    it('should support KeepDistance alias', () => {
      const p1 = { pos: { x: 0, z: 0 } };
      const p2 = { pos: { x: 0, z: 40 } };

      cameraManager.KeepDistance(p1, p2, 20);

      const dist = Math.hypot(p2.pos.x - p1.pos.x, p2.pos.z - p1.pos.z);
      expect(dist).toBeCloseTo(20, 1);
    });

    it('should update midpoint camera and apply keepDistance in Game.update()', () => {
      const game = new Game({ autoStart: false, coop: true });
      game.player.pos.x = -15;
      game.player.pos.z = 0;
      game.player2!.pos.x = 15;
      game.player2!.pos.z = 0;

      // Distance is 30, keepDistance clamps to 20
      game.update(0.016);

      const dist = Math.hypot(
        game.player2!.pos.x - game.player.pos.x,
        game.player2!.pos.z - game.player.pos.z
      );
      expect(dist).toBeLessThanOrEqual(20.01);
      expect(game.cameraManager.camera.position.x).toBeCloseTo(0);

      game.dispose();
    });
  });

  describe('4. Friendly Fire Logic', () => {
    let p1: Player;
    let p2: Player;

    beforeEach(() => {
      p1 = new Player(0, 0, 1, true);
      p2 = new Player(5, 0, 2, true);
    });

    it('should NOT damage P2 with hitscan bullets when friendlyFire is false', () => {
      const initialHp = p2.hp;
      fireHitscanBullet(0, 0, 1, 0, 50, 60, 1.5, {
        players: [p1, p2],
        shooter: p1,
        friendlyFire: false,
        enemies: [],
        obstacles: [],
        barrels: [],
        fakeWalls: [],
      });

      expect(p2.hp).toBe(initialHp);
    });

    it('should damage P2 with hitscan bullets when friendlyFire is true', () => {
      const initialHp = p2.hp;
      fireHitscanBullet(0, 0, 1, 0, 50, 60, 1.5, {
        players: [p1, p2],
        shooter: p1,
        friendlyFire: true,
        enemies: [],
        obstacles: [],
        barrels: [],
        fakeWalls: [],
      });

      expect(p2.hp).toBeLessThan(initialHp);
    });

    it('should NOT damage P2 from P1 explosions when friendlyFire is false', () => {
      const initialHp = p2.hp;
      detonateExplosion(0, 0, 10, 40, {
        enemies: [],
        player: p1,
        player2: p2,
        players: [p1, p2],
        sourcePlayer: p1,
        friendlyFire: false,
      });

      // P1 takes self-damage, but P2 is immune
      expect(p1.hp).toBeLessThan(p1.maxHp);
      expect(p2.hp).toBe(initialHp);
    });

    it('should damage P2 from P1 explosions when friendlyFire is true', () => {
      const initialHp = p2.hp;
      detonateExplosion(0, 0, 10, 40, {
        enemies: [],
        player: p1,
        player2: p2,
        players: [p1, p2],
        sourcePlayer: p1,
        friendlyFire: true,
      });

      expect(p1.hp).toBeLessThan(p1.maxHp);
      expect(p2.hp).toBeLessThan(initialHp);
    });

    it('should damage both players from neutral / environmental explosions', () => {
      detonateExplosion(0, 0, 10, 40, {
        enemies: [],
        player: p1,
        player2: p2,
        players: [p1, p2],
        sourcePlayer: undefined,
        friendlyFire: false,
      });

      expect(p1.hp).toBeLessThan(p1.maxHp);
      expect(p2.hp).toBeLessThan(p2.maxHp);
    });

    it('should allow toggling friendly fire dynamically on Game', () => {
      const game = new Game({ autoStart: false, coop: true, friendlyFire: false });
      expect(game.friendlyFire).toBe(false);
      expect((game as any).fireContext.friendlyFire).toBe(false);

      game.setFriendlyFire(true);
      expect(game.friendlyFire).toBe(true);
      expect((game as any).fireContext.friendlyFire).toBe(true);

      game.dispose();
    });
  });

  describe('5. Mode Selector & Dynamic Co-op Toggle', () => {
    it('should dynamically switch between 1-Player and 2-Player modes via setCoop()', () => {
      const game = new Game({ autoStart: false, coop: false });
      expect(game.isCoop).toBe(false);
      expect(game.player2).toBeNull();

      // Enable Co-op
      game.setCoop(true);
      expect(game.isCoop).toBe(true);
      expect(game.player2).toBeDefined();
      expect(game.player.isCoop).toBe(true);
      expect(game.player2!.isCoop).toBe(true);
      expect(game.hud.modeToggleBtnEl?.textContent).toBe('👥 2 PLAYERS');

      // Disable Co-op
      game.setCoop(false);
      expect(game.isCoop).toBe(false);
      expect(game.player.isCoop).toBe(false);
      expect(game.hud.modeToggleBtnEl?.textContent).toBe('👤 1 PLAYER');

      game.dispose();
    });

    it('should trigger mode switch when clicking HUD toggle button', () => {
      const game = new Game({ autoStart: false, coop: false });
      const toggleBtn = game.hud.modeToggleBtnEl!;

      // Click to toggle to 2P
      toggleBtn.dispatchEvent({ type: 'click' });
      expect(game.isCoop).toBe(true);
      expect(toggleBtn.textContent).toBe('👥 2 PLAYERS');

      // Click to toggle back to 1P
      toggleBtn.dispatchEvent({ type: 'click' });
      expect(game.isCoop).toBe(false);
      expect(toggleBtn.textContent).toBe('👤 1 PLAYER');

      game.dispose();
    });
  });

  describe('6. Co-op Enemy AI & Game Over Condition', () => {
    let game: Game;

    beforeEach(() => {
      game = new Game({ autoStart: false, coop: true });
    });

    afterEach(() => {
      game.dispose();
    });

    it('should target the closest living player for enemy steering', () => {
      game.player.pos.x = 100;
      game.player.pos.z = 100;

      game.player2!.pos.x = 2;
      game.player2!.pos.z = 0;

      const zombie = new Zombie(0, 0);
      game.enemyManager.enemies.push(zombie);

      // EnemyManager update with player2 passed
      (game as any).enemyManager.update(0.1, game.player, (game as any).obstacles, (game as any).fakeWalls, undefined, [], undefined, game.player2);

      // Zombie should move towards player2 (dx > 0)
      expect(zombie.pos.x).toBeGreaterThan(0);
    });

    it('should not trigger game over if only one player dies', () => {
      game.player.takeDamage(game.player.maxHp);
      expect(game.player.isDead).toBe(true);
      expect(game.player2!.isDead).toBe(false);

      game.update(0.016);
      expect(game.isGameOver).toBe(false);
    });

    it('should trigger game over only when both players are dead', () => {
      game.player.takeDamage(game.player.maxHp);
      game.player2!.takeDamage(game.player2!.maxHp);
      expect(game.player.isDead).toBe(true);
      expect(game.player2!.isDead).toBe(true);

      game.update(0.016);
      expect(game.isGameOver).toBe(true);
    });
  });
});
