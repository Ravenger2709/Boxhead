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
import { WeaponId, WEAPONS } from '../weapons/WeaponTypes';
import { ComboSystem } from '../core/ComboSystem';
import { WaveDirector } from '../core/WaveDirector';
import { AudioManager, audioManager } from '../core/Audio';
import { Barrel, detonateExplosion, ExplosionContext } from '../entities/Barrel';
import { FakeWall } from '../entities/FakeWall';
import { Crate } from '../entities/Crate';
import { HUD } from '../ui/HUD';
import { GameOverModal } from '../ui/GameOverModal';
import {
  AABB,
  DEVIL_FIREBALL_DAMAGE,
  DEVIL_FIREBALL_SPEED,
} from '../core/Constants';

export interface GameOptions {
  canvas?: HTMLCanvasElement;
  container?: HTMLElement | null;
  audioContext?: AudioContext;
  autoStart?: boolean;
}

export class Game {
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

  public score: number = 0;
  public isGameOver: boolean = false;
  public isRunning: boolean = false;

  private obstacles: AABB[] = [];
  private fireContext: FireContext;

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

    let damageOverlay: HTMLElement | null = null;
    if (typeof document !== 'undefined') {
      damageOverlay = document.getElementById('damage-overlay');
    }
    this.damageNumberPool = new DamageNumberPool(damageOverlay);

    // 5. Player Entity
    this.player = new Player(0, 0);
    this.sceneManager.attachPlayer(this.player);
    this.cameraManager.update(this.player.pos);

    // 6. Gameplay Managers
    this.weaponInventory = new WeaponInventory();
    this.comboSystem = new ComboSystem();
    this.enemyManager = new EnemyManager(
      this.sceneManager.scene,
      this.projectilePool,
      undefined,
      this.particlePool
    );
    this.enemyManager.fakeWalls = this.fakeWalls;
    this.waveDirector = new WaveDirector();

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
    };

    // 7. UI Components
    this.hud = new HUD({
      container,
      onToggleMute: () => this.toggleMute(),
      onSelectWeapon: (slot) => this.selectWeaponSlot(slot),
    });

    this.gameOverModal = new GameOverModal({
      container,
    });

    // 8. Wire Subsystem Callbacks
    this.initCallbacks();

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
      this.spawnCrate((Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 5);
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

    // 6. Update Player Movement & Collision
    this.player.update(dt, this.inputManager, this.obstacles);

    // 7. Player Weapon Firing & Prop Placement
    this.fireContext.projectilePool = this.projectilePool;
    this.fireContext.scene = this.sceneManager.scene;
    this.fireContext.obstacles = this.obstacles;
    this.fireContext.barrels = this.barrels;
    this.fireContext.fakeWalls = this.fakeWalls;
    this.fireContext.enemies = this.enemyManager.enemies;
    this.fireContext.player = this.player;
    this.fireContext.particlePool = this.particlePool;
    this.fireContext.bloodCanvas = this.bloodCanvas;

    const didFire = this.weaponInventory.update(
      dt,
      this.inputManager,
      this.player.pos,
      this.player.rotationAngle,
      this.fireContext
    );

    if (didFire) {
      const activeDef = this.weaponInventory.getActiveWeaponDef();
      switch (activeDef.id) {
        case WeaponId.Pistol:
          this.audioManager.playPistol();
          break;
        case WeaponId.Uzi:
          this.audioManager.playUzi();
          break;
        case WeaponId.Shotgun:
          this.audioManager.playShotgun();
          break;
        case WeaponId.RocketLauncher:
          this.audioManager.playPistol();
          break;
        case WeaponId.Grenade:
          this.audioManager.playPistol();
          break;
        case WeaponId.Barrel:
        case WeaponId.FakeWall:
          this.audioManager.playPickup();
          break;
      }
    }

    // 8. Update Projectile Physics & Collisions (BEFORE enemy update so deaths are resolved in same frame!)
    this.projectilePool.update(dt, (p: Projectile) => {
      this.handleProjectileDetonate(p);
    });
    this.handleProjectileCollisions();

    // 9. Update Wave Director (Spawns enemies)
    this.waveDirector.update(dt, this.enemyManager);

    // 10. Update Enemy Manager (AI Steering, contact damage to player, onEnemyKilled callbacks)
    this.enemyManager.update(dt, this.player, this.obstacles, this.fakeWalls, this.particlePool);

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
      const collected = crate.update(dt, this.player, this.weaponInventory, {
        particlePool: this.particlePool,
        audio: this.audioManager,
      });
      if (collected || crate.collected) {
        this.crates.splice(i, 1);
      }
    }

    // 15. Update Visual Decal & Particle Pools
    this.particlePool.update(dt);
    this.damageNumberPool.update(dt, this.cameraManager.camera);
    this.sceneManager.update(dt);

    // 16. Camera Tracking with Screen Shake
    if (this.shakeTimer > 0) {
      const currentIntensity = this.shakeIntensity * (this.shakeTimer / 0.3);
      const shakeX = (Math.random() * 2 - 1) * currentIntensity;
      const shakeZ = (Math.random() * 2 - 1) * currentIntensity;
      this.cameraManager.update({
        x: this.player.pos.x + shakeX,
        z: this.player.pos.z + shakeZ,
      });
    } else {
      this.cameraManager.update(this.player.pos);
    }

    // 17. Check Player Death
    if (this.player.isDead && !this.isGameOver) {
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
            const knockbackDist = (p.knockback ?? 1.5) * 0.1;
            enemy.pos.x += p.dirX * knockbackDist;
            enemy.pos.z += p.dirZ * knockbackDist;

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
          if (dist <= p.radius + b.radius) {
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
            this.detonateExplosion(p.x, p.z, 4.0, p.damage);
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
          if (dist <= p.radius + b.radius) {
            this.detonateExplosion(p.x, p.z, 4.0, p.damage);
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
            this.detonateExplosion(p.x, p.z, 4.0, p.damage);
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
            this.detonateExplosion(p.x, p.z, 4.0, p.damage);
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
          if (dist <= p.radius + b.radius) {
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
      this.detonateExplosion(p.x, p.z, 4.5, p.damage);
    } else if (p.type === 'rocket') {
      this.detonateExplosion(p.x, p.z, 4.0, p.damage);
    }
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
    this.audioManager.playExplosion();
    this.triggerShake(0.35, 0.4);
  }

  public getExplosionContext(): ExplosionContext {
    return {
      enemies: this.enemyManager.enemies,
      player: this.player,
      barrels: this.barrels,
      fakeWalls: this.fakeWalls,
      particlePool: this.particlePool,
      bloodCanvas: this.bloodCanvas,
    };
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

    // Check weapon unlock milestones
    const newlyUnlocked = this.weaponInventory.unlockMilestone(this.comboSystem.multiplier);
    for (let i = 0; i < newlyUnlocked.length; i++) {
      const def = WEAPONS[newlyUnlocked[i]];
      if (def) {
        this.hud.showMilestoneUnlock(def.name);
      }
    }

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
   * Resets entire game session back to fresh starting state.
   */
  public restart(): void {
    this.isGameOver = false;
    this.score = 0;

    // Reset Player
    this.player.pos.x = 0;
    this.player.pos.z = 0;
    this.player.hp = this.player.maxHp;
    this.player.mesh.position.set(0, 0, 0);
    if (this.player.mesh.parent !== this.sceneManager.scene) {
      this.sceneManager.attachPlayer(this.player);
    }

    // Reset Wave Director & Combo System
    this.waveDirector.reset();
    this.comboSystem.reset();

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

    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].destroy(this.sceneManager.scene);
    }
    this.crates = [];

    // Reset Inventory (Starts with Pistol unlocked)
    this.weaponInventory = new WeaponInventory();
    this.inputManager.activeSlot = WeaponId.Pistol;

    // Hide Modal & Update HUD
    this.gameOverModal.hide();
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
