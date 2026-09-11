# Boxhead 2Play Browser Clone - Design Specification

## 1. Overview
A performant, browser-based recreation of the classic Flash game "Boxhead 2Play" built with Vite, TypeScript, and Three.js. The game features fast-paced top-down 2D arena combat with orthographic projection, swarming zombie hordes with flocking separation, permanent combo-based weapon unlocks, procedural Web Audio effects, and strict object pooling for sustained 60 FPS performance.

---

## 2. Visual & Camera Specifications
- **Projection**: `THREE.OrthographicCamera`. Fixed view looking down from the south:
  * Camera position relative to player/center: `(x, y + 26, z + 18)` focused on `(x, 0, z)` (~55° tilt angle).
  * Dynamic frustum sizing based on viewport aspect ratio:
    - Base view height = 32 world units.
    - Camera bounds: `left = -halfW`, `right = halfW`, `top = halfH`, `bottom = -halfH`.
    - Camera frustum dynamically recalculated on browser resize event without distortion.
- **Lighting**:
  * Flat shading aesthetic matching the original Flash look.
  * Directional light: `color: 0xffffff`, `intensity: 1.2`, `position: (-25, 45, -20)`. No soft shadow maps (crisp diffuse shading).
  * Ambient light: `color: 0x777777`, `intensity: 1.0`.
- **Palette & Styling**:
  * Arena Floor: Solid pale beige (`#D9C8A9`).
  * Arena Walls & Pillars: Solid light gray (`#E5E5E5`) with dark border edges (`EdgesGeometry` + `LineSegments` with `#111111`).
  * Player 1: White/blue torso (`#2980B9`), peach head (`#F3C59A`), black hair block (`#111111`).
  * Zombies: Light gray torso (`#BDC3C7`), dull greenish head (`#7F8C8D`).
  * Devils: Deep crimson red (`#C0392B`) with glowing yellow eye blocks (`#F1C40F`).
  * Explosive Barrels: Bright red cylinder/box (`#E74C3C`) with yellow warning band (`#F1C40F`).
  * Fake Walls: Wooden barricade planks (`#8E44AD` or dark wood `#8D6E63`) with dark edges.
  * Crates: Wooden box (`#D35400`) with cross braces and dark edges.
  * Characters use `MeshLambertMaterial` with `flatShading: true` (no line segment wrappers on dynamic characters to save draw calls).

---

## 3. Math & Physics (2D on X/Z Plane)
- **Coordinate System**:
  * Physics calculations occur purely on the 2D X/Z plane ($y = 0$).
  * Circle-Circle collision: $\text{distance}^2 \le (r_1 + r_2)^2$.
  * Circle-AABB collision: Clamp circle center $(x, z)$ to bounding box $[x_{\min}, x_{\max}] \times [z_{\min}, z_{\max}]$ and test distance.
- **Entity Radii & Bounding**:
  * Player: Circle radius = $0.7$ units.
  * Zombie: Circle radius = $0.65$ units.
  * Devil: Circle radius = $0.9$ units.
  * Walls/Pillars: Static AABBs (e.g. boundary walls thickness $1.5$, pillars $2.0 \times 2.0$).
  * Barrels: Circle radius = $0.6$ or AABB $1.2 \times 1.2$.
  * Fake Walls: AABB $1.5 \times 1.5$.
- **Swarm Separation Steering**:
  * Spatial Grid partitioning ($4.0 \times 4.0$ cell size) indexes all active enemies each tick.
  * For each zombie, query adjacent cells within neighbor radius ($1.6$ units).
  * Repulsion force:
    $$\vec{F}_{\text{sep}} = \sum_{j \ne i} \frac{\vec{p}_i - \vec{p}_j}{\max(\|\vec{p}_i - \vec{p}_j\|^2, 0.01)}$$
  * Target force: Vector towards Player (or obstructing barricade if path is blocked).
  * Combined steering: $\vec{v} = \text{normalize}(\vec{v}_{\text{target}} \times 1.0 + \vec{F}_{\text{sep}} \times 0.7) \times \text{speed}$.

---

## 4. Performance Guardrails & Pooling Architecture
- **Object Pooling**:
  * `ProjectilePool`: Pre-allocated pool of 300 bullet meshes, 40 rocket meshes, 40 grenade meshes, and 60 fireball meshes.
  * `ParticlePool`: Pre-allocated pool of 400 cube particles (`BoxGeometry(0.18, 0.18, 0.18)`) for blood droplets, explosion sparks, wood splinters, and smoke.
  * `DamageNumberPool`: Pooled HTML/Canvas/Sprite floating indicators for combat feedback.
  * No instantiation of `new THREE.Mesh` or geometries inside the active game loop.
- **Blood Decal System**:
  * Single offscreen HTML 2D Canvas ($1024 \times 1024$ resolution).
  * Projected onto the floor plane as a `THREE.CanvasTexture`.
  * Blood splatters are painted directly onto the 2D canvas with crimson tones (`#8B0000`, `#A93226`, `#922B21`) using random circular and splattered droplet stamps.
  * Canvas texture update flagged via `floorTexture.needsUpdate = true` throttled to at most once per frame when dirty.
  * Splatters capped at 1,000 active splatters to avoid canvas redraw lag.

---

## 5. Controls & Gameplay Mechanics
- **Controls (P1)**:
  * `W`, `A`, `S`, `D` to move (speed: 9.0 units/sec).
  * Mouse pointer raycast against ground plane $y = 0$ calculates precise rotation angle $\theta$.
  * Left Click: Fire active weapon or place barricade/barrel.
  * Keys `1` - `7` or Mouse Wheel: Switch active unlocked weapon.
  * `M` key: Mute/unmute procedural audio.
- **Combo Multiplier System**:
  * Multiplier starts at `1x`.
  * Each enemy kill adds `+1` to multiplier and resets decay timer to 3.5 seconds.
  * Multiplier drain rate formula:
    $$\text{drainRate} = 1.0 + (\text{multiplier} \times 0.05)$$
  * Decay: When timer reaches 0, multiplier decrements by 1 and resets timer to $3.5 / \text{drainRate}$.
  * Weapon milestones are unlocked permanently once reached during a run.
- **Weapons & Equipment**:
  1. **Pistol (1x)**: Single fire, infinite ammo, damage 15, cooldown 0.22s, high velocity (55 u/s).
  2. **Uzi (4x)**: Automatic fire, 200 ammo capacity, damage 10, cooldown 0.08s, spread $\pm 0.12$ rad.
  3. **Shotgun (8x)**: 5-pellet cone, 50 ammo, damage 12 per pellet (total 60), heavy knockback, cooldown 0.65s.
  4. **Explosive Barrel (12x)**: Placeable entity, 10 inventory count, 35 HP. When destroyed by bullet/explosion, detonates in radius 4.5, dealing 120 damage to all nearby entities and chaining explosions.
  5. **Hand Grenade (16x)**: Thrown projectile with bouncing friction, 15 inventory count, 2.0s fuse timer, detonates in radius 4.5 for 140 damage.
  6. **Fake Wall (20x)**: Placeable barricade with 150 HP, 15 inventory count. Blocks enemy pathing and draws zombie aggro until broken.
  7. **Rocket Launcher (40x)**: Straight rocket projectile, 20 ammo capacity, velocity 28 u/s, detonates on impact with enemy/wall dealing 160 damage in radius 4.0.
- **Enemies & Waves**:
  * **Standard Zombie**: 30 HP, contact damage (15 dmg/hit with 0.6s cooldown), moves at 4.2 units/sec. Target closest between player and obstructing fake walls.
  * **Red Devil**: Spawns in Wave 4+. 150 HP, movement speed 3.2 units/sec. Every 3.0s, pauses and shoots a slow tracking orange fireball (damage 25, speed 14 u/s). Can be staggered/interrupted by sustained bullet hits.
  * **Wave Progression**: Wave starts with an enemy quota. Enemies spawn from arena edges. Once quota is cleared, 3.0s grace period before next wave begins with increased enemy count and devil ratio.
- **Pickups**:
  * Wooden crates spawn periodically (every 18–25s) in open areas.
  * Collecting a crate restores +25% max HP and +35% ammo across all unlocked secondary weapons.

---

## 6. Procedural Audio System (Web Audio API)
- Zero external audio files required. Uses standard `AudioContext` synthesizers:
  * **Pistol**: White noise burst with short exponential decay + bandpass filter.
  * **Uzi**: Fast clipped white noise snap.
  * **Shotgun**: Low-frequency resonant punch + wide noise burst.
  * **Explosion (Barrels/Grenades/Rockets)**: Low sine oscillator sweep (120Hz $\to$ 20Hz) mixed with distorted low-pass noise.
  * **Zombie Groan**: Modulated square/sawtooth oscillator at low pitch (60–90Hz) with jitter.
  * **Devil Fireball**: Pitch descending triangle tone with noise resonance.
  * **Crate Pickup**: Two-tone rising arpeggio (C5 $\to$ G5).
  * **Mute Toggle**: Global gain node clamped to 0 or 0.3.

---

## 7. Arena Layout ("Columns")
- Arena Dimensions: Width = 52 units, Depth = 36 units.
- Outer Boundary: 4 thick boundary wall blocks enclosing the perimeter.
- Interior: 4 square pillars ($2.5 \times 2.5$ units) symmetrically arranged at $(\pm 14, \pm 8)$ to provide authentic tactical kiting pathways.

---

## 8. UI & HUD
- **Top HUD**:
  * Left: Player Health bar (green-to-red gradient, 100 HP max) and Lives/Score.
  * Center: Combo Multiplier badge (e.g. "x14") and animated decay timer progress bar.
  * Right: Wave indicator and remaining enemy count.
- **Bottom HUD**:
  * Weapon bar with slots 1–7 showing icons/names, lock status, active selection outline, and ammo count.
  * Audio mute button toggle indicator.
- **Game Over Screen**:
  * Score tally, highest multiplier achieved, waves survived, and "Play Again" button (`Space` or click).
