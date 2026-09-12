/**
 * Boxhead Combo Multiplier System
 *
 * Implements authentic Flash AS2 combo multiplier decay formula (from CUpgrades.as:607-611):
 * - Multiplier starts at 1x
 * - index = 101 - min(multiplier, 100)
 * - ticks = (Math.pow(index, 2.5) / 100000.0) * 72.0 + 3.0
 * - durationSeconds = ticks / 25.0 (25 fps in Flash, so at x1 = 3.0s, x25 = 1.48s/1.57s, x50 = 0.65s, x100 = 0.12s)
 * - Enemy kills add +1 multiplier and refresh decay timer to the duration for the new multiplier
 * - When timer expires: multiplier drops by 1 (if > 1) and timer resets to the duration for the new multiplier!
 * - At multiplier 1x, timer clamps at 0s
 * - Tracks max multiplier achieved in current session for scoring & unlocks
 */

export function calculateComboTicks(multiplier: number): number {
  const clamped = Math.min(Math.max(1, multiplier), 100);
  const index = 101 - clamped;
  return (Math.pow(index, 2.5) / 100000.0) * 72.0 + 3.0;
}

export function calculateComboDecayDuration(multiplier: number): number {
  return calculateComboTicks(multiplier) / 25.0;
}

export const COMBO_DECAY_TIME = calculateComboDecayDuration(1); // 3.0s

export class ComboSystem {
  public multiplier: number = 1;
  public decayTimer: number = COMBO_DECAY_TIME;
  public maxMultiplierAchieved: number = 1;
  public onMultiplierChange?: (multiplier: number) => void;

  constructor(initialMultiplier: number = 1) {
    this.multiplier = Math.max(1, initialMultiplier);
    this.decayTimer = calculateComboDecayDuration(this.multiplier);
    this.maxMultiplierAchieved = this.multiplier;
  }

  public get baseDecayTime(): number {
    return calculateComboDecayDuration(this.multiplier);
  }

  public get drainRate(): number {
    return 1.0;
  }

  /**
   * Normalized decay progress (1.0 down to 0.0) for UI gauge rendering.
   */
  public get decayProgress(): number {
    const total = calculateComboDecayDuration(this.multiplier);
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1.0, this.decayTimer / total));
  }

  /**
   * Sets multiplier directly (e.g. from difficulty preset).
   */
  public setMultiplier(multiplier: number): void {
    this.multiplier = Math.max(1, multiplier);
    if (this.multiplier > this.maxMultiplierAchieved) {
      this.maxMultiplierAchieved = this.multiplier;
    }
    this.decayTimer = calculateComboDecayDuration(this.multiplier);
    this.onMultiplierChange?.(this.multiplier);
  }

  /**
   * Called whenever an enemy is killed.
   * Increments multiplier, checks high water mark, and refreshes timer to duration for new multiplier.
   */
  public onKill(): void {
    this.multiplier += 1;
    if (this.multiplier > this.maxMultiplierAchieved) {
      this.maxMultiplierAchieved = this.multiplier;
    }
    this.decayTimer = calculateComboDecayDuration(this.multiplier);
    this.onMultiplierChange?.(this.multiplier);
  }

  /**
   * Updates decay timer with elapsed delta time dt.
   * When timer expires: multiplier drops by 1 (if > 1) and timer resets to the duration for the new multiplier!
   */
  public update(dt: number): void {
    if (dt <= 0) return;

    if (this.multiplier === 1 && this.decayTimer <= 0) {
      this.decayTimer = 0;
      return;
    }

    this.decayTimer -= dt;

    if (this.decayTimer <= 0) {
      if (this.multiplier > 1) {
        this.multiplier -= 1;
        this.decayTimer = calculateComboDecayDuration(this.multiplier);
        this.onMultiplierChange?.(this.multiplier);
      } else {
        this.decayTimer = 0;
      }
    }
  }

  /**
   * Resets combo system to starting state (1x multiplier or given multiplier, full timer).
   */
  public reset(multiplier: number = 1): void {
    this.multiplier = Math.max(1, multiplier);
    this.decayTimer = calculateComboDecayDuration(this.multiplier);
    this.maxMultiplierAchieved = this.multiplier;
    this.onMultiplierChange?.(this.multiplier);
  }
}
