/**
 * Boxhead Combo Multiplier System
 *
 * Implements exponential tension combo mechanic:
 * - Multiplier starts at 1x
 * - Base decay duration: 3.5s
 * - Enemy kills add +1 multiplier and refresh decay timer to 3.5s
 * - Drain rate scales with current multiplier: drainRate = 1.0 + (multiplier * 0.05)
 * - Dropping to 0 timer decrements multiplier by 1 and resets timer to 3.5s
 * - At multiplier 1x, timer clamps at 0s
 * - Tracks max multiplier achieved in current session for scoring & unlocks
 */

export const COMBO_DECAY_TIME = 3.5;

export class ComboSystem {
  public multiplier: number = 1;
  public decayTimer: number = COMBO_DECAY_TIME;
  public maxMultiplierAchieved: number = 1;
  public readonly baseDecayTime: number = COMBO_DECAY_TIME;
  public onMultiplierChange?: (multiplier: number) => void;

  constructor(baseDecayTime: number = COMBO_DECAY_TIME) {
    this.baseDecayTime = baseDecayTime;
    this.decayTimer = baseDecayTime;
  }

  /**
   * Drain rate formula: drainRate = 1.0 + (multiplier * 0.05)
   * Higher multiplier drains exponentially faster to increase tension.
   */
  public get drainRate(): number {
    return 1.0 + this.multiplier * 0.05;
  }

  /**
   * Normalized decay progress (1.0 down to 0.0) for UI gauge rendering.
   */
  public get decayProgress(): number {
    if (this.baseDecayTime <= 0) return 0;
    return Math.max(0, Math.min(1.0, this.decayTimer / this.baseDecayTime));
  }

  /**
   * Called whenever an enemy is killed.
   * Increments multiplier, checks high water mark, and refreshes timer.
   */
  public onKill(): void {
    this.multiplier += 1;
    if (this.multiplier > this.maxMultiplierAchieved) {
      this.maxMultiplierAchieved = this.multiplier;
    }
    this.decayTimer = this.baseDecayTime;
    this.onMultiplierChange?.(this.multiplier);
  }

  /**
   * Updates decay timer with current drain rate.
   */
  public update(dt: number): void {
    if (dt <= 0) return;

    if (this.multiplier === 1 && this.decayTimer <= 0) {
      this.decayTimer = 0;
      return;
    }

    this.decayTimer -= dt * this.drainRate;

    if (this.decayTimer <= 0) {
      if (this.multiplier > 1) {
        this.multiplier -= 1;
        this.decayTimer = this.baseDecayTime;
        this.onMultiplierChange?.(this.multiplier);
      } else {
        this.decayTimer = 0;
      }
    }
  }

  /**
   * Resets combo system to starting state (1x multiplier, full timer).
   */
  public reset(): void {
    this.multiplier = 1;
    this.decayTimer = this.baseDecayTime;
    this.maxMultiplierAchieved = 1;
    this.onMultiplierChange?.(this.multiplier);
  }
}
