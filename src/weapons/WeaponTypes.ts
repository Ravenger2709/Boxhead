export type WeaponId =
  | 'pistol'
  | 'uzi'
  | 'shotgun'
  | 'barrel'
  | 'grenade'
  | 'fakewall'
  | 'claymore'
  | 'rocket'
  | 'chargepack'
  | 'railgun';

export const WeaponId = {
  Pistol: 1,
  Uzi: 2,
  Shotgun: 3,
  Barrel: 4,
  Grenade: 5,
  FakeWall: 6,
  RocketLauncher: 7,
  Claymore: 8,
  ChargePack: 9,
  Railgun: 10,
  pistol: 'pistol',
  uzi: 'uzi',
  shotgun: 'shotgun',
  barrel: 'barrel',
  grenade: 'grenade',
  fakewall: 'fakewall',
  claymore: 'claymore',
  rocket: 'rocket',
  chargepack: 'chargepack',
  railgun: 'railgun',
} as const;

export interface WeaponDefinition {
  id: WeaponId;
  slot: number;
  name: string;
  isAutomatic: boolean;
  cooldown: number;
  fireRate?: number;
  damage: number;
  maxAmmo: number;
  speed?: number;
  spread?: number;
  pellets?: number;
  count?: number;
  knockback?: number;
  radius?: number;
  explosionRadius?: number;
  health?: number;
  hp?: number;
  range?: number;
  isPlaceable?: boolean;
}

export interface UpgradeMilestone {
  multiplier: number;
  type: 'unlock' | 'upgrade';
  weaponId: WeaponId;
  name: string;
  description: string;
  effectType: string;
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
    cooldown: 0.32,
    fireRate: 0.32,
    maxAmmo: -1,
    isPlaceable: false,
    isAutomatic: false,
    damage: 26,
    speed: 55,
    spread: 0,
    count: 1,
  },
  [WeaponId.Uzi]: {
    id: 2,
    slot: 2,
    name: 'Uzi',
    unlockMultiplier: 4,
    cooldown: 0.16,
    fireRate: 0.16,
    maxAmmo: 100,
    isPlaceable: false,
    isAutomatic: true,
    damage: 35,
    speed: 50,
    spread: 0.12,
    count: 1,
  },
  [WeaponId.Shotgun]: {
    id: 3,
    slot: 3,
    name: 'Shotgun',
    unlockMultiplier: 8,
    cooldown: 0.48,
    fireRate: 0.48,
    maxAmmo: 20,
    isPlaceable: false,
    isAutomatic: false,
    damage: 51,
    speed: 45,
    spread: (1.25 * Math.PI) / 180,
    count: 3,
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
    damage: 150,
    speed: 0,
    spread: 0,
    count: 1,
    explosionRadius: 4.5,
    hp: 1,
  },
  [WeaponId.Grenade]: {
    id: 5,
    slot: 5,
    name: 'Hand Grenade',
    unlockMultiplier: 16,
    cooldown: 0.4,
    fireRate: 0.4,
    maxAmmo: 20,
    isPlaceable: false,
    isAutomatic: false,
    damage: 150,
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
    maxAmmo: 5,
    isPlaceable: true,
    isAutomatic: false,
    damage: 0,
    speed: 0,
    spread: 0,
    count: 1,
    hp: 1000,
  },
  [WeaponId.RocketLauncher]: {
    id: 7,
    slot: 7,
    name: 'Rocket Launcher',
    unlockMultiplier: 40,
    cooldown: 0.48,
    fireRate: 0.48,
    maxAmmo: 20,
    isPlaceable: false,
    isAutomatic: false,
    damage: 250,
    speed: 28,
    spread: 0,
    count: 1,
    explosionRadius: 4.0,
  },
};

export const WEAPON_DEFINITIONS: readonly WeaponDef[] = Object.values(WEAPONS);
