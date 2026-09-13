import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Game } from '../../src/core/Game';
import {
  COLOR_PLAYER2_TORSO,
  DEFAULT_FRAG_LIMIT,
  DEATHMATCH_RESPAWN_DELAY,
  DEATHMATCH_INVULNERABILITY_DURATION,
  DEATHMATCH_CRATE_RESPAWN_INTERVAL,
} from '../../src/core/Constants';
import { WeaponId } from '../../src/weapons/WeaponTypes';

describe('DeathMatch 2-Player Duel Mode', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({ autoStart: false, gameMode: 'deathmatch' });
  });

  afterEach(() => {
    game.dispose();
  });

  describe('1. Mode Initialization & Spawning', () => {
    it('should initialize with gameMode set to deathmatch and default frag limit 10', () => {
      expect(game.gameMode).toBe('deathmatch');
      expect(game.fragLimit).toBe(DEFAULT_FRAG_LIMIT);
      expect(game.p1Frags).toBe(0);
      expect(game.p2Frags).toBe(0);
      expect(game.isGameOver).toBe(false);
      expect(game.victoryMessage).toBeNull();
    });

    it('should spawn Player 1 and Player 2 at their room start locations', () => {
      const p1Start = game.mapManager.getPlayerStart(1);
      const p2Start = game.mapManager.getPlayerStart(2);

      expect(game.player.pos.x).toBeCloseTo(p1Start.x, 1);
      expect(game.player.pos.z).toBeCloseTo(p1Start.z, 1);
      expect(game.player2).toBeDefined();
      expect(game.player2!.pos.x).toBeCloseTo(p2Start.x, 1);
      expect(game.player2!.pos.z).toBeCloseTo(p2Start.z, 1);
    });

    it('should configure control schemes: arrows for P1 and wasd for P2', () => {
      expect(game.player.controlScheme).toBe('arrows');
      expect(game.player2!.controlScheme).toBe('wasd');
    });

    it('should configure Player 2 appearance with orange torso color', () => {
      expect(game.player2!.options?.torsoColor).toBe(COLOR_PLAYER2_TORSO);
    });

    it('should unlock all 10 weapons for both players via multiplier 200', () => {
      expect(game.weaponInventory.isUnlocked(WeaponId.Pistol)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Uzi)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Shotgun)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Barrel)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Grenade)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.FakeWall)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Claymore)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.RocketLauncher)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.ChargePack)).toBe(true);
      expect(game.weaponInventory.isUnlocked(WeaponId.Railgun)).toBe(true);

      expect(game.weaponInventory2).toBeDefined();
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Pistol)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Uzi)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Shotgun)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Barrel)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Grenade)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.FakeWall)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Claymore)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.RocketLauncher)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.ChargePack)).toBe(true);
      expect(game.weaponInventory2!.isUnlocked(WeaponId.Railgun)).toBe(true);
    });

    it('should suppress zombie waves and enemy updates during deathmatch', () => {
      expect(game.enemyManager.enemies.length).toBe(0);
      game.update(1.0);
      expect(game.enemyManager.enemies.length).toBe(0);
    });

    it('should spawn initial crates at room crate spawn points', () => {
      expect(game.crates.length).toBeGreaterThan(0);
    });
  });

  describe('2. Combat & Friendly Fire', () => {
    it('should allow Player 1 hitscan bullets to damage Player 2', () => {
      expect(game.player2).toBeDefined();
      const initialHp = game.player2!.hp;

      // Position Player 1 and Player 2 in line with each other
      game.player.pos.x = 0;
      game.player.pos.z = 0;
      game.player.rotationAngle = 0; // facing +Z

      game.player2!.pos.x = 0;
      game.player2!.pos.z = 5; // directly in front of Player 1
      game.player2!.invulnerableTimer = 0;

      // Trigger Player 1 fire using '/' key
      game.inputManager.keys.add('/');
      game.handleFiring(0.016);
      game.inputManager.keys.delete('/');

      expect(game.player2!.hp).toBeLessThan(initialHp);
    });

    it('should allow Player 2 hitscan bullets to damage Player 1', () => {
      expect(game.player2).toBeDefined();
      const initialHp = game.player.hp;

      // Position Player 2 to face Player 1
      game.player2!.pos.x = 0;
      game.player2!.pos.z = 5;
      game.player2!.rotationAngle = Math.PI; // facing -Z towards Player 1

      game.player.pos.x = 0;
      game.player.pos.z = 0;
      game.player.invulnerableTimer = 0;

      // Trigger Player 2 fire using Space key
      game.inputManager.keys.add(' ');
      game.handleFiringPlayer2(0.016);
      game.inputManager.keys.delete(' ');

      expect(game.player.hp).toBeLessThan(initialHp);
    });

    it('should damage both players if caught in an explosion radius', () => {
      game.player.pos.x = 2;
      game.player.pos.z = 0;
      game.player.invulnerableTimer = 0;

      game.player2!.pos.x = -2;
      game.player2!.pos.z = 0;
      game.player2!.invulnerableTimer = 0;

      const p1Initial = game.player.hp;
      const p2Initial = game.player2!.hp;

      // Detonate explosion at origin (radius 4.0)
      game.detonateExplosion(0, 0, 4.0, 50);

      expect(game.player.hp).toBeLessThan(p1Initial);
      expect(game.player2!.hp).toBeLessThan(p2Initial);
    });

    it('should prevent damage when player has spawn invulnerability', () => {
      game.player2!.pos.x = 0;
      game.player2!.pos.z = 5;
      game.player2!.invulnerableTimer = 5.0; // Invulnerable
      expect(game.player2!.isInvulnerable).toBe(true);

      const hpBefore = game.player2!.hp;
      game.player.pos.x = 0;
      game.player.pos.z = 0;
      game.player.rotationAngle = 0;

      game.inputManager.keys.add('/');
      game.handleFiring(0.016);
      game.inputManager.keys.delete('/');

      expect(game.player2!.hp).toBe(hpBefore);
    });
  });

  describe('3. Frag Scoring & Respawns', () => {
    it('should award +1 frag to Player 1 when Player 2 dies', () => {
      expect(game.p1Frags).toBe(0);
      game.player2!.takeDamage(game.player2!.maxHp + 50);
      expect(game.player2!.hp).toBe(0);

      game.update(0.016);

      expect(game.p1Frags).toBe(1);
      expect(game.isP2Dead).toBe(true);
      expect(game.p2RespawnTimer).toBeCloseTo(DEATHMATCH_RESPAWN_DELAY - 0.016, 2);
      expect(game.player2!.mesh.visible).toBe(false);
    });

    it('should award +1 frag to Player 2 when Player 1 dies', () => {
      expect(game.p2Frags).toBe(0);
      game.player.takeDamage(game.player.maxHp + 50);
      expect(game.player.hp).toBe(0);

      game.update(0.016);

      expect(game.p2Frags).toBe(1);
      expect(game.isP1Dead).toBe(true);
      expect(game.p1RespawnTimer).toBeCloseTo(DEATHMATCH_RESPAWN_DELAY - 0.016, 2);
      expect(game.player.mesh.visible).toBe(false);
    });

    it('should respawn dead player after 2 seconds with 8 seconds invulnerability', () => {
      game.player2!.takeDamage(game.player2!.maxHp + 50);
      game.update(0.016);
      expect(game.isP2Dead).toBe(true);

      // Tick forward by 1 second (not yet respawned)
      game.update(1.0);
      expect(game.isP2Dead).toBe(true);

      // Tick forward by another 1.1 seconds (respawns!)
      game.update(1.1);
      expect(game.isP2Dead).toBe(false);
      expect(game.player2!.hp).toBe(game.player2!.maxHp);
      expect(game.player2!.invulnerableTimer).toBeCloseTo(DEATHMATCH_INVULNERABILITY_DURATION, 1);
      expect(game.player2!.isInvulnerable).toBe(true);

      const p2Start = game.mapManager.getPlayerStart(2);
      expect(game.player2!.pos.x).toBeCloseTo(p2Start.x, 1);
      expect(game.player2!.pos.z).toBeCloseTo(p2Start.z, 1);
    });
  });

  describe('4. Victory Condition & Frag Limit', () => {
    it('should trigger victory state when Player 1 reaches frag limit', () => {
      game.setFragLimit(5);
      game.p1Frags = 4;

      // Kill Player 2 for the 5th frag
      game.player2!.takeDamage(game.player2!.maxHp + 50);
      game.update(0.016);

      expect(game.p1Frags).toBe(5);
      expect(game.isGameOver).toBe(true);
      expect(game.victoryMessage).toBe('PLAYER 1 WINS!');
      expect(game.gameOverModal.titleEl?.textContent).toBe('PLAYER 1 WINS!');
    });

    it('should trigger victory state when Player 2 reaches frag limit', () => {
      game.setFragLimit(5);
      game.p2Frags = 4;

      // Kill Player 1 for the 5th frag
      game.player.takeDamage(game.player.maxHp + 50);
      game.update(0.016);

      expect(game.p2Frags).toBe(5);
      expect(game.isGameOver).toBe(true);
      expect(game.victoryMessage).toBe('PLAYER 2 WINS!');
      expect(game.gameOverModal.titleEl?.textContent).toBe('PLAYER 2 WINS!');
    });
  });

  describe('5. Rapid Crate Respawns & Collection', () => {
    it('should have a 10s crate respawn timer in DeathMatch mode', () => {
      expect(game.crateRespawnTimer).toBe(DEATHMATCH_CRATE_RESPAWN_INTERVAL);
    });

    it('should spawn a new crate when crateRespawnTimer expires', () => {
      const initialCount = game.crates.length;
      game.crateRespawnTimer = 0.05;

      game.update(0.1);

      expect(game.crates.length).toBe(initialCount + 1);
      expect(game.crateRespawnTimer).toBe(DEATHMATCH_CRATE_RESPAWN_INTERVAL);
    });

    it('should allow either Player 1 or Player 2 to collect crates', () => {
      const crate = game.spawnCrate(10, 10);
      game.player2!.pos.x = 10;
      game.player2!.pos.z = 10;
      game.player2!.hp = 100;

      game.update(0.016);

      expect(crate.collected).toBe(true);
      expect(game.player2!.hp).toBeGreaterThan(100);
    });
  });

  describe('6. HUD DeathMatch Overlay & Mode Switching', () => {
    it('should display DeathMatch banner in HUD', () => {
      expect(game.hud.deathMatchBannerEl).toBeDefined();
      expect(game.hud.deathMatchBannerEl?.textContent).toContain('P1: 0  |  P2: 0  (First to 10)');
    });

    it('should update DeathMatch banner when score changes', () => {
      game.p1Frags = 3;
      game.p2Frags = 2;
      game.hud.updateDeathMatch(game.p1Frags, game.p2Frags, game.fragLimit);

      expect(game.hud.deathMatchBannerEl?.textContent).toContain('P1: 3  |  P2: 2  (First to 10)');
    });

    it('should allow dynamically switching from Single Player to DeathMatch and back', () => {
      const singleGame = new Game({ autoStart: false, gameMode: 'single' });
      expect(singleGame.gameMode).toBe('single');
      expect(singleGame.player2).toBeNull();

      singleGame.setGameMode('deathmatch', 20);
      expect(singleGame.gameMode).toBe('deathmatch');
      expect(singleGame.fragLimit).toBe(20);
      expect(singleGame.player2).toBeDefined();
      expect(singleGame.hud.deathMatchBannerEl?.textContent).toContain('(First to 20)');

      singleGame.setGameMode('single');
      expect(singleGame.gameMode).toBe('single');
      expect(singleGame.player2).toBeNull();

      singleGame.dispose();
    });
  });
});
