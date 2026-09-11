# Boxhead 2Play Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable, performant local browser clone of the Flash game "Boxhead 2Play" using Vite, TypeScript, and Three.js with locked 60 FPS under high-density zombie hordes.

**Architecture:** Modular system architecture separating rendering (`Three.js`, `OrthographicCamera`), 2D X/Z plane physics (`Collision2D`, `SpatialGrid`), pre-allocated typed object pools (`ProjectilePool`, `ParticlePool`), offscreen 2D canvas blood decal texture (`BloodCanvas`), state managers (`WeaponManager`, `ComboSystem`, `WaveDirector`), procedural Web Audio sound synthesis, and Flash-authentic HUD overlay.

**Tech Stack:** Vite 6, TypeScript 5, Three.js (r170+), Vitest for unit testing pure physics/math/pools/combos.

**Spec:** `docs/superpowers/specs/2026-09-12-boxhead-2play-design.md`

## Global Constraints
- Coordinate physics strictly on the 2D X/Z plane ($y=0$); ignore Y-axis for collisions.
- No dynamic `new THREE.Mesh` or geometries instantiated inside the animation/game loop.
- Characters (Player, Zombies, Devils) use `MeshLambertMaterial` with `flatShading: true` (no line segment outlines on moving characters).
- Static environment obstacles (Walls, Pillars, Barrels, Crates) use `EdgesGeometry` + `LineSegments` with color `#111111`.
- Offscreen 2D blood canvas must throttle `floorTexture.needsUpdate = true` to at most once per frame and cap active splatters at 1,000.
- Camera: `THREE.OrthographicCamera` fixed angle looking down from the south: position `(x, y + 26, z + 18)` focused on `(x, 0, z)`.

---

### Task 1: Scaffolding, Base Render Pipeline & Arena Environment
**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/core/Constants.ts`
- Create: `src/render/Camera.ts`
- Create: `src/render/Scene.ts`
- Create: `src/main.ts`

**Interfaces:**
- `CameraManager`: `camera: THREE.OrthographicCamera`, `update(playerPos: { x: number, z: number }): void`, `handleResize(): void`
- `SceneManager`: `scene: THREE.Scene`, `renderer: THREE.WebGLRenderer`, `walls: AABB[]`, `initArena(): void`, `render(): void`

- [ ] **Step 1: Write package.json and config files**
Install dependencies: `three`, `@types/three`, `vite`, `typescript`, `vitest`.
- [ ] **Step 2: Implement Constants.ts with colors, speeds, dimensions**
Arena dimensions: Width = 52, Depth = 36. Colors: Floor `#D9C8A9`, Walls `#E5E5E5`, Player `#2980B9`, `#F3C59A`, `#111111`.
- [ ] **Step 3: Implement Camera.ts**
OrthographicCamera positioned at `(0, 26, 18)` looking at `(0, 0, 0)`. Frustum size dynamically scaled to preserve aspect ratio without stretching.
- [ ] **Step 4: Implement Scene.ts & Arena Environment**
Create arena floor ($52 \times 36$), 4 boundary walls with `EdgesGeometry` + `LineSegments`, and 4 symmetrical columns at $(\pm 14, \pm 8)$. Add directional light top-left and `#777777` ambient light.
- [ ] **Step 5: Verify build with `npm run build`**
- [ ] **Step 6: Commit changes**
`git add . && git commit -m "feat: scaffold project with orthographic arena rendering"`

---

### Task 2: 2D Physics Engine & Spatial Partitioning
**Files:**
- Create: `src/physics/Collision2D.ts`
- Create: `src/physics/SpatialGrid.ts`
- Create: `tests/physics/Collision2D.test.ts`
- Create: `tests/physics/SpatialGrid.test.ts`

**Interfaces:**
- `Circle`: `{ x: number, z: number, radius: number }`
- `AABB`: `{ minX: number, maxX: number, minZ: number, maxZ: number }`
- `checkCircleCircle(c1: Circle, c2: Circle): boolean`
- `resolveCircleAABB(circle: Circle, box: AABB): { collided: boolean, normalX: number, normalZ: number, depth: number }`
- `SpatialGrid`: `insert(id: number, x: number, z: number): void`, `query(x: number, z: number, radius: number): number[]`, `clear(): void`

- [ ] **Step 1: Write failing unit tests for Collision2D and SpatialGrid**
Test circle-circle collision, circle-AABB sliding/penetration resolution, and spatial grid neighbor queries.
- [ ] **Step 2: Run tests to verify failure**
`npx vitest run tests/physics`
- [ ] **Step 3: Implement Collision2D.ts and SpatialGrid.ts**
- [ ] **Step 4: Run tests to verify pass**
`npx vitest run tests/physics`
- [ ] **Step 5: Commit changes**
`git add src/physics tests/physics && git commit -m "feat: implement 2D physics and spatial grid with unit tests"`

---

### Task 3: Input System & Player Entity
**Files:**
- Create: `src/core/Input.ts`
- Create: `src/entities/Player.ts`
- Modify: `src/render/Scene.ts`
- Modify: `src/main.ts`

**Interfaces:**
- `InputManager`: `keys: Set<string>`, `pointerGroundPos: { x: number, z: number }`, `isMouseDown: boolean`, `activeSlot: number`, `init(): void`, `updateRaycast(camera: THREE.Camera): void`
- `Player`: `mesh: THREE.Group`, `pos: { x: number, z: number }`, `radius: number`, `hp: number`, `maxHp: number`, `rotationAngle: number`, `update(dt: number, input: InputManager, walls: AABB[]): void`, `takeDamage(amount: number): boolean`

- [ ] **Step 1: Implement InputManager**
Capture WASD keyboard events, mouse movement raycasted against $y = 0$ ground plane, left click, and number keys 1–7.
- [ ] **Step 2: Implement Player Entity Mesh**
Construct iconic Boxhead player mesh: Torso (`#2980B9`, size `0.8 x 0.9 x 0.5`), Peach Head (`#F3C59A`, size `0.6 x 0.6 x 0.6`), Hair block (`#111111`), and arms holding weapon position.
- [ ] **Step 3: Implement Player Movement & Wall Sliding Collision**
Handle WASD velocity (speed 9.0 u/s), resolve collisions against arena boundaries and interior pillars, rotate character towards mouse pointer ground target.
- [ ] **Step 4: Connect Player in Game Loop & Verify**
Smooth camera follow player position, responsive mouse aiming.
- [ ] **Step 5: Commit changes**
`git add src/core/Input.ts src/entities/Player.ts src/render/Scene.ts src/main.ts && git commit -m "feat: implement player movement, aiming and wall collision"`

---

### Task 4: High-Performance Object Pooling & Particle Systems
**Files:**
- Create: `src/fx/ParticlePool.ts`
- Create: `src/weapons/ProjectilePool.ts`
- Create: `src/ui/DamageNumberPool.ts`
- Create: `tests/pools/Pools.test.ts`

**Interfaces:**
- `ProjectileType`: `'bullet' | 'rocket' | 'grenade' | 'fireball'`
- `ProjectilePool`: `spawn(type: ProjectileType, x: number, z: number, dirX: number, dirZ: number, damage: number, speed: number): Projectile | null`, `update(dt: number, onHit: (p: Projectile) => void): void`, `recycle(p: Projectile): void`
- `ParticlePool`: `spawnBurst(x: number, z: number, count: number, colorHex: number, speed: number): void`, `update(dt: number): void`
- `DamageNumberPool`: `spawn(x: number, z: number, amount: number, isCrit?: boolean): void`, `update(dt: number): void`

- [ ] **Step 1: Write failing unit tests for pooling logic (allocation, recycling, capacity reuse)**
- [ ] **Step 2: Run tests to verify failure**
`npx vitest run tests/pools`
- [ ] **Step 3: Implement ProjectilePool with pre-allocated Three.js meshes**
300 bullets, 40 rockets, 40 grenades, 60 fireballs. Meshes kept in scene with `visible = false` when inactive.
- [ ] **Step 4: Implement ParticlePool (400 3D cube particles with gravity/bounce and fade)**
- [ ] **Step 5: Implement DamageNumberPool (floating combat text elements in overlay layer)**
- [ ] **Step 6: Run tests to verify pass**
`npx vitest run tests/pools`
- [ ] **Step 7: Commit changes**
`git add src/fx/ src/weapons/ src/ui/DamageNumberPool.ts tests/pools/ && git commit -m "feat: implement pre-allocated projectile and particle pools"`

---

### Task 5: Dynamic Blood Decal System
**Files:**
- Create: `src/render/BloodCanvas.ts`
- Modify: `src/render/Scene.ts`
- Create: `tests/render/BloodCanvas.test.ts`

**Interfaces:**
- `BloodCanvas`: `texture: THREE.CanvasTexture`, `addSplatter(worldX: number, worldZ: number, size?: number, count?: number): void`, `update(): void`, `clear(): void`

- [ ] **Step 1: Write unit tests for BloodCanvas coordinate mapping & splatter capping**
- [ ] **Step 2: Run tests to verify failure**
`npx vitest run tests/render`
- [ ] **Step 3: Implement BloodCanvas.ts**
Offscreen $1024 \times 1024$ 2D canvas, world-to-UV mapping for $52 \times 36$ arena plane, procedural jagged blood drops in dark crimson tones, throttling texture updates to at most once per frame, capping at 1,000 active splatters.
- [ ] **Step 4: Bind BloodCanvas texture to Floor Mesh in Scene.ts**
- [ ] **Step 5: Run tests to verify pass**
`npx vitest run tests/render`
- [ ] **Step 6: Commit changes**
`git add src/render/BloodCanvas.ts src/render/Scene.ts tests/render/ && git commit -m "feat: implement dynamic floor blood decal canvas"`

---

### Task 6: Zombie Horde AI & Devil Entities
**Files:**
- Create: `src/entities/Zombie.ts`
- Create: `src/entities/Devil.ts`
- Create: `src/entities/EnemyManager.ts`
- Create: `tests/entities/Flocking.test.ts`

**Interfaces:**
- `Enemy`: `mesh: THREE.Group`, `pos: { x: number, z: number }`, `hp: number`, `speed: number`, `radius: number`, `alive: boolean`, `update(dt: number, playerPos: {x: number, z: number}, obstacles: AABB[], spatialGrid: SpatialGrid): void`, `takeDamage(amount: number): boolean`
- `EnemyManager`: `enemies: Enemy[]`, `spawnZombie(x: number, z: number): void`, `spawnDevil(x: number, z: number): void`, `update(dt: number, player: Player, obstacles: AABB[]): void`

- [ ] **Step 1: Write unit test for separation steering behavior**
Verify two close zombies experience a repulsive vector pointing away from each other.
- [ ] **Step 2: Run test to verify failure**
`npx vitest run tests/entities`
- [ ] **Step 3: Implement Zombie entity with Boxhead aesthetic & contact damage**
Light gray torso (`#BDC3C7`), dull greenish head (`#7F8C8D`), forward arm stance.
- [ ] **Step 4: Implement Devil entity with wave 4+ ranged fireball mechanics**
Deep red (`#C0392B`), glowing yellow eyes (`#F1C40F`), stops every 3.0s to cast fireball. Can be interrupted by incoming damage.
- [ ] **Step 5: Implement EnemyManager with perimeter spawn points and spatial grid updates**
- [ ] **Step 6: Run tests to verify pass**
`npx vitest run tests/entities`
- [ ] **Step 7: Commit changes**
`git add src/entities/ tests/entities/ && git commit -m "feat: implement zombie swarm with separation steering and devil ranged attacks"`

---

### Task 7: Weapons Arsenal & Explosive Props
**Files:**
- Create: `src/weapons/WeaponTypes.ts`
- Create: `src/weapons/WeaponInventory.ts`
- Create: `src/entities/Barrel.ts`
- Create: `src/entities/FakeWall.ts`
- Create: `tests/weapons/Weapons.test.ts`

**Interfaces:**
- `WeaponDef`: `{ id: number, name: string, unlockMultiplier: number, fireRate: number, maxAmmo: number, isPlaceable: boolean, ... }`
- `WeaponInventory`: `unlocked: Set<number>`, `ammo: Map<number, number>`, `activeWeaponId: number`, `fire(playerPos, aimAngle, pools): void`, `addAmmo(fraction: number): void`
- `Barrel`: Explosive entity (35 HP), chain detonation radius 4.5, deals 120 damage.
- `FakeWall`: Barricade block (150 HP), attracts zombie attacks.

- [ ] **Step 1: Write unit tests for weapon firing cooldowns, ammo consumption, and unlock conditions**
- [ ] **Step 2: Run tests to verify failure**
`npx vitest run tests/weapons`
- [ ] **Step 3: Implement WeaponTypes.ts & 7 Weapon definitions**
Pistol (1x), Uzi (4x), Shotgun (8x), Barrels (12x), Grenades (16x), Fake Walls (20x), Rocket Launcher (40x).
- [ ] **Step 4: Implement WeaponInventory.ts with mouse/keyboard switching and cooldown timers**
- [ ] **Step 5: Implement Barrel and FakeWall placeable entities**
- [ ] **Step 6: Run tests to verify pass**
`npx vitest run tests/weapons`
- [ ] **Step 7: Commit changes**
`git add src/weapons/ src/entities/Barrel.ts src/entities/FakeWall.ts tests/weapons/ && git commit -m "feat: implement full weapon arsenal, barrels and barricades"`

---

### Task 8: Combo Multiplier, Wave Director, Crate Pickups & Procedural Audio
**Files:**
- Create: `src/core/ComboSystem.ts`
- Create: `src/core/WaveDirector.ts`
- Create: `src/entities/Crate.ts`
- Create: `src/core/Audio.ts`
- Create: `tests/core/ComboSystem.test.ts`

**Interfaces:**
- `ComboSystem`: `multiplier: number`, `decayTimer: number`, `drainRate: number`, `onKill(): void`, `update(dt: number): void`
- `WaveDirector`: `currentWave: number`, `remainingToSpawn: number`, `activeEnemiesCount: number`, `isIntermission: boolean`, `update(dt: number, enemyManager: EnemyManager): void`
- `AudioManager`: `playPistol(): void`, `playUzi(): void`, `playShotgun(): void`, `playExplosion(): void`, `playZombieGroan(): void`, `playPickup(): void`, `toggleMute(): boolean`

- [ ] **Step 1: Write unit tests for Combo multiplier drain formula & decay timing**
Formula: $\text{drainRate} = 1.0 + (\text{multiplier} \times 0.05)$. Kill resets timer to 3.5s.
- [ ] **Step 2: Run tests to verify failure**
`npx vitest run tests/core/ComboSystem.test.ts`
- [ ] **Step 3: Implement ComboSystem.ts**
- [ ] **Step 4: Implement WaveDirector.ts with escalating waves (Devils introduced at Wave 4+)**
- [ ] **Step 5: Implement Crate.ts random pickups (+25% HP, +35% ammo)**
- [ ] **Step 6: Implement procedural Audio.ts using Web Audio API synthesis with mute toggle**
- [ ] **Step 7: Run tests to verify pass**
`npx vitest run tests/core/ComboSystem.test.ts`
- [ ] **Step 8: Commit changes**
`git add src/core/ComboSystem.ts src/core/WaveDirector.ts src/entities/Crate.ts src/core/Audio.ts tests/core/ && git commit -m "feat: implement combo multiplier, wave director, crate pickups and procedural audio"`

---

### Task 9: Retro HUD Overlay, Game State Management & Polish
**Files:**
- Create: `src/ui/HUD.ts`
- Create: `src/ui/GameOverModal.ts`
- Create: `src/core/Game.ts`
- Modify: `src/main.ts`
- Create: `index.html` (styling and canvas overlay)

**Interfaces:**
- `HUD`: `update(playerHp: number, playerMaxHp: number, multiplier: number, decayProgress: number, activeWeapon: WeaponDef, ammo: number, wave: number, score: number, isMuted: boolean): void`
- `GameOverModal`: `show(score: number, maxCombo: number, wave: number, onRestart: () => void): void`, `hide(): void`
- `Game`: Central game loop orchestrating rendering, updates, collisions, combat, audio, and UI.

- [ ] **Step 1: Design retro Flash-style HUD in HTML/CSS**
Health bar, combo multiplier badge with animated decay drain gauge, weapon slots 1–7 with unlock indicators and ammo counters, wave tracker, mute button.
- [ ] **Step 2: Implement HUD.ts to dynamically bind game state to DOM elements**
- [ ] **Step 3: Implement GameOverModal.ts with restart loop**
- [ ] **Step 4: Connect all systems in Game.ts fixed-update and render loops**
- [ ] **Step 5: Perform end-to-end playability test and verify locked 60 FPS performance**
- [ ] **Step 6: Run all test suites and production build**
`npm run test && npm run build`
- [ ] **Step 7: Commit changes**
`git add . && git commit -m "feat: complete Boxhead 2Play game loop, HUD and game over screen"`
