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
import { WeaponId } from '../weapons/WeaponTypes';
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
  GameMode,
  FragLimit,
  DEFAULT_FRAG_LIMIT,
  DEATHMATCH_RESPAWN_DELAY,
  DEATHMATCH_INVULNERABILITY_DURATION,
  DEATHMATCH_CRATE_RESPAWN_INTERVAL,
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
  gameMode?: GameMode;
  fragLimit?: FragLimit;
}

export class Game {
  public mapManager: MapManager;
  public hasLoadedCustomRoom: boolean = false;
  public sceneManager: SceneManager;
  public cameraManager: CameraManager;
  public inputManager: InputManager;
  public player: Player;
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
  public gameMode: GameMode = 'single';
  public fragLimit: FragLimit = DEFAULT_FRAG_LIMIT;
  public p1Frags: number = 0;
  public p2Frags: number = 0;
  public victoryMessage: string | null = null;
  public player2: Player | null = null;
  public weaponInventory2?: WeaponInventory;
  public fireContext2?: FireContext;
  public crateRespawnTimer: number = DEATHMATCH_CRATE_RESPAWN_INTERVAL;
  public crateRespawnInterval: number = DEATHMATCH_CRATE_RESPAWN_INTERVAL;
  public p1RespawnTimer: number = 0;
  public p2RespawnTimer: number = 0;
  public isP1Dead: boolean = false;
  public isP2Dead: boolean = false;
  private prevP2NextDown: boolean = false;
  private prevP2PrevDown: boolean = false;
  private prevP1NextDown: boolean = false;
  private prevP1PrevDown: boolean = false;

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
    this.gameMode = options.gameMode ?? 'single';
    this.fragLimit = options.fragLimit ?? DEFAULT_FRAG_LIMIT;

    this.player = new Player(0, 0);
    this.sceneManager.attachPlayer(this.player);
    this.cameraManager.update(this.player.pos);

    // 6. Gameplay Managers
    this.difficulty = options.difficulty ?? 'beginner';
    this.devilsEnabled = options.devilsEnabled !== undefined ? options.devilsEnabled : true;

    this.weaponInventory = new WeaponInventory();
    this.weaponInventory.fireKeyChecker = (keys, isMouseDown) => {
      if (this.gameMode === 'deathmatch') {
        return isMouseDown || keys.has('/') || keys.has('slash');
      }
      return isMouseDown || keys.has('/') || keys.has('slash') || keys.has(' ') || keys.has('space');
    };

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
      onSelectGameMode: (mode) => this.setGameMode(mode as GameMode),
      difficulty: this.difficulty,
      devilsEnabled: this.devilsEnabled,
      gameMode: this.gameMode,
      fragLimit: this.fragLimit,
    });

    this.gameOverModal = new GameOverModal({
      container,
    });

    if (this.gameMode === 'deathmatch') {
      this.initDeathMatch(this.fragLimit);
    }

    // Apply difficulty preset if non-default
    if (this.difficulty !== 'beginner') {
      this.applyDifficultyPreset(this.difficulty);
    }

    // 8. Wire Subsystem Callbacks
    this.initCallbacks();

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

    // 6. Update Player Movement & Collision & Weapon Cycling
    if (this.gameMode === 'deathmatch') {
      const p1Next = this.inputManager.keys.has('.') || this.inputManager.keys.has('period');
      const p1Prev = this.inputManager.keys.has(',') || this.inputManager.keys.has('comma');
      if (p1Next && !this.prevP1NextDown) {
        this.weaponInventory.nextWeapon();
        this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
      }
      if (p1Prev && !this.prevP1PrevDown) {
        this.weaponInventory.previousWeapon();
        this.inputManager.activeSlot = this.weaponInventory.activeWeaponId;
      }
      this.prevP1NextDown = p1Next;
      this.prevP1PrevDown = p1Prev;

      if (this.weaponInventory2) {
        const p2Next = this.inputManager.keys.has('e') || this.inputManager.keys.has('keye');
        const p2Prev = this.inputManager.keys.has('q') || this.inputManager.keys.has('keyq');
        if (p2Next && !this.prevP2NextDown) {
          this.weaponInventory2.nextWeapon();
        }
        if (p2Prev && !this.prevP2PrevDown) {
          this.weaponInventory2.previousWeapon();
        }
        this.prevP2NextDown = p2Next;
        this.prevP2PrevDown = p2Prev;
      }

      if (!this.isP1Dead && this.player.hp > 0) {
        this.player.update(dt, this.inputManager, this.obstacles);
      }
      if (this.player2 && !this.isP2Dead && this.player2.hp > 0) {
        this.player2.update(dt, this.inputManager, this.obstacles);
      }
    } else {
      this.player.update(dt, this.inputManager, this.obstacles);
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

    if (this.gameMode === 'deathmatch') {
      this.handleFiringPlayer2(dt);
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

    if (this.gameMode !== 'deathmatch') {
      // 12. Check Progression Milestones
      this.checkMilestones();
    }

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

    if (this.gameMode === 'deathmatch') {
      // Rapid crate respawns (every 10s)
      this.crateRespawnTimer -= dt;
      if (this.crateRespawnTimer <= 0) {
        this.crateRespawnTimer = DEATHMATCH_CRATE_RESPAWN_INTERVAL;
        this.spawnDeathMatchCrate();
      }
    } else {
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
        this.getExplosionContext()
      );

      // 11. Update Combo System (Decay timer)
      this.comboSystem.update(dt);
    }

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
      let collected = false;
      if (!this.isP1Dead && this.player.hp > 0) {
        collected = crate.update(dt, this.player, this.weaponInventory, {
          particlePool: this.particlePool,
          audio: this.audioManager,
        });
      }
      if (!collected && !crate.collected && this.gameMode === 'deathmatch' && this.player2 && this.weaponInventory2 && !this.isP2Dead && this.player2.hp > 0) {
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

    // 16. Camera Tracking with Screen Shake
    let targetPos: { x: number; z: number } = this.player.pos;
    if (this.gameMode === 'deathmatch' && this.player2) {
      if (this.isP1Dead && !this.isP2Dead) {
        targetPos = this.player2.pos;
      } else if (!this.isP1Dead && this.isP2Dead) {
        targetPos = this.player.pos;
      } else {
        targetPos = {
          x: (this.player.pos.x + this.player2.pos.x) * 0.5,
          z: (this.player.pos.z + this.player2.pos.z) * 0.5,
        };
      }
    }

    if (this.shakeTimer > 0) {
      const currentIntensity = this.shakeIntensity * (this.shakeTimer / 0.3);
      const shakeX = (Math.random() * 2 - 1) * currentIntensity;
      const shakeZ = (Math.random() * 2 - 1) * currentIntensity;
      this.cameraManager.update({
        x: targetPos.x + shakeX,
        z: targetPos.z + shakeZ,
      });
    } else {
      this.cameraManager.update(targetPos);
    }

    // 17. Check Player Death
    if (this.gameMode === 'deathmatch') {
      if ((this.player.isDead || this.player.hp <= 0) && !this.isP1Dead && !this.isGameOver) {
        this.handlePlayer1Death();
      }
      if (this.player2 && (this.player2.isDead || this.player2.hp <= 0) && !this.isP2Dead && !this.isGameOver) {
        this.handlePlayer2Death();
      }
      if (this.isP1Dead && !this.isGameOver) {
        this.p1RespawnTimer -= dt;
        if (this.p1RespawnTimer <= 0) {
          this.respawnPlayer(1);
        }
      }
      if (this.isP2Dead && !this.isGameOver) {
        this.p2RespawnTimer -= dt;
        if (this.p2RespawnTimer <= 0) {
          this.respawnPlayer(2);
        }
      }
    } else {
      if (this.player.isDead && !this.isGameOver) {
        this.onPlayerDeath();
      }
    }

    // 18. Synchronize HUD
    if (this.gameMode === 'deathmatch') {
      this.hud.updateDeathMatch(this.p1Frags, this.p2Frags, this.fragLimit);
    }
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

        // In deathmatch: check vs players
        if (this.gameMode === 'deathmatch') {
          const targetPlayers = [this.player, this.player2].filter(
            (tp): tp is Player => tp !== null && !tp.isDead && !tp.isInvulnerable
          );
          for (let j = 0; j < targetPlayers.length; j++) {
            const tp = targetPlayers[j];
            const dist = Math.hypot(p.x - tp.pos.x, p.z - tp.pos.z);
            if (dist <= p.radius + tp.radius) {
              tp.takeDamage(p.damage, p.dirX, p.dirZ);
              this.bloodCanvas.addSplatter(tp.pos.x, tp.pos.z, 0.9, 8);
              this.particlePool.spawnBurst(p.x, p.z, 10, 0x8b0000, 4.5);
              this.damageNumberPool.spawn(p.x, p.z, p.damage, false);
              this.projectilePool.recycle(p);
              bulletHit = true;
              break;
            }
          }
        }
        if (bulletHit) continue;

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

        // In deathmatch: check vs players
        if (this.gameMode === 'deathmatch') {
          const targetPlayers = [this.player, this.player2].filter(
            (tp): tp is Player => tp !== null && !tp.isDead && !tp.isInvulnerable
          );
          for (let j = 0; j < targetPlayers.length; j++) {
            const tp = targetPlayers[j];
            const dist = Math.hypot(p.x - tp.pos.x, p.z - tp.pos.z);
            if (dist <= p.radius + tp.radius) {
              this.handleProjectileDetonate(p);
              this.projectilePool.recycle(p);
              rocketDetonated = true;
              break;
            }
          }
        }
        if (rocketDetonated) continue;

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
    if (p.type === 'grenade') {
      const radius = this.weaponInventory.getEffectiveBlastRadius('grenade');
      this.detonateExplosion(p.x, p.z, radius, p.damage);
      if (this.weaponInventory.hasClusterExplode('grenade')) {
        const offset = 1.5;
        const subDamage = Math.round(p.damage * 0.5);
        const subRadius = radius * 0.75;
        this.dealSplashDamage(p.x + offset, p.z, subDamage, subRadius);
        this.dealSplashDamage(p.x - offset, p.z, subDamage, subRadius);
        this.dealSplashDamage(p.x, p.z + offset, subDamage, subRadius);
        this.dealSplashDamage(p.x, p.z - offset, subDamage, subRadius);
      }
      if (this.weaponInventory.hasBigBang('grenade')) {
        this.triggerMultiExplosionRing(p.x, p.z, p.damage, radius, this.weaponInventory.hasBiggerBang('grenade'));
      }
    } else if (p.type === 'rocket') {
      const radius = this.weaponInventory.getEffectiveBlastRadius('rocket');
      this.detonateExplosion(p.x, p.z, radius, p.damage);
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
    damage: number
  ): void {
    detonateExplosion(x, z, radius, damage, this.getExplosionContext());
    this.triggerShake(0.35, 0.4);
  }

  public getExplosionContext(): ExplosionContext {
    return {
      enemies: this.enemyManager.enemies,
      player: this.player,
      player2: this.player2 ?? undefined,
      players: [this.player, this.player2].filter(Boolean) as Player[],
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

  private playWeaponSound(canonical: WeaponId): void {
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
        this.audioManager.playPistol();
        break;
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
    if (this.detonatedThisPress) return false;
    if (this.player.isInputLocked || this.player.hp <= 0 || this.isP1Dead) return false;
    this.fireContext.projectilePool = this.projectilePool;
    this.fireContext.scene = this.sceneManager.scene;
    this.fireContext.obstacles = this.obstacles;
    this.fireContext.barrels = this.barrels;
    this.fireContext.fakeWalls = this.fakeWalls;
    this.fireContext.enemies = this.gameMode === 'deathmatch'
      ? (this.player2 ? [this.player2] : [])
      : this.enemyManager.enemies;
    this.fireContext.player = this.gameMode === 'deathmatch' ? this.player2 : this.player;
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
      this.fireContext
    );

    if (didFire) {
      this.playWeaponSound(this.weaponInventory.getActiveWeaponId());
    }

    return didFire;
  }

  public handleFiringPlayer2(dt: number): boolean {
    if (!this.player2 || !this.weaponInventory2 || !this.fireContext2) return false;
    if (this.player2.isInputLocked || this.player2.hp <= 0 || this.isP2Dead) return false;

    this.fireContext2.projectilePool = this.projectilePool;
    this.fireContext2.scene = this.sceneManager.scene;
    this.fireContext2.obstacles = this.obstacles;
    this.fireContext2.barrels = this.barrels;
    this.fireContext2.fakeWalls = this.fakeWalls;
    this.fireContext2.enemies = [this.player];
    this.fireContext2.player = this.player;
    this.fireContext2.particlePool = this.particlePool;
    this.fireContext2.damageNumberPool = this.damageNumberPool;
    this.fireContext2.bloodCanvas = this.bloodCanvas;
    this.fireContext2.claymores = this.activeClaymores;
    this.fireContext2.chargePacks = this.activeChargePacks;
    this.fireContext2.railgun = this.railgunBeam;
    this.fireContext2.audio = this.audioManager;
    this.fireContext2.audioManager = this.audioManager;

    const didFire = this.weaponInventory2.update(
      dt,
      this.inputManager,
      this.player2.pos,
      this.player2.rotationAngle,
      this.fireContext2
    );

    if (didFire) {
      this.playWeaponSound(this.weaponInventory2.getActiveWeaponId());
    }

    return didFire;
  }

  public dealSplashDamage(x: number, z: number, damage: number, radius: number): void {
    detonateExplosion(x, z, radius, damage, this.getExplosionContext());
    this.particlePool.spawnBurst(x, z, 20, 0xff4500, 5.0, 0.4);
    this.audioManager.playExplosion();
    this.triggerShake(0.35, 0.4);
  }

  public handleClaymoreExplosion(claymore: Claymore): void {
    if ((claymore as any)._handledExplosion) return;
    (claymore as any)._handledExplosion = true;
    this.dealSplashDamage(claymore.pos.x, claymore.pos.z, claymore.damage, claymore.radius);
    if (claymore.hasCluster) {
      const offset = 1.5;
      const subDmg = claymore.damage * 0.5;
      const subRad = claymore.radius * 0.6;
      this.dealSplashDamage(claymore.pos.x + offset, claymore.pos.z, subDmg, subRad);
      this.dealSplashDamage(claymore.pos.x - offset, claymore.pos.z, subDmg, subRad);
      this.dealSplashDamage(claymore.pos.x, claymore.pos.z + offset, subDmg, subRad);
      this.dealSplashDamage(claymore.pos.x, claymore.pos.z - offset, subDmg, subRad);
    }
    if (claymore.hasBigBang || this.weaponInventory.hasBigBang('claymore')) {
      const isBigger = claymore.hasBiggerBang || this.weaponInventory.hasBiggerBang('claymore');
      this.triggerMultiExplosionRing(claymore.pos.x, claymore.pos.z, claymore.damage, claymore.radius, isBigger);
    }
  }

  public handleChargePackExplosion(chargePack: ChargePack): void {
    if ((chargePack as any)._handledExplosion) return;
    (chargePack as any)._handledExplosion = true;
    this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z, chargePack.damage, chargePack.radius);
    if (chargePack.hasCluster) {
      const offset = 1.8;
      const subDmg = chargePack.damage * 0.5;
      const subRad = chargePack.radius * 0.6;
      this.dealSplashDamage(chargePack.pos.x + offset, chargePack.pos.z, subDmg, subRad);
      this.dealSplashDamage(chargePack.pos.x - offset, chargePack.pos.z, subDmg, subRad);
      this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z + offset, subDmg, subRad);
      this.dealSplashDamage(chargePack.pos.x, chargePack.pos.z - offset, subDmg, subRad);
    }
    if (chargePack.hasBigBang || this.weaponInventory.hasBigBang('chargepack')) {
      const isBigger = chargePack.hasBiggerBang || this.weaponInventory.hasBiggerBang('chargepack');
      this.triggerMultiExplosionRing(chargePack.pos.x, chargePack.pos.z, chargePack.damage, chargePack.radius, isBigger);
    }
  }

  public checkMilestones(): void {
    const milestones = this.weaponInventory.checkMilestones(this.comboSystem.multiplier);
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
    this.player.mesh.visible = true;
    this.player.invulnerableTimer = 0;
    this.cameraManager.update(this.player.pos);

    if (this.gameMode === 'deathmatch') {
      const p2Start = this.mapManager.getPlayerStart(2);
      if (!this.player2) {
        this.player2 = new Player(p2Start.x, p2Start.z, 2);
        this.sceneManager.scene.add(this.player2.mesh);
      } else {
        this.player2.pos.x = p2Start.x;
        this.player2.pos.z = p2Start.z;
        this.player2.mesh.position.set(p2Start.x, 0, p2Start.z);
        this.player2.hp = this.player2.maxHp;
        this.player2.mesh.visible = true;
        this.player2.invulnerableTimer = 0;
      }
      this.player2.rotationAngle = p2Start.angle;
      this.player2.mesh.rotation.y = p2Start.angle;
      this.player2.controlScheme = 'wasd';

      this.p1Frags = 0;
      this.p2Frags = 0;
      this.isP1Dead = false;
      this.isP2Dead = false;
      this.p1RespawnTimer = 0;
      this.p2RespawnTimer = 0;
      this.victoryMessage = null;
      this.crateRespawnTimer = DEATHMATCH_CRATE_RESPAWN_INTERVAL;

      // Spawn initial crates for deathmatch
      const cratePoints = this.mapManager.getCrateSpawnPoints();
      for (let i = 0; i < cratePoints.length; i++) {
        this.spawnCrate(cratePoints[i].x, cratePoints[i].z);
      }
      if (this.hud) {
        this.hud.setGameMode('deathmatch');
        this.hud.updateDeathMatch(0, 0, this.fragLimit);
      }
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
    this.victoryMessage = null;

    if (this.gameMode === 'deathmatch') {
      this.initDeathMatch(this.fragLimit);
      this.gameOverModal.hide();
      return;
    }

    // Reset Player
    if (this.hasLoadedCustomRoom) {
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
    this.cameraManager.update(this.player.pos);

    // Reset Wave Director & Combo System
    const preset = DIFFICULTY_PRESETS[this.difficulty] ?? DIFFICULTY_PRESETS.beginner;
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

  public initDeathMatch(fragLimit?: FragLimit): void {
    this.gameMode = 'deathmatch';
    if (fragLimit !== undefined) {
      this.fragLimit = fragLimit;
    }
    this.p1Frags = 0;
    this.p2Frags = 0;
    this.p1RespawnTimer = 0;
    this.p2RespawnTimer = 0;
    this.isP1Dead = false;
    this.isP2Dead = false;
    this.victoryMessage = null;
    this.isGameOver = false;
    this.crateRespawnTimer = DEATHMATCH_CRATE_RESPAWN_INTERVAL;

    // 1. Reposition Player 1 at player start 1
    const p1Start = this.mapManager.getPlayerStart(1);
    this.player.pos.x = p1Start.x;
    this.player.pos.z = p1Start.z;
    this.player.mesh.position.set(p1Start.x, 0, p1Start.z);
    this.player.rotationAngle = p1Start.angle;
    this.player.mesh.rotation.y = p1Start.angle;
    this.player.hp = this.player.maxHp;
    this.player.mesh.visible = true;
    this.player.invulnerableTimer = 0;
    this.player.controlScheme = 'arrows';

    // 2. Setup or reposition Player 2 at player start 2
    const p2Start = this.mapManager.getPlayerStart(2);
    if (!this.player2) {
      this.player2 = new Player(p2Start.x, p2Start.z, 2);
    } else {
      this.player2.pos.x = p2Start.x;
      this.player2.pos.z = p2Start.z;
      this.player2.hp = this.player2.maxHp;
    }
    this.player2.rotationAngle = p2Start.angle;
    this.player2.mesh.position.set(p2Start.x, 0, p2Start.z);
    this.player2.mesh.rotation.y = p2Start.angle;
    this.player2.controlScheme = 'wasd';
    this.player2.mesh.visible = true;
    this.player2.invulnerableTimer = 0;

    if (this.player2.mesh.parent !== this.sceneManager.scene) {
      this.sceneManager.scene.add(this.player2.mesh);
    }

    // 3. Setup inventories: milestone 200 unlocks all 10 weapons per Flash AS2
    this.weaponInventory.fireKeyChecker = (keys, isMouseDown) => {
      return isMouseDown || keys.has('/') || keys.has('slash');
    };
    this.weaponInventory.syncActiveSlotWithInput = true;
    this.weaponInventory.checkMilestones(200);
    this.weaponInventory.selectSlot(1);

    this.weaponInventory2 = new WeaponInventory();
    this.weaponInventory2.syncActiveSlotWithInput = false;
    this.weaponInventory2.fireKeyChecker = (keys) => keys.has(' ') || keys.has('space');
    this.weaponInventory2.checkMilestones(200);
    this.weaponInventory2.selectSlot(1);

    // 4. Setup FireContext for Player 2
    this.fireContext2 = {
      projectilePool: this.projectilePool,
      scene: this.sceneManager.scene,
      obstacles: this.obstacles,
      barrels: this.barrels,
      fakeWalls: this.fakeWalls,
      enemies: [this.player],
      player: this.player,
      particlePool: this.particlePool,
      damageNumberPool: this.damageNumberPool,
      bloodCanvas: this.bloodCanvas,
      claymores: this.activeClaymores,
      chargePacks: this.activeChargePacks,
      railgun: this.railgunBeam,
      audio: this.audioManager,
      audioManager: this.audioManager,
    };

    // 5. Clear wave director and active enemies
    this.enemyManager.clear();
    this.waveDirector.reset();

    // 6. Pre-spawn starting crates at room spawn points
    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].destroy(this.sceneManager.scene);
    }
    this.crates = [];
    const cratePoints = this.mapManager.getCrateSpawnPoints();
    for (let i = 0; i < cratePoints.length; i++) {
      this.spawnCrate(cratePoints[i].x, cratePoints[i].z);
    }

    // 7. Update HUD & Modal
    if (this.hud) {
      this.hud.setGameMode('deathmatch');
      this.hud.updateDeathMatch(0, 0, this.fragLimit);
    }
    this.gameOverModal?.hide();
  }

  public setGameMode(mode: GameMode, fragLimit?: FragLimit): void {
    if (mode === 'deathmatch') {
      this.initDeathMatch(fragLimit);
    } else {
      this.gameMode = mode;
      if (this.player2) {
        if (this.player2.mesh.parent) {
          this.player2.mesh.parent.remove(this.player2.mesh);
        }
        this.player2 = null;
        this.weaponInventory2 = undefined;
        this.fireContext2 = undefined;
      }
      this.player.controlScheme = 'all';
      this.weaponInventory.fireKeyChecker = (keys, isMouseDown) => {
        return isMouseDown || keys.has('/') || keys.has('slash') || keys.has(' ') || keys.has('space');
      };
      this.hud.setGameMode(mode);
      this.restart();
    }
  }

  public setFragLimit(limit: FragLimit): void {
    this.fragLimit = limit;
    this.hud.updateDeathMatch(this.p1Frags, this.p2Frags, this.fragLimit);
  }

  public spawnDeathMatchCrate(): Crate {
    const cratePoints = this.mapManager.getCrateSpawnPoints();
    if (cratePoints.length > 0) {
      const pt = cratePoints[Math.floor(Math.random() * cratePoints.length)];
      return this.spawnCrate(pt.x, pt.z);
    }
    const halfW = this.mapManager.getArenaWidth() / 2 - 2;
    const halfD = this.mapManager.getArenaDepth() / 2 - 2;
    const rx = (Math.random() * 2 - 1) * halfW;
    const rz = (Math.random() * 2 - 1) * halfD;
    return this.spawnCrate(rx, rz);
  }

  public handlePlayer1Death(): void {
    this.isP1Dead = true;
    this.p1RespawnTimer = DEATHMATCH_RESPAWN_DELAY;
    this.particlePool.spawnBurst(this.player.pos.x, this.player.pos.z, 35, 0x8b0000, 7.0);
    this.bloodCanvas.addSplatter(this.player.pos.x, this.player.pos.z, 2.0, 16);
    this.audioManager.playExplosion();
    this.player.mesh.visible = false;

    this.p2Frags += 1;
    this.hud.updateDeathMatch(this.p1Frags, this.p2Frags, this.fragLimit);

    if (this.p2Frags >= this.fragLimit) {
      this.triggerDeathMatchVictory(2);
    }
  }

  public handlePlayer2Death(): void {
    if (!this.player2) return;
    this.isP2Dead = true;
    this.p2RespawnTimer = DEATHMATCH_RESPAWN_DELAY;
    this.particlePool.spawnBurst(this.player2.pos.x, this.player2.pos.z, 35, 0x8b0000, 7.0);
    this.bloodCanvas.addSplatter(this.player2.pos.x, this.player2.pos.z, 2.0, 16);
    this.audioManager.playExplosion();
    this.player2.mesh.visible = false;

    this.p1Frags += 1;
    this.hud.updateDeathMatch(this.p1Frags, this.p2Frags, this.fragLimit);

    if (this.p1Frags >= this.fragLimit) {
      this.triggerDeathMatchVictory(1);
    }
  }

  public triggerDeathMatchVictory(winnerIndex: 1 | 2): void {
    this.isGameOver = true;
    this.victoryMessage = winnerIndex === 1 ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!';
    this.gameOverModal.show(
      this.score,
      this.comboSystem.maxMultiplierAchieved,
      this.waveDirector.currentWave,
      () => this.restart(),
      this.victoryMessage
    );
  }

  public respawnPlayer(playerIndex: 1 | 2): void {
    if (playerIndex === 1) {
      this.isP1Dead = false;
      const p1Start = this.mapManager.getPlayerStart(1);
      this.player.pos.x = p1Start.x;
      this.player.pos.z = p1Start.z;
      this.player.mesh.position.set(p1Start.x, 0, p1Start.z);
      this.player.rotationAngle = p1Start.angle;
      this.player.mesh.rotation.y = p1Start.angle;
      this.player.hp = this.player.maxHp;
      this.player.mesh.visible = true;
      this.player.invulnerableTimer = DEATHMATCH_INVULNERABILITY_DURATION;
    } else if (playerIndex === 2 && this.player2) {
      this.isP2Dead = false;
      const p2Start = this.mapManager.getPlayerStart(2);
      this.player2.pos.x = p2Start.x;
      this.player2.pos.z = p2Start.z;
      this.player2.mesh.position.set(p2Start.x, 0, p2Start.z);
      this.player2.rotationAngle = p2Start.angle;
      this.player2.mesh.rotation.y = p2Start.angle;
      this.player2.hp = this.player2.maxHp;
      this.player2.mesh.visible = true;
      this.player2.invulnerableTimer = DEATHMATCH_INVULNERABILITY_DURATION;
    }
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
