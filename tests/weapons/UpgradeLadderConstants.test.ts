import { describe, it, expect } from 'vitest';
import { UPGRADE_LADDER, WEAPON_DEFINITIONS } from '../../src/core/Constants';
import { WeaponId } from '../../src/weapons/WeaponTypes';

describe('Upgrade Ladder & 10 Weapon Constants', () => {
  it('defines all 10 weapons with slots 1 to 10', () => {
    const expectedWeapons: WeaponId[] = [
      'pistol', 'uzi', 'shotgun', 'barrel', 'grenade',
      'fakewall', 'claymore', 'rocket', 'chargepack', 'railgun'
    ];
    for (let i = 0; i < expectedWeapons.length; i++) {
      const id = expectedWeapons[i];
      expect(WEAPON_DEFINITIONS[id]).toBeDefined();
      expect(WEAPON_DEFINITIONS[id].slot).toBe(i + 1);
    }
  });

  it('contains exactly 58 milestones spanning x3 to x125 in strictly ascending order', () => {
    expect(UPGRADE_LADDER.length).toBe(58);
    expect(UPGRADE_LADDER[0].multiplier).toBe(3);
    expect(UPGRADE_LADDER[57].multiplier).toBe(125);

    for (let i = 1; i < UPGRADE_LADDER.length; i++) {
      expect(UPGRADE_LADDER[i].multiplier).toBeGreaterThan(UPGRADE_LADDER[i - 1].multiplier);
    }
  });

  it('verifies key authentic weapon unlocks in the ladder', () => {
    const unlocks = UPGRADE_LADDER.filter(m => m.type === 'unlock');
    expect(unlocks.length).toBe(9); // Pistol starts unlocked at x1; 9 weapons unlocked via ladder
    expect(unlocks.find(u => u.weaponId === 'uzi')?.multiplier).toBe(5);
    expect(unlocks.find(u => u.weaponId === 'shotgun')?.multiplier).toBe(10);
    expect(unlocks.find(u => u.weaponId === 'barrel')?.multiplier).toBe(15);
    expect(unlocks.find(u => u.weaponId === 'grenade')?.multiplier).toBe(20);
    expect(unlocks.find(u => u.weaponId === 'fakewall')?.multiplier).toBe(30);
    expect(unlocks.find(u => u.weaponId === 'claymore')?.multiplier).toBe(40);
    expect(unlocks.find(u => u.weaponId === 'rocket')?.multiplier).toBe(50);
    expect(unlocks.find(u => u.weaponId === 'chargepack')?.multiplier).toBe(55);
    expect(unlocks.find(u => u.weaponId === 'railgun')?.multiplier).toBe(70);
  });

  it('verifies specific weapon definition baseline attributes', () => {
    // Slot 1: pistol
    expect(WEAPON_DEFINITIONS.pistol).toMatchObject({
      slot: 1,
      isAutomatic: false,
      cooldown: 0.22,
      damage: 15,
      speed: 55,
      maxAmmo: -1,
    });

    // Slot 2: uzi
    expect(WEAPON_DEFINITIONS.uzi).toMatchObject({
      slot: 2,
      isAutomatic: true,
      cooldown: 0.08,
      damage: 10,
      speed: 50,
      maxAmmo: 200,
      spread: 0.12,
    });

    // Slot 3: shotgun
    expect(WEAPON_DEFINITIONS.shotgun).toMatchObject({
      slot: 3,
      isAutomatic: false,
      cooldown: 0.65,
      damage: 12,
      speed: 45,
      maxAmmo: 50,
      pellets: 5,
      spread: 0.25,
      knockback: 4.5,
    });

    // Slot 4: barrel
    expect(WEAPON_DEFINITIONS.barrel).toMatchObject({
      slot: 4,
      isAutomatic: false,
      cooldown: 0.5,
      damage: 120,
      maxAmmo: 10,
      radius: 4.5,
    });

    // Slot 5: grenade
    expect(WEAPON_DEFINITIONS.grenade).toMatchObject({
      slot: 5,
      isAutomatic: false,
      cooldown: 0.6,
      damage: 140,
      maxAmmo: 15,
      radius: 4.5,
    });

    // Slot 6: fakewall
    expect(WEAPON_DEFINITIONS.fakewall).toMatchObject({
      slot: 6,
      isAutomatic: false,
      cooldown: 0.5,
      maxAmmo: 15,
      health: 150,
    });

    // Slot 7: claymore
    expect(WEAPON_DEFINITIONS.claymore).toMatchObject({
      slot: 7,
      isAutomatic: false,
      cooldown: 0.5,
      damage: 150,
      maxAmmo: 10,
      radius: 4.0,
    });

    // Slot 8: rocket
    expect(WEAPON_DEFINITIONS.rocket).toMatchObject({
      slot: 8,
      isAutomatic: false,
      cooldown: 1.0,
      damage: 160,
      speed: 28,
      maxAmmo: 20,
      radius: 4.0,
    });

    // Slot 9: chargepack
    expect(WEAPON_DEFINITIONS.chargepack).toMatchObject({
      slot: 9,
      isAutomatic: false,
      cooldown: 0.5,
      damage: 180,
      maxAmmo: 8,
      radius: 5.0,
    });

    // Slot 10: railgun
    expect(WEAPON_DEFINITIONS.railgun).toMatchObject({
      slot: 10,
      isAutomatic: false,
      cooldown: 1.2,
      damage: 100,
      maxAmmo: 25,
      range: 60,
    });
  });

  it('validates integrity of all 58 milestones', () => {
    const validWeaponIds: WeaponId[] = [
      'pistol', 'uzi', 'shotgun', 'barrel', 'grenade',
      'fakewall', 'claymore', 'rocket', 'chargepack', 'railgun'
    ];

    for (const milestone of UPGRADE_LADDER) {
      expect(milestone.multiplier).toBeGreaterThan(0);
      expect(['unlock', 'upgrade']).toContain(milestone.type);
      expect(validWeaponIds).toContain(milestone.weaponId);
      expect(milestone.name.length).toBeGreaterThan(0);
      expect(milestone.description.length).toBeGreaterThan(0);
      expect(milestone.effectType.length).toBeGreaterThan(0);
    }
  });
});
