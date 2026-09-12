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
});
