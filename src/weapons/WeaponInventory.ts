import * as THREE from 'three';
import {
  WeaponId,
  WeaponDef,
  WEAPON_DEFINITIONS as LEGACY_WEAPON_DEFINITIONS,
  UpgradeMilestone,
} from './WeaponTypes';
import { Barrel } from '../entities/Barrel';
import { FakeWall } from '../entities/FakeWall';
import type { ProjectilePool } from './ProjectilePool';
import type { ParticlePool } from '../fx/ParticlePool';
import type { BloodCanvas } from '../render/BloodCanvas';
import type { InputManager } from '../core/Input';
import {
  AABB,
  ARENA_WIDTH,
  ARENA_DEPTH,
  UPGRADE_LADDER,
  WEAPON_DEFINITIONS as BASE_WEAPON_DEFINITIONS,
} from '../core/Constants';

export interface FireContext {
  projectilePool?: ProjectilePool;
  scene?: THREE.Scene | THREE.Group;
  obstacles?: AABB[];
  barrels?: Barrel[];
  fakeWalls?: FakeWall[];
  enemies?: any[];
  player?: any;
  particlePool?: ParticlePool;
  bloodCanvas?: BloodCanvas;
}

export const ALL_WEAPON_IDS: readonly WeaponId[] = [
  'pistol',
  'uzi',
  'shotgun',
  'barrel',
  'grenade',
  'fakewall',
  'claymore',
  'rocket',
  'chargepack',
  'railgun',
] as const;

export const SLOT_MAP: Record<number, WeaponId> = {
  1: 'pistol',
  2: 'uzi',
  3: 'shotgun',
  4: 'barrel',
  5: 'grenade',
  6: 'fakewall',
  7: 'claymore',
  8: 'rocket',
  9: 'chargepack',
  10: 'railgun',
};

export const WEAPON_SLOT_MAP: Record<WeaponId, number> = {
  pistol: 1,
  uzi: 2,
  shotgun: 3,
  barrel: 4,
  grenade: 5,
  fakewall: 6,
  claymore: 7,
  rocket: 8,
  chargepack: 9,
  railgun: 10,
};

export const WEAPON_LEGACY_ID_MAP: Record<WeaponId, number> = {
  pistol: 1,
  uzi: 2,
  shotgun: 3,
  barrel: 4,
  grenade: 5,
  fakewall: 6,
  rocket: 7,
  claymore: 8,
  chargepack: 9,
  railgun: 10,
};

export function toCanonicalWeaponId(id: WeaponId | number | string): WeaponId {
  if (typeof id === 'string') {
    const lower = id.toLowerCase();
    if (lower === 'rocketlauncher') return 'rocket';
    if (lower === 'fake_wall' || lower === 'fake-wall') return 'fakewall';
    if (lower === 'charge_pack' || lower === 'charge-pack') return 'chargepack';
    if ((ALL_WEAPON_IDS as readonly string[]).includes(lower)) {
      return lower as WeaponId;
    }
  } else if (typeof id === 'number') {
    switch (id) {
      case 1: return 'pistol';
      case 2: return 'uzi';
      case 3: return 'shotgun';
      case 4: return 'barrel';
      case 5: return 'grenade';
      case 6: return 'fakewall';
      case 7: return 'rocket'; // Legacy WeaponId.RocketLauncher = 7
      case 8: return 'claymore'; // Legacy WeaponId.Claymore = 8
      case 9: return 'chargepack'; // Legacy WeaponId.ChargePack = 9
      case 10: return 'railgun'; // Legacy WeaponId.Railgun = 10
    }
  }
  return 'pistol';
}

export class WeaponUnlockedSet extends Set<number | string> {
  override add(value: number | string): this {
    super.add(value);
    if (typeof value === 'string' || typeof value === 'number') {
      const canonical = toCanonicalWeaponId(value);
      super.add(canonical);
      const slot = WEAPON_SLOT_MAP[canonical];
      if (slot !== undefined) super.add(slot);
      const legacyNum = WEAPON_LEGACY_ID_MAP[canonical];
      if (legacyNum !== undefined) super.add(legacyNum);
    }
    return this;
  }
}

export class WeaponAmmoMap extends Map<number | string, number> {
  override set(key: number | string, value: number): this {
    super.set(key, value);
    if (typeof key === 'string' || typeof key === 'number') {
      const canonical = toCanonicalWeaponId(key);
      if (key !== canonical) super.set(canonical, value);
      const slot = WEAPON_SLOT_MAP[canonical];
      if (slot !== undefined && key !== slot) super.set(slot, value);
      const legacyNum = WEAPON_LEGACY_ID_MAP[canonical];
      if (legacyNum !== undefined && key !== legacyNum) super.set(legacyNum, value);
    }
    return this;
  }
}

export class WeaponInventory {
  public unlocked: WeaponUnlockedSet = new WeaponUnlockedSet();
  public ammo: WeaponAmmoMap = new WeaponAmmoMap();
  public appliedMilestones: Set<number> = new Set<number>();
  public activeWeaponId: number = WeaponId.Pistol;
  public cooldownTimer: number = 0;

  private currentWeaponId: WeaponId = 'pistol';
  private upgrades: Map<WeaponId, Set<string>> = new Map<WeaponId, Set<string>>();
  private prevMouseDown: boolean = false;

  constructor() {
    // Pistol is permanently unlocked from the start with infinite ammo (-1)
    this.unlocked.add(WeaponId.Pistol);
    this.ammo.set(WeaponId.Pistol, -1);
    this.activeWeaponId = WeaponId.Pistol;
    this.currentWeaponId = 'pistol';
  }

  public setAmmo(id: WeaponId | number | string, amount: number): void {
    const canonical = toCanonicalWeaponId(id);
    this.ammo.set(canonical, amount);
  }

  /**
   * Applies an upgrade milestone: unlocks new weapons and/or applies stat/ammo upgrades.
   */
  public applyMilestone(milestone: UpgradeMilestone): void {
    if (this.appliedMilestones.has(milestone.multiplier)) {
      return;
    }
    this.appliedMilestones.add(milestone.multiplier);

    const canonical = toCanonicalWeaponId(milestone.weaponId);

    if (milestone.type === 'unlock') {
      this.unlocked.add(canonical);
      const maxAmmo = this.getEffectiveMaxAmmo(canonical);
      this.setAmmo(canonical, maxAmmo);
    } else {
      const oldMax = this.getEffectiveMaxAmmo(canonical);

      if (!this.upgrades.has(canonical)) {
        this.upgrades.set(canonical, new Set<string>());
      }
      this.upgrades.get(canonical)!.add(milestone.effectType);

      const newMax = this.getEffectiveMaxAmmo(canonical);
      const diff = newMax - oldMax;
      if (diff > 0) {
        const curAmmo = this.getAmmo(canonical);
        this.setAmmo(canonical, Math.min(newMax, curAmmo + diff));
      }
    }
  }

  /**
   * Evaluates current peak multiplier against UPGRADE_LADDER and applies any
   * newly achieved milestones permanently. Returns array of newly applied milestones.
   */
  public checkMilestones(peakMultiplier: number): UpgradeMilestone[] {
    const newlyApplied: UpgradeMilestone[] = [];

    for (let i = 0; i < UPGRADE_LADDER.length; i++) {
      const milestone = UPGRADE_LADDER[i];
      if (peakMultiplier >= milestone.multiplier && !this.appliedMilestones.has(milestone.multiplier)) {
        this.applyMilestone(milestone);
        newlyApplied.push(milestone);
      }
    }

    return newlyApplied;
  }

  /**
   * Legacy method for unlocking weapons via combo multiplier.
   */
  public unlockMilestone(multiplier: number): number[] {
    const newlyUnlocked: number[] = [];

    for (const def of LEGACY_WEAPON_DEFINITIONS) {
      if (multiplier >= def.unlockMultiplier && !this.unlocked.has(def.id)) {
        this.unlocked.add(def.id);
        const canonical = toCanonicalWeaponId(def.id);
        const maxAmmo = this.getEffectiveMaxAmmo(canonical);
        this.setAmmo(canonical, maxAmmo);
        newlyUnlocked.push(def.id);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Refills secondary weapon ammo by a given fraction (e.g. 0.35 for +35%),
   * capped at weapon maximum capacity. If weaponId is provided, refills only that weapon.
   */
  public addAmmo(fraction: number, weaponId?: number | string): void {
    if (weaponId !== undefined) {
      const canonical = toCanonicalWeaponId(weaponId);
      const maxAmmo = this.getEffectiveMaxAmmo(canonical);
      if (maxAmmo > 0 && this.isUnlocked(canonical)) {
        const cur = this.getAmmo(canonical);
        const refill = Math.ceil(maxAmmo * fraction);
        this.setAmmo(canonical, Math.min(maxAmmo, cur + refill));
      }
      return;
    }

    // Refill all unlocked secondary weapons
    for (const id of ALL_WEAPON_IDS) {
      const maxAmmo = this.getEffectiveMaxAmmo(id);
      if (maxAmmo > 0 && this.isUnlocked(id)) {
        const cur = this.getAmmo(id);
        const refill = Math.ceil(maxAmmo * fraction);
        this.setAmmo(id, Math.min(maxAmmo, cur + refill));
      }
    }
  }

  public getAmmo(id: number | WeaponId | string = this.currentWeaponId): number {
    const canonical = toCanonicalWeaponId(id);
    if (canonical === 'pistol') return -1;
    return this.ammo.get(canonical) ?? 0;
  }

  public isUnlocked(id: WeaponId | number | string): boolean {
    if (typeof id === 'string') {
      const canonical = toCanonicalWeaponId(id);
      return this.unlocked.has(canonical);
    }
    if (typeof id === 'number') {
      if (id >= 1 && id <= 6) {
        const canonical = SLOT_MAP[id];
        return this.unlocked.has(canonical);
      }
      if (id === 7) {
        return this.unlocked.has('rocket') || this.unlocked.has('claymore');
      }
      if (id === 8) {
        return this.unlocked.has('rocket') || this.unlocked.has('claymore');
      }
      if (id === 9) return this.unlocked.has('chargepack');
      if (id === 10) return this.unlocked.has('railgun');
    }
    return this.unlocked.has(id as any);
  }

  public getActiveWeaponId(): WeaponId {
    return this.currentWeaponId;
  }

  public getActiveWeaponDef(): WeaponDef {
    const canonical = this.getActiveWeaponId();
    const baseDef = BASE_WEAPON_DEFINITIONS[canonical];
    const slot = WEAPON_SLOT_MAP[canonical];
    const legacyId = WEAPON_LEGACY_ID_MAP[canonical] ?? slot;

    return {
      id: legacyId,
      slot: slot,
      name: baseDef.name,
      unlockMultiplier: 0,
      cooldown: this.getEffectiveCooldown(canonical),
      fireRate: this.getEffectiveCooldown(canonical),
      maxAmmo: this.getEffectiveMaxAmmo(canonical),
      isPlaceable: !!baseDef.isPlaceable,
      isAutomatic: !!baseDef.isAutomatic,
      damage: this.getEffectiveDamage(canonical),
      speed: this.getEffectiveSpeed(canonical),
      spread: this.getEffectiveSpread(canonical),
      count: this.getEffectivePelletCount(canonical),
      explosionRadius: this.getEffectiveBlastRadius(canonical),
      knockback: baseDef.knockback,
      hp: this.getEffectiveHp(canonical),
    };
  }

  public selectWeaponBySlot(slot: number): boolean {
    if (slot < 1 || slot > 10) return false;
    const canonical = SLOT_MAP[slot];
    if (!canonical || !this.isUnlocked(canonical)) return false;

    this.currentWeaponId = canonical;
    this.activeWeaponId = slot;
    return true;
  }

  public selectWeapon(id: number | WeaponId | string): boolean {
    if (typeof id === 'string') {
      const canonical = toCanonicalWeaponId(id);
      const slot = WEAPON_SLOT_MAP[canonical];
      return this.selectWeaponBySlot(slot);
    }
    if (typeof id === 'number') {
      if (id === 7) {
        // Legacy WeaponId.RocketLauncher = 7
        if (this.isUnlocked('rocket') && !this.isUnlocked('claymore')) {
          this.currentWeaponId = 'rocket';
          this.activeWeaponId = 7;
          return true;
        }
        if (this.isUnlocked('claymore') && !this.isUnlocked('rocket')) {
          return this.selectWeaponBySlot(7);
        }
        if (this.isUnlocked('rocket')) {
          this.currentWeaponId = 'rocket';
          this.activeWeaponId = 7;
          return true;
        }
        return false;
      }
      if (id >= 1 && id <= 10) {
        return this.selectWeaponBySlot(id);
      }
    }
    return false;
  }

  public selectSlot(slot: number): boolean {
    return this.selectWeaponBySlot(slot);
  }

  public nextWeapon(): number {
    const unlockedSlots: number[] = [];
    for (let s = 1; s <= 10; s++) {
      const weaponId = SLOT_MAP[s];
      if (this.unlocked.has(weaponId)) {
        unlockedSlots.push(s);
      }
    }
    if (unlockedSlots.length === 0) return this.activeWeaponId;

    const currentSlot = WEAPON_SLOT_MAP[this.currentWeaponId] ?? 1;
    const currentIndex = unlockedSlots.indexOf(currentSlot);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % unlockedSlots.length;
    const nextSlot = unlockedSlots[nextIndex];
    this.selectWeaponBySlot(nextSlot);
    return this.activeWeaponId;
  }

  public previousWeapon(): number {
    const unlockedSlots: number[] = [];
    for (let s = 1; s <= 10; s++) {
      const weaponId = SLOT_MAP[s];
      if (this.unlocked.has(weaponId)) {
        unlockedSlots.push(s);
      }
    }
    if (unlockedSlots.length === 0) return this.activeWeaponId;

    const currentSlot = WEAPON_SLOT_MAP[this.currentWeaponId] ?? 1;
    const currentIndex = unlockedSlots.indexOf(currentSlot);
    const prevIndex =
      currentIndex === -1
        ? unlockedSlots.length - 1
        : (currentIndex - 1 + unlockedSlots.length) % unlockedSlots.length;
    const prevSlot = unlockedSlots[prevIndex];
    this.selectWeaponBySlot(prevSlot);
    return this.activeWeaponId;
  }

  public updateCooldown(dt: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer = Math.max(0, this.cooldownTimer - dt);
    }
  }

  // --- Dynamic Stat Getters ---

  public getEffectiveCooldown(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.cooldown ?? 0.22;
    const weaponUpgrades = this.upgrades.get(canonical);
    if (!weaponUpgrades) return base;

    if (canonical === 'pistol') {
      if (weaponUpgrades.has('fast_fire')) return 0.14;
    } else if (canonical === 'uzi') {
      if (weaponUpgrades.has('rapid_fire')) return 0.05;
    } else if (canonical === 'shotgun') {
      if (weaponUpgrades.has('rapid_fire')) return 0.22;
      if (weaponUpgrades.has('fast_fire')) return 0.42;
    } else if (canonical === 'rocket') {
      if (weaponUpgrades.has('rapid_fire')) return 0.35;
      if (weaponUpgrades.has('fast_fire')) return 0.60;
    } else if (canonical === 'railgun') {
      if (weaponUpgrades.has('rapid_fire')) return 0.45;
      if (weaponUpgrades.has('fast_fire')) return 0.75;
    }

    return base;
  }

  public getEffectiveDamage(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.damage ?? 15;
    const weaponUpgrades = this.upgrades.get(canonical);
    if (!weaponUpgrades) return base;

    if (canonical === 'pistol') {
      if (weaponUpgrades.has('double_damage')) return 30;
    } else if (canonical === 'uzi') {
      if (weaponUpgrades.has('quad_damage')) return 40;
      if (weaponUpgrades.has('double_damage')) return 20;
    } else if (canonical === 'shotgun') {
      if (weaponUpgrades.has('double_damage')) return 24;
    } else if (canonical === 'barrel') {
      if (weaponUpgrades.has('bigger_bang')) return 260;
      if (weaponUpgrades.has('big_bang')) return 180;
    } else if (canonical === 'grenade') {
      if (weaponUpgrades.has('bigger_bang')) return 280;
      if (weaponUpgrades.has('big_bang')) return 200;
    } else if (canonical === 'claymore') {
      if (weaponUpgrades.has('bigger_bang')) return 300;
      if (weaponUpgrades.has('big_bang')) return 220;
    } else if (canonical === 'rocket') {
      if (weaponUpgrades.has('bigger_bang')) return 320;
      if (weaponUpgrades.has('big_bang')) return 240;
    } else if (canonical === 'chargepack') {
      if (weaponUpgrades.has('bigger_bang')) return 380;
      if (weaponUpgrades.has('big_bang')) return 260;
    } else if (canonical === 'railgun') {
      if (weaponUpgrades.has('long_shot')) return 200;
    }

    return base;
  }

  public getEffectiveMaxAmmo(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.maxAmmo ?? -1;
    if (base <= 0) return base; // -1 for Pistol

    const weaponUpgrades = this.upgrades.get(canonical);
    if (!weaponUpgrades) return base;

    if (weaponUpgrades.has('quad_ammo')) {
      return base * 4;
    }
    if (weaponUpgrades.has('double_ammo')) {
      return base * 2;
    }

    return base;
  }

  public getEffectivePelletCount(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    if (canonical !== 'shotgun') {
      return BASE_WEAPON_DEFINITIONS[canonical]?.count ?? 1;
    }

    const weaponUpgrades = this.upgrades.get('shotgun');
    if (weaponUpgrades?.has('wider_shot')) return 10;
    if (weaponUpgrades?.has('wide_shot')) return 7;
    return 5;
  }

  public getEffectiveBlastRadius(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.explosionRadius ?? 0;
    const weaponUpgrades = this.upgrades.get(canonical);
    if (!weaponUpgrades) return base;

    if (canonical === 'barrel' || canonical === 'grenade') {
      if (weaponUpgrades.has('bigger_bang')) return 8.0;
      if (weaponUpgrades.has('big_bang')) return 6.0;
      return 4.5;
    }
    if (canonical === 'claymore' || canonical === 'rocket') {
      if (weaponUpgrades.has('bigger_bang')) return 7.0;
      if (weaponUpgrades.has('big_bang')) return 5.5;
      return 4.0;
    }
    if (canonical === 'chargepack') {
      if (weaponUpgrades.has('bigger_bang')) return 9.0;
      if (weaponUpgrades.has('big_bang')) return 7.0;
      return 5.0;
    }

    return base;
  }

  public hasClusterExplode(id: WeaponId | number | string): boolean {
    const canonical = toCanonicalWeaponId(id);
    return !!this.upgrades.get(canonical)?.has('cluster_explode');
  }

  public isInfiniteRange(id: WeaponId | number | string): boolean {
    const canonical = toCanonicalWeaponId(id);
    return !!this.upgrades.get(canonical)?.has('infinite_range');
  }

  public getEffectiveSpeed(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.speed ?? 50;
    const weaponUpgrades = this.upgrades.get(canonical);
    if (canonical === 'uzi' && weaponUpgrades?.has('long_shot')) return 65;
    if (canonical === 'shotgun' && weaponUpgrades?.has('long_shot')) return 60;
    return base;
  }

  public getEffectiveSpread(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    const base = BASE_WEAPON_DEFINITIONS[canonical]?.spread ?? 0;
    if (canonical === 'shotgun') {
      const weaponUpgrades = this.upgrades.get('shotgun');
      if (weaponUpgrades?.has('wider_shot')) return 0.48;
      if (weaponUpgrades?.has('wide_shot')) return 0.35;
      return 0.25;
    }
    return base;
  }

  public getEffectiveHp(id: WeaponId | number | string): number {
    const canonical = toCanonicalWeaponId(id);
    if (canonical === 'fakewall') {
      const weaponUpgrades = this.upgrades.get('fakewall');
      if (weaponUpgrades?.has('quad_ammo')) return 400;
      if (weaponUpgrades?.has('double_ammo')) return 250;
      return 150;
    }
    if (canonical === 'barrel') return 35;
    return 0;
  }

  // --- Update & Fire ---

  public update(
    dt: number,
    input?: InputManager,
    playerPos?: { x: number; z: number },
    aimAngle?: number,
    context?: FireContext
  ): boolean {
    this.updateCooldown(dt);

    if (input) {
      if (typeof input.wheelDelta === 'number' && input.wheelDelta !== 0) {
        if (input.wheelDelta > 0) {
          this.nextWeapon();
        } else if (input.wheelDelta < 0) {
          this.previousWeapon();
        }
        input.activeSlot = this.activeWeaponId;
        if (typeof input.consumeWheelDelta === 'function') {
          input.consumeWheelDelta();
        } else {
          input.wheelDelta = 0;
        }
      } else if (input.activeSlot !== this.activeWeaponId) {
        if (this.isUnlocked(input.activeSlot)) {
          this.selectWeaponBySlot(input.activeSlot);
        } else {
          input.activeSlot = this.activeWeaponId;
        }
      }

      const def = this.getActiveWeaponDef();
      const isTriggered = def.isAutomatic
        ? input.isMouseDown
        : (input.isMouseDown && !this.prevMouseDown);
      this.prevMouseDown = input.isMouseDown;

      if (isTriggered && this.cooldownTimer <= 0 && playerPos && aimAngle !== undefined) {
        return this.fire(playerPos, aimAngle, context);
      }
    } else {
      this.prevMouseDown = false;
    }

    return false;
  }

  public canPlaceProp(
    x: number,
    z: number,
    radius: number,
    obstacles?: AABB[],
    barrels?: Barrel[],
    fakeWalls?: FakeWall[]
  ): boolean {
    // 1. Arena perimeter bounds check
    const halfW = ARENA_WIDTH / 2 - 1.0;
    const halfD = ARENA_DEPTH / 2 - 1.0;
    if (
      Math.abs(x) + radius > halfW ||
      Math.abs(z) + radius > halfD
    ) {
      return false;
    }

    // 2. Static and dynamic obstacles check
    if (obstacles) {
      for (let i = 0; i < obstacles.length; i++) {
        const box = obstacles[i];
        const clampedX = Math.max(box.minX, Math.min(x, box.maxX));
        const clampedZ = Math.max(box.minZ, Math.min(z, box.maxZ));
        const dx = x - clampedX;
        const dz = z - clampedZ;
        if (dx * dx + dz * dz < radius * radius) {
          return false;
        }
      }
    }

    // 3. Barrels check (prevent overlapping barrels)
    if (barrels) {
      for (let i = 0; i < barrels.length; i++) {
        const b = barrels[i];
        if (!b.alive || b.exploded) continue;
        const dx = x - b.pos.x;
        const dz = z - b.pos.z;
        const minClearance = radius + b.radius;
        if (dx * dx + dz * dz < minClearance * minClearance) {
          return false;
        }
      }
    }

    // 4. FakeWalls check (prevent overlapping fake walls)
    if (fakeWalls) {
      for (let i = 0; i < fakeWalls.length; i++) {
        const fw = fakeWalls[i];
        if (!fw.alive) continue;
        const box = fw.getAABB();
        const clampedX = Math.max(box.minX, Math.min(x, box.maxX));
        const clampedZ = Math.max(box.minZ, Math.min(z, box.maxZ));
        const dx = x - clampedX;
        const dz = z - clampedZ;
        if (dx * dx + dz * dz < radius * radius) {
          return false;
        }
      }
    }

    return true;
  }

  public fire(
    playerPos: { x: number; z: number },
    aimAngle: number,
    context?: FireContext
  ): boolean {
    if (this.cooldownTimer > 0) {
      return false;
    }

    const canonical = this.getActiveWeaponId();
    if (!this.isUnlocked(canonical)) {
      return false;
    }

    const curAmmo = this.getAmmo(canonical);
    const maxAmmo = this.getEffectiveMaxAmmo(canonical);
    if (maxAmmo > 0 && curAmmo <= 0) {
      return false;
    }

    const baseDef = BASE_WEAPON_DEFINITIONS[canonical];

    // Handle placeable props (Explosive Barrel & Fake Wall)
    if (baseDef.isPlaceable) {
      const placeDistance = 1.8;
      const px = playerPos.x + Math.sin(aimAngle) * placeDistance;
      const pz = playerPos.z + Math.cos(aimAngle) * placeDistance;
      const propRadius = canonical === 'barrel' ? 0.6 : (canonical === 'fakewall' ? 0.75 : 0.5);

      if (!this.canPlaceProp(px, pz, propRadius, context?.obstacles, context?.barrels, context?.fakeWalls)) {
        return false;
      }

      this.setAmmo(canonical, curAmmo - 1);
      this.cooldownTimer = this.getEffectiveCooldown(canonical);

      if (canonical === 'barrel') {
        const barrel = new Barrel(px, pz);
        const aabb = barrel.getAABB();
        barrel.aabb = aabb;
        if (context?.barrels) context.barrels.push(barrel);
        if (context?.obstacles) {
          context.obstacles.push(aabb);
          barrel.onDestroy = () => {
            const idx = context.obstacles!.indexOf(aabb);
            if (idx !== -1) {
              context.obstacles!.splice(idx, 1);
            }
          };
        }
        if (context?.scene) context.scene.add(barrel.mesh);
      } else if (canonical === 'fakewall') {
        const fakeWall = new FakeWall(px, pz);
        const hp = this.getEffectiveHp('fakewall');
        fakeWall.hp = hp;
        fakeWall.maxHp = hp;
        const aabb = fakeWall.getAABB();
        fakeWall.aabb = aabb;
        if (context?.fakeWalls) context.fakeWalls.push(fakeWall);
        if (context?.obstacles) {
          context.obstacles.push(aabb);
          fakeWall.onDestroy = () => {
            const idx = context.obstacles!.indexOf(aabb);
            if (idx !== -1) {
              context.obstacles!.splice(idx, 1);
            }
          };
        }
        if (context?.scene) context.scene.add(fakeWall.mesh);
      }

      return true;
    }

    // Handle projectile weapons
    if (maxAmmo > 0) {
      this.setAmmo(canonical, curAmmo - 1);
    }
    this.cooldownTimer = this.getEffectiveCooldown(canonical);

    const muzzleOffset = 0.8;
    const startX = playerPos.x + Math.sin(aimAngle) * muzzleOffset;
    const startZ = playerPos.z + Math.cos(aimAngle) * muzzleOffset;
    const damage = this.getEffectiveDamage(canonical);
    const speed = this.getEffectiveSpeed(canonical);
    const knockback = baseDef.knockback;

    switch (canonical) {
      case 'pistol': {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'bullet',
          startX,
          startZ,
          dirX,
          dirZ,
          damage,
          speed,
          knockback
        );
        break;
      }

      case 'uzi': {
        const spread = (Math.random() * 2 - 1) * this.getEffectiveSpread('uzi');
        const angle = aimAngle + spread;
        const dirX = Math.sin(angle);
        const dirZ = Math.cos(angle);
        context?.projectilePool?.spawn(
          'bullet',
          startX,
          startZ,
          dirX,
          dirZ,
          damage,
          speed,
          knockback
        );
        break;
      }

      case 'shotgun': {
        const count = this.getEffectivePelletCount('shotgun');
        const spread = this.getEffectiveSpread('shotgun');
        for (let i = 0; i < count; i++) {
          const angleOffset = count === 1 ? 0 : -spread + (2 * spread * i) / (count - 1);
          const angle = aimAngle + angleOffset;
          const dirX = Math.sin(angle);
          const dirZ = Math.cos(angle);
          context?.projectilePool?.spawn(
            'bullet',
            startX,
            startZ,
            dirX,
            dirZ,
            damage,
            speed,
            knockback
          );
        }
        break;
      }

      case 'rocket': {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'rocket',
          startX,
          startZ,
          dirX,
          dirZ,
          damage,
          speed
        );
        break;
      }

      case 'grenade': {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'grenade',
          startX,
          startZ,
          dirX,
          dirZ,
          damage,
          speed
        );
        break;
      }
    }

    return true;
  }
}
