// ==========================================
// Arena Dimensions & Layout
// ==========================================
export const ARENA_WIDTH = 52;
export const ARENA_DEPTH = 36;
export const WALL_HEIGHT = 2.5;
export const WALL_THICKNESS = 1.5;
export const PILLAR_SIZE = 2.5;

export const PILLAR_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [-14, -8],
  [14, -8],
  [-14, 8],
  [14, 8],
] as const;

// ==========================================
// Camera Configuration
// ==========================================
export const CAMERA_BASE_VIEW_HEIGHT = 32;
export const CAMERA_OFFSET_Y = 26;
export const CAMERA_OFFSET_Z = 18;

// ==========================================
// Lighting Configuration
// ==========================================
export const AMBIENT_LIGHT_COLOR = 0x777777;
export const AMBIENT_LIGHT_INTENSITY = 1.0;
export const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
export const DIRECTIONAL_LIGHT_INTENSITY = 1.2;
export const DIRECTIONAL_LIGHT_POS = { x: -25, y: 45, z: -20 } as const;

// ==========================================
// Color Palette (Flash Boxhead Authentic)
// ==========================================
export const COLOR_FLOOR = 0xD9C8A9;
export const COLOR_WALL = 0xE5E5E5;
export const COLOR_OUTLINE = 0x111111;

// Player Colors
export const COLOR_PLAYER_TORSO = 0x2980B9;
export const COLOR_PLAYER_SKIN = 0xF3C59A;
export const COLOR_PLAYER_HAIR = 0x111111;

// Enemy Colors
export const COLOR_ZOMBIE_TORSO = 0xBDC3C7;
export const COLOR_ZOMBIE_SKIN = 0x7F8C8D;
export const COLOR_DEVIL_BODY = 0xC0392B;
export const COLOR_DEVIL_EYES = 0xF1C40F;

// Prop Colors
export const COLOR_BARREL_BODY = 0xE74C3C;
export const COLOR_BARREL_STRIPE = 0xF1C40F;
export const COLOR_WOOD_CRATE = 0xD35400;
export const COLOR_FAKE_WALL = 0x8D6E63;

// Blood Tones
export const BLOOD_COLORS = ['#8B0000', '#A93226', '#922B21'] as const;

// ==========================================
// Physics & Movement Constants
// ==========================================
export const PLAYER_RADIUS = 0.7;
export const PLAYER_SPEED = 9.0;
export const PLAYER_MAX_HP = 100;

export const ZOMBIE_RADIUS = 0.65;
export const ZOMBIE_SPEED = 4.2;
export const ZOMBIE_HP = 30;
export const ZOMBIE_CONTACT_DAMAGE = 15;
export const ZOMBIE_ATTACK_COOLDOWN = 0.6;

export const DEVIL_RADIUS = 0.9;
export const DEVIL_SPEED = 3.2;
export const DEVIL_HP = 150;
export const DEVIL_FIREBALL_COOLDOWN = 3.0;
export const DEVIL_FIREBALL_DAMAGE = 25;
export const DEVIL_FIREBALL_SPEED = 14;
export const DEVIL_CONTACT_DAMAGE = 20;
export const DEVIL_ATTACK_COOLDOWN = 0.8;
export const DEVIL_CAST_DURATION = 0.5;
export const DEVIL_STAGGER_DURATION = 0.3;

export const ZOMBIE_SEPARATION_RADIUS = 1.6;
export const ZOMBIE_SEPARATION_WEIGHT = 0.75;
export const ZOMBIE_TARGET_WEIGHT = 1.0;

// ==========================================
// 2D Physics Geometry Interfaces
// ==========================================
export interface AABB {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Circle {
  x: number;
  z: number;
  radius: number;
}

// ==========================================
// 10 Weapon Baseline Definitions
// ==========================================
import type { WeaponId, WeaponDefinition, UpgradeMilestone } from '../weapons/WeaponTypes';
export type { WeaponId, WeaponDefinition, UpgradeMilestone };

export const WEAPON_DEFINITIONS: Record<WeaponId, WeaponDefinition> = {
  pistol: {
    id: 'pistol',
    slot: 1,
    name: 'Pistol',
    isAutomatic: false,
    cooldown: 0.22,
    fireRate: 0.22,
    damage: 15,
    speed: 55,
    maxAmmo: -1,
    spread: 0,
    count: 1,
    isPlaceable: false,
  },
  uzi: {
    id: 'uzi',
    slot: 2,
    name: 'UZI',
    isAutomatic: true,
    cooldown: 0.08,
    fireRate: 0.08,
    damage: 10,
    speed: 50,
    maxAmmo: 200,
    spread: 0.12,
    count: 1,
    isPlaceable: false,
  },
  shotgun: {
    id: 'shotgun',
    slot: 3,
    name: 'Shotgun',
    isAutomatic: false,
    cooldown: 0.65,
    fireRate: 0.65,
    damage: 12,
    speed: 45,
    maxAmmo: 50,
    pellets: 5,
    count: 5,
    spread: 0.25,
    knockback: 4.5,
    isPlaceable: false,
  },
  barrel: {
    id: 'barrel',
    slot: 4,
    name: 'Explosive Barrel',
    isAutomatic: false,
    cooldown: 0.5,
    fireRate: 0.5,
    damage: 120,
    maxAmmo: 10,
    radius: 4.5,
    explosionRadius: 4.5,
    health: 35,
    hp: 35,
    speed: 0,
    count: 1,
    isPlaceable: true,
  },
  grenade: {
    id: 'grenade',
    slot: 5,
    name: 'Hand Grenade',
    isAutomatic: false,
    cooldown: 0.6,
    fireRate: 0.6,
    damage: 140,
    speed: 12,
    maxAmmo: 15,
    radius: 4.5,
    explosionRadius: 4.5,
    count: 1,
    isPlaceable: false,
  },
  fakewall: {
    id: 'fakewall',
    slot: 6,
    name: 'Fake Wall',
    isAutomatic: false,
    cooldown: 0.5,
    fireRate: 0.5,
    damage: 0,
    maxAmmo: 15,
    health: 150,
    hp: 150,
    speed: 0,
    count: 1,
    isPlaceable: true,
  },
  claymore: {
    id: 'claymore',
    slot: 7,
    name: 'Claymore',
    isAutomatic: false,
    cooldown: 0.5,
    fireRate: 0.5,
    damage: 150,
    maxAmmo: 10,
    radius: 4.0,
    explosionRadius: 4.0,
    speed: 0,
    count: 1,
    isPlaceable: true,
  },
  rocket: {
    id: 'rocket',
    slot: 8,
    name: 'Rocket Launcher',
    isAutomatic: false,
    cooldown: 1.0,
    fireRate: 1.0,
    damage: 160,
    speed: 28,
    maxAmmo: 20,
    radius: 4.0,
    explosionRadius: 4.0,
    spread: 0,
    count: 1,
    isPlaceable: false,
  },
  chargepack: {
    id: 'chargepack',
    slot: 9,
    name: 'Charge Pack',
    isAutomatic: false,
    cooldown: 0.5,
    fireRate: 0.5,
    damage: 180,
    maxAmmo: 8,
    radius: 5.0,
    explosionRadius: 5.0,
    speed: 0,
    count: 1,
    isPlaceable: true,
  },
  railgun: {
    id: 'railgun',
    slot: 10,
    name: 'Railgun',
    isAutomatic: false,
    cooldown: 1.2,
    fireRate: 1.2,
    damage: 100,
    maxAmmo: 25,
    range: 60,
    speed: 0,
    count: 1,
    isPlaceable: false,
  },
};

// ==========================================
// 58-Milestone Upgrade Progression Ladder
// Authentic Boxhead 2Play Bytecode Table
// ==========================================
export const UPGRADE_LADDER: readonly UpgradeMilestone[] = [
  { multiplier: 3, type: 'upgrade', weaponId: 'pistol', name: 'Pistol+: Fast Fire', description: 'Cooldown 0.22s -> 0.14s', effectType: 'fast_fire' },
  { multiplier: 5, type: 'unlock', weaponId: 'uzi', name: 'New Weapon: UZI (Key 2)', description: 'Unlocks automatic UZI (200 ammo)', effectType: 'unlock' },
  { multiplier: 8, type: 'upgrade', weaponId: 'pistol', name: 'Pistol+: Double Damage', description: 'Damage 15 -> 30', effectType: 'double_damage' },
  { multiplier: 10, type: 'unlock', weaponId: 'shotgun', name: 'New Weapon: Shotgun (Key 3)', description: 'Unlocks 5-pellet shotgun (50 ammo)', effectType: 'unlock' },
  { multiplier: 13, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Rapid Fire', description: 'Cooldown 0.08s -> 0.05s', effectType: 'rapid_fire' },
  { multiplier: 15, type: 'unlock', weaponId: 'barrel', name: 'New Weapon: Barrel (Key 4)', description: 'Unlocks placeable red explosive barrels (10 count)', effectType: 'unlock' },
  { multiplier: 17, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Double Ammo', description: 'Max ammo 200 -> 400, +200 ammo granted', effectType: 'double_ammo' },
  { multiplier: 18, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Fast Fire', description: 'Cooldown 0.65s -> 0.42s', effectType: 'fast_fire' },
  { multiplier: 20, type: 'unlock', weaponId: 'grenade', name: 'New Weapon: Grenade (Key 5)', description: 'Unlocks hand grenades (15 count)', effectType: 'unlock' },
  { multiplier: 21, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Double Ammo', description: 'Max ammo 50 -> 100, +50 ammo granted', effectType: 'double_ammo' },
  { multiplier: 23, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Long Shot', description: 'Bullet speed 50 -> 65, lifespan 0.5s -> 0.8s', effectType: 'long_shot' },
  { multiplier: 26, type: 'upgrade', weaponId: 'barrel', name: 'Barrel+: Double Ammo', description: 'Max ammo 10 -> 20, +10 barrels granted', effectType: 'double_ammo' },
  { multiplier: 30, type: 'unlock', weaponId: 'fakewall', name: 'New Weapon: Fake walls (Key 6)', description: 'Unlocks placeable barricades (15 count)', effectType: 'unlock' },
  { multiplier: 31, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Wide Shot', description: 'Pellets 5 -> 7, spread cone ±0.25 -> ±0.35 rad', effectType: 'wide_shot' },
  { multiplier: 32, type: 'upgrade', weaponId: 'barrel', name: 'Barrel+: Big Bang', description: 'Radius 4.5 -> 6.0, damage 120 -> 180', effectType: 'big_bang' },
  { multiplier: 33, type: 'upgrade', weaponId: 'grenade', name: 'Grenade+: Cluster Explode', description: 'Primary blast spawns 4 sub-bomblets with radial bounce', effectType: 'cluster_explode' },
  { multiplier: 35, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Long Shot', description: 'Pellet speed 45 -> 60, range +40%', effectType: 'long_shot' },
  { multiplier: 36, type: 'upgrade', weaponId: 'barrel', name: 'Barrel+: Quad Ammo', description: 'Max ammo 20 -> 40, +20 barrels granted', effectType: 'quad_ammo' },
  { multiplier: 37, type: 'upgrade', weaponId: 'fakewall', name: 'Fake Wall+: Double Ammo', description: 'Max ammo 15 -> 30, +15 walls granted, HP 150 -> 250', effectType: 'double_ammo' },
  { multiplier: 39, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Quad Ammo', description: 'Max ammo 400 -> 800, +400 ammo granted', effectType: 'quad_ammo' },
  { multiplier: 40, type: 'unlock', weaponId: 'claymore', name: 'New Weapon: Claymore (Key 7)', description: 'Unlocks proximity landmines (10 count)', effectType: 'unlock' },
  { multiplier: 41, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Quad Ammo', description: 'Max ammo 100 -> 200, +100 ammo granted', effectType: 'quad_ammo' },
  { multiplier: 42, type: 'upgrade', weaponId: 'grenade', name: 'Grenade+: Double Ammo', description: 'Max ammo 15 -> 30, +15 grenades granted', effectType: 'double_ammo' },
  { multiplier: 43, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Rapid Fire', description: 'Cooldown 0.42s -> 0.22s (near-automatic fire)', effectType: 'rapid_fire' },
  { multiplier: 44, type: 'upgrade', weaponId: 'barrel', name: 'Barrel+: Bigger Bang', description: 'Radius 6.0 -> 8.0, damage 180 -> 260', effectType: 'bigger_bang' },
  { multiplier: 45, type: 'upgrade', weaponId: 'grenade', name: 'Grenade+: Big Bang', description: 'Radius 4.5 -> 6.0, damage 140 -> 200', effectType: 'big_bang' },
  { multiplier: 47, type: 'upgrade', weaponId: 'claymore', name: 'Claymore+: Cluster Explode', description: 'Mine detonation triggers 4 secondary cluster bursts', effectType: 'cluster_explode' },
  { multiplier: 48, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Double Damage', description: 'Bullet damage 10 -> 20', effectType: 'double_damage' },
  { multiplier: 50, type: 'unlock', weaponId: 'rocket', name: 'New Weapon: Rocket (Key 8)', description: 'Unlocks straight explosive rockets (20 count)', effectType: 'unlock' },
  { multiplier: 51, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Wider Shot', description: 'Pellets 7 -> 10, spread cone ±0.35 -> ±0.48 rad', effectType: 'wider_shot' },
  { multiplier: 52, type: 'upgrade', weaponId: 'grenade', name: 'Grenade+: Quad Ammo', description: 'Max ammo 30 -> 60, +30 grenades granted', effectType: 'quad_ammo' },
  { multiplier: 53, type: 'upgrade', weaponId: 'fakewall', name: 'Fake Wall+: Quad Ammo', description: 'Max ammo 30 -> 60, +30 walls granted, HP 250 -> 400', effectType: 'quad_ammo' },
  { multiplier: 54, type: 'upgrade', weaponId: 'claymore', name: 'Claymore+: Double Ammo', description: 'Max ammo 10 -> 20, +10 mines granted', effectType: 'double_ammo' },
  { multiplier: 55, type: 'unlock', weaponId: 'chargepack', name: 'New Weapon: Chargepack (Key 9)', description: 'Unlocks remote-detonated C-4 satchels (8 count)', effectType: 'unlock' },
  { multiplier: 56, type: 'upgrade', weaponId: 'shotgun', name: 'Shotgun+: Double Damage', description: 'Pellet damage 12 -> 24 (240 total damage on direct blast)', effectType: 'double_damage' },
  { multiplier: 57, type: 'upgrade', weaponId: 'grenade', name: 'Grenade+: Bigger Bang', description: 'Radius 6.0 -> 8.0, damage 200 -> 280', effectType: 'bigger_bang' },
  { multiplier: 58, type: 'upgrade', weaponId: 'claymore', name: 'Claymore+: Big Bang', description: 'Radius 4.0 -> 5.5, damage 150 -> 220', effectType: 'big_bang' },
  { multiplier: 59, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Fast Fire', description: 'Cooldown 1.0s -> 0.60s', effectType: 'fast_fire' },
  { multiplier: 61, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Infinite Range', description: 'Bullets travel across entire map until hitting walls', effectType: 'infinite_range' },
  { multiplier: 62, type: 'upgrade', weaponId: 'claymore', name: 'Claymore+: Bigger Bang', description: 'Radius 5.5 -> 7.0, damage 220 -> 300', effectType: 'bigger_bang' },
  { multiplier: 63, type: 'upgrade', weaponId: 'chargepack', name: 'Charge Pack+: Cluster Explode', description: 'Remote blast triggers 4 secondary cluster charges', effectType: 'cluster_explode' },
  { multiplier: 64, type: 'upgrade', weaponId: 'claymore', name: 'Claymore+: Quad Ammo', description: 'Max ammo 20 -> 40, +20 mines granted', effectType: 'quad_ammo' },
  { multiplier: 66, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Double Ammo', description: 'Max ammo 20 -> 40, +20 rockets granted', effectType: 'double_ammo' },
  { multiplier: 68, type: 'upgrade', weaponId: 'chargepack', name: 'Charge Pack+: Double Ammo', description: 'Max ammo 8 -> 16, +8 charges granted', effectType: 'double_ammo' },
  { multiplier: 70, type: 'unlock', weaponId: 'railgun', name: 'New Weapon: Railgun (Key 0)', description: 'Unlocks instant laser beam sniper (25 charges)', effectType: 'unlock' },
  { multiplier: 72, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Big Bang', description: 'Radius 4.0 -> 5.5, damage 160 -> 240', effectType: 'big_bang' },
  { multiplier: 74, type: 'upgrade', weaponId: 'chargepack', name: 'Charge Pack+: Big Bang', description: 'Radius 5.0 -> 7.0, damage 180 -> 260', effectType: 'big_bang' },
  { multiplier: 76, type: 'upgrade', weaponId: 'chargepack', name: 'Charge Pack+: Quad Ammo', description: 'Max ammo 16 -> 32, +16 charges granted', effectType: 'quad_ammo' },
  { multiplier: 78, type: 'upgrade', weaponId: 'railgun', name: 'Railgun+: Fast Fire', description: 'Cooldown 1.2s -> 0.75s', effectType: 'fast_fire' },
  { multiplier: 80, type: 'upgrade', weaponId: 'railgun', name: 'Railgun+: Double Ammo', description: 'Max ammo 25 -> 50, +25 charges granted', effectType: 'double_ammo' },
  { multiplier: 85, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Quad Ammo', description: 'Max ammo 40 -> 80, +40 rockets granted', effectType: 'quad_ammo' },
  { multiplier: 90, type: 'upgrade', weaponId: 'uzi', name: 'UZI+: Quad Damage', description: 'Bullet damage 20 -> 40 (hyper-destructive SMG)', effectType: 'quad_damage' },
  { multiplier: 95, type: 'upgrade', weaponId: 'chargepack', name: 'Charge Pack+: Bigger Bang', description: 'Radius 7.0 -> 9.0, damage 260 -> 380', effectType: 'bigger_bang' },
  { multiplier: 100, type: 'upgrade', weaponId: 'railgun', name: 'Railgun+: Rapid Fire', description: 'Cooldown 0.75s -> 0.45s', effectType: 'rapid_fire' },
  { multiplier: 105, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Bigger Bang', description: 'Radius 5.5 -> 7.0, damage 240 -> 320', effectType: 'bigger_bang' },
  { multiplier: 110, type: 'upgrade', weaponId: 'railgun', name: 'Railgun+: Quad Ammo', description: 'Max ammo 50 -> 100, +50 charges granted', effectType: 'quad_ammo' },
  { multiplier: 120, type: 'upgrade', weaponId: 'rocket', name: 'Rocket+: Rapid Fire', description: 'Cooldown 0.60s -> 0.35s', effectType: 'rapid_fire' },
  { multiplier: 125, type: 'upgrade', weaponId: 'railgun', name: 'Railgun+: Long Shot', description: 'Piercing damage 100 -> 200, thicker beam width', effectType: 'long_shot' },
];

