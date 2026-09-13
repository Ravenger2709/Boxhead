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
export const MULTIPLE_KILL_WINDOW = 1.5; // 1.5s window for rapid succession kills

export interface MultipleKillEvent {
  count: number;
  title: string;
}

export function getMultipleKillTitle(count: number): string {
  switch (count) {
    case 2:
      return 'DOUBLE KILL!';
    case 3:
      return 'TRIPLE KILL!';
    case 4:
      return 'QUAD KILL!';
    case 5:
      return 'MULTI KILL!';
    case 6:
      return 'ULTRA KILL!';
    case 7:
      return 'MONSTER KILL!';
    default:
      if (count >= 8) {
        return 'LUDICROUS KILL!';
      }
      return '';
  }
}

export class ComboSystem {
  public multiplier: number = 1;
  public decayTimer: number = COMBO_DECAY_TIME;
  public maxMultiplierAchieved: number = 1;
  public onMultiplierChange?: (multiplier: number) => void;

  public multipleKillCount: number = 0;
  public multipleKillTimer: number = 0;
  public burstEvents: MultipleKillEvent[] = [];
  public lastBurstEvent: MultipleKillEvent | null = null;
  public onMultipleKill?: (event: MultipleKillEvent) => void;

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
   * Normalized multiple-kill window progress (1.0 down to 0.0) for UI gauge rendering.
   */
  public get multipleKillProgress(): number {
    if (MULTIPLE_KILL_WINDOW <= 0) return 0;
    return Math.max(0, Math.min(1.0, this.multipleKillTimer / MULTIPLE_KILL_WINDOW));
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
   * Registers an enemy kill for both multiple-kill burst streak tracking and combo multiplier.
   * If multipleKillTimer > 0, multipleKillCount++
   * Else multipleKillCount = 1
   * Resets multipleKillTimer = 1.5s
   * When multipleKillCount >= 2, records burst event with count and banner title.
   */
  public registerKill(): MultipleKillEvent | null {
    // Multiplier increment
    this.multiplier += 1;
    if (this.multiplier > this.maxMultiplierAchieved) {
      this.maxMultiplierAchieved = this.multiplier;
    }
    this.decayTimer = calculateComboDecayDuration(this.multiplier);
    this.onMultiplierChange?.(this.multiplier);

    // Multiple-kill burst streak tracking
    if (this.multipleKillTimer > 0) {
      this.multipleKillCount++;
    } else {
      this.multipleKillCount = 1;
    }
    this.multipleKillTimer = MULTIPLE_KILL_WINDOW;

    let event: MultipleKillEvent | null = null;
    if (this.multipleKillCount >= 2) {
      event = {
        count: this.multipleKillCount,
        title: getMultipleKillTitle(this.multipleKillCount),
      };
      this.burstEvents.push(event);
      this.lastBurstEvent = event;
      this.onMultipleKill?.(event);
    }

    return event;
  }

  /**
   * Called whenever an enemy is killed.
   * Delegates to registerKill().
   */
  public onKill(): MultipleKillEvent | null {
    return this.registerKill();
  }

  /**
   * Updates decay timer and multiple-kill timer with elapsed delta time dt.
   * Decrements multipleKillTimer to 0. When it hits 0, multipleKillCount resets to 0.
   * When combo decay timer expires: multiplier drops by 1 (if > 1) and timer resets to new duration.
   */
  public update(dt: number): void {
    if (dt <= 0) return;

    if (this.multipleKillTimer > 0) {
      this.multipleKillTimer -= dt;
      if (this.multipleKillTimer <= 0) {
        this.multipleKillTimer = 0;
        this.multipleKillCount = 0;
      }
    }

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
    this.multipleKillCount = 0;
    this.multipleKillTimer = 0;
    this.lastBurstEvent = null;
    this.burstEvents = [];
    this.onMultiplierChange?.(this.multiplier);
  }
}
