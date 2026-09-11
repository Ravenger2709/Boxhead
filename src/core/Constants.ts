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
