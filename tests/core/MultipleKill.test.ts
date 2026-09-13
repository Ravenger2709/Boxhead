import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ComboSystem,
  MULTIPLE_KILL_WINDOW,
  getMultipleKillTitle,
  MultipleKillEvent,
} from '../../src/core/ComboSystem';
import { HUD } from '../../src/ui/HUD';
import { WEAPONS, WeaponId } from '../../src/weapons/WeaponTypes';

describe('MultipleKill Burst Streak System & HUD Integration', () => {
  describe('ComboSystem MultipleKill Tracking', () => {
    let combo: ComboSystem;

    beforeEach(() => {
      combo = new ComboSystem();
    });

    it('should initialize with multipleKillCount = 0 and multipleKillTimer = 0', () => {
      expect(combo.multipleKillCount).toBe(0);
      expect(combo.multipleKillTimer).toBe(0);
      expect(combo.multipleKillProgress).toBe(0);
      expect(combo.lastBurstEvent).toBeNull();
      expect(combo.burstEvents).toEqual([]);
    });

    it('should start streak at 1 on first kill and set timer to 1.5s without burst event', () => {
      const event = combo.registerKill();
      expect(combo.multipleKillCount).toBe(1);
      expect(combo.multipleKillTimer).toBe(MULTIPLE_KILL_WINDOW);
      expect(combo.multipleKillProgress).toBeCloseTo(1.0);
      expect(event).toBeNull();
      expect(combo.lastBurstEvent).toBeNull();
    });

    it('should increment multipleKillCount and emit DOUBLE KILL on second rapid kill', () => {
      const onStreak = vi.fn();
      combo.onMultipleKill = onStreak;

      combo.registerKill(); // Kill 1
      combo.update(0.5); // 1.0s left
      expect(combo.multipleKillTimer).toBeCloseTo(1.0);

      const event = combo.registerKill(); // Kill 2
      expect(combo.multipleKillCount).toBe(2);
      expect(combo.multipleKillTimer).toBe(MULTIPLE_KILL_WINDOW);
      expect(event).toEqual({
        count: 2,
        title: 'DOUBLE KILL!',
      });
      expect(combo.lastBurstEvent).toEqual(event);
      expect(combo.burstEvents).toHaveLength(1);
      expect(onStreak).toHaveBeenCalledWith(event);
    });

    it('should increment streaks through TRIPLE, QUAD, and MULTI KILL', () => {
      combo.registerKill(); // 1
      const doubleKill = combo.registerKill(); // 2
      expect(doubleKill?.title).toBe('DOUBLE KILL!');

      combo.update(0.2);
      const tripleKill = combo.registerKill(); // 3
      expect(tripleKill?.count).toBe(3);
      expect(tripleKill?.title).toBe('TRIPLE KILL!');

      combo.update(0.2);
      const quadKill = combo.registerKill(); // 4
      expect(quadKill?.count).toBe(4);
      expect(quadKill?.title).toBe('QUAD KILL!');

      combo.update(0.2);
      const multiKill = combo.registerKill(); // 5
      expect(multiKill?.count).toBe(5);
      expect(multiKill?.title).toBe('MULTI KILL!');

      combo.update(0.2);
      const ultraKill = combo.registerKill(); // 6
      expect(ultraKill?.title).toBe('ULTRA KILL!');

      combo.update(0.2);
      const monsterKill = combo.registerKill(); // 7
      expect(monsterKill?.title).toBe('MONSTER KILL!');

      combo.update(0.2);
      const ludicrousKill = combo.registerKill(); // 8
      expect(ludicrousKill?.title).toBe('LUDICROUS KILL!');
    });

    it('should reset multipleKillCount to 0 when multipleKillTimer reaches 0 in update(dt)', () => {
      combo.registerKill(); // 1
      combo.registerKill(); // 2 -> DOUBLE KILL!
      expect(combo.multipleKillCount).toBe(2);

      // Decrement partway
      combo.update(1.0);
      expect(combo.multipleKillTimer).toBeCloseTo(0.5);
      expect(combo.multipleKillCount).toBe(2);

      // Decrement past expiry
      combo.update(0.6);
      expect(combo.multipleKillTimer).toBe(0);
      expect(combo.multipleKillCount).toBe(0);
      expect(combo.multipleKillProgress).toBe(0);

      // Subsequent kill starts fresh at 1
      const nextKill = combo.registerKill();
      expect(combo.multipleKillCount).toBe(1);
      expect(nextKill).toBeNull();
    });

    it('should reset multiple-kill state when reset() is called', () => {
      combo.registerKill();
      combo.registerKill();
      expect(combo.multipleKillCount).toBe(2);
      expect(combo.burstEvents.length).toBe(1);

      combo.reset();
      expect(combo.multipleKillCount).toBe(0);
      expect(combo.multipleKillTimer).toBe(0);
      expect(combo.lastBurstEvent).toBeNull();
      expect(combo.burstEvents).toEqual([]);
    });

    it('should also trigger registerKill when onKill is called', () => {
      const event1 = combo.onKill();
      expect(event1).toBeNull();
      expect(combo.multipleKillCount).toBe(1);

      const event2 = combo.onKill();
      expect(event2?.title).toBe('DOUBLE KILL!');
      expect(combo.multipleKillCount).toBe(2);
    });

    it('should return correct titles from getMultipleKillTitle helper', () => {
      expect(getMultipleKillTitle(1)).toBe('');
      expect(getMultipleKillTitle(2)).toBe('DOUBLE KILL!');
      expect(getMultipleKillTitle(3)).toBe('TRIPLE KILL!');
      expect(getMultipleKillTitle(4)).toBe('QUAD KILL!');
      expect(getMultipleKillTitle(5)).toBe('MULTI KILL!');
      expect(getMultipleKillTitle(6)).toBe('ULTRA KILL!');
      expect(getMultipleKillTitle(7)).toBe('MONSTER KILL!');
      expect(getMultipleKillTitle(8)).toBe('LUDICROUS KILL!');
      expect(getMultipleKillTitle(99)).toBe('LUDICROUS KILL!');
    });
  });

  describe('HUD MultipleKill Banner Component', () => {
    let hud: HUD;

    beforeEach(() => {
      hud = new HUD();
    });

    it('should initialize with MultipleKill banner elements', () => {
      expect(hud.multipleKillBannerEl).toBeDefined();
      expect(hud.multipleKillTextEl).toBeDefined();
      expect(hud.multipleKillGaugeContainerEl).toBeDefined();
      expect(hud.multipleKillGaugeEl).toBeDefined();
      expect(hud.multipleKillBannerEl.style.display).toBe('none');
    });

    it('should display streak banner and initialize gauge on showMultipleKill', () => {
      hud.showMultipleKill('DOUBLE KILL!', 2);
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');
      expect(hud.multipleKillTextEl.textContent).toBe('DOUBLE KILL!');
      expect(hud.multipleKillGaugeEl.style.width).toBe('100.0%');
    });

    it('should accept MultipleKillEvent object in showMultipleKill', () => {
      const event: MultipleKillEvent = { count: 3, title: 'TRIPLE KILL!' };
      hud.showMultipleKill(event);
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');
      expect(hud.multipleKillTextEl.textContent).toBe('TRIPLE KILL!');
      expect(hud.multipleKillGaugeEl.style.width).toBe('100.0%');
    });

    it('should update gauge width and hide banner when depleted', () => {
      hud.showMultipleKill('QUAD KILL!', 4);
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');

      hud.updateMultipleKillGauge(0.65);
      expect(hud.multipleKillGaugeEl.style.width).toBe('65.0%');

      hud.updateMultipleKillGauge(0.0);
      expect(hud.multipleKillBannerEl.style.display).toBe('none');
      expect(hud.multipleKillGaugeEl.style.width).toBe('0.0%');
    });

    it('should hide banner on hideMultipleKill()', () => {
      hud.showMultipleKill('MULTI KILL!', 5);
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');

      hud.hideMultipleKill();
      expect(hud.multipleKillBannerEl.style.display).toBe('none');
      expect(hud.multipleKillGaugeEl.style.width).toBe('0.0%');
    });

    it('should clean up on dispose()', () => {
      hud.showMultipleKill('DOUBLE KILL!', 2);
      hud.dispose();
      expect(hud.multipleKillBannerEl.style.display).toBe('none');
    });
  });

  describe('ComboSystem & HUD Automatic Integration', () => {
    it('should automatically trigger HUD banner when comboSystem is passed in HUDOptions', () => {
      const combo = new ComboSystem();
      const hud = new HUD({ comboSystem: combo });

      expect(hud.multipleKillBannerEl.style.display).toBe('none');

      // 1st kill: streak starts, no banner
      combo.registerKill();
      expect(hud.multipleKillBannerEl.style.display).toBe('none');

      // 2nd kill: triggers banner automatically
      combo.registerKill();
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');
      expect(hud.multipleKillTextEl.textContent).toBe('DOUBLE KILL!');
      expect(hud.multipleKillGaugeEl.style.width).toBe('100.0%');
    });

    it('should wire via attachComboSystem method', () => {
      const combo = new ComboSystem();
      const hud = new HUD();
      hud.attachComboSystem(combo);

      combo.registerKill();
      combo.registerKill(); // DOUBLE KILL!
      expect(hud.multipleKillTextEl.textContent).toBe('DOUBLE KILL!');

      combo.registerKill(); // TRIPLE KILL!
      expect(hud.multipleKillTextEl.textContent).toBe('TRIPLE KILL!');
    });

    it('should deplete gauge bar during hud.update() as comboSystem timer decrements', () => {
      const combo = new ComboSystem();
      const hud = new HUD({ comboSystem: combo });

      combo.registerKill();
      combo.registerKill(); // count 2, timer = 1.5s
      expect(hud.multipleKillBannerEl.style.display).toBe('flex');

      // Elapse 0.75s (half of 1.5s window)
      combo.update(0.75);
      hud.update(
        100,
        100,
        combo.multiplier,
        combo.decayProgress,
        WEAPONS[WeaponId.Pistol],
        -1,
        1,
        100,
        false
      );
      expect(hud.multipleKillGaugeEl.style.width).toBe('50.0%');

      // Elapse remaining 0.75s -> timer hits 0
      combo.update(0.75);
      hud.update(
        100,
        100,
        combo.multiplier,
        combo.decayProgress,
        WEAPONS[WeaponId.Pistol],
        -1,
        1,
        100,
        false
      );
      expect(hud.multipleKillBannerEl.style.display).toBe('none');
    });
  });
});
