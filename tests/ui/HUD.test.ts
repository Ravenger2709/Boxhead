import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HUD } from '../../src/ui/HUD';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import { WEAPONS, WeaponId } from '../../src/weapons/WeaponTypes';

describe('Task 9: HUD Component', () => {
  let hud: HUD;
  let inventory: WeaponInventory;

  beforeEach(() => {
    inventory = new WeaponInventory();
    hud = new HUD();
  });

  describe('Initialization', () => {
    it('should instantiate HUD with all core UI elements initialized', () => {
      expect(hud).toBeDefined();
      expect(hud.hpFillEl).toBeDefined();
      expect(hud.hpTextEl).toBeDefined();
      expect(hud.scoreEl).toBeDefined();
      expect(hud.comboValEl).toBeDefined();
      expect(hud.comboDrainBarEl).toBeDefined();
      expect(hud.waveEl).toBeDefined();
      expect(hud.enemiesEl).toBeDefined();
      expect(hud.muteBtnEl).toBeDefined();
      expect(hud.toastEl).toBeDefined();
      expect(hud.slotElements.size).toBe(7);
    });

    it('should initialize weapon slots 1 through 7 with slot 1 active by default', () => {
      for (let slot = 1; slot <= 7; slot++) {
        expect(hud.slotElements.has(slot)).toBe(true);
      }
      expect(hud.slotElements.get(1)?.classList.contains('active')).toBe(true);
      expect(hud.slotElements.get(2)?.classList.contains('active')).toBe(false);
    });
  });

  describe('Health Bar Updates', () => {
    it('should update HP fill bar width and text for full health', () => {
      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.hpFillEl?.style.width).toBe('100.0%');
      expect(hud.hpTextEl?.textContent).toContain('100 / 100');
    });

    it('should update HP fill bar width and text for reduced health', () => {
      hud.update(45, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.hpFillEl?.style.width).toBe('45.0%');
      expect(hud.hpTextEl?.textContent).toContain('45 / 100');
    });

    it('should clamp HP fill bar at 0% when health drops to 0 or below', () => {
      hud.update(0, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.hpFillEl?.style.width).toBe('0.0%');
      expect(hud.hpTextEl?.textContent).toContain('0 / 100');
    });
  });

  describe('Combo Multiplier and Decay Drain Bar', () => {
    it('should display x1 and empty decay bar when at base multiplier 1x', () => {
      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.comboValEl?.textContent).toBe('x1');
      expect(hud.comboDrainBarEl?.style.width).toBe('0.0%');
    });

    it('should display elevated multiplier and active decay progress bar', () => {
      hud.update(100, 100, 14, 0.75, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.comboValEl?.textContent).toBe('x14');
      expect(hud.comboDrainBarEl?.style.width).toBe('75.0%');
    });
  });

  describe('Wave, Enemies and Score Tracking', () => {
    it('should display current wave, enemy count, and formatted score', () => {
      hud.update(100, 100, 3, 0.5, WEAPONS[WeaponId.Pistol], -1, 5, 24500, false, inventory, 18);
      expect(hud.waveEl?.textContent).toContain('5');
      expect(hud.enemiesEl?.textContent).toContain('18');
      expect(hud.scoreEl?.textContent).toContain('24,500');
    });
  });

  describe('Weapon Slot and Ammo Updates', () => {
    it('should mark active weapon slot and format infinite ammo for Pistol', () => {
      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false, inventory);
      expect(hud.slotElements.get(1)?.classList.contains('active')).toBe(true);
      expect(hud.slotAmmoElements.get(1)?.textContent).toBe('∞');
    });

    it('should reflect ammo and active state when switching to Uzi', () => {
      inventory.unlockMilestone(4); // unlocks Uzi
      inventory.selectWeapon(WeaponId.Uzi);

      hud.update(100, 100, 4, 0.8, WEAPONS[WeaponId.Uzi], 180, 1, 1200, false, inventory);

      expect(hud.slotElements.get(1)?.classList.contains('active')).toBe(false);
      expect(hud.slotElements.get(2)?.classList.contains('active')).toBe(true);
      expect(hud.slotElements.get(2)?.classList.contains('locked')).toBe(false);
      expect(hud.slotAmmoElements.get(2)?.textContent).toBe('180');
    });

    it('should indicate locked state with lock element visible on locked weapons', () => {
      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false, inventory);
      // Rocket launcher (slot 7) requires 40x combo and should be locked
      expect(hud.slotElements.get(7)?.classList.contains('locked')).toBe(true);
      expect(hud.slotLockElements.get(7)?.style.display).not.toBe('none');
    });
  });

  describe('Audio Mute Toggle', () => {
    it('should update mute button text to reflect muted state', () => {
      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, true);
      expect(hud.muteBtnEl?.textContent).toContain('MUTED');
      expect(hud.muteBtnEl?.classList.contains('muted')).toBe(true);

      hud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false);
      expect(hud.muteBtnEl?.textContent).toContain('SOUND');
      expect(hud.muteBtnEl?.classList.contains('muted')).toBe(false);
    });

    it('should invoke onToggleMute callback when mute button is clicked', () => {
      const toggleSpy = vi.fn();
      const customHud = new HUD({ onToggleMute: toggleSpy });

      customHud.muteBtnEl?.dispatchEvent({ type: 'click' });
      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Milestone Unlock Toast', () => {
    it('should show toast banner with uppercase weapon name on milestone unlock', () => {
      hud.showMilestoneUnlock('Uzi');
      expect(hud.toastEl?.style.display).not.toBe('none');
      expect(hud.toastTextEl?.textContent).toContain('UZI');
    });

    it('should hide toast banner on hideMilestoneUnlock()', () => {
      hud.showMilestoneUnlock('Shotgun');
      expect(hud.toastEl?.style.display).not.toBe('none');

      hud.hideMilestoneUnlock();
      expect(hud.toastEl?.style.display).toBe('none');
    });
  });

  describe('Weapon Slot Click Selection', () => {
    it('should invoke onSelectWeapon callback when clicking an unlocked slot', () => {
      const selectSpy = vi.fn();
      const customHud = new HUD({ onSelectWeapon: selectSpy });
      inventory.unlockMilestone(4); // unlocks Uzi (slot 2)
      customHud.update(100, 100, 4, 0.5, WEAPONS[WeaponId.Pistol], -1, 1, 0, false, inventory);

      customHud.slotElements.get(2)?.dispatchEvent({ type: 'click' });
      expect(selectSpy).toHaveBeenCalledWith(2);
    });

    it('should not invoke onSelectWeapon when clicking a locked slot', () => {
      const selectSpy = vi.fn();
      const customHud = new HUD({ onSelectWeapon: selectSpy });
      customHud.update(100, 100, 1, 0, WEAPONS[WeaponId.Pistol], -1, 1, 0, false, inventory);

      // Slot 7 is locked
      customHud.slotElements.get(7)?.dispatchEvent({ type: 'click' });
      expect(selectSpy).not.toHaveBeenCalled();
    });
  });
});
