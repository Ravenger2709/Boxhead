# Boxhead 2Play - Browser Clone

A playable, performant browser clone of the classic Flash game **Boxhead 2Play**, built using **Vite**, **TypeScript**, and **Three.js**.

![Boxhead 2Play](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r170+-000000?logo=threedotjs)
![Tests](https://img.shields.io/badge/Vitest-240%20passing-brightgreen?logo=vitest)

---

## 🎮 How to Play

### Controls
- **W, A, S, D**: Move Player 1
- **Mouse Movement**: Aim raycasted against the arena floor plane ($y = 0$)
- **Left Click**: Fire active weapon or place barricade/barrel
- **Number Keys 1–7** or **Mouse Wheel**: Switch active unlocked weapon
- **M**: Mute / Unmute procedural sound effects
- **Spacebar / Enter**: Restart on Game Over

---

## 🔫 Weapons & Equipment

Weapons unlock permanently as you achieve combo multiplier milestones during your run:

| Slot | Weapon | Unlock | Fire Mode | Ammo | Description |
|---|---|---|---|---|---|
| **1** | **Pistol** | `1x` | Semi-Auto | $\infty$ | Standard sidearm with zero spread and high velocity. |
| **2** | **Uzi** | `4x` | Full-Auto | 200 | High rate-of-fire submachine gun with slight cone spread. |
| **3** | **Shotgun** | `8x` | Semi-Auto | 50 | 5-pellet spread with heavy knockback to repel swarms. |
| **4** | **Explosive Barrel** | `12x` | Placeable | 10 | Detonates when hit by damage, triggering recursive chain reactions. |
| **5** | **Hand Grenade** | `16x` | Thrown | 15 | Bouncing parabolic projectile with 2.0s fuse timer. |
| **6** | **Fake Wall** | `20x` | Placeable | 15 | Barricade with 150 HP that draws zombie aggro to protect the player. |
| **7** | **Rocket Launcher** | `40x` | Semi-Auto | 20 | High-velocity rocket detonating on impact with enemies or walls. |

---

## 🧟 Enemies & Waves

- **Standard Zombies**: 30 HP, 4.2 u/s speed. Swarm using anti-clumping separation steering and attack both the player and obstructing fake walls.
- **Red Devils**: Spawn starting at Wave 4+. 150 HP, tanky movement. Every 3.0 seconds, pauses to cast a slow fiery orange projectile. Sustained bullet fire interrupts their casting.
- **Wooden Crates**: Drop periodically in open arena space, restoring **+25% HP** and **+35% secondary ammo**.

---

## ⚡ Technical & Performance Features

- **Orthographic Camera**: Fixed angle looking down from south `(x, y + 26, z + 18)` focused on `(x, 0, z)` with dynamic aspect-ratio adaptation.
- **Strict Object Pooling**: Pre-allocated pools for 440 projectiles, 400 3D particle cubes, and 60 floating damage numbers with zero runtime mesh/geometry allocations in the animation loop.
- **Dynamic 2D Blood Decals**: Offscreen 1024x1024 2D canvas texture mapped onto the arena floor, throttled to at most one texture upload per frame and capped at 1,000 active splatters.
- **Flash Flat Shading**: Pure `MeshLambertMaterial` flat shading with `#111111` `EdgesGeometry` + `LineSegments` outlines on static obstacles.
- **Procedural Web Audio API**: 100% synthesized sound effects (gunshots, explosions, groans, chimes) with zero external asset dependencies.
- **2D Math & Physics**: Circle-circle, circle-AABB continuous collision resolution, and spatial grid partitioning for flocking separation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/broeib/Boxhead.git
cd Boxhead

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run test suite
npm test

# Build for production
npm run build
```

---

## 📜 License
MIT
