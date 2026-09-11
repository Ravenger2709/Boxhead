export enum WeaponId {
  Pistol = 1,
  Uzi = 2,
  Shotgun = 3,
  Barrel = 4,
  Grenade = 5,
  FakeWall = 6,
  RocketLauncher = 7,
}

export interface WeaponDef {
  readonly id: number;
  readonly slot: number;
  readonly name: string;
  readonly unlockMultiplier: number;
  readonly cooldown: number;
  readonly fireRate: number; // Seconds between shots (alias of cooldown)
  readonly maxAmmo: number; // -1 for infinite (Pistol)
  readonly isPlaceable: boolean;
  readonly isAutomatic: boolean;
  readonly damage: number;
  readonly speed: number;
  readonly spread: number; // Radians
  readonly count: number; // Projectiles spawned per trigger (e.g. 5 for shotgun)
  readonly explosionRadius?: number;
  readonly knockback?: number;
  readonly hp?: number;
}

export const WEAPONS: Record<number, WeaponDef> = {
  [WeaponId.Pistol]: {
    id: 1,
    slot: 1,
    name: 'Pistol',
    unlockMultiplier: 1,
    cooldown: 0.22,
    fireRate: 0.22,
    maxAmmo: -1,
    isPlaceable: false,
    isAutomatic: false,
    damage: 15,
    speed: 55,
    spread: 0,
    count: 1,
  },
  [WeaponId.Uzi]: {
    id: 2,
    slot: 2,
    name: 'Uzi',
    unlockMultiplier: 4,
    cooldown: 0.08,
    fireRate: 0.08,
    maxAmmo: 200,
    isPlaceable: false,
    isAutomatic: true,
    damage: 10,
    speed: 50,
    spread: 0.12,
    count: 1,
  },
  [WeaponId.Shotgun]: {
    id: 3,
    slot: 3,
    name: 'Shotgun',
    unlockMultiplier: 8,
    cooldown: 0.65,
    fireRate: 0.65,
    maxAmmo: 50,
    isPlaceable: false,
    isAutomatic: false,
    damage: 12,
    speed: 45,
    spread: 0.25,
    count: 5,
    knockback: 8.0,
  },
  [WeaponId.Barrel]: {
    id: 4,
    slot: 4,
    name: 'Explosive Barrel',
    unlockMultiplier: 12,
    cooldown: 0.3,
    fireRate: 0.3,
    maxAmmo: 10,
    isPlaceable: true,
    isAutomatic: false,
    damage: 120,
    speed: 0,
    spread: 0,
    count: 1,
    explosionRadius: 4.5,
    hp: 35,
  },
  [WeaponId.Grenade]: {
    id: 5,
    slot: 5,
    name: 'Hand Grenade',
    unlockMultiplier: 16,
    cooldown: 0.4,
    fireRate: 0.4,
    maxAmmo: 15,
    isPlaceable: false,
    isAutomatic: false,
    damage: 140,
    speed: 12,
    spread: 0,
    count: 1,
    explosionRadius: 4.5,
  },
  [WeaponId.FakeWall]: {
    id: 6,
    slot: 6,
    name: 'Fake Wall',
    unlockMultiplier: 20,
    cooldown: 0.3,
    fireRate: 0.3,
    maxAmmo: 15,
    isPlaceable: true,
    isAutomatic: false,
    damage: 0,
    speed: 0,
    spread: 0,
    count: 1,
    hp: 150,
  },
  [WeaponId.RocketLauncher]: {
    id: 7,
    slot: 7,
    name: 'Rocket Launcher',
    unlockMultiplier: 40,
    cooldown: 1.0,
    fireRate: 1.0,
    maxAmmo: 20,
    isPlaceable: false,
    isAutomatic: false,
    damage: 160,
    speed: 28,
    spread: 0,
    count: 1,
    explosionRadius: 4.0,
  },
};

export const WEAPON_DEFINITIONS: readonly WeaponDef[] = Object.values(WEAPONS);
