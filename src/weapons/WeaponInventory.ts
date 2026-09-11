import * as THREE from 'three';
import {
  WEAPONS,
  WeaponId,
  WeaponDef,
  WEAPON_DEFINITIONS,
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

export class WeaponInventory {
  public unlocked: Set<number> = new Set<number>();
  public ammo: Map<number, number> = new Map<number, number>();
  public activeWeaponId: number = WeaponId.Pistol;
  public cooldownTimer: number = 0;

  constructor() {
    // Pistol is permanently unlocked from the start with infinite ammo (-1)
    this.unlocked.add(WeaponId.Pistol);
    this.ammo.set(WeaponId.Pistol, -1);
    this.activeWeaponId = WeaponId.Pistol;
  }

  /**
   * Checks current combo multiplier against weapon unlock milestones
   * (4x, 8x, 12x, 16x, 20x, 40x) and unlocks eligible weapons permanently.
   * Returns an array of newly unlocked weapon IDs.
   */
  public unlockMilestone(multiplier: number): number[] {
    const newlyUnlocked: number[] = [];

    for (const def of WEAPON_DEFINITIONS) {
      if (multiplier >= def.unlockMultiplier && !this.unlocked.has(def.id)) {
        this.unlocked.add(def.id);
        this.ammo.set(def.id, def.maxAmmo);
        newlyUnlocked.push(def.id);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Refills secondary weapon ammo by a given fraction (e.g. 0.35 for +35%),
   * capped at weapon maximum capacity. If weaponId is provided, refills only that weapon.
   */
  public addAmmo(fraction: number, weaponId?: number): void {
    if (weaponId !== undefined) {
      const def = WEAPONS[weaponId];
      if (def && def.maxAmmo > 0 && this.unlocked.has(weaponId)) {
        const cur = this.ammo.get(weaponId) ?? 0;
        const refill = Math.ceil(def.maxAmmo * fraction);
        this.ammo.set(weaponId, Math.min(def.maxAmmo, cur + refill));
      }
      return;
    }

    // Refill all unlocked secondary weapons
    for (const id of this.unlocked) {
      const def = WEAPONS[id];
      if (def && def.maxAmmo > 0) {
        const cur = this.ammo.get(id) ?? 0;
        const refill = Math.ceil(def.maxAmmo * fraction);
        this.ammo.set(id, Math.min(def.maxAmmo, cur + refill));
      }
    }
  }

  public getAmmo(id: number = this.activeWeaponId): number {
    return this.ammo.get(id) ?? 0;
  }

  public isUnlocked(id: number): boolean {
    return this.unlocked.has(id);
  }

  public getActiveWeaponDef(): WeaponDef {
    return WEAPONS[this.activeWeaponId] ?? WEAPONS[WeaponId.Pistol];
  }

  public selectWeapon(id: number): boolean {
    if (this.unlocked.has(id) && WEAPONS[id]) {
      this.activeWeaponId = id;
      return true;
    }
    return false;
  }

  public selectSlot(slot: number): boolean {
    return this.selectWeapon(slot);
  }

  public nextWeapon(): number {
    const unlockedIds = Array.from(this.unlocked).sort((a, b) => a - b);
    if (unlockedIds.length === 0) return this.activeWeaponId;

    const currentIndex = unlockedIds.indexOf(this.activeWeaponId);
    const nextIndex = (currentIndex + 1) % unlockedIds.length;
    this.activeWeaponId = unlockedIds[nextIndex];
    return this.activeWeaponId;
  }

  public previousWeapon(): number {
    const unlockedIds = Array.from(this.unlocked).sort((a, b) => a - b);
    if (unlockedIds.length === 0) return this.activeWeaponId;

    const currentIndex = unlockedIds.indexOf(this.activeWeaponId);
    const prevIndex = (currentIndex - 1 + unlockedIds.length) % unlockedIds.length;
    this.activeWeaponId = unlockedIds[prevIndex];
    return this.activeWeaponId;
  }

  public updateCooldown(dt: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer = Math.max(0, this.cooldownTimer - dt);
    }
  }

  public update(
    dt: number,
    input?: InputManager,
    playerPos?: { x: number; z: number },
    aimAngle?: number,
    context?: FireContext
  ): boolean {
    this.updateCooldown(dt);

    if (input) {
      if (input.activeSlot !== this.activeWeaponId) {
        if (this.isUnlocked(input.activeSlot)) {
          this.activeWeaponId = input.activeSlot;
        } else {
          input.activeSlot = this.activeWeaponId;
        }
      }

      if (input.isMouseDown && playerPos && aimAngle !== undefined) {
        const def = this.getActiveWeaponDef();
        if (def.isAutomatic && this.cooldownTimer <= 0) {
          return this.fire(playerPos, aimAngle, context);
        }
      }
    }

    return false;
  }

  /**
   * Tests whether a prop can be placed cleanly without clipping into walls or boundary.
   */
  public canPlaceProp(
    x: number,
    z: number,
    radius: number,
    obstacles?: AABB[]
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

    // 2. Obstacles check
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

    return true;
  }

  /**
   * Fires the active weapon or places a prop in front of the player.
   */
  public fire(
    playerPos: { x: number; z: number },
    aimAngle: number,
    context?: FireContext
  ): boolean {
    if (this.cooldownTimer > 0) {
      return false;
    }

    const def = this.getActiveWeaponDef();
    if (!def || !this.unlocked.has(def.id)) {
      return false;
    }

    const curAmmo = this.getAmmo(def.id);
    if (def.maxAmmo > 0 && curAmmo <= 0) {
      return false;
    }

    // Handle placeable props (Explosive Barrel & Fake Wall)
    if (def.isPlaceable) {
      const placeDistance = 1.8;
      const px = playerPos.x + Math.sin(aimAngle) * placeDistance;
      const pz = playerPos.z + Math.cos(aimAngle) * placeDistance;
      const propRadius = def.id === WeaponId.Barrel ? 0.6 : 0.75;

      if (!this.canPlaceProp(px, pz, propRadius, context?.obstacles)) {
        return false;
      }

      // Deduct ammo & activate cooldown only after placement succeeds
      this.ammo.set(def.id, curAmmo - 1);
      this.cooldownTimer = def.cooldown;

      if (def.id === WeaponId.Barrel) {
        const barrel = new Barrel(px, pz);
        if (context?.barrels) context.barrels.push(barrel);
        if (context?.scene) context.scene.add(barrel.mesh);
      } else if (def.id === WeaponId.FakeWall) {
        const fakeWall = new FakeWall(px, pz);
        if (context?.fakeWalls) context.fakeWalls.push(fakeWall);
        if (context?.obstacles) context.obstacles.push(fakeWall.getAABB());
        if (context?.scene) context.scene.add(fakeWall.mesh);
      }

      return true;
    }

    // Handle projectile weapons
    if (def.maxAmmo > 0) {
      this.ammo.set(def.id, curAmmo - 1);
    }
    this.cooldownTimer = def.cooldown;

    const muzzleOffset = 0.8;
    const startX = playerPos.x + Math.sin(aimAngle) * muzzleOffset;
    const startZ = playerPos.z + Math.cos(aimAngle) * muzzleOffset;

    switch (def.id) {
      case WeaponId.Pistol: {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'bullet',
          startX,
          startZ,
          dirX,
          dirZ,
          def.damage,
          def.speed
        );
        break;
      }

      case WeaponId.Uzi: {
        const spread = (Math.random() * 2 - 1) * def.spread;
        const angle = aimAngle + spread;
        const dirX = Math.sin(angle);
        const dirZ = Math.cos(angle);
        context?.projectilePool?.spawn(
          'bullet',
          startX,
          startZ,
          dirX,
          dirZ,
          def.damage,
          def.speed
        );
        break;
      }

      case WeaponId.Shotgun: {
        const offsets = [-def.spread, -def.spread * 0.5, 0, def.spread * 0.5, def.spread];
        for (let i = 0; i < offsets.length; i++) {
          const angle = aimAngle + offsets[i];
          const dirX = Math.sin(angle);
          const dirZ = Math.cos(angle);
          context?.projectilePool?.spawn(
            'bullet',
            startX,
            startZ,
            dirX,
            dirZ,
            def.damage,
            def.speed
          );
        }
        break;
      }

      case WeaponId.RocketLauncher: {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'rocket',
          startX,
          startZ,
          dirX,
          dirZ,
          def.damage,
          def.speed
        );
        break;
      }

      case WeaponId.Grenade: {
        const dirX = Math.sin(aimAngle);
        const dirZ = Math.cos(aimAngle);
        context?.projectilePool?.spawn(
          'grenade',
          startX,
          startZ,
          dirX,
          dirZ,
          def.damage,
          def.speed
        );
        break;
      }
    }

    return true;
  }
}
