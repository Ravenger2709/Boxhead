import { describe, it, expect, beforeEach } from 'vitest';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import { UPGRADE_LADDER } from '../../src/core/Constants';
import { WeaponId } from '../../src/weapons/WeaponTypes';

describe('WeaponInventory Dynamic Upgrades', () => {
  let inventory: WeaponInventory;

  beforeEach(() => {
    inventory = new WeaponInventory();
  });

  it('starts with only Pistol unlocked and base stats', () => {
    expect(inventory.isUnlocked('pistol')).toBe(true);
    expect(inventory.isUnlocked('uzi')).toBe(false);
    expect(inventory.getEffectiveDamage('pistol')).toBe(15);
    expect(inventory.getEffectiveCooldown('pistol')).toBe(0.22);
  });

  it('applies Pistol Fast Fire at x3 and Double Damage at x8', () => {
    const x3 = UPGRADE_LADDER.find(m => m.multiplier === 3)!;
    inventory.applyMilestone(x3);
    expect(inventory.getEffectiveCooldown('pistol')).toBeCloseTo(0.14, 2);

    const x8 = UPGRADE_LADDER.find(m => m.multiplier === 8)!;
    inventory.applyMilestone(x8);
    expect(inventory.getEffectiveDamage('pistol')).toBe(30);
  });

  it('unlocks UZI at x5 and applies ammo doubling bonuses', () => {
    const x5 = UPGRADE_LADDER.find(m => m.multiplier === 5)!;
    inventory.applyMilestone(x5);
    expect(inventory.isUnlocked('uzi')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('uzi')).toBe(200);

    const x17 = UPGRADE_LADDER.find(m => m.multiplier === 17)!;
    inventory.applyMilestone(x17);
    expect(inventory.getEffectiveMaxAmmo('uzi')).toBe(400);
    expect(inventory.getAmmo('uzi')).toBe(400);
  });

  it('retains all upgrades even if combo drains to 1', () => {
    inventory.checkMilestones(25);
    expect(inventory.isUnlocked('shotgun')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('shotgun')).toBe(100);

    // Drains back down
    inventory.checkMilestones(1);
    expect(inventory.isUnlocked('shotgun')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('shotgun')).toBe(100);
  });

  it('cycles smoothly between all 10 unlocked weapons', () => {
    inventory.checkMilestones(125); // Unlock everything
    inventory.selectWeaponBySlot(1);
    expect(inventory.getActiveWeaponId()).toBe('pistol');

    inventory.nextWeapon();
    expect(inventory.getActiveWeaponId()).toBe('uzi');

    inventory.selectWeaponBySlot(10);
    expect(inventory.getActiveWeaponId()).toBe('railgun');

    inventory.nextWeapon();
    expect(inventory.getActiveWeaponId()).toBe('pistol'); // wraps to slot 1
  });

  it('supports legacy numeric IDs seamlessly for stat getters and checks', () => {
    expect(inventory.isUnlocked(WeaponId.Pistol)).toBe(true);
    expect(inventory.isUnlocked(WeaponId.Uzi)).toBe(false);
    expect(inventory.getEffectiveDamage(WeaponId.Pistol)).toBe(15);
    expect(inventory.getEffectiveCooldown(WeaponId.Pistol)).toBe(0.22);
    expect(inventory.getEffectiveMaxAmmo(WeaponId.Pistol)).toBe(-1);
  });

  it('handles dynamic pellet counts for Shotgun Wide Shot and Wider Shot', () => {
    expect(inventory.getEffectivePelletCount('shotgun')).toBe(5);

    // Unlock shotgun at x10
    const x10 = UPGRADE_LADDER.find(m => m.multiplier === 10)!;
    inventory.applyMilestone(x10);
    expect(inventory.getEffectivePelletCount('shotgun')).toBe(5);

    // Wide Shot at x31 (5 -> 7 pellets)
    const x31 = UPGRADE_LADDER.find(m => m.multiplier === 31)!;
    inventory.applyMilestone(x31);
    expect(inventory.getEffectivePelletCount('shotgun')).toBe(7);

    // Wider Shot at x51 (7 -> 10 pellets)
    const x51 = UPGRADE_LADDER.find(m => m.multiplier === 51)!;
    inventory.applyMilestone(x51);
    expect(inventory.getEffectivePelletCount('shotgun')).toBe(10);
  });

  it('handles explosive radius upgrades (Big Bang and Bigger Bang)', () => {
    // Barrel base radius 4.5
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(4.5);

    // Barrel Big Bang at x32 (4.5 -> 6.0)
    const x32 = UPGRADE_LADDER.find(m => m.multiplier === 32)!;
    inventory.applyMilestone(x32);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(6.0);

    // Barrel Bigger Bang at x44 (6.0 -> 8.0)
    const x44 = UPGRADE_LADDER.find(m => m.multiplier === 44)!;
    inventory.applyMilestone(x44);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(8.0);
  });

  it('tracks cluster explode and infinite range flags', () => {
    expect(inventory.hasClusterExplode('grenade')).toBe(false);
    expect(inventory.hasClusterExplode('claymore')).toBe(false);
    expect(inventory.hasClusterExplode('chargepack')).toBe(false);
    expect(inventory.isInfiniteRange('uzi')).toBe(false);

    // Grenade Cluster Explode at x33
    const x33 = UPGRADE_LADDER.find(m => m.multiplier === 33)!;
    inventory.applyMilestone(x33);
    expect(inventory.hasClusterExplode('grenade')).toBe(true);

    // Claymore Cluster Explode at x47
    const x47 = UPGRADE_LADDER.find(m => m.multiplier === 47)!;
    inventory.applyMilestone(x47);
    expect(inventory.hasClusterExplode('claymore')).toBe(true);

    // UZI Infinite Range at x61
    const x61 = UPGRADE_LADDER.find(m => m.multiplier === 61)!;
    inventory.applyMilestone(x61);
    expect(inventory.isInfiniteRange('uzi')).toBe(true);

    // Charge Pack Cluster Explode at x63
    const x63 = UPGRADE_LADDER.find(m => m.multiplier === 63)!;
    inventory.applyMilestone(x63);
    expect(inventory.hasClusterExplode('chargepack')).toBe(true);
  });

  it('cycles backwards with previousWeapon() wrapping between 1 and 10', () => {
    inventory.checkMilestones(125); // Unlock everything
    inventory.selectWeaponBySlot(1);
    expect(inventory.getActiveWeaponId()).toBe('pistol');

    inventory.previousWeapon();
    expect(inventory.getActiveWeaponId()).toBe('railgun'); // wraps 1 -> 10

    inventory.previousWeapon();
    expect(inventory.getActiveWeaponId()).toBe('chargepack'); // 10 -> 9
  });

  it('selectWeaponBySlot rejects locked slots and keeps active selection', () => {
    inventory.selectWeaponBySlot(1);
    expect(inventory.getActiveWeaponId()).toBe('pistol');

    const selected = inventory.selectWeaponBySlot(5); // Grenade is locked
    expect(selected).toBe(false);
    expect(inventory.getActiveWeaponId()).toBe('pistol');
  });

  it('checkMilestones returns newly applied milestones and does not duplicate', () => {
    const firstBatch = inventory.checkMilestones(5);
    // Multipliers <= 5: x3 (Pistol Fast Fire), x5 (Uzi unlock)
    expect(firstBatch.length).toBe(2);
    expect(firstBatch.map(m => m.multiplier)).toEqual([3, 5]);

    // Calling again with same multiplier returns empty
    const duplicateBatch = inventory.checkMilestones(5);
    expect(duplicateBatch.length).toBe(0);

    // Reaching x10 applies x8 and x10
    const secondBatch = inventory.checkMilestones(10);
    expect(secondBatch.length).toBe(2);
    expect(secondBatch.map(m => m.multiplier)).toEqual([8, 10]);
  });

  it('handles slot 7 (Claymore) and slot 8 (Rocket) progression without desync or false unlocks', () => {
    // 5a: Reach combo x40 -> Claymore unlocked (slot 7), Rocket locked (slot 8)
    inventory.checkMilestones(40);
    expect(inventory.isUnlocked(7)).toBe(true);
    expect(inventory.isUnlocked('claymore')).toBe(true);
    expect(inventory.isUnlocked(8)).toBe(false);
    expect(inventory.isUnlocked('rocket')).toBe(false);
    expect(inventory.selectWeaponBySlot(8)).toBe(false);
    expect(inventory.getActiveWeaponId()).not.toBe('rocket');

    // 5b: Reach combo x50 -> both unlocked
    inventory.checkMilestones(50);
    expect(inventory.isUnlocked(7)).toBe(true);
    expect(inventory.isUnlocked('claymore')).toBe(true);
    expect(inventory.isUnlocked(8)).toBe(true);
    expect(inventory.isUnlocked('rocket')).toBe(true);

    expect(inventory.selectWeaponBySlot(7)).toBe(true);
    expect(inventory.getActiveWeaponId()).toBe('claymore');
    expect(inventory.activeWeaponId).toBe(7);

    expect(inventory.selectWeaponBySlot(8)).toBe(true);
    expect(inventory.getActiveWeaponId()).toBe('rocket');
    expect(inventory.activeWeaponId).toBe(8);

    expect(inventory.selectWeapon(7)).toBe(true);
    expect(inventory.getActiveWeaponId()).toBe('claymore');
    expect(inventory.activeWeaponId).toBe(7);

    expect(inventory.selectWeapon(8)).toBe(true);
    expect(inventory.getActiveWeaponId()).toBe('rocket');
    expect(inventory.activeWeaponId).toBe(8);
  });

  it('keeps Claymore and Rocket ammo completely decoupled without cross-slot state corruption', () => {
    inventory.checkMilestones(50); // Unlock both Claymore (slot 7, max 10) and Rocket (slot 8, max 20)
    expect(inventory.getAmmo('claymore')).toBe(10);
    expect(inventory.getAmmo(7)).toBe(10);
    expect(inventory.ammo.get(7)).toBe(10);

    expect(inventory.getAmmo('rocket')).toBe(20);
    expect(inventory.getAmmo(8)).toBe(20);
    expect(inventory.ammo.get(8)).toBe(20);

    // 5c: Modifying Claymore ammo does NOT corrupt Rocket ammo
    inventory.ammo.set('claymore', 3);
    expect(inventory.getAmmo('claymore')).toBe(3);
    expect(inventory.getAmmo(7)).toBe(3);
    expect(inventory.ammo.get(7)).toBe(3);
    expect(inventory.getAmmo('rocket')).toBe(20);
    expect(inventory.getAmmo(8)).toBe(20);
    expect(inventory.ammo.get(8)).toBe(20);

    inventory.ammo.set(7, 1);
    expect(inventory.getAmmo('claymore')).toBe(1);
    expect(inventory.getAmmo(7)).toBe(1);
    expect(inventory.ammo.get(7)).toBe(1);
    expect(inventory.getAmmo('rocket')).toBe(20);
    expect(inventory.getAmmo(8)).toBe(20);
    expect(inventory.ammo.get(8)).toBe(20);

    // 5d: Modifying Rocket ammo does NOT corrupt Claymore ammo
    inventory.ammo.set('rocket', 14);
    expect(inventory.getAmmo('rocket')).toBe(14);
    expect(inventory.getAmmo(8)).toBe(14);
    expect(inventory.ammo.get(8)).toBe(14);
    expect(inventory.getAmmo('claymore')).toBe(1);
    expect(inventory.getAmmo(7)).toBe(1);
    expect(inventory.ammo.get(7)).toBe(1);

    inventory.ammo.set(8, 6);
    expect(inventory.getAmmo('rocket')).toBe(6);
    expect(inventory.getAmmo(8)).toBe(6);
    expect(inventory.ammo.get(8)).toBe(6);
    expect(inventory.getAmmo('claymore')).toBe(1);
    expect(inventory.getAmmo(7)).toBe(1);
    expect(inventory.ammo.get(7)).toBe(1);
  });

  it('allows placing adjacent barrels at physical clearance distance even when upgraded to Bigger Bang', () => {
    // Milestone x44: Barrel Bigger Bang (blast radius 8.0, damage 260)
    inventory.checkMilestones(44);
    expect(inventory.getEffectiveBlastRadius('barrel')).toBe(8.0);

    const b1 = { pos: { x: 0, z: 0 }, alive: true, exploded: false, radius: 8.0, physicalRadius: 0.6 };
    // Placing at distance 1.5m (greater than 0.6 + 0.6 = 1.2m physical clearance, but much less than 8.0 + 0.6 = 8.6m)
    const canPlaceAt1_5m = inventory.canPlaceProp(1.5, 0, 0.6, [], [b1 as any]);
    expect(canPlaceAt1_5m).toBe(true);

    // Placing overlapping at 0.8m (less than 1.2m) should be rejected
    const canPlaceAt0_8m = inventory.canPlaceProp(0.8, 0, 0.6, [], [b1 as any]);
    expect(canPlaceAt0_8m).toBe(false);
  });
});

