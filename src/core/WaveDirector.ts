import type { EnemyManager, Enemy } from '../entities/EnemyManager';

export interface WaveDirectorOptions {
  baseQuota?: number;
  quotaIncrement?: number;
  spawnInterval?: number;
  intermissionDuration?: number;
  startWave?: number;
}

export class WaveDirector {
  public currentWave: number = 1;
  public remainingToSpawn: number = 0;
  public activeEnemiesCount: number = 0;
  public isIntermission: boolean = false;
  public intermissionTimer: number = 0;

  public baseQuota: number = 10;
  public quotaIncrement: number = 5;
  public spawnInterval: number = 0.6;
  public intermissionDuration: number = 3.0;

  public spawnTimer: number = 0;
  private devilsSpawnedInWave: number = 0;
  private zombiesSpawnedInWave: number = 0;

  public onWaveStart?: (wave: number) => void;
  public onWaveComplete?: (wave: number) => void;
  public onEnemySpawn?: (enemy: Enemy, type: 'zombie' | 'devil') => void;

  constructor(options: WaveDirectorOptions = {}) {
    if (options.baseQuota !== undefined) this.baseQuota = options.baseQuota;
    if (options.quotaIncrement !== undefined) this.quotaIncrement = options.quotaIncrement;
    if (options.spawnInterval !== undefined) this.spawnInterval = options.spawnInterval;
    if (options.intermissionDuration !== undefined) this.intermissionDuration = options.intermissionDuration;

    const startWave = options.startWave ?? 1;
    this.startWave(startWave);
  }

  /**
   * Calculates total enemies to spawn for a given wave.
   * Escalates linearly: baseQuota + (wave - 1) * quotaIncrement
   */
  public calculateWaveQuota(wave: number): number {
    return this.baseQuota + Math.max(0, wave - 1) * this.quotaIncrement;
  }

  /**
   * Probability of spawning a Red Devil instead of a standard Zombie.
   * Waves 1-3: 0% (standard zombies only)
   * Wave 4+: scales up from 20% to 40% cap
   */
  public getDevilProbability(wave: number): number {
    if (wave < 4) return 0;
    return Math.min(0.40, 0.20 + (wave - 4) * 0.05);
  }

  /**
   * Starts a specified wave, resetting timers and calculating quota.
   */
  public startWave(wave: number): void {
    this.currentWave = wave;
    this.remainingToSpawn = this.calculateWaveQuota(wave);
    this.isIntermission = false;
    this.intermissionTimer = 0;
    this.spawnTimer = this.spawnInterval;
    this.devilsSpawnedInWave = 0;
    this.zombiesSpawnedInWave = 0;
    this.onWaveStart?.(this.currentWave);
  }

  /**
   * Core director update loop:
   * - Spawns enemies along the arena perimeter at configured interval
   * - Escalates to Red Devils starting at Wave 4
   * - Triggers 3.0s intermission when all quota is cleared and no enemies remain
   * - Advances to next wave upon intermission expiration
   */
  public update(dt: number, enemyManager: EnemyManager): void {
    if (dt <= 0) return;

    // Track active alive enemies without array allocation
    let aliveCount = 0;
    for (let i = 0; i < enemyManager.enemies.length; i++) {
      if (enemyManager.enemies[i].alive) aliveCount++;
    }
    this.activeEnemiesCount = aliveCount;

    // Handle intermission countdown
    if (this.isIntermission) {
      this.intermissionTimer -= dt;
      if (this.intermissionTimer <= 0) {
        this.isIntermission = false;
        this.intermissionTimer = 0;
        this.startWave(this.currentWave + 1);
      }
      return;
    }

    // Spawn quota
    if (this.remainingToSpawn > 0) {
      this.spawnTimer -= dt;
      while (this.spawnTimer <= 0 && this.remainingToSpawn > 0) {
        this.spawnTimer += this.spawnInterval;

        let enemyType: 'zombie' | 'devil' = 'zombie';
        if (this.currentWave >= 4) {
          const prob = this.getDevilProbability(this.currentWave);
          // Ensure both types get spawned deterministically across the wave
          if (this.devilsSpawnedInWave === 0 && this.remainingToSpawn <= 2) {
            enemyType = 'devil';
          } else if (this.zombiesSpawnedInWave === 0) {
            enemyType = 'zombie';
          } else {
            enemyType = Math.random() < prob ? 'devil' : 'zombie';
          }
        }

        if (enemyType === 'devil') {
          this.devilsSpawnedInWave++;
        } else {
          this.zombiesSpawnedInWave++;
        }

        const enemy = enemyManager.spawnAtPerimeter(enemyType);
        this.remainingToSpawn--;
        let spawnedAlive = 0;
        for (let j = 0; j < enemyManager.enemies.length; j++) {
          if (enemyManager.enemies[j].alive) spawnedAlive++;
        }
        this.activeEnemiesCount = spawnedAlive;
        this.onEnemySpawn?.(enemy, enemyType);
      }
    }

    // Check if entire wave has been defeated
    if (this.remainingToSpawn === 0 && this.activeEnemiesCount === 0) {
      this.isIntermission = true;
      this.intermissionTimer = this.intermissionDuration;
      this.onWaveComplete?.(this.currentWave);
    }
  }

  /**
   * Resets director to wave 1 starting state.
   */
  public reset(): void {
    this.startWave(1);
  }
}
