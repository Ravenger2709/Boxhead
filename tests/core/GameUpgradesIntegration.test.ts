import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Game } from '../../src/core/Game';
import { Claymore } from '../../src/entities/Claymore';
import { ChargePack } from '../../src/entities/ChargePack';

describe('Game Full Upgrade System Integration', () => {
  let game: Game;

  beforeEach(() => {
    if (typeof document !== 'undefined') {
      document.body.innerHTML = `
        <div id="game-container">
          <div id="damage-overlay"></div>
          <div id="hud-overlay"></div>
        </div>
      `;
    }
    game = new Game({ autoStart: false });
  });

  afterEach(() => {
    game.dispose();
  });

  it('triggers upgrade milestones and toasts when combo scales up', () => {
    const inventory = (game as any).inventory;
    expect(inventory.isUnlocked('uzi')).toBe(false);

    const toastSpy = vi.spyOn(game.hud, 'showUpgradeToast');
    const fanfareSpy = vi.spyOn(game.audioManager, 'playUpgradeFanfare');

    (game as any).comboSystem.multiplier = 5;
    game.update(0.016);

    expect(inventory.isUnlocked('uzi')).toBe(true);
    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringMatching(/uzi/i),
      expect.stringMatching(/unlocked at x5/i),
      true
    );
    expect(fanfareSpy).toHaveBeenCalled();
  });

  it('triggers stat upgrade toasts and fanfares on stat milestones', () => {
    const toastSpy = vi.spyOn(game.hud, 'showUpgradeToast');
    const fanfareSpy = vi.spyOn(game.audioManager, 'playUpgradeFanfare');

    // Milestone x3 is Pistol Fast Fire
    (game as any).comboSystem.multiplier = 3;
    game.update(0.016);

    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringMatching(/fast fire/i),
      expect.any(String),
      false
    );
    expect(fanfareSpy).toHaveBeenCalled();
  });

  it('supports Key 0 to select Railgun when unlocked', () => {
    const inventory = (game as any).inventory;
    (game as any).comboSystem.multiplier = 70;
    game.update(0.016);

    expect(inventory.isUnlocked('railgun')).toBe(true);

    // Simulate pressing Key 0 via input manager
    game.inputManager.handleKeyDown('0', 'Digit0');
    game.update(0.016);

    expect(game.inputManager.activeSlot).toBe(10);
    expect(inventory.getActiveWeaponId()).toBe('railgun');
  });

  it('supports Number keys 1-9 to select unlocked slots 1-9', () => {
    (game as any).comboSystem.multiplier = 55; // Unlocks up to Charge Pack (slot 9)
    game.update(0.016);

    for (let slot = 1; slot <= 9; slot++) {
      game.inputManager.handleKeyDown(slot.toString(), `Digit${slot}`);
      game.update(0.016);
      expect(game.inputManager.activeSlot).toBe(slot);
    }
  });

  it('places Claymore, arms it, beeps on proximity, detonates and damages enemies', () => {
    const inventory = (game as any).inventory;
    (game as any).comboSystem.multiplier = 40; // Claymore unlocked
    game.update(0.016);

    game.inputManager.handleKeyDown('7', 'Digit7');
    game.update(0.016);
    expect(inventory.getActiveWeaponId()).toBe('claymore');

    // Set player position and aim angle
    game.player.pos = { x: 0, z: 0 };
    game.player.rotationAngle = 0; // aiming toward +Z

    // Spawn an enemy far away
    const enemy = game.enemyManager.spawnZombie(0, 20);
    enemy.hp = 300;

    // Fire Claymore
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.activeClaymores.length).toBe(1);
    const claymore = game.activeClaymores[0];
    expect(claymore.pos.z).toBeCloseTo(1.8, 1);
    expect(game.sceneManager.scene.children).toContain(claymore.mesh);

    const beepSpy = vi.spyOn(game.audioManager, 'playClaymoreBeep');
    const explosionSpy = vi.spyOn(game.audioManager, 'playExplosion');

    // Arm the claymore (armingTimer = 0.5s)
    game.update(0.6);
    expect(claymore.state).toBe('armed');

    // Move enemy into trigger radius (triggerRadius = 1.2)
    enemy.pos = { x: claymore.pos.x, z: claymore.pos.z + 0.8 };
    game.update(0.016);

    expect(claymore.state).toBe('tripped');
    expect(beepSpy).toHaveBeenCalled();

    // Fuse countdown (0.15s)
    game.update(0.2);

    expect(explosionSpy).toHaveBeenCalled();
    expect(enemy.hp).toBeLessThan(300);
    expect(game.activeClaymores.length).toBe(0);
    expect(game.sceneManager.scene.children).not.toContain(claymore.mesh);
  });

  it('places Charge Pack and detonates via Spacebar with remote click and explosion', () => {
    const inventory = (game as any).inventory;
    (game as any).comboSystem.multiplier = 55; // Charge Pack unlocked
    game.update(0.016);

    game.inputManager.handleKeyDown('9', 'Digit9');
    game.update(0.016);
    expect(inventory.getActiveWeaponId()).toBe('chargepack');

    // Fire Charge Pack
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.activeChargePacks.length).toBe(1);
    const cp = game.activeChargePacks[0];
    expect(game.sceneManager.scene.children).toContain(cp.mesh);

    // Spawn an enemy near the charge pack
    const enemy = game.enemyManager.spawnZombie(cp.pos.x, cp.pos.z + 1.0);
    enemy.hp = 400;

    const clickSpy = vi.spyOn(game.audioManager, 'playRemoteClick');
    const explosionSpy = vi.spyOn(game.audioManager, 'playExplosion');

    // Press Spacebar to detonate
    game.inputManager.handleKeyDown(' ', 'Space');
    game.update(0.016);

    expect(clickSpy).toHaveBeenCalled();
    expect(explosionSpy).toHaveBeenCalled();
    expect(enemy.hp).toBeLessThan(400);
    expect(game.activeChargePacks.length).toBe(0);
    expect(game.sceneManager.scene.children).not.toContain(cp.mesh);
  });

  it('detonates Charge Pack via left click when active charges are deployed', () => {
    (game as any).comboSystem.multiplier = 55;
    game.update(0.016);

    game.inputManager.handleKeyDown('9', 'Digit9');
    game.update(0.016);

    // First click: places charge pack
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;
    game.update(0.016);

    expect(game.activeChargePacks.length).toBe(1);

    const clickSpy = vi.spyOn(game.audioManager, 'playRemoteClick');
    const explosionSpy = vi.spyOn(game.audioManager, 'playExplosion');

    // Second click while holding Charge Pack: detonates deployed charge
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(clickSpy).toHaveBeenCalled();
    expect(explosionSpy).toHaveBeenCalled();
    expect(game.activeChargePacks.length).toBe(0);
  });

  it('fires Railgun hitscan beam piercing multiple enemies along aim angle', () => {
    const inventory = (game as any).inventory;
    (game as any).comboSystem.multiplier = 70; // Railgun unlocked
    game.update(0.016);

    game.inputManager.handleKeyDown('0', 'Digit0');
    game.update(0.016);
    expect(inventory.getActiveWeaponId()).toBe('railgun');

    game.player.pos = { x: 0, z: 0 };
    game.player.rotationAngle = 0; // aim along +Z

    // Spawn 3 enemies directly in line along +Z
    const e1 = game.enemyManager.spawnZombie(0, 5);
    const e2 = game.enemyManager.spawnZombie(0, 10);
    const e3 = game.enemyManager.spawnZombie(0, 15);
    e1.hp = 300;
    e2.hp = 300;
    e3.hp = 300;

    const laserSpy = vi.spyOn(game.audioManager, 'playRailgunLaser');

    // Fire Railgun
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(laserSpy).toHaveBeenCalledTimes(1);
    expect(e1.hp).toBeLessThan(300);
    expect(e2.hp).toBeLessThan(300);
    expect(e3.hp).toBeLessThan(300);

    expect(game.railgunBeam.mesh.visible).toBe(true);

    // Update simulation to let beam fade out
    game.update(0.2);
    expect(game.railgunBeam.mesh.visible).toBe(false);
  });

  it('clears active Claymores and Charge Packs on restart()', () => {
    const claymore = new Claymore(5, 5);
    game.sceneManager.scene.add(claymore.mesh);
    game.activeClaymores.push(claymore);

    const cp = new ChargePack(10, 10);
    game.sceneManager.scene.add(cp.mesh);
    game.activeChargePacks.push(cp);

    expect(game.activeClaymores.length).toBe(1);
    expect(game.activeChargePacks.length).toBe(1);

    game.restart();

    expect(game.activeClaymores.length).toBe(0);
    expect(game.activeChargePacks.length).toBe(0);
    expect(game.sceneManager.scene.children).not.toContain(claymore.mesh);
    expect(game.sceneManager.scene.children).not.toContain(cp.mesh);
  });

  it('plays remote click on Spacebar even if 0 charges are deployed', () => {
    (game as any).comboSystem.multiplier = 55;
    game.update(0.016);

    game.inputManager.handleKeyDown('9', 'Digit9');
    game.update(0.016);
    expect(game.activeChargePacks.length).toBe(0);

    const clickSpy = vi.spyOn(game.audioManager, 'playRemoteClick');

    game.inputManager.handleKeyDown(' ', 'Space');
    game.update(0.016);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('triggers cluster sub-explosions for upgraded Claymore', () => {
    // Milestone x47 is Claymore Cluster Explode
    (game as any).comboSystem.multiplier = 47;
    game.update(0.016);

    game.inputManager.handleKeyDown('7', 'Digit7');
    game.update(0.016);

    game.player.pos = { x: 0, z: 0 };
    game.player.rotationAngle = 0;

    // Fire Claymore
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.activeClaymores.length).toBe(1);
    const claymore = game.activeClaymores[0];
    expect(claymore.hasCluster).toBe(true);

    const splashSpy = vi.spyOn(game, 'dealSplashDamage');

    // Arm it
    game.update(0.6);

    // Trip it with an enemy
    game.enemyManager.spawnZombie(claymore.pos.x, claymore.pos.z + 0.5);
    game.update(0.016);
    expect(claymore.state).toBe('tripped');

    // Fuse expires
    game.update(0.2);

    expect(claymore.state).toBe('detonated');
    // Main blast + 4 radial sub-explosions = 5 splash calls
    expect(splashSpy).toHaveBeenCalledTimes(5);
  });

  it('triggers cluster sub-explosions for upgraded Charge Pack', () => {
    // Milestone x63 is Charge Pack Cluster Explode
    (game as any).comboSystem.multiplier = 63;
    game.update(0.016);

    game.inputManager.handleKeyDown('9', 'Digit9');
    game.update(0.016);

    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.activeChargePacks.length).toBe(1);
    const cp = game.activeChargePacks[0];
    expect(cp.hasCluster).toBe(true);

    const splashSpy = vi.spyOn(game, 'dealSplashDamage');

    game.inputManager.handleKeyDown(' ', 'Space');
    game.update(0.016);

    // Main blast + 4 radial sub-explosions = 5 splash calls
    expect(splashSpy).toHaveBeenCalledTimes(5);
  });

  it('does not place unintended charge pack during multi-frame held click after detonation', () => {
    game.player.hp = 99999;
    (game as any).comboSystem.multiplier = 55;
    game.update(0.016);
    game.inputManager.handleKeyDown('9', 'Digit9');
    game.update(0.016);

    // Place charge
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;
    game.update(0.016);
    expect(game.activeChargePacks.length).toBe(1);

    // Click to detonate and hold across 5 consecutive frames
    game.inputManager.isMouseDown = true;
    for (let i = 0; i < 5; i++) {
      game.update(0.016);
    }
    expect(game.activeChargePacks.length).toBe(0);

    // Release mouse and click again: places new charge after cooldown (0.5s)
    game.inputManager.isMouseDown = false;
    game.update(0.6);
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    expect(game.activeChargePacks.length).toBe(1);
  });

  it('scales Railgun damage and beam width on Long Shot milestone at x125', () => {
    const inventory = (game as any).inventory;
    // Milestone x125 is Railgun Long Shot (Double Damage = 200)
    (game as any).comboSystem.multiplier = 125;
    game.update(0.016);

    game.inputManager.handleKeyDown('0', 'Digit0');
    game.update(0.016);

    expect(inventory.getEffectiveDamage('railgun')).toBe(200);

    const enemy = game.enemyManager.spawnZombie(0, 5);
    enemy.hp = 500;

    game.player.pos = { x: 0, z: 0 };
    game.player.rotationAngle = 0;

    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    // Enemy should take 200 damage: 500 - 200 = 300
    expect(enemy.hp).toBe(300);
    expect(game.railgunBeam.beamWidth).toBeCloseTo(0.38, 2);
  });

  it('supports restartGame() alias to clean up sessions', () => {
    const claymore = new Claymore(1, 1);
    game.activeClaymores.push(claymore);
    game.restartGame();
    expect(game.activeClaymores.length).toBe(0);
  });

  it('scales Grenade blast radius with Big Bang / Bigger Bang milestones and spawns cluster sub-explosions on x33 Cluster Explode', () => {
    game.player.hp = 99999;
    const inventory = (game as any).inventory;
    const detonateSpy = vi.spyOn(game, 'detonateExplosion');
    const splashSpy = vi.spyOn(game, 'dealSplashDamage');

    // 1. Base Grenade at x20
    (game as any).comboSystem.multiplier = 20;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('grenade')).toBe(4.5);
    expect(inventory.hasClusterExplode('grenade')).toBe(false);

    const mockGrenade1 = {
      type: 'grenade',
      x: 0,
      y: 0,
      z: 0,
      damage: 140,
    } as any;

    (game as any).handleProjectileDetonate(mockGrenade1);
    expect(detonateSpy).toHaveBeenLastCalledWith(0, 0, 4.5, 140);
    expect(splashSpy).not.toHaveBeenCalled();

    // 2. Cluster Explode at x33
    (game as any).comboSystem.multiplier = 33;
    game.update(0.016);
    expect(inventory.hasClusterExplode('grenade')).toBe(true);

    const mockGrenade2 = {
      type: 'grenade',
      x: 10,
      y: 0,
      z: 10,
      damage: 140,
    } as any;

    (game as any).handleProjectileDetonate(mockGrenade2);
    expect(detonateSpy).toHaveBeenLastCalledWith(10, 10, 4.5, 140);
    // 4 radial cluster sub-explosions
    expect(splashSpy).toHaveBeenCalledTimes(4);
    expect(splashSpy).toHaveBeenCalledWith(10 + 1.5, 10, 70, 4.5 * 0.75);

    // 3. Big Bang at x45 (radius 6.0, damage 200)
    (game as any).comboSystem.multiplier = 45;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('grenade')).toBe(6.0);

    const mockGrenade3 = {
      type: 'grenade',
      x: 0,
      y: 0,
      z: 0,
      damage: 200,
    } as any;

    (game as any).handleProjectileDetonate(mockGrenade3);
    expect(detonateSpy).toHaveBeenLastCalledWith(0, 0, 6.0, 200);

    // 4. Bigger Bang at x57 (radius 8.0, damage 280)
    (game as any).comboSystem.multiplier = 57;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('grenade')).toBe(8.0);

    const mockGrenade4 = {
      type: 'grenade',
      x: 0,
      y: 0,
      z: 0,
      damage: 280,
    } as any;

    (game as any).handleProjectileDetonate(mockGrenade4);
    expect(detonateSpy).toHaveBeenLastCalledWith(0, 0, 8.0, 280);
  });

  it('scales Rocket blast radius with Big Bang / Bigger Bang milestones on impact and expiry', () => {
    const inventory = (game as any).inventory;
    const detonateSpy = vi.spyOn(game, 'detonateExplosion');

    // 1. Base Rocket at x50 (radius 4.0)
    (game as any).comboSystem.multiplier = 50;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('rocket')).toBe(4.0);

    const mockRocket1 = {
      type: 'rocket',
      x: 5,
      y: 0,
      z: 5,
      damage: 160,
    } as any;

    (game as any).handleProjectileDetonate(mockRocket1);
    expect(detonateSpy).toHaveBeenLastCalledWith(5, 5, 4.0, 160);

    // 2. Big Bang at x72 (radius 5.5, damage 240)
    (game as any).comboSystem.multiplier = 72;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('rocket')).toBe(5.5);

    const mockRocket2 = {
      type: 'rocket',
      x: 8,
      y: 0,
      z: 8,
      damage: 240,
    } as any;

    (game as any).handleProjectileDetonate(mockRocket2);
    expect(detonateSpy).toHaveBeenLastCalledWith(8, 8, 5.5, 240);

    // Rocket impact collision with enemy also uses upgraded blast radius
    game.enemyManager.spawnZombie(10, 10);
    game.projectilePool.spawn('rocket', 9.8, 10, 1, 0, 240, 28);
    detonateSpy.mockClear();

    // Trigger projectile collision update
    (game as any).handleProjectileCollisions();
    expect(detonateSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 5.5, 240);
  });

  it('places Barrel with upgraded damage and radius when milestone x32/x44 is unlocked and explodes with scaled stats', () => {
    const inventory = (game as any).inventory;

    // 1. Base Barrel at x15: radius 4.5, damage 120
    (game as any).comboSystem.multiplier = 15;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(4.5);
    expect(inventory.getEffectiveDamage('barrel')).toBe(120);

    game.inputManager.handleKeyDown('4', 'Digit4');
    game.update(0.016);
    game.player.pos = { x: 0, z: 0 };
    game.player.rotationAngle = 0;

    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.barrels.length).toBe(1);
    const bBase = game.barrels[0];
    expect(bBase.radius).toBe(4.5);
    expect(bBase.damage).toBe(120);

    // 2. Big Bang at x32: radius 6.0, damage 180
    (game as any).comboSystem.multiplier = 32;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(6.0);
    expect(inventory.getEffectiveDamage('barrel')).toBe(180);

    // Move player and place next barrel
    game.player.pos = { x: 10, z: 0 };
    game.weaponInventory.updateCooldown(1.0); // Reset cooldown
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.barrels.length).toBe(2);
    const bBigBang = game.barrels[1];
    expect(bBigBang.radius).toBe(6.0);
    expect(bBigBang.damage).toBe(180);

    // 3. Bigger Bang at x44: radius 8.0, damage 260
    (game as any).comboSystem.multiplier = 44;
    game.update(0.016);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(8.0);
    expect(inventory.getEffectiveDamage('barrel')).toBe(260);

    game.player.pos = { x: 20, z: 0 };
    game.weaponInventory.updateCooldown(1.0);
    game.inputManager.isMouseDown = true;
    game.update(0.016);
    game.inputManager.isMouseDown = false;

    expect(game.barrels.length).toBe(3);
    const bBiggerBang = game.barrels[2];
    expect(bBiggerBang.radius).toBe(8.0);
    expect(bBiggerBang.damage).toBe(260);

    // Detonating Bigger Bang barrel damages enemies up to radius 8.0
    const farEnemy = game.enemyManager.spawnZombie(bBiggerBang.pos.x + 7.5, bBiggerBang.pos.z);
    farEnemy.hp = 500;

    bBiggerBang.explode((game as any).getExplosionContext());
    expect(farEnemy.hp).toBe(500 - 260);
  });
});
