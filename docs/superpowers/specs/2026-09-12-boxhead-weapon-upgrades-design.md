# Boxhead 2Play: Complete 10-Weapon Arsenal & 58-Milestone Upgrade System Design

## 1. Overview & Motivation
In early iterations of the Boxhead 2Play browser clone, all 7 weapons were unlocked in rapid succession within low combo ranges (x4 to x40), and weapons possessed static stats with no subsequent upgrades. 

By decompiling the original Flash game bytecode from `Boxhead_2PlayRooms.swf`, we identified the authentic progression model:
1. **10 Distinct Weapons** mapped across keys `1`–`9` and `0` (`10`).
2. **58-Tier Multiplier Progression Ladder** spanning from x3 up to x125.
3. **Dynamic Stat Upgrades**: Rather than unlocking weapons back-to-back, combo milestones alternate between weapon unlocks and major stat evolutions (Fast Fire, Rapid Fire, Double Damage, Quad Damage, Double Ammo, Quad Ammo, Long Shot, Wide Shot, Wider Shot, Big Bang, Bigger Bang, Cluster Explode, Infinite Range).
4. **Permanent Run Progression**: Once a multiplier milestone is achieved during a run, the unlocked weapon or upgrade is permanently retained for the duration of that play session even if the combo multiplier decays back to x1.

---

## 2. The 10-Weapon Arsenal

### Weapon Slot Mapping
| Key | Weapon | Type | Base Role / Mechanics |
| :--- | :--- | :--- | :--- |
| **1** | **Pistol** | Bullet | Starter weapon with infinite ammo; accurate single shots. |
| **2** | **UZI** | Bullet | Rapid automatic submachine gun; high rate of fire with light spread. |
| **3** | **Shotgun** | Pellets | Multi-pellet cone blast with strong knockback; devastating at close range. |
| **4** | **Barrels** | Prop | Placeable explosive red barrels that detonate on damage with chain reaction. |
| **5** | **Grenades** | Projectile | Lobbed explosive that bounces on floor and detonates after fuse time. |
| **6** | **Fake Walls** | Prop | Placeable wooden barricades with high health to divert horde pathing. |
| **7** | **Claymore** | Prop | Proximity landmine. Arms after 0.5s; beeps and detonates on enemy proximity. |
| **8** | **Rocket Launcher** | Projectile | High-velocity rocket that travels straight and explodes on enemy or wall impact. |
| **9** | **Charge Pack** | Prop | Remote-detonated C-4 pack. Placed on floor; detonated on command via Spacebar or second click. |
| **0** | **Railgun** | Hitscan | Instant high-energy piercing beam that shoots clean through lines of zombies and barricades. |

---

## 3. The 58-Milestone Progression Ladder

Extracted directly from the original game bytecode table (`AddToMultipliers` in `Boxhead_2PlayRooms.swf`):

| Step | Multiplier | Type | Name | Target Weapon | Concrete Gameplay Effect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **x3** | Upgrade | Pistol+: Fast Fire | Pistol | Cooldown 0.22s -> 0.14s |
| 2 | **x5** | **Unlock** | **New Weapon: UZI (Key 2)** | UZI | Unlocks automatic UZI (200 ammo) |
| 3 | **x8** | Upgrade | Pistol+: Double Damage | Pistol | Damage 15 -> 30 |
| 4 | **x10** | **Unlock** | **New Weapon: Shotgun (Key 3)** | Shotgun | Unlocks 5-pellet shotgun (50 ammo) |
| 5 | **x13** | Upgrade | UZI+: Rapid Fire | UZI | Cooldown 0.08s -> 0.05s |
| 6 | **x15** | **Unlock** | **New Weapon: Barrel (Key 4)** | Barrels | Unlocks placeable red explosive barrels (10 count) |
| 7 | **x17** | Upgrade | UZI+: Double Ammo | UZI | Max ammo 200 -> 400, +200 ammo granted |
| 8 | **x18** | Upgrade | Shotgun+: Fast Fire | Shotgun | Cooldown 0.65s -> 0.42s |
| 9 | **x20** | **Unlock** | **New Weapon: Grenade (Key 5)** | Grenades | Unlocks throwable hand grenades (15 count) |
| 10 | **x21** | Upgrade | Shotgun+: Double Ammo | Shotgun | Max ammo 50 -> 100, +50 ammo granted |
| 11 | **x23** | Upgrade | UZI+: Long Shot | UZI | Bullet speed 50 -> 65, lifespan 0.5s -> 0.8s |
| 12 | **x26** | Upgrade | Barrel+: Double Ammo | Barrels | Max ammo 10 -> 20, +10 barrels granted |
| 13 | **x30** | **Unlock** | **New Weapon: Fake walls (Key 6)** | Fake Walls | Unlocks placeable barricades (15 count) |
| 14 | **x31** | Upgrade | Shotgun+: Wide Shot | Shotgun | Pellets 5 -> 7, spread cone ±0.25 -> ±0.35 rad |
| 15 | **x32** | Upgrade | Barrel+: Big Bang | Barrels | Radius 4.5 -> 6.0, damage 120 -> 180 |
| 16 | **x33** | Upgrade | Grenade+: Cluster Explode | Grenades | Primary blast spawns 4 sub-bomblets with radial bounce |
| 17 | **x35** | Upgrade | Shotgun+: Long Shot | Shotgun | Pellet speed 45 -> 60, range +40% |
| 18 | **x36** | Upgrade | Barrel+: Quad Ammo | Barrels | Max ammo 20 -> 40, +20 barrels granted |
| 19 | **x37** | Upgrade | Fake Wall+: Double Ammo | Fake Walls | Max ammo 15 -> 30, +15 walls granted, HP 150 -> 250 |
| 20 | **x39** | Upgrade | UZI+: Quad Ammo | UZI | Max ammo 400 -> 800, +400 ammo granted |
| 21 | **x40** | **Unlock** | **New Weapon: Claymore (Key 7)** | Claymore | Unlocks proximity landmines (10 count) |
| 22 | **x41** | Upgrade | Shotgun+: Quad Ammo | Shotgun | Max ammo 100 -> 200, +100 ammo granted |
| 23 | **x42** | Upgrade | Grenade+: Double Ammo | Grenades | Max ammo 15 -> 30, +15 grenades granted |
| 24 | **x43** | Upgrade | Shotgun+: Rapid Fire | Shotgun | Cooldown 0.42s -> 0.22s (near-automatic fire) |
| 25 | **x44** | Upgrade | Barrel+: Bigger Bang | Barrels | Radius 6.0 -> 8.0, damage 180 -> 260 |
| 26 | **x45** | Upgrade | Grenade+: Big Bang | Grenades | Radius 4.5 -> 6.0, damage 140 -> 200 |
| 27 | **x47** | Upgrade | Claymore+: Cluster Explode | Claymore | Mine detonation triggers 4 secondary cluster bursts |
| 28 | **x48** | Upgrade | UZI+: Double Damage | UZI | Bullet damage 10 -> 20 |
| 29 | **x50** | **Unlock** | **New Weapon: Rocket (Key 8)** | Rocket Launcher | Unlocks straight explosive rockets (20 count) |
| 30 | **x51** | Upgrade | Shotgun+: Wider Shot | Shotgun | Pellets 7 -> 10, spread cone ±0.35 -> ±0.48 rad |
| 31 | **x52** | Upgrade | Grenade+: Quad Ammo | Grenades | Max ammo 30 -> 60, +30 grenades granted |
| 32 | **x53** | Upgrade | Fake Wall+: Quad Ammo | Fake Walls | Max ammo 30 -> 60, +30 walls granted, HP 250 -> 400 |
| 33 | **x54** | Upgrade | Claymore+: Double Ammo | Claymore | Max ammo 10 -> 20, +10 mines granted |
| 34 | **x55** | **Unlock** | **New Weapon: Chargepack (Key 9)** | Charge Pack | Unlocks remote-detonated C-4 satchels (8 count) |
| 35 | **x56** | Upgrade | Shotgun+: Double Damage | Shotgun | Pellet damage 12 -> 24 (240 total damage on direct blast) |
| 36 | **x57** | Upgrade | Grenade+: Bigger Bang | Grenades | Radius 6.0 -> 8.0, damage 200 -> 280 |
| 37 | **x58** | Upgrade | Claymore+: Big Bang | Claymore | Radius 4.0 -> 5.5, damage 150 -> 220 |
| 38 | **x59** | Upgrade | Rocket+: Fast Fire | Rocket Launcher | Cooldown 1.0s -> 0.60s |
| 39 | **x61** | Upgrade | UZI+: Infinite Range | UZI | Bullets travel across entire map until hitting walls |
| 40 | **x62** | Upgrade | Claymore+: Bigger Bang | Claymore | Radius 5.5 -> 7.0, damage 220 -> 300 |
| 41 | **x63** | Upgrade | Charge Pack+: Cluster Explode | Charge Pack | Remote blast triggers 4 secondary cluster charges |
| 42 | **x64** | Upgrade | Claymore+: Quad Ammo | Claymore | Max ammo 20 -> 40, +20 mines granted |
| 43 | **x66** | Upgrade | Rocket+: Double Ammo | Rocket Launcher | Max ammo 20 -> 40, +20 rockets granted |
| 44 | **x68** | Upgrade | Charge Pack+: Double Ammo | Charge Pack | Max ammo 8 -> 16, +8 charges granted |
| 45 | **x70** | **Unlock** | **New Weapon: Railgun (Key 0)** | Railgun | Unlocks instant laser beam sniper (25 charges) |
| 46 | **x72** | Upgrade | Rocket+: Big Bang | Rocket Launcher | Radius 4.0 -> 5.5, damage 160 -> 240 |
| 47 | **x74** | Upgrade | Charge Pack+: Big Bang | Charge Pack | Radius 5.0 -> 7.0, damage 180 -> 260 |
| 48 | **x76** | Upgrade | Charge Pack+: Quad Ammo | Charge Pack | Max ammo 16 -> 32, +16 charges granted |
| 49 | **x78** | Upgrade | Railgun+: Fast Fire | Railgun | Cooldown 1.2s -> 0.75s |
| 50 | **x80** | Upgrade | Railgun+: Double Ammo | Railgun | Max ammo 25 -> 50, +25 charges granted |
| 51 | **x85** | Upgrade | Rocket+: Quad Ammo | Rocket Launcher | Max ammo 40 -> 80, +40 rockets granted |
| 52 | **x90** | Upgrade | UZI+: Quad Damage | UZI | Bullet damage 20 -> 40 (hyper-destructive SMG) |
| 53 | **x95** | Upgrade | Charge Pack+: Bigger Bang | Charge Pack | Radius 7.0 -> 9.0, damage 260 -> 380 |
| 54 | **x100** | Upgrade | Railgun+: Rapid Fire | Railgun | Cooldown 0.75s -> 0.45s |
| 55 | **x105** | Upgrade | Rocket+: Bigger Bang | Rocket Launcher | Radius 5.5 -> 7.0, damage 240 -> 320 |
| 56 | **x110** | Upgrade | Railgun+: Quad Ammo | Railgun | Max ammo 50 -> 100, +50 charges granted |
| 57 | **x120** | Upgrade | Rocket+: Rapid Fire | Rocket Launcher | Cooldown 0.60s -> 0.35s |
| 58 | **x125** | Upgrade | Railgun+: Long Shot | Railgun | Piercing damage 100 -> 200, thicker beam width |

---

## 4. Subsystem Specifications

### 4.1. New Entity: Claymore (`src/entities/Claymore.ts`)
- **Visual**: Flat parcel block (0.8 x 0.2 x 0.5 units) with `#E0E0E0` base, olive strapping `#556B2F`, and `#111111` `EdgesGeometry` + `LineSegments`.
- **State Lifecycle**:
  1. `state = 'arming'`: 0.5s delay after placement.
  2. `state = 'armed'`: Proximity detection active. In `update(dt, enemies)`: calculates 2D Euclidean distance to active enemies. If any enemy distance <= radius + enemy.radius (1.2m total threshold):
     - Plays warning beep: `audioManager.playClaymoreBeep()`.
     - Transitions to `state = 'tripped'` (0.15s fuse delay before explosion).
  3. `state = 'detonating'`:
     - Deals radial damage within radius to enemies, player, barrels, and fake walls.
     - If `clusterExplode` upgrade is active: spawns 4 secondary bomblets radially outward that detonate after 0.2s dealing 50% damage.
     - Spawns particle burst and triggers floor blood splatters.
     - Recycles entity back to pool.

### 4.2. New Entity: Charge Pack (`src/entities/ChargePack.ts`)
- **Visual**: High-explosive satchel (0.7 x 0.25 x 0.7 units) `#2C3E50` with blinking red trigger LED `#E74C3C` and `#111111` edge lines.
- **Detonation Trigger**:
  - Maintained in an active list `activeChargePacks: ChargePack[]`.
  - When the player selects weapon slot 9 (Charge Pack) and presses `Spacebar` (or left-clicks when at least 1 charge pack is active on the field):
    - Plays `audioManager.playRemoteClick()`.
    - Detonates the oldest placed charge pack (or all active charge packs in sequence).
    - If `clusterExplode` is active: triggers secondary cluster bomblets.

### 4.3. New Weapon Action: Railgun Hitscan Beam (`src/weapons/Railgun.ts`)
- **Behavior**:
  - Instant line trace starting from player position along aim angle for range L = 60m.
  - Tests 2D segment-circle intersection against all living enemies and segment-AABB against barrels and fake walls.
  - **Piercing**: Does not terminate on first hit. Deals damage to every enemy pierced along the trajectory.
  - Generates high knockback along the firing vector.
  - Draws a pooled line/cylinder laser mesh with cyan/white glowing emissive material that flashes for 0.12s with rapid opacity fade.
  - Spawns cyan particle ionization trail and plays `audioManager.playRailgunLaser()`.

### 4.4. Dynamic Weapon Inventory (`src/weapons/WeaponInventory.ts`)
- Supports 10 weapon IDs: `'pistol'`, `'uzi'`, `'shotgun'`, `'barrel'`, `'grenade'`, `'fakewall'`, `'claymore'`, `'rocket'`, `'chargepack'`, `'railgun'`.
- Dynamic stat getters recalculate cooldowns, damages, max ammo capacities, pellet counts, and blast radii based on applied upgrades.
- Ammo refill bonus is granted upon unlocking Double Ammo or Quad Ammo milestones.
- Milestone checking checks combo multiplier against `UPGRADE_LADDER` and triggers unlocks/toasts.

### 4.5. 10-Slot HUD Overlay (`src/ui/HUD.ts`)
- 10 slots rendered on bottom bar: `[1] PISTOL`, `[2] UZI`, `[3] SHOTGUN`, `[4] BARRELS`, `[5] GRENADES`, `[6] FAKE WALLS`, `[7] CLAYMORE`, `[8] ROCKETS`, `[9] CHARGE PACK`, `[0] RAILGUN`.
- Keys `1`–`9` and `0` select slots 1–10. Mouse wheel cycles sequentially forward/backward through unlocked slots.
- Locked slots show lock icon and multiplier required.
- Retro arcade pop-up toast displays weapon unlocks in gold and upgrades in cyan with animated scale-in.

### 4.6. Procedural Web Audio Additions (`src/core/Audio.ts`)
- `playClaymoreBeep()`: Sharp 1200Hz warning tone burst.
- `playRemoteClick()`: High-pass metallic click for Charge Pack detonator.
- `playRailgunLaser()`: Swept oscillator with white noise burst and resonant filter.
- `playUpgradeFanfare()`: Rising tri-tone chime for upgrade milestones.

---

## 5. Verification & Testing Plan
1. **Unit Tests**:
   - `tests/weapons/Upgrades.test.ts`: Verify all 58 milestones, stat scaling, capacity changes, and ammo refill bonuses.
   - `tests/entities/Claymore.test.ts`: Verify arming timer, proximity distance trigger, beep callback, detonation radius, and cluster bomblet spawning.
   - `tests/entities/ChargePack.test.ts`: Verify placement, remote trigger command, cluster explosion, and props removal.
   - `tests/weapons/Railgun.test.ts`: Verify hitscan raycast piercing multiple enemies in line, distance checks, and cooldown reduction.
   - `tests/ui/HUD10Slots.test.ts`: Verify 10-slot DOM rendering, key bindings (1-9, 0), lock badge updates, and toast generation.
2. **Integration Tests**:
   - Verify `ComboSystem` integration: rising combo activates correct milestones in order; falling combo retains unlocks.
3. **Automated Suite**:
   - Ensure all 240 existing tests plus new tests pass cleanly with `npm run test`.
   - Ensure `npm run build` compiles with 0 TypeScript/Vite errors.
4. **Browser Runtime Verification**:
   - Verify in Chrome that slots 1-10 are clickable, keyboard keys 1-9 and 0 switch weapons, and upgrades trigger with sound and visual banners.
