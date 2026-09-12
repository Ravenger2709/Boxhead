import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../../src/core/Game';
import { WeaponId } from '../../src/weapons/WeaponTypes';
import { Barrel } from '../../src/entities/Barrel';
import { FakeWall } from '../../src/entities/FakeWall';

describe('Task 9: Game Orchestrator Integration', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({ autoStart: false });
  });

  afterEach(() => {
    game.dispose();
  });

  describe('Initialization', () => {
    it('should initialize all subsystems and managers', () => {
      expect(game.sceneManager).toBeDefined();
      expect(game.cameraManager).toBeDefined();
      expect(game.inputManager).toBeDefined();
      expect(game.player).toBeDefined();
      expect(game.projectilePool).toBeDefined();
      expect(game.particlePool).toBeDefined();
      expect(game.damageNumberPool).toBeDefined();
      expect(game.bloodCanvas).toBeDefined();
      expect(game.weaponInventory).toBeDefined();
      expect(game.comboSystem).toBeDefined();
      expect(game.waveDirector).toBeDefined();
      expect(game.audioManager).toBeDefined();
      expect(game.enemyManager).toBeDefined();
      expect(game.hud).toBeDefined();
      expect(game.gameOverModal).toBeDefined();

      expect(game.score).toBe(0);
      expect(game.isGameOver).toBe(false);
      expect(game.player.hp).toBe(game.player.maxHp);
      expect(game.player.pos.x).toBe(0);
      expect(game.player.pos.z).toBe(0);
      expect(game.waveDirector.currentWave).toBe(1);
      expect(game.weaponInventory.isUnlocked(WeaponId.Pistol)).toBe(true);
    });
  });

  describe('Game Loop Update', () => {
    it('should advance simulation on update(dt)', () => {
      expect(() => game.update(0.016)).not.toThrow();
    });

    it('should update HUD with player state and score', () => {
      game.score = 5000;
      game.player.takeDamage(20);
      game.comboSystem.multiplier = 3;

      game.update(0.016);

      expect(game.hud.scoreEl?.textContent).toBe('5,000');
      expect(game.hud.hpTextEl?.textContent).toContain('200');
      expect(game.hud.comboValEl?.textContent).toBe('x3');
    });
  });

  describe('Combat & Bullet Collision Resolution', () => {
    it('should resolve bullet hitting zombie: deal damage, knockback, blood decals, and floating damage numbers', () => {
      // Spawn zombie at (5, 0)
      const zombie = game.enemyManager.spawnZombie(5, 0);
      const initialHp = zombie.hp;

      // Spawn bullet right in front of zombie traveling toward it
      const bullet = game.projectilePool.spawn('bullet', 4.8, 0, 1, 0, 15, 55);
      expect(bullet).not.toBeNull();

      const initialSplatters = game.bloodCanvas.splatterCount;
      const initialActiveNumbers = game.damageNumberPool.getActiveCount();

      // Process update tick
      game.update(0.016);

      // Zombie should take damage
      expect(zombie.hp).toBeLessThan(initialHp);
      // Blood decals and damage numbers created
      expect(game.bloodCanvas.splatterCount).toBeGreaterThan(initialSplatters);
      expect(game.damageNumberPool.getActiveCount()).toBeGreaterThan(initialActiveNumbers);
      // Bullet should be recycled
      expect(bullet?.active).toBe(false);
    });

    it('should trigger kill rewards when bullet defeats an enemy: increment combo, add score, and play groan', () => {
      const groanSpy = vi.spyOn(game.audioManager, 'playZombieGroan');
      const comboSpy = vi.spyOn(game.comboSystem, 'onKill');

      // Spawn zombie with 10 HP at (4, 0)
      const zombie = game.enemyManager.spawnZombie(4, 0);
      zombie.hp = 10;

      // Spawn bullet dealing 15 damage directly hitting zombie
      game.projectilePool.spawn('bullet', 3.9, 0, 1, 0, 15, 55);

      const prevScore = game.score;
      game.update(0.016);

      expect(groanSpy).toHaveBeenCalled();
      expect(comboSpy).toHaveBeenCalled();
      expect(game.score).toBeGreaterThan(prevScore);
    });
  });

  describe('Milestone Weapon Unlocks', () => {
    it('should unlock Uzi at 4x combo and trigger milestone toast on HUD', () => {
      const toastSpy = vi.spyOn(game.hud, 'showMilestoneUnlock');

      // Simulate kills to reach 4x combo
      for (let i = 0; i < 3; i++) {
        game.comboSystem.onKill();
      }
      expect(game.comboSystem.multiplier).toBe(4);

      // Trigger enemy death to evaluate milestone unlock
      const zombie = game.enemyManager.spawnZombie(0, 0);
      zombie.hp = 1;
      game.projectilePool.spawn('bullet', 0, 0, 0, 1, 15, 50);

      game.update(0.016);

      expect(game.weaponInventory.isUnlocked(WeaponId.Uzi)).toBe(true);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringMatching(/uzi/i));
    });
  });

  describe('Prop Placement & Explosions', () => {
    it('should place explosive barrel when active weapon is Barrel', () => {
      // Unlock barrel (slot 4)
      game.weaponInventory.unlocked.add(WeaponId.Barrel);
      game.weaponInventory.ammo.set(WeaponId.Barrel, 5);
      game.selectWeaponSlot(WeaponId.Barrel);

      // Player facing east (+X)
      game.player.rotationAngle = Math.PI / 2;

      // Mock mouse click in input
      game.inputManager.isMouseDown = true;
      game.update(0.016);

      expect(game.barrels.length).toBe(1);
      expect(game.barrels[0].alive).toBe(true);
    });

    it('should detonate explosive barrel on lethal damage and damage nearby enemies', () => {
      const barrel = new Barrel(0, 0);
      game.barrels.push(barrel);
      game.sceneManager.scene.add(barrel.mesh);

      const zombie = game.enemyManager.spawnZombie(1.5, 0);
      const explosionSpy = vi.spyOn(game.audioManager, 'playExplosion');

      // Bullet hits barrel with lethal damage (35 HP)
      game.projectilePool.spawn('bullet', -0.2, 0, 1, 0, 40, 30);

      game.update(0.016);

      expect(barrel.exploded).toBe(true);
      expect(explosionSpy).toHaveBeenCalled();
      expect(zombie.hp).toBeLessThan(30);
    });
  });

  describe('Crate Collection', () => {
    it('should collect crate when player touches it: heal player, refill ammo, and play sound', () => {
      const pickupSpy = vi.spyOn(game.audioManager, 'playPickup');

      // Hurt player and reduce ammo
      game.player.hp = 50;
      game.weaponInventory.unlocked.add(WeaponId.Uzi);
      game.weaponInventory.ammo.set(WeaponId.Uzi, 50);

      // Spawn crate right at player position (0, 0)
      const crate = game.spawnCrate(0, 0);
      expect(game.crates.length).toBe(1);

      game.update(0.016);

      expect(crate.collected).toBe(true);
      expect(game.player.hp).toBeCloseTo(75, 0); // +25 HP
      expect(game.weaponInventory.getAmmo(WeaponId.Uzi)).toBeGreaterThan(50);
      expect(pickupSpy).toHaveBeenCalled();
      expect(game.crates.length).toBe(0);
    });
  });

  describe('Player Death & Game Over Flow', () => {
    it('should transition to GAME_OVER and show GameOverModal when player HP drops to 0', () => {
      const showModalSpy = vi.spyOn(game.gameOverModal, 'show');

      game.player.takeDamage(200);
      expect(game.player.isDead).toBe(true);

      game.update(0.016);

      expect(game.isGameOver).toBe(true);
      expect(showModalSpy).toHaveBeenCalled();
    });

    it('should freeze or ignore gameplay updates while in GAME_OVER state', () => {
      game.player.takeDamage(200);
      game.update(0.016);
      expect(game.isGameOver).toBe(true);

      const prevScore = game.score;
      // Spawning enemy or bullet during game over should not increment score
      game.enemyManager.spawnZombie(0, 0);
      game.update(0.016);

      expect(game.score).toBe(prevScore);
    });
  });

  describe('Restart Flow', () => {
    it('should reset game state cleanly on restart()', () => {
      // Setup dirty state
      game.score = 50000;
      game.comboSystem.multiplier = 12;
      game.waveDirector.currentWave = 4;
      game.player.takeDamage(100);
      game.enemyManager.spawnZombie(2, 2);
      game.projectilePool.spawn('bullet', 0, 0, 1, 0, 15, 50);
      game.spawnCrate(1, 1);
      game.isGameOver = true;

      game.restart();

      expect(game.isGameOver).toBe(false);
      expect(game.score).toBe(0);
      expect(game.player.hp).toBe(game.player.maxHp);
      expect(game.player.pos.x).toBe(0);
      expect(game.player.pos.z).toBe(0);
      expect(game.comboSystem.multiplier).toBe(1);
      expect(game.waveDirector.currentWave).toBe(1);
      expect(game.enemyManager.enemies.length).toBe(0);
      expect(game.projectilePool.getActiveCount()).toBe(0);
      expect(game.crates.length).toBe(0);
      expect(game.barrels.length).toBe(0);
      expect(game.gameOverModal.visible).toBe(false);
    });
  });

  describe('Mute and Weapon Selection Controls', () => {
    it('should toggle audio muting on toggleMute()', () => {
      expect(game.audioManager.isMuted).toBe(false);

      game.toggleMute();
      expect(game.audioManager.isMuted).toBe(true);
      expect(game.hud.muteBtnEl?.textContent).toContain('MUTED');

      game.toggleMute();
      expect(game.audioManager.isMuted).toBe(false);
      expect(game.hud.muteBtnEl?.textContent).toContain('SOUND');
    });

    it('should switch active weapon slot when selectWeaponSlot(slot) is called', () => {
      game.weaponInventory.unlockMilestone(4); // unlocks Uzi (slot 2)
      game.selectWeaponSlot(2);

      expect(game.weaponInventory.activeWeaponId).toBe(WeaponId.Uzi);
      expect(game.inputManager.activeSlot).toBe(2);
    });
  });

  describe('Review Fixes Verification', () => {
    describe('Fireball Collisions with Obstacles', () => {
      it('should collide with static boundary wall: spawn orange burst, play fizzle sound, and recycle projectile', () => {
        const fizzleSpy = vi.spyOn(game.audioManager, 'playFireballFizzle');
        const burstSpy = vi.spyOn(game.particlePool, 'spawnBurst');

        // North wall is minZ: -19.5, maxZ: -18
        const fireball = game.projectilePool.spawn('fireball', 0, -18.5, 0, -1, 25, 14);
        expect(fireball).not.toBeNull();
        expect(fireball?.active).toBe(true);

        game.handleProjectileCollisions();

        expect(burstSpy).toHaveBeenCalledWith(0, -18.5, 8, 0xe67e22, 3.0);
        expect(fizzleSpy).toHaveBeenCalled();
        expect(fireball?.active).toBe(false);
      });

      it('should collide with interior pillar obstacles: spawn orange burst, play fizzle sound, and recycle projectile', () => {
        const fizzleSpy = vi.spyOn(game.audioManager, 'playFireballFizzle');
        const burstSpy = vi.spyOn(game.particlePool, 'spawnBurst');

        // Symmetrical interior pillar at (14, 8) with half-size 1.25
        const fireball = game.projectilePool.spawn('fireball', 14, 8, 1, 0, 25, 14);
        expect(fireball).not.toBeNull();
        expect(fireball?.active).toBe(true);

        game.handleProjectileCollisions();

        expect(burstSpy).toHaveBeenCalledWith(14, 8, 8, 0xe67e22, 3.0);
        expect(fizzleSpy).toHaveBeenCalled();
        expect(fireball?.active).toBe(false);
      });
    });

    describe('Persistent Obstacle Array Reuse', () => {
      it('should reuse persistent obstacle array across frames without heap reallocation', () => {
        const initialObstacles = game.getObstacles();
        expect(initialObstacles).toBeDefined();

        game.update(0.016);
        expect(game.getObstacles()).toBe(initialObstacles);

        // Add a barrel and a fake wall
        const barrel = new Barrel(5, 5);
        game.barrels.push(barrel);
        const fakeWall = new FakeWall(8, 8);
        game.fakeWalls.push(fakeWall);

        game.update(0.016);
        expect(game.getObstacles()).toBe(initialObstacles);
        expect(game.getObstacles().length).toBe(game.sceneManager.walls.length + 2);

        game.update(0.016);
        expect(game.getObstacles()).toBe(initialObstacles);
      });
    });

    describe('Mouse Wheel Weapon Cycling', () => {
      it('should cycle only between unlocked weapons and wrap around via mouse wheel', () => {
        // Start with Pistol (1)
        expect(game.weaponInventory.activeWeaponId).toBe(WeaponId.Pistol);

        // Unlock Shotgun (slot 3) only, Uzi (slot 2) is locked
        game.weaponInventory.unlocked.add(WeaponId.Shotgun);
        game.weaponInventory.ammo.set(WeaponId.Shotgun, 50);

        // Scroll wheel down (deltaY > 0) -> should skip locked Uzi (2) and select Shotgun (3)
        game.inputManager.onWheel?.(100);
        expect(game.weaponInventory.activeWeaponId).toBe(WeaponId.Shotgun);
        expect(game.inputManager.activeSlot).toBe(WeaponId.Shotgun);

        // Scroll wheel down again -> wraps around to Pistol (1)
        game.inputManager.onWheel?.(100);
        expect(game.weaponInventory.activeWeaponId).toBe(WeaponId.Pistol);
        expect(game.inputManager.activeSlot).toBe(WeaponId.Pistol);

        // Scroll wheel up (previous weapon) -> wraps backwards to Shotgun (3)
        game.inputManager.onWheel?.(-100);
        expect(game.weaponInventory.activeWeaponId).toBe(WeaponId.Shotgun);
        expect(game.inputManager.activeSlot).toBe(WeaponId.Shotgun);
      });
    });

    describe('Zombie Contact Attack Damaging Fake Wall', () => {
      it('should damage fake wall when zombie is in contact attack range', () => {
        const fakeWall = new FakeWall(2, 0);
        game.fakeWalls.push(fakeWall);
        game.sceneManager.scene.add(fakeWall.mesh);

        const zombie = game.enemyManager.spawnZombie(2, 0.5);
        const initialHp = fakeWall.hp;

        game.update(0.016);

        expect(fakeWall.hp).toBe(initialHp - zombie.contactDamage);
        expect(zombie.attackCooldown).toBeGreaterThan(0);
      });

      it('should destroy fake wall, spawn splinter particles, and remove it on lethal contact damage', () => {
        const burstSpy = vi.spyOn(game.particlePool, 'spawnBurst');

        const fakeWall = new FakeWall(2, 0);
        fakeWall.hp = 10;
        game.fakeWalls.push(fakeWall);
        game.sceneManager.scene.add(fakeWall.mesh);

        // Zombie contact damage is 20, lethal to 10 HP fake wall
        game.enemyManager.spawnZombie(2, 0.5);

        game.update(0.016);

        expect(fakeWall.alive).toBe(false);
        expect(burstSpy).toHaveBeenCalledWith(2, 0, 12, 0x8D6E63, 2.5);
        expect(game.fakeWalls).not.toContain(fakeWall);
      });
    });

    describe('Bullet Knockback Stored on Projectile', () => {
      it('should determine bullet knockback from projectile knockback rather than active weapon', () => {
        const zombie = game.enemyManager.spawnZombie(5, 0);
        const initialX = zombie.pos.x;

        // Spawn bullet moving in +X direction with knockback = 4.0
        game.projectilePool.spawn('bullet', 4.8, 0, 1, 0, 10, 50, 4.0);

        game.handleProjectileCollisions();

        // knockback distance: 4.0 * 0.1 = 0.4 along +X
        expect(zombie.pos.x).toBeCloseTo(initialX + 0.4);
      });
    });
  });
});
