import { SceneManager } from '../render/Scene';
import { CameraManager } from '../render/Camera';
import { InputManager } from '../core/Input';
import { Player } from '../entities/Player';
import { EnemyManager, Enemy } from '../entities/EnemyManager';
import { Devil } from '../entities/Devil';
import { ProjectilePool, Projectile } from '../weapons/ProjectilePool';
import { ParticlePool } from '../fx/ParticlePool';
import { DamageNumberPool } from '../ui/DamageNumberPool';
import { BloodCanvas } from '../render/BloodCanvas';
import { WeaponInventory, FireContext } from '../weapons/WeaponInventory';
import { ComboSystem } from '../core/ComboSystem';
import { WaveDirector } from '../core/WaveDirector';
import { AudioManager, audioManager } from '../core/Audio';
import { Barrel, detonateExplosion, ExplosionContext } from '../entities/Barrel';
import { FakeWall } from '../entities/FakeWall';
import { Claymore } from '../entities/Claymore';
import { ChargePack } from '../entities/ChargePack';
import { RailgunBeam } from '../weapons/Railgun';
import { Crate } from '../entities/Crate';
import { createExplosionRing, SubExplosion } from '../weapons/ExplosionRing';
import { HUD } from '../ui/HUD';
import { GameOverModal } from '../ui/GameOverModal';
import {
  AABB,
  DEVIL_FIREBALL_DAMAGE,
  DEVIL_FIREBALL_SPEED,
  DifficultyLevel,
  DIFFICULTY_PRESETS,
} from '../core/Constants';
import { MapManager } from '../maps/MapManager';
import { RoomData, getRoom, getAllRooms } from '../maps/RoomData';

export interface GameOptions {
  canvas?: HTMLCanvasElement;
  container?: HTMLElement | null;
  audioContext?: AudioContext;
  room?: string | RoomData;
  difficulty?: DifficultyLevel;
  devilsEnabled?: boolean;
  autoStart?: boolean;
  coop?: boolean;
  isCoop?: boolean;
  friendlyFire?: boolean;
}

export class Game {
  public mapManager: MapManager;
  public hasLoadedCustomRoom: boolean = false;
  public sceneManager: SceneManager;
  public cameraManager: CameraManager;
  public inputManager: InputManager;
  public player: Player;
  public player2: Player | null = null;
  public isCoop: boolean = false;
  public friendlyFire: boolean = false;
  public weaponInventory2: WeaponInventory | null = null;
  private fireContext2?: FireContext;
  public projectilePool: ProjectilePool;
  public particlePool: ParticlePool;
  public damageNumberPool: DamageNumberPool;
  public bloodCanvas: BloodCanvas;
  public weaponInventory: WeaponInventory;
  public comboSystem: ComboSystem;
  public waveDirector: WaveDirector;
  public audioManager: AudioManager;
  public enemyManager: EnemyManager;
  public hud: HUD;
  public gameOverModal: GameOverModal;

  public barrels: Barrel[] = [];
  public fakeWalls: FakeWall[] = [];
  public crates: Crate[] = [];
  public activeClaymores: Claymore[] = [];
  public activeChargePacks: ChargePack[] = [];
  public pendingSubExplosions: SubExplosion[] = [];
  public railgunBeam: RailgunBeam;

  public get inventory(): WeaponInventory {
    return this.weaponInventory;
  }

  public difficulty: DifficultyLevel = 'beginner';
  public devilsEnabled: boolean = true;

  public score: number = 0;
  public isGameOver: boolean = false;
  public isRunning: boolean = false;

  private obstacles: AABB[] = [];
  private fireContext: FireContext;
  private prevSpaceDown: boolean = false;
  private prevMouseDownForDetonator: boolean = false;
  private detonatedThisPress: boolean = false;

  public getObstacles(): AABB[] {
    return this.obstacles;
  }

  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private crateDropChance: number = 0.12;
  private shakeTimer: number = 0;
  private shakeIntensity: number = 0;
  private prevMuteKeyDown: boolean = false;
  private boundResizeHandler?: () => void;

  constructor(options: GameOptions = {}) {
    let container: HTMLElement | null = null;
    if (options.container) {
      container = options.container;
    } else if (typeof document !== 'undefined') {
      container = document.getElementById('game-container') || document.body;
    }

    // 1. Render Pipeline & Camera
    this.sceneManager = new SceneManager(options.canvas);
    if (container && this.sceneManager.renderer?.domElement) {
      if (this.sceneManager.renderer.domElement.parentNode !== container) {
        container.appendChild(this.sceneManager.renderer.domElement);
      }
    }

    this.cameraManager = new CameraManager();
    this.sceneManager.camera = this.cameraManager.camera;

    // 2. Input Manager
    this.inputManager = new InputManager(this.sceneManager.renderer?.domElement);

    // 3. Audio System
    this.audioManager = options.audioContext
      ? new AudioManager(options.audioContext)
      : audioManager;

    // 4. Entity & Object Pools
    this.bloodCanvas = this.sceneManager.bloodCanvas;
    this.projectilePool = new ProjectilePool(this.sceneManager.scene);
    this.particlePool = new ParticlePool(this.sceneManager.scene);
    this.railgunBeam = new RailgunBeam(this.sceneManager.scene);

    let damageOverlay: HTMLElement | null = null;
    if (typeof document !== 'undefined') {
      damageOverlay = document.getElementById('damage-overlay');
    }
    this.damageNumberPool = new DamageNumberPool(damageOverlay);

    // Initialize MapManager
    this.mapManager = new MapManager(options.room ?? 'BOXY');

    // 5. Player Entity
    this.player = new Player(0, 0);
    this.sceneManager.attachPlayer(this.player);
    this.cameraManager.update(this.player.pos);

    // 6. Gameplay Managers
    this.difficulty = options.difficulty ?? 'beginner';
    this.devilsEnabled = options.devilsEnabled !== undefined ? options.devilsEnabled : true;
    this.friendlyFire = options.friendlyFire ?? false;
    const initialCoop = options.coop ?? options.isCoop ?? false;

    this.weaponInventory = new WeaponInventory();
    this.comboSystem = new ComboSystem();
    this.enemyManager = new EnemyManager(
      this.sceneManager.scene,
      this.projectilePool,
      undefined,
      this.particlePool
    );
    this.enemyManager.fakeWalls = this.fakeWalls;
    this.enemyManager.barrels = this.barrels;
    this.waveDirector = new WaveDirector({
      devilsEnabled: this.devilsEnabled,
    });

    // Wire mouse wheel weapon cycling through unlocked weapons
    this.inputManager.onWheel = (deltaY: number) => {
      if (deltaY > 0) {
        this.weaponInventory.nextWeapon();
      } else if (deltaY < 0) {
        this.weaponInventory.previousWeapon();
      }
      this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
      this.inputManager.wheelDelta = 0;
    };

    // Persistent fire context reused across frames
    this.fireContext = {
      projectilePool: this.projectilePool,
      scene: this.sceneManager.scene,
      obstacles: this.obstacles,
      barrels: this.barrels,
      fakeWalls: this.fakeWalls,
      enemies: this.enemyManager.enemies,
      player: this.player,
      shooter: this.player,
      friendlyFire: this.friendlyFire,
      players: [this.player],
      particlePool: this.particlePool,
      bloodCanvas: this.bloodCanvas,
      claymores: this.activeClaymores,
      chargePacks: this.activeChargePacks,
      railgun: this.railgunBeam,
      audio: this.audioManager,
      audioManager: this.audioManager,
    };

    // 7. UI Components
    this.hud = new HUD({
      container,
      inventory: this.weaponInventory,
      rooms: getAllRooms().map((r) => r.name),
      currentRoom: this.mapManager.activeRoom.name,
      onToggleMute: () => this.toggleMute(),
      onSelectRoom: (name) => this.loadRoom(name),
      onSelectDifficulty: (diff) => this.setDifficulty(diff),
      onToggleDevils: (enabled) => this.setDevilsEnabled(enabled),
      onToggleCoop: (enabled) => this.setCoop(enabled),
      difficulty: this.difficulty,
      devilsEnabled: this.devilsEnabled,
      isCoop: initialCoop,
    });

    this.gameOverModal = new GameOverModal({
      container,
    });

    // Apply difficulty preset if non-default
    if (this.difficulty !== 'beginner') {
      this.applyDifficultyPreset(this.difficulty);
    }

    // 8. Wire Subsystem Callbacks
    this.initCallbacks();

    // Enable co-op if requested
    if (initialCoop) {
      this.setCoop(true);
    }

    // If initial custom room requested, load it now
    if (options.room) {
      this.loadRoom(options.room);
    }

    // 9. Resize Listener
    if (typeof window !== 'undefined') {
      this.boundResizeHandler = () => {
        this.cameraManager.handleResize();
        this.sceneManager.handleResize();
      };
      window.addEventListener('resize', this.boundResizeHandler);
    }

    // 10. Auto-start if requested (defaults to true in browser, false in tests)
    if (options.autoStart ?? (typeof window !== 'undefined' && typeof requestAnimationFrame === 'function')) {
      this.start();
    }
  }

  private initCallbacks(): void {
    // When enemies die (killed by bullets, explosions, etc.)
    this.enemyManager.onEnemyKilled = (enemy: Enemy) => {
      this.handleEnemyKill(enemy);
    };

    // Devil fireball attack wiring
    const bindDevil = (devil: Devil) => {
      devil.onShootFireball = (d, dirX, dirZ) => {
        this.audioManager.playDevilFireball();
        this.projectilePool.spawn(
          'fireball',
          d.pos.x + dirX * d.radius,
          d.pos.z + dirZ * d.radius,
          dirX,
          dirZ,
          DEVIL_FIREBALL_DAMAGE,
          DEVIL_FIREBALL_SPEED
        );
      };
    };

    const originalSpawnDevil = this.enemyManager.spawnDevil.bind(this.enemyManager);
    this.enemyManager.spawnDevil = (x: number, z: number) => {
      const devil = originalSpawnDevil(x, z);
      bindDevil(devil);
      return devil;
    };

    // Wave Director callbacks
    this.waveDirector.onEnemySpawn = (enemy, type) => {
      if (type === 'devil' && enemy instanceof Devil) {
        bindDevil(enemy);
      }
    };

    this.waveDirector.onWaveComplete = (wave) => {
      this.score += wave * 500;
      // Bonus crate reward for clearing wave
      const cratePoints = this.mapManager.getCrateSpawnPoints();
      if (cratePoints.length > 0) {
        const pt = cratePoints[Math.floor(Math.random() * cratePoints.length)];
        this.spawnCrate(pt.x, pt.z);
      } else {
        this.spawnCrate((Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 5);
      }
    };
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (typeof requestAnimationFrame === 'function') {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public loop = (time: number): void => {
    if (!this.isRunning) return;

    const dt = Math.max(0, Math.min((time - this.lastTime) / 1000, 0.1));
    this.lastTime = time;

    this.update(dt);
    this.render();

    if (this.isRunning && typeof requestAnimationFrame === 'function') {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  };

  /**
   * Main game update loop: ticks input, player, enemies, combat, and UI.
   */
  public update(dt: number): void {
    // 1. Keyboard mute toggle ('M' key)
    if (this.inputManager.keys.has('m') || this.inputManager.keys.has('keym')) {
      if (!this.prevMuteKeyDown) {
        this.toggleMute();
      }
      this.prevMuteKeyDown = true;
    } else {
      this.prevMuteKeyDown = false;
    }

    // 2. If game is over, freeze simulation and only update pools/rendering
    if (this.isGameOver) {
      this.particlePool.update(dt);
      this.damageNumberPool.update(dt, this.cameraManager.camera);
      this.sceneManager.update(dt);
      return;
    }

    // 3. Screen shake countdown
    if (this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    }

    // 4. Update raycast pointer target
    this.inputManager.updateRaycast(this.cameraManager.camera);

    // 5. Build dynamic obstacles list (static walls + props)
    this.obstacles.length = 0;
    const staticWalls = this.sceneManager.walls;
    for (let i = 0; i < staticWalls.length; i++) {
      this.obstacles.push(staticWalls[i]);
    }
    for (let i = 0; i < this.barrels.length; i++) {
      const b = this.barrels[i];
      if (b.alive && !b.exploded) {
        this.obstacles.push(b.aabb ?? b.getAABB());
      }
    }
    for (let i = 0; i < this.fakeWalls.length; i++) {
      const fw = this.fakeWalls[i];
      if (fw.alive) {
        this.obstacles.push(fw.aabb ?? fw.getAABB());
      }
    }

    // Weapon cycling via keyboard shortcuts:
    // P1: ',' (prev) and '.' (next)
    const p1Cycle = this.inputManager.consumeP1Cycle();
    if (p1Cycle > 0) {
      this.weaponInventory.nextWeapon();
      this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
    } else if (p1Cycle < 0) {
      this.weaponInventory.previousWeapon();
      this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
    }

    // P2: 'q' (prev) and 'e' (next)
    if (this.isCoop && this.weaponInventory2) {
      const p2Cycle = this.inputManager.consumeP2Cycle();
      if (p2Cycle > 0) {
        this.weaponInventory2.nextWeapon();
      } else if (p2Cycle < 0) {
        this.weaponInventory2.previousWeapon();
      }
    }

    // 6. Update Player Movement & Collision
    this.player.update(dt, this.inputManager, this.obstacles, this.isCoop);
    if (this.isCoop && this.player2) {
      this.player2.update(dt, this.inputManager, this.obstacles, this.isCoop);
      this.keepDistance(20);
    }

    // 7. Update Railgun Beam fade
    this.railgunBeam.update(dt);

    // 8. Remote Detonator for Charge Pack:
    // If active weapon is 'chargepack' (slot 9) and (inputManager has Spacebar pressed OR left click when activeChargePacks.length > 0):
    // Play audioManager.playRemoteClick().
    // Detonate all active charge packs: for (const cp of this.activeChargePacks) cp.detonate();
    if (!this.inputManager.isMouseDown) {
      this.detonatedThisPress = false;
    }

    const isSpacePressed =
      this.inputManager.keys.has(' ') ||
      this.inputManager.keys.has('space') ||
      this.inputManager.keys.has('/') ||
      this.inputManager.keys.has('slash');
    const isSpaceTriggered = isSpacePressed && !this.prevSpaceDown;
    this.prevSpaceDown = isSpacePressed;

    const activeCanonical = this.weaponInventory.getActiveWeaponId();
    let isDetonatorFiring = false;

    if (activeCanonical === 'chargepack') {
      const isClickTriggered = this.inputManager.isMouseDown && !this.prevMouseDownForDetonator;
      const mode = ChargePack.getActionMode(this.activeChargePacks);
      const isDetonateClick = isClickTriggered && mode === 'detonate';

      if (isSpaceTriggered || isDetonateClick) {
        isDetonatorFiring = true;
        if (this.inputManager.isMouseDown) {
          this.detonatedThisPress = true;
          this.weaponInventory.syncMouseDown(true);
        }
        this.audioManager.playRemoteClick();
        const charges = [...this.activeChargePacks];
        this.activeChargePacks.length = 0;
        for (let i = 0; i < charges.length; i++) {
          charges[i].detonate();
          this.handleChargePackExplosion(charges[i]);
          const parent = charges[i].mesh.parent;
          if (parent) {
            parent.remove(charges[i].mesh);
          }
        }
      }
    }
    this.prevMouseDownForDetonator = this.inputManager.isMouseDown;

    // 9. Player Weapon Firing & Prop Placement
    if (!isDetonatorFiring && !this.detonatedThisPress) {
      this.handleFiring(dt);
    } else {
      this.weaponInventory.updateCooldown(dt);
      this.weaponInventory.syncMouseDown(this.inputManager.isMouseDown);
    }

    // 10. Update Active Claymores
    const enemies = typeof this.enemyManager.getEnemies === 'function'
      ? this.enemyManager.getEnemies()
      : this.enemyManager.enemies;

    for (let i = this.activeClaymores.length - 1; i >= 0; i--) {
      const claymore = this.activeClaymores[i];
      const wasDetonated = claymore.state === 'detonated' || !claymore.active;
      claymore.update(dt, enemies);
      if (!wasDetonated && (claymore.state === 'detonated' || !claymore.active)) {
        this.handleClaymoreExplosion(claymore);
      }
      if (claymore.state === 'detonated' || !claymore.active) {
        if (claymore.mesh.parent) {
          claymore.mesh.parent.remove(claymore.mesh);
        }
        this.activeClaymores.splice(i, 1);
      }
    }

    // 11. Update Active Charge Packs
    for (let i = this.activeChargePacks.length - 1; i >= 0; i--) {
      const cp = this.activeChargePacks[i];
      const wasActive = cp.isActive;
      cp.update(dt);
      if (wasActive && !cp.isActive) {
        this.handleChargePackExplosion(cp);
      }
      if (!cp.isActive) {
        if (cp.mesh.parent) {
          cp.mesh.parent.remove(cp.mesh);
        }
        this.activeChargePacks.splice(i, 1);
      }
    }

    // 12. Check Progression Milestones
    this.checkMilestones();

    // 8. Update Projectile Physics & Collisions (BEFORE enemy update so deaths are resolved in same frame!)
    this.projectilePool.update(dt, (p: Projectile) => {
      this.handleProjectileDetonate(p);
    });
    this.handleProjectileCollisions();

    // Update delayed secondary sub-explosions from BigBang / BiggerBang
    for (let i = this.pendingSubExplosions.length - 1; i >= 0; i--) {
      const sub = this.pendingSubExplosions[i];
      sub.delay -= dt;
      if (sub.delay <= 0) {
        this.dealSplashDamage(sub.x, sub.z, sub.damage, sub.radius);
        this.pendingSubExplosions.splice(i, 1);
      }
    }

    // 9. Update Wave Director (Spawns enemies)
    this.waveDirector.update(dt, this.enemyManager);

    // 10. Update Enemy Manager (AI Steering, contact damage to player, onEnemyKilled callbacks)
    this.enemyManager.update(
      dt,
      this.player,
      this.obstacles,
      this.fakeWalls,
      this.particlePool,
      this.barrels,
      this.getExplosionContext(),
      this.isCoop && this.player2 ? this.player2 : null
    );

    // 11. Update Combo System (Decay timer)
    this.comboSystem.update(dt);

    // 13. Update Placeable Props & Clean up destroyed props
    for (let i = this.barrels.length - 1; i >= 0; i--) {
      const b = this.barrels[i];
      if (!b.alive || b.exploded) {
        if (b.mesh.parent) b.mesh.parent.remove(b.mesh);
        this.barrels.splice(i, 1);
      }
    }
    for (let i = this.fakeWalls.length - 1; i >= 0; i--) {
      const fw = this.fakeWalls[i];
      if (!fw.alive) {
        if (fw.mesh.parent) fw.mesh.parent.remove(fw.mesh);
        this.fakeWalls.splice(i, 1);
      }
    }

    // 14. Update Crates & Collection
    for (let i = this.crates.length - 1; i >= 0; i--) {
      const crate = this.crates[i];
      let collected = crate.update(dt, this.player, this.weaponInventory, {
        particlePool: this.particlePool,
        audio: this.audioManager,
      });
      if (!collected && this.isCoop && this.player2 && this.weaponInventory2) {
        collected = crate.update(dt, this.player2, this.weaponInventory2, {
          particlePool: this.particlePool,
          audio: this.audioManager,
        });
      }
      if (collected || crate.collected) {
        this.crates.splice(i, 1);
      }
    }

    // 15. Update Visual Decal & Particle Pools
    this.particlePool.update(dt);
    this.damageNumberPool.update(dt, this.cameraManager.camera);
    const sceneObj = this.sceneManager.scene as any;
    if (sceneObj?._bulletTracerPool) {
      sceneObj._bulletTracerPool.update(dt);
    }
    this.sceneManager.update(dt);

    // 16. Camera Tracking with Screen Shake (Midpoint in 2-Player Co-op)
    let camTargetX = this.player.pos.x;
    let camTargetZ = this.player.pos.z;
    if (this.isCoop && this.player2) {
      camTargetX = (this.player.pos.x + this.player2.pos.x) / 2;
      camTargetZ = (this.player.pos.z + this.player2.pos.z) / 2;
    }

    if (this.shakeTimer > 0) {
      const currentIntensity = this.shakeIntensity * (this.shakeTimer / 0.3);
      const shakeX = (Math.random() * 2 - 1) * currentIntensity;
      const shakeZ = (Math.random() * 2 - 1) * currentIntensity;
      this.cameraManager.update({
        x: camTargetX + shakeX,
        z: camTargetZ + shakeZ,
      });
    } else {
      this.cameraManager.update({ x: camTargetX, z: camTargetZ });
    }

    // 17. Check Player Death
    const allDead = this.isCoop && this.player2
      ? (this.player.isDead && this.player2.isDead)
      : this.player.isDead;

    if (allDead && !this.isGameOver) {
      this.onPlayerDeath();
    }

    // 18. Synchronize HUD
    const activeDef = this.weaponInventory.getActiveWeaponDef();
    const curAmmo = this.weaponInventory.getAmmo(activeDef.id);
    const remainingEnemies = this.waveDirector.activeEnemiesCount + this.waveDirector.remainingToSpawn;

    this.hud.update(
      this.player.hp,
      this.player.maxHp,
      this.comboSystem.multiplier,
      this.comboSystem.decayProgress,
      activeDef,
      curAmmo,
      this.waveDirector.currentWave,
      this.score,
      this.audioManager.isMuted,
      this.weaponInventory,
      remainingEnemies
    );
  }

  /**
   * Projectile collision loop: bullets/rockets vs enemies, barrels, fake walls, and static walls.
   */
  public handleProjectileCollisions(): void {
    const projectiles = this.projectilePool.getActive();
    const enemies = this.enemyManager.enemies;
    const obstacles = this.sceneManager.walls;

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (!p || !p.active) continue;

      if (p.type === 'bullet') {
        if ((p as any).isHitscanTracer) {
          continue;
        }
        let bulletHit = false;

        // 1. Bullet vs Enemies
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j];
          if (!enemy.alive) continue;

          const dist = Math.hypot(p.x - enemy.pos.x, p.z - enemy.pos.z);
          if (dist <= p.radius + enemy.radius) {
            // Damage enemy
            enemy.takeDamage(p.damage);

            // Knockback
            const knockbackDist = ((p.knockback ?? 1.5) * 0.1) / ((enemy as any).mass ?? 1);
            enemy.pos.x += p.dirX * knockbackDist;
            enemy.pos.z += p.dirZ * knockbackDist;
            if ((enemy as any).stunDelay !== undefined) {
              (enemy as any).stunTimer = (enemy as any).stunDelay;
            }

            // Blood splatters & particles
            this.bloodCanvas.addSplatter(enemy.pos.x, enemy.pos.z, 0.9, 8);
            this.particlePool.spawnBurst(p.x, p.z, 10, 0x8b0000, 4.5);
            this.damageNumberPool.spawn(p.x, p.z, p.damage, false);

            this.projectilePool.recycle(p);
            bulletHit = true;
            break;
          }
        }
        if (bulletHit) continue;

        // 1b. Bullet vs Players (Friendly Fire)
        if (this.friendlyFire && this.isCoop && this.player2) {
          const players = [this.player, this.player2];
          const src = (p as any).sourcePlayer;
          for (let k = 0; k < players.length; k++) {
            const pl = players[k];
            if (!pl || pl.hp <= 0 || pl === src) continue;
            const dist = Math.hypot(p.x - pl.pos.x, p.z - pl.pos.z);
            if (dist <= p.radius + pl.radius) {
              pl.takeDamage(p.damage, p.dirX, p.dirZ);
              this.bloodCanvas.addSplatter(pl.pos.x, pl.pos.z, 0.9, 8);
              this.particlePool.spawnBurst(p.x, p.z, 10, 0x8b0000, 4.5);
              this.damageNumberPool.spawn(p.x, p.z, p.damage, false);
              this.projectilePool.recycle(p);
              bulletHit = true;
              break;
            }
          }
        }
        if (bulletHit) continue;

        // 2. Bullet vs Barrels
        for (let j = 0; j < this.barrels.length; j++) {
          const b = this.barrels[j];
          if (!b.alive || b.exploded) continue;

          const dist = Math.hypot(p.x - b.pos.x, p.z - b.pos.z);
          const bRad = (b as any).physicalRadius ?? 0.6;
          if (dist <= p.radius + bRad) {
            b.takeDamage(p.damage, this.getExplosionContext());
            this.particlePool.spawnBurst(p.x, p.z, 6, 0xe74c3c, 3.5);
            this.projectilePool.recycle(p);
            bulletHit = true;
            break;
          }
        }
        if (bulletHit) continue;

        // 3. Bullet vs Fake Walls
        for (let j = 0; j < this.fakeWalls.length; j++) {
          const fw = this.fakeWalls[j];
          if (!fw.alive) continue;

          const box = fw.getAABB();
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            fw.takeDamage(p.damage);
            this.particlePool.spawnBurst(p.x, p.z, 6, 0x8d6e63, 3.0);
            this.projectilePool.recycle(p);
            bulletHit = true;
            break;
          }
        }
        if (bulletHit) continue;

        // 4. Bullet vs Static Walls
        for (let j = 0; j < obstacles.length; j++) {
          const box = obstacles[j];
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            this.particlePool.spawnBurst(p.x, p.z, 4, 0xcccccc, 2.5);
            this.projectilePool.recycle(p);
            break;
          }
        }
      } else if (p.type === 'rocket') {
        let rocketDetonated = false;

        // Check vs Enemies
        for (let j = 0; j < enemies.length; j++) {
          const enemy = enemies[j];
          if (!enemy.alive) continue;
          const dist = Math.hypot(p.x - enemy.pos.x, p.z - enemy.pos.z);
          if (dist <= p.radius + enemy.radius) {
            this.handleProjectileDetonate(p);
            this.projectilePool.recycle(p);
            rocketDetonated = true;
            break;
          }
        }
        if (rocketDetonated) continue;

        // Check vs other player (Friendly Fire)
        if (this.friendlyFire && this.isCoop && this.player2) {
          const players = [this.player, this.player2];
          const src = (p as any).sourcePlayer;
          for (let k = 0; k < players.length; k++) {
            const pl = players[k];
            if (!pl || pl.hp <= 0 || pl === src) continue;
            const dist = Math.hypot(p.x - pl.pos.x, p.z - pl.pos.z);
            if (dist <= p.radius + pl.radius) {
              this.handleProjectileDetonate(p);
              this.projectilePool.recycle(p);
              rocketDetonated = true;
              break;
            }
          }
        }
        if (rocketDetonated) continue;

        // Check vs Barrels
        for (let j = 0; j < this.barrels.length; j++) {
          const b = this.barrels[j];
          if (!b.alive || b.exploded) continue;
          const dist = Math.hypot(p.x - b.pos.x, p.z - b.pos.z);
          const bRad = (b as any).physicalRadius ?? 0.6;
          if (dist <= p.radius + bRad) {
            this.handleProjectileDetonate(p);
            this.projectilePool.recycle(p);
            rocketDetonated = true;
            break;
          }
        }
        if (rocketDetonated) continue;

        // Check vs Fake Walls
        for (let j = 0; j < this.fakeWalls.length; j++) {
          const fw = this.fakeWalls[j];
          if (!fw.alive) continue;
          const box = fw.getAABB();
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            this.handleProjectileDetonate(p);
            this.projectilePool.recycle(p);
            rocketDetonated = true;
            break;
          }
        }
        if (rocketDetonated) continue;

        // Check vs Static Walls
        for (let j = 0; j < obstacles.length; j++) {
          const box = obstacles[j];
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            this.handleProjectileDetonate(p);
            this.projectilePool.recycle(p);
            break;
          }
        }
      } else if (p.type === 'fireball') {
        let fireballHit = false;

        // Fireball vs Barrels
        for (let j = 0; j < this.barrels.length; j++) {
          const b = this.barrels[j];
          if (!b.alive || b.exploded) continue;
          const dist = Math.hypot(p.x - b.pos.x, p.z - b.pos.z);
          const bRad = (b as any).physicalRadius ?? 0.6;
          if (dist <= p.radius + bRad) {
            b.takeDamage(p.damage, this.getExplosionContext());
            this.particlePool.spawnBurst(p.x, p.z, 12, 0xe67e22, 4.0);
            this.projectilePool.recycle(p);
            fireballHit = true;
            break;
          }
        }
        if (fireballHit) continue;

        // Fireball vs Fake Walls
        for (let j = 0; j < this.fakeWalls.length; j++) {
          const fw = this.fakeWalls[j];
          if (!fw.alive) continue;
          const box = fw.getAABB();
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            fw.takeDamage(p.damage);
            this.particlePool.spawnBurst(p.x, p.z, 12, 0xe67e22, 4.0);
            this.projectilePool.recycle(p);
            fireballHit = true;
            break;
          }
        }
        if (fireballHit) continue;

        // Fireball vs Static Walls & Pillars
        for (let j = 0; j < obstacles.length; j++) {
          const box = obstacles[j];
          if (p.x >= box.minX && p.x <= box.maxX && p.z >= box.minZ && p.z <= box.maxZ) {
            this.particlePool.spawnBurst(p.x, p.z, 8, 0xe67e22, 3.0);
            this.audioManager.playFireballFizzle();
            this.projectilePool.recycle(p);
            break;
          }
        }
      }
    }
  }

  /**
   * Detonation on fuse expiry (grenades) or impact.
   */
  private handleProjectileDetonate(p: Projectile): void {
    const sourcePlayer = (p as any).sourcePlayer;
    if (p.type === 'grenade') {
      const radius = this.weaponInventory.getEffectiveBlastRadius('grenade');
      if (sourcePlayer !== undefined) {
        this.detonateExplosion(p.x, p.z, radius, p.damage, sourcePlayer);
      } else {
        this.detonateExplosion(p.x, p.z, radius, p.damage);
      }
      if (this.weaponInventory.hasClusterExplode('grenade')) {
        const offset = 1.5;
        const subDamage = Math.round(p.damage * 0.5);
        const subRadius = radius * 0.75;
        if (sourcePlayer !== undefined) {
          this.dealSplashDamage(p.x + offset, p.z, subDamage, subRadius, sourcePlayer);
          this.dealSplashDamage(p.x - offset, p.z, subDamage, subRadius, sourcePlayer);
          this.dealSplashDamage(p.x, p.z + offset, subDamage, subRadius, sourcePlayer);
          this.dealSplashDamage(p.x, p.z - offset, subDamage, subRadius, sourcePlayer);
        } else {
          this.dealSplashDamage(p.x + offset, p.z, subDamage, subRadius);
          this.dealSplashDamage(p.x - offset, p.z, subDamage, subRadius);
          this.dealSplashDamage(p.x, p.z + offset, subDamage, subRadius);
          this.dealSplashDamage(p.x, p.z - offset, subDamage, subRadius);
        }
      }
      if (this.weaponInventory.hasBigBang('grenade')) {
        this.triggerMultiExplosionRing(p.x, p.z, p.damage, radius, this.weaponInventory.hasBiggerBang('grenade'));
      }
    } else if (p.type === 'rocket') {
      const radius = this.weaponInventory.getEffectiveBlastRadius('rocket');
      if (sourcePlayer !== undefined) {
        this.detonateExplosion(p.x, p.z, radius, p.damage, sourcePlayer);
      } else {
        this.detonateExplosion(p.x, p.z, radius, p.damage);
      }
      if (this.weaponInventory.hasBigBang('rocket')) {
        this.triggerMultiExplosionRing(p.x, p.z, p.damage, radius, this.weaponInventory.hasBiggerBang('rocket'));
      }
    }
  }

  public triggerMultiExplosionRing(
    x: number,
    z: number,
    damage: number,
    radius: number,
    isBiggerBang: boolean
  ): void {
    const subs = createExplosionRing(x, z, damage, radius, isBiggerBang);
    this.pendingSubExplosions.push(...subs);
  }

  /**
   * Radial explosion centered at (x, z): damages enemies, player, props, creates blast particles.
   */
  public detonateExplosion(
    x: number,
    z: number,
    radius: number,
    damage: number,
    sourcePlayer?: Player
  ): void {
    detonateExplosion(x, z, radius, damage, this.getExplosionContext(sourcePlayer));
    this.triggerShake(0.35, 0.4);
  }

  public getExplosionContext(sourcePlayer?: Player): ExplosionContext {
    return {
      enemies: this.enemyManager.enemies,
      player: this.player,
      player2: this.player2 ?? undefined,
      players: this.isCoop && this.player2 ? [this.player, this.player2] : [this.player],
      sourcePlayer: sourcePlayer,
      friendlyFire: this.friendlyFire,
      barrels: this.barrels,
      fakeWalls: this.fakeWalls,
      particlePool: this.particlePool,
      bloodCanvas: this.bloodCanvas,
      audio: this.audioManager,
      audioManager: this.audioManager,
      onExplosionRing: (x, z, damage, radius, isBigger) => {
        this.triggerMultiExplosionRing(x, z, damage, radius, isBigger);
      },
    };
  }

  private playWeaponAudio(canonical: string): void {
    switch (canonical) {
      case 'pistol':
        this.audioManager.playPistol();
        break;
      case 'uzi':
        this.audioManager.playUzi();
        break;
      case 'shotgun':
        this.audioManager.playShotgun();
        break;
      case 'rocket':
      case 'grenade':
        this.audioManager.playPistol();
        break;
      case 'barrel':
      case 'fakewall':
      case 'claymore':
      case 'chargepack':
        this.audioManager.playPickup();
        break;
      case 'railgun':
        this.audioManager.playRailgunLaser();
        break;
    }
  }

  public handleFiring(dt: number): boolean {
    let anyFired = false;

    // 1. Player 1 Firing
    if (!this.detonatedThisPress && !this.player.isInputLocked) {
      this.fireContext.projectilePool = this.projectilePool;
      this.fireContext.scene = this.sceneManager.scene;
      this.fireContext.obstacles = this.obstacles;
      this.fireContext.barrels = this.barrels;
      this.fireContext.fakeWalls = this.fakeWalls;
      this.fireContext.enemies = this.enemyManager.enemies;
      this.fireContext.player = this.player;
      this.fireContext.shooter = this.player;
      this.fireContext.friendlyFire = this.friendlyFire;
      this.fireContext.players = this.isCoop && this.player2 ? [this.player, this.player2] : [this.player];
      this.fireContext.particlePool = this.particlePool;
      this.fireContext.damageNumberPool = this.damageNumberPool;
      this.fireContext.bloodCanvas = this.bloodCanvas;
      this.fireContext.claymores = this.activeClaymores;
      this.fireContext.chargePacks = this.activeChargePacks;
      this.fireContext.railgun = this.railgunBeam;
      this.fireContext.audio = this.audioManager;
      this.fireContext.audioManager = this.audioManager;

      const didFire = this.weaponInventory.update(
        dt,
        this.inputManager,
        this.player.pos,
        this.player.rotationAngle,
        this.fireContext,
        1,
        this.isCoop
      );

      if (didFire) {
        anyFired = true;
        this.playWeaponAudio(this.weaponInventory.getActiveWeaponId());
      }
    }

    // 2. Player 2 Firing (Co-op)
    if (this.isCoop && this.player2 && this.weaponInventory2 && !this.player2.isInputLocked) {
      if (!this.fireContext2) {
        this.fireContext2 = { ...this.fireContext };
      }
      this.fireContext2.projectilePool = this.projectilePool;
      this.fireContext2.scene = this.sceneManager.scene;
      this.fireContext2.obstacles = this.obstacles;
      this.fireContext2.barrels = this.barrels;
      this.fireContext2.fakeWalls = this.fakeWalls;
      this.fireContext2.enemies = this.enemyManager.enemies;
      this.fireContext2.player = this.player2;
      this.fireContext2.shooter = this.player2;
      this.fireContext2.friendlyFire = this.friendlyFire;
      this.fireContext2.players = [this.player, this.player2];
      this.fireContext2.particlePool = this.particlePool;
      this.fireContext2.damageNumberPool = this.damageNumberPool;
      this.fireContext2.bloodCanvas = this.bloodCanvas;
      this.fireContext2.claymores = this.activeClaymores;
      this.fireContext2.chargePacks = this.activeChargePacks;
      this.fireContext2.railgun = this.railgunBeam;
      this.fireContext2.audio = this.audioManager;
      this.fireContext2.audioManager = this.audioManager;

      const didFire2 = this.weaponInventory2.update(
        dt,
        this.inputManager,
        this.player2.pos,
        this.player2.rotationAngle,
        this.fireContext2,
        2,
        true
      );

      if (didFire2) {
        anyFired = true;
        this.playWeaponAudio(this.weaponInventory2.getActiveWeaponId());
      }
    }

    return anyFired;
  }

  public dealSplashDamage(x: number, z: number, damage: number, radius: number, sourcePlayer?: Player): void {
    detonateExplosion(x, z, radius, damage, this.getExplosionContext(sourcePlayer));
    this.particlePool.spawnBurst(x, z, 20, 0xff4500, 5.0, 0.4);
    this.audioManager.playExplosion();
    this.triggerShake(0.35, 0.4);
  }

  public handleClaymoreExplosion(claymore: Claymore): void {
    if ((claymore as any)._handledExplosion) return;
    (claymore as any)._handledExplosion = true;
    const sourcePlayer = (claymore as any).sourcePlayer;
    this.dealSplashDamage(claymore.pos.x, claymore.pos.z, claymore.damage, claymore.radius, sourcePlayer);
    if (claymore.hasCluster) {
      const offset = 1.5;
      const subDmg = claymore.damage * 0.5;
      const subRad = claymore.radius * 0.6;
      this.dealSplashDamage(claymore.pos.x + offset, claymore.pos.z, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(claymore.pos.x - offset, claymore.pos.z, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(claymore.pos.x, claymore.pos.z + offset, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(claymore.pos.x, claymore.pos.z - offset, subDmg, subRad, sourcePlayer);
    }
    if (claymore.hasBigBang || this.weaponInventory.hasBigBang('claymore')) {
      const isBigger = claymore.hasBiggerBang || this.weaponInventory.hasBiggerBang('claymore');
      this.triggerMultiExplosionRing(claymore.pos.x, claymore.pos.z, claymore.damage, claymore.radius, isBigger);
    }
  }

  public handleChargePackExplosion(chargePack: ChargePack): void {
    if ((chargePack as any)._handledExplosion) return;
    (chargePack as any)._handledExplosion = true;
    const sourcePlayer = (chargePack as any).sourcePlayer;
    this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z, chargePack.damage, chargePack.radius, sourcePlayer);
    if (chargePack.hasCluster) {
      const offset = 1.8;
      const subDmg = chargePack.damage * 0.5;
      const subRad = chargePack.radius * 0.6;
      this.dealSplashDamage(chargePack.pos.x + offset, chargePack.pos.z, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(chargePack.pos.x - offset, chargePack.pos.z, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z + offset, subDmg, subRad, sourcePlayer);
      this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z - offset, subDmg, subRad, sourcePlayer);
    }
    if (chargePack.hasBigBang || this.weaponInventory.hasBigBang('chargepack')) {
      const isBigger = chargePack.hasBiggerBang || this.weaponInventory.hasBiggerBang('chargepack');
      this.triggerMultiExplosionRing(chargePack.pos.x, chargePack.pos.z, chargePack.damage, chargePack.radius, isBigger);
    }
  }

  public checkMilestones(): void {
    const milestones = this.weaponInventory.checkMilestones(this.comboSystem.multiplier);
    if (this.isCoop && this.weaponInventory2) {
      this.weaponInventory2.checkMilestones(this.comboSystem.multiplier);
    }
    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      if (milestone.type === 'unlock') {
        this.hud.showMilestoneUnlock(milestone.name);
        this.hud.showUpgradeToast(milestone.name, `UNLOCKED AT x${milestone.multiplier}`, true);
        this.audioManager.playUpgradeFanfare();
      } else {
        this.hud.showUpgradeToast(milestone.name, milestone.description, false);
        this.audioManager.playUpgradeFanfare();
      }
    }
  }

  /**
   * Handles enemy death: plays audio, updates combo multiplier, scores points,
   * unlocks milestone weapons, and rolls crate drop chance.
   */
  public handleEnemyKill(enemy: Enemy): void {
    this.audioManager.playZombieGroan();
    this.comboSystem.onKill();

    const isDevil = enemy instanceof Devil || enemy.radius > 0.8;
    const basePoints = isDevil ? 500 : 100;
    this.score += basePoints * this.comboSystem.multiplier;

    // Check weapon unlock and upgrade milestones
    this.checkMilestones();

    // Chance to drop crate on kill
    if (Math.random() < this.crateDropChance) {
      this.spawnCrate(enemy.pos.x, enemy.pos.z);
    }
  }

  public spawnCrate(x: number, z: number): Crate {
    const crate = new Crate(x, z, this.sceneManager.scene);
    this.crates.push(crate);
    return crate;
  }

  public triggerShake(intensity: number = 0.3, duration: number = 0.3): void {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  public toggleMute(): boolean {
    const muted = this.audioManager.toggleMute();
    this.hud.update(
      this.player.hp,
      this.player.maxHp,
      this.comboSystem.multiplier,
      this.comboSystem.decayProgress,
      this.weaponInventory.getActiveWeaponDef(),
      this.weaponInventory.getAmmo(),
      this.waveDirector.currentWave,
      this.score,
      muted,
      this.weaponInventory
    );
    return muted;
  }

  public selectWeaponSlot(slot: number): void {
    if (this.weaponInventory.isUnlocked(slot)) {
      this.weaponInventory.selectSlot(slot);
      this.inputManager.activeSlot = slot;
    }
  }

  public onPlayerDeath(): void {
    this.isGameOver = true;
    this.particlePool.spawnBurst(this.player.pos.x, this.player.pos.z, 35, 0x8b0000, 7.0);
    this.bloodCanvas.addSplatter(this.player.pos.x, this.player.pos.z, 2.0, 16);
    this.audioManager.playExplosion();

    this.gameOverModal.show(
      this.score,
      this.comboSystem.maxMultiplierAchieved,
      this.waveDirector.currentWave,
      () => this.restart()
    );
  }

  /**
   * Loads any Boxhead 2Play room by name or RoomData definition.
   */
  public loadRoom(roomOrName: string | RoomData): void {
    const room = typeof roomOrName === 'string' ? getRoom(roomOrName) : roomOrName;
    this.hasLoadedCustomRoom = true;
    this.mapManager.setRoom(room);
    this.sceneManager.loadRoom(room, this.mapManager.cellSize);

    // Clear Props
    for (let i = 0; i < this.barrels.length; i++) {
      const parent = this.barrels[i].mesh.parent;
      if (parent) parent.remove(this.barrels[i].mesh);
    }
    this.barrels = [];

    for (let i = 0; i < this.fakeWalls.length; i++) {
      const parent = this.fakeWalls[i].mesh.parent;
      if (parent) parent.remove(this.fakeWalls[i].mesh);
    }
    this.fakeWalls = [];

    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].destroy(this.sceneManager.scene);
    }
    this.crates = [];

    for (let i = 0; i < this.activeClaymores.length; i++) {
      const parent = this.activeClaymores[i].mesh.parent;
      if (parent) parent.remove(this.activeClaymores[i].mesh);
    }
    this.activeClaymores = [];

    for (let i = 0; i < this.activeChargePacks.length; i++) {
      const parent = this.activeChargePacks[i].mesh.parent;
      if (parent) parent.remove(this.activeChargePacks[i].mesh);
    }
    this.activeChargePacks = [];

    // Clear Enemies & Pools
    this.enemyManager.clear();
    this.projectilePool.clear();
    this.particlePool.clear();
    this.damageNumberPool.clear();
    this.bloodCanvas.clear();

    // Populate starting barrels & barricades from room
    this.barrels = this.mapManager.populateBarrels(this.sceneManager.scene);
    this.fakeWalls = this.mapManager.populateWalls(this.sceneManager.scene);
    this.enemyManager.fakeWalls = this.fakeWalls;
    this.fireContext.barrels = this.barrels;
    this.fireContext.fakeWalls = this.fakeWalls;

    // Reposition player at room player1 start location
    const start = this.mapManager.getPlayerStart(1);
    this.player.pos.x = start.x;
    this.player.pos.z = start.z;
    this.player.mesh.position.set(start.x, 0, start.z);
    this.player.rotationAngle = start.angle;
    this.player.mesh.rotation.y = start.angle;
    this.player.hp = this.player.maxHp;

    if (this.isCoop) {
      const start2 = this.mapManager.getPlayerStart(2);
      if (!this.player2) {
        this.player2 = new Player(start2.x, start2.z, 2, true);
      } else {
        this.player2.pos.x = start2.x;
        this.player2.pos.z = start2.z;
        this.player2.mesh.position.set(start2.x, 0, start2.z);
        this.player2.hp = this.player2.maxHp;
      }
      this.player2.rotationAngle = start2.angle;
      this.player2.mesh.rotation.y = start2.angle;
      if (this.player2.mesh.parent !== this.sceneManager.scene) {
        this.sceneManager.scene.add(this.player2.mesh);
      }
      this.cameraManager.updateCoop(this.player.pos, this.player2.pos);
    } else {
      this.cameraManager.update(this.player.pos);
    }

    // Setup enemy portals & arena bounds
    this.enemyManager.zombieSpawnPoints = this.mapManager.getZombieSpawnPoints();
    this.enemyManager.devilSpawnPoints = this.mapManager.getDevilSpawnPoints();
    this.enemyManager.setArenaSize(this.mapManager.getArenaWidth(), this.mapManager.getArenaDepth());

    // Update HUD room selector
    if (this.hud && typeof this.hud.setRoom === 'function') {
      this.hud.setRoom(room.name);
    }

    // Reset Wave Director, Combo & Score
    this.waveDirector.reset();
    this.comboSystem.reset();
    this.score = 0;
    this.isGameOver = false;
    this.gameOverModal.hide();
  }

  /**
   * Resets entire game session back to fresh starting state.
   */
  public restart(): void {
    this.isGameOver = false;
    this.score = 0;

    const preset = DIFFICULTY_PRESETS[this.difficulty] ?? DIFFICULTY_PRESETS.beginner;

    // Reset Player
    if (this.hasLoadedCustomRoom || this.isCoop) {
      const start = this.mapManager.getPlayerStart(1);
      this.player.pos.x = start.x;
      this.player.pos.z = start.z;
      this.player.mesh.position.set(start.x, 0, start.z);
      this.player.rotationAngle = start.angle;
      this.player.mesh.rotation.y = start.angle;
    } else {
      this.player.pos.x = 0;
      this.player.pos.z = 0;
      this.player.mesh.position.set(0, 0, 0);
    }
    this.player.hp = this.player.maxHp;
    if (this.player.mesh.parent !== this.sceneManager.scene) {
      this.sceneManager.attachPlayer(this.player);
    }

    if (this.isCoop) {
      const start2 = this.mapManager.getPlayerStart(2);
      if (!this.player2) {
        this.player2 = new Player(start2.x, start2.z, 2, true);
      } else {
        this.player2.pos.x = start2.x;
        this.player2.pos.z = start2.z;
        this.player2.mesh.position.set(start2.x, 0, start2.z);
        this.player2.hp = this.player2.maxHp;
      }
      this.player2.rotationAngle = start2.angle;
      this.player2.mesh.rotation.y = start2.angle;
      if (this.player2.mesh.parent !== this.sceneManager.scene) {
        this.sceneManager.scene.add(this.player2.mesh);
      }
      this.weaponInventory2 = new WeaponInventory();
      this.weaponInventory2.checkMilestones(preset.startMultiplier);
      this.cameraManager.updateCoop(this.player.pos, this.player2.pos);
    } else {
      this.cameraManager.update(this.player.pos);
    }

    // Reset Wave Director & Combo System
    this.waveDirector.devilsEnabled = this.devilsEnabled;
    this.waveDirector.startWave(preset.startLevel);
    this.comboSystem.reset(preset.startMultiplier);

    // Clear Enemies & Pools
    this.enemyManager.clear();
    this.projectilePool.clear();
    this.particlePool.clear();
    this.damageNumberPool.clear();
    this.bloodCanvas.clear();

    // Clear Props
    for (let i = 0; i < this.barrels.length; i++) {
      const parent = this.barrels[i].mesh.parent;
      if (parent) {
        parent.remove(this.barrels[i].mesh);
      }
    }
    this.barrels = [];

    for (let i = 0; i < this.fakeWalls.length; i++) {
      const parent = this.fakeWalls[i].mesh.parent;
      if (parent) {
        parent.remove(this.fakeWalls[i].mesh);
      }
    }
    this.fakeWalls = [];

    if (this.hasLoadedCustomRoom) {
      this.barrels = this.mapManager.populateBarrels(this.sceneManager.scene);
      this.fakeWalls = this.mapManager.populateWalls(this.sceneManager.scene);
      this.enemyManager.fakeWalls = this.fakeWalls;
      this.fireContext.barrels = this.barrels;
      this.fireContext.fakeWalls = this.fakeWalls;
    }

    for (let i = 0; i < this.activeClaymores.length; i++) {
      const parent = this.activeClaymores[i].mesh.parent;
      if (parent) {
        parent.remove(this.activeClaymores[i].mesh);
      }
    }
    this.activeClaymores = [];

    for (let i = 0; i < this.activeChargePacks.length; i++) {
      const parent = this.activeChargePacks[i].mesh.parent;
      if (parent) {
        parent.remove(this.activeChargePacks[i].mesh);
      }
    }
    this.activeChargePacks = [];

    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].destroy(this.sceneManager.scene);
    }
    this.crates = [];

    // Reset Inventory (Starts with Pistol unlocked, then applies preset milestones)
    this.weaponInventory = new WeaponInventory();
    this.weaponInventory.checkMilestones(preset.startMultiplier);
    this.hud.inventory = this.weaponInventory;
    this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
    this.detonatedThisPress = false;
    this.prevMouseDownForDetonator = false;
    this.prevSpaceDown = false;

    // Hide Modal & Update HUD
    this.gameOverModal.hide();
    this.hud.setDifficulty?.(this.difficulty);
    this.hud.setDevilsEnabled?.(this.devilsEnabled);
    this.hud.update(
      this.player.hp,
      this.player.maxHp,
      this.comboSystem.multiplier,
      this.comboSystem.decayProgress,
      this.weaponInventory.getActiveWeaponDef(),
      -1,
      this.waveDirector.currentWave,
      this.score,
      this.audioManager.isMuted,
      this.weaponInventory
    );
  }

  public setDifficulty(difficulty: DifficultyLevel): void {
    this.difficulty = difficulty;
    this.applyDifficultyPreset(difficulty);
  }

  public applyDifficultyPreset(difficulty: DifficultyLevel): void {
    const preset = DIFFICULTY_PRESETS[difficulty];
    if (!preset) return;

    this.waveDirector.startWave(preset.startLevel);
    this.comboSystem.setMultiplier(preset.startMultiplier);
    this.checkMilestones();

    this.hud.setDifficulty?.(difficulty);
    this.hud.update(
      this.player.hp,
      this.player.maxHp,
      this.comboSystem.multiplier,
      this.comboSystem.decayProgress,
      this.weaponInventory.getActiveWeaponDef(),
      this.weaponInventory.getAmmo(),
      this.waveDirector.currentWave,
      this.score,
      this.audioManager.isMuted,
      this.weaponInventory
    );
  }

  public setDevilsEnabled(enabled: boolean): void {
    this.devilsEnabled = enabled;
    this.waveDirector.devilsEnabled = enabled;
    this.hud.setDevilsEnabled?.(enabled);
  }

  public setCoop(enabled: boolean): void {
    this.isCoop = enabled;
    if (this.hud && typeof this.hud.setCoop === 'function') {
      this.hud.setCoop(enabled);
    }
    if (enabled) {
      const start1 = this.mapManager.getPlayerStart(1);
      this.player.pos.x = start1.x;
      this.player.pos.z = start1.z;
      this.player.mesh.position.set(start1.x, 0, start1.z);
      this.player.rotationAngle = start1.angle;
      this.player.mesh.rotation.y = start1.angle;

      const start2 = this.mapManager.getPlayerStart(2);
      if (!this.player2) {
        this.player2 = new Player(start2.x, start2.z, 2, true);
        this.player2.rotationAngle = start2.angle;
        this.player2.mesh.rotation.y = start2.angle;
      } else {
        this.player2.pos.x = start2.x;
        this.player2.pos.z = start2.z;
        this.player2.mesh.position.set(start2.x, 0, start2.z);
        this.player2.rotationAngle = start2.angle;
        this.player2.mesh.rotation.y = start2.angle;
        this.player2.hp = this.player2.maxHp;
      }
      this.player.isCoop = true;
      this.player2.isCoop = true;
      if (this.player2.mesh.parent !== this.sceneManager.scene) {
        this.sceneManager.scene.add(this.player2.mesh);
      }
      if (!this.weaponInventory2) {
        this.weaponInventory2 = new WeaponInventory();
        const preset = DIFFICULTY_PRESETS[this.difficulty] ?? DIFFICULTY_PRESETS.beginner;
        this.weaponInventory2.checkMilestones(preset.startMultiplier);
      }
      if (this.fireContext) {
        this.fireContext.players = [this.player, this.player2];
      }
      this.cameraManager.updateCoop(this.player.pos, this.player2.pos);
    } else {
      this.player.isCoop = false;
      if (this.player2) {
        this.player2.isCoop = false;
        if (this.player2.mesh.parent) {
          this.player2.mesh.parent.remove(this.player2.mesh);
        }
      }
      if (this.fireContext) {
        this.fireContext.players = [this.player];
      }
      this.cameraManager.update(this.player.pos);
    }
  }

  public setFriendlyFire(enabled: boolean): void {
    this.friendlyFire = enabled;
    if (this.fireContext) {
      this.fireContext.friendlyFire = enabled;
    }
  }

  public keepDistance(maxDistance: number = 20): void {
    if (this.isCoop && this.player2) {
      this.cameraManager.keepDistance(this.player, this.player2, maxDistance);
    }
  }

  public KeepDistance(maxDistance: number = 20): void {
    this.keepDistance(maxDistance);
  }

  public restartGame(): void {
    this.restart();
  }

  public render(): void {
    this.sceneManager.render(this.cameraManager.camera);
  }

  public dispose(): void {
    this.stop();
    this.hud.dispose();
    this.gameOverModal.dispose();
    this.inputManager.dispose();
    this.bloodCanvas.dispose();

    if (typeof window !== 'undefined' && this.boundResizeHandler) {
      window.removeEventListener('resize', this.boundResizeHandler);
      this.boundResizeHandler = undefined;
    }
  }
}
