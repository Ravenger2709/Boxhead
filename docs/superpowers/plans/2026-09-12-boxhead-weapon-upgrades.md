# Boxhead 2Play: Complete 10-Weapon Arsenal & 58-Milestone Upgrade System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the authentic Boxhead 2Play Rooms 10-weapon arsenal, the 58-tier multiplier upgrade ladder ($x3 \to x125$), dynamic weapon attribute scaling, and the 10-slot HUD overlay with upgrade toast banners.

**Architecture:** A data-driven upgrade engine where `Constants.ts` defines the authentic 58-milestone `UPGRADE_LADDER` decompiled from the original game SWF. `WeaponInventory.ts` dynamically evaluates effective weapon stats (cooldown, damage, ammo, pellets, blast radius) from base profiles and active upgrade modifiers. Dedicated `Claymore`, `ChargePack`, and `Railgun` implementations provide authentic proximity, remote C-4, and penetrating beam gameplay. `HUD.ts` expands to 10 slots (Keys 1–9, 0) with lock multiplier badges and animated pop-up toasts.

**Tech Stack:** TypeScript, Vite, Three.js, Web Audio API, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-12-boxhead-weapon-upgrades-design.md`

## Global Constraints
- Coordinate physics strictly on the 2D X/Z plane ($y=0$); ignore Y-axis for obstacle and entity collisions.
- No dynamic `new THREE.Mesh`, `new THREE.BufferGeometry`, or `new THREE.Material` inside the animation/game loop. Reuse pre-allocated object pools and cached shared geometries.
- Characters and props use flat-shaded `MeshLambertMaterial` with `#111111` `EdgesGeometry` + `LineSegments` on static props (Barrels, Fake Walls, Claymores, Charge Packs).
- Multiplier milestone unlocks and upgrades are **permanent for the run** once reached; combo decay does not downgrade earned weapons.
- 10 Weapon Slots: `1: Pistol`, `2: Uzi`, `3: Shotgun`, `4: Barrels`, `5: Grenades`, `6: Fake Walls`, `7: Claymore`, `8: Rockets`, `9: Charge Pack`, `0: Railgun`.

---

### Task 1: Constants & Data Structures for 10 Weapons & 58-Milestone Ladder

**Files:**
- Modify: `src/core/Constants.ts`
- Modify: `src/weapons/WeaponTypes.ts`
- Test: `tests/weapons/UpgradeLadderConstants.test.ts`

**Interfaces:**
- Consumes: Existing `Constants.ts` and `WeaponTypes.ts`.
- Produces:
  - `WeaponId`: `'pistol' | 'uzi' | 'shotgun' | 'barrel' | 'grenade' | 'fakewall' | 'claymore' | 'rocket' | 'chargepack' | 'railgun'`.
  - `WEAPON_DEFINITIONS`: dictionary mapping all 10 `WeaponId` to base `WeaponDefinition` (adding slot numbers 1 to 10, default ammo, cooldown, damage, etc.).
  - `UpgradeMilestone`: `{ multiplier: number; type: 'unlock' | 'upgrade'; weaponId: WeaponId; name: string; description: string; effectType: string; }`.
  - `UPGRADE_LADDER`: array of 58 `UpgradeMilestone` items matching exact SWF offsets.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/weapons/UpgradeLadderConstants.test.ts
import { describe, it, expect } from 'vitest';
import { UPGRADE_LADDER, WEAPON_DEFINITIONS } from '../../src/core/Constants';
import { WeaponId } from '../../src/weapons/WeaponTypes';

describe('Upgrade Ladder & 10 Weapon Constants', () => {
  it('defines all 10 weapons with slots 1 to 10', () => {
    const expectedWeapons: WeaponId[] = [
      'pistol', 'uzi', 'shotgun', 'barrel', 'grenade',
      'fakewall', 'claymore', 'rocket', 'chargepack', 'railgun'
    ];
    for (let i = 0; i < expectedWeapons.length; i++) {
      const id = expectedWeapons[i];
      expect(WEAPON_DEFINITIONS[id]).toBeDefined();
      expect(WEAPON_DEFINITIONS[id].slot).toBe(i + 1);
    }
  });

  it('contains exactly 58 milestones spanning x3 to x125 in strictly ascending order', () => {
    expect(UPGRADE_LADDER.length).toBe(58);
    expect(UPGRADE_LADDER[0].multiplier).toBe(3);
    expect(UPGRADE_LADDER[57].multiplier).toBe(125);

    for (let i = 1; i < UPGRADE_LADDER.length; i++) {
      expect(UPGRADE_LADDER[i].multiplier).toBeGreaterThanOrEqual(UPGRADE_LADDER[i - 1].multiplier);
    }
  });

  it('verifies key authentic weapon unlocks in the ladder', () => {
    const unlocks = UPGRADE_LADDER.filter(m => m.type === 'unlock');
    expect(unlocks.length).toBe(9); // Pistol starts unlocked at x1; 9 weapons unlocked via ladder
    expect(unlocks.find(u => u.weaponId === 'uzi')?.multiplier).toBe(5);
    expect(unlocks.find(u => u.weaponId === 'shotgun')?.multiplier).toBe(10);
    expect(unlocks.find(u => u.weaponId === 'barrel')?.multiplier).toBe(15);
    expect(unlocks.find(u => u.weaponId === 'grenade')?.multiplier).toBe(20);
    expect(unlocks.find(u => u.weaponId === 'fakewall')?.multiplier).toBe(30);
    expect(unlocks.find(u => u.weaponId === 'claymore')?.multiplier).toBe(40);
    expect(unlocks.find(u => u.weaponId === 'rocket')?.multiplier).toBe(50);
    expect(unlocks.find(u => u.weaponId === 'chargepack')?.multiplier).toBe(55);
    expect(unlocks.find(u => u.weaponId === 'railgun')?.multiplier).toBe(70);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/weapons/UpgradeLadderConstants.test.ts`
Expected: FAIL with "WEAPON_DEFINITIONS[id] undefined" or "UPGRADE_LADDER is not defined".

- [ ] **Step 3: Write minimal implementation**

Update `src/weapons/WeaponTypes.ts` with 10 `WeaponId` types and update `src/core/Constants.ts` with all 10 weapon profiles and the full 58-milestone `UPGRADE_LADDER`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/weapons/UpgradeLadderConstants.test.ts`
Expected: PASS (all 3 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/core/Constants.ts src/weapons/WeaponTypes.ts tests/weapons/UpgradeLadderConstants.test.ts
git commit -m "feat(weapons): define 10 weapon profiles and 58-milestone upgrade ladder constants"
```

---

### Task 2: Dynamic Weapon Inventory & Upgrade Modifier Engine

**Files:**
- Modify: `src/weapons/WeaponInventory.ts`
- Test: `tests/weapons/DynamicUpgrades.test.ts`

**Interfaces:**
- Consumes: `UPGRADE_LADDER`, `WEAPON_DEFINITIONS`, `WeaponId` from Task 1.
- Produces:
  - `WeaponInventory.applyMilestone(milestone: UpgradeMilestone): void`.
  - `WeaponInventory.checkMilestones(peakMultiplier: number): UpgradeMilestone[]`.
  - Dynamic stat getters: `getEffectiveCooldown(id: WeaponId): number`, `getEffectiveDamage(id: WeaponId): number`, `getEffectiveMaxAmmo(id: WeaponId): number`, `getEffectivePelletCount(id: WeaponId): number`, `getEffectiveBlastRadius(id: WeaponId): number`, `hasClusterExplode(id: WeaponId): boolean`, `isInfiniteRange(id: WeaponId): boolean`.
  - Automatic ammo refill bonuses upon reaching Double Ammo / Quad Ammo milestones.
  - Cycle weapons across 10 slots (wrapping between 1 and 10 for unlocked weapons).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/weapons/DynamicUpgrades.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import { UPGRADE_LADDER } from '../../src/core/Constants';

describe('WeaponInventory Dynamic Upgrades', () => {
  let inventory: WeaponInventory;

  beforeEach(() => {
    inventory = new WeaponInventory();
  });

  it('starts with only Pistol unlocked and base stats', () => {
    expect(inventory.isUnlocked('pistol')).toBe(true);
    expect(inventory.isUnlocked('uzi')).toBe(false);
    expect(inventory.getEffectiveDamage('pistol')).toBe(15);
    expect(inventory.getEffectiveCooldown('pistol')).toBe(0.22);
  });

  it('applies Pistol Fast Fire at x3 and Double Damage at x8', () => {
    const x3 = UPGRADE_LADDER.find(m => m.multiplier === 3)!;
    inventory.applyMilestone(x3);
    expect(inventory.getEffectiveCooldown('pistol')).toBeCloseTo(0.14, 2);

    const x8 = UPGRADE_LADDER.find(m => m.multiplier === 8)!;
    inventory.applyMilestone(x8);
    expect(inventory.getEffectiveDamage('pistol')).toBe(30);
  });

  it('unlocks UZI at x5 and applies ammo doubling bonuses', () => {
    const x5 = UPGRADE_LADDER.find(m => m.multiplier === 5)!;
    inventory.applyMilestone(x5);
    expect(inventory.isUnlocked('uzi')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('uzi')).toBe(200);

    const x17 = UPGRADE_LADDER.find(m => m.multiplier === 17)!;
    inventory.applyMilestone(x17);
    expect(inventory.getEffectiveMaxAmmo('uzi')).toBe(400);
    expect(inventory.getAmmo('uzi')).toBe(400);
  });

  it('retains all upgrades even if combo drains to 1', () => {
    inventory.checkMilestones(25);
    expect(inventory.isUnlocked('shotgun')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('shotgun')).toBe(100);

    // Drains back down
    inventory.checkMilestones(1);
    expect(inventory.isUnlocked('shotgun')).toBe(true);
    expect(inventory.getEffectiveMaxAmmo('shotgun')).toBe(100);
  });

  it('cycles smoothly between all 10 unlocked weapons', () => {
    inventory.checkMilestones(125); // Unlock everything
    inventory.selectWeaponBySlot(1);
    expect(inventory.getActiveWeaponId()).toBe('pistol');

    inventory.nextWeapon();
    expect(inventory.getActiveWeaponId()).toBe('uzi');

    inventory.selectWeaponBySlot(10);
    expect(inventory.getActiveWeaponId()).toBe('railgun');

    inventory.nextWeapon();
    expect(inventory.getActiveWeaponId()).toBe('pistol'); // wraps to slot 1
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/weapons/DynamicUpgrades.test.ts`
Expected: FAIL with "getEffectiveDamage is not a function" or missing methods.

- [ ] **Step 3: Write minimal implementation**

Enhance `src/weapons/WeaponInventory.ts` to implement `appliedMilestones: Set<number>`, modifier tracking map, stat calculation helpers, and 10-slot wrap-around cycling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/weapons/DynamicUpgrades.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/weapons/WeaponInventory.ts tests/weapons/DynamicUpgrades.test.ts
git commit -m "feat(weapons): implement dynamic weapon upgrade modifier engine and 10-slot inventory"
```

---

### Task 3: Claymore Proximity Mine Entity & Cluster Explode

**Files:**
- Create: `src/entities/Claymore.ts`
- Test: `tests/entities/Claymore.test.ts`

**Interfaces:**
- Consumes: `ParticlePool`, `BloodCanvas`, 2D collision utilities, Web Audio.
- Produces:
  - `class Claymore`: Placeable proximity mine entity.
  - Lifecycle: `arming` ($0.5\text{s}$) $\to$ `armed` (scans enemies within $1.2\text{m}$) $\to$ `tripped` (beeps, $0.15\text{s}$ delay) $\to$ `detonating` (radial damage, optional cluster sub-blasts) $\to$ `recycled`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/entities/Claymore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Claymore } from '../../src/entities/Claymore';

describe('Claymore Proximity Mine', () => {
  let claymore: Claymore;

  beforeEach(() => {
    claymore = new Claymore();
  });

  it('starts in arming state and becomes armed after 0.5s', () => {
    claymore.init(0, 0, { damage: 150, radius: 4.0 });
    expect(claymore.state).toBe('arming');

    claymore.update(0.3, []);
    expect(claymore.state).toBe('arming');

    claymore.update(0.25, []);
    expect(claymore.state).toBe('armed');
  });

  it('trips when an enemy comes within trigger range and calls onBeep', () => {
    const onBeep = vi.fn();
    claymore.init(0, 0, { damage: 150, radius: 4.0, onBeep });
    claymore.update(0.55, []); // arm it

    const mockEnemy = { x: 0.8, z: 0.5, radius: 0.65, isDead: false };
    claymore.update(0.016, [mockEnemy as any]);

    expect(claymore.state).toBe('tripped');
    expect(onBeep).toHaveBeenCalled();
  });

  it('detonates after fuse delay and deals damage to nearby enemies', () => {
    const onExplode = vi.fn();
    claymore.init(0, 0, { damage: 150, radius: 4.0, onExplode });
    claymore.update(0.55, []); // armed

    const mockEnemy = { x: 0.5, z: 0.5, radius: 0.65, isDead: false };
    claymore.update(0.016, [mockEnemy as any]); // tripped

    claymore.update(0.2, [mockEnemy as any]); // fuse expires
    expect(claymore.state).toBe('detonated');
    expect(onExplode).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/entities/Claymore.test.ts`
Expected: FAIL with "Cannot find module '../../src/entities/Claymore'".

- [ ] **Step 3: Write minimal implementation**

Create `src/entities/Claymore.ts`:
- Three.js flat parcel box visual with olive strap and `#111111` edge lines.
- Arming delay timer ($0.5\text{s}$), circle proximity trigger check, fuse countdown ($0.15\text{s}$), radial explosion callback, and cluster sub-blast generator.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/entities/Claymore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/Claymore.ts tests/entities/Claymore.test.ts
git commit -m "feat(entities): implement Claymore proximity landmine with cluster explosion"
```

---

### Task 4: Charge Pack Remote C-4 Entity & Detonator

**Files:**
- Create: `src/entities/ChargePack.ts`
- Test: `tests/entities/ChargePack.test.ts`

**Interfaces:**
- Consumes: `ParticlePool`, 2D distance checks.
- Produces:
  - `class ChargePack`: Remote C-4 explosive placed on floor.
  - `detonate()` method dealing radial explosion damage and optional secondary cluster blasts.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/entities/ChargePack.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChargePack } from '../../src/entities/ChargePack';

describe('ChargePack Remote Explosive', () => {
  let chargePack: ChargePack;

  beforeEach(() => {
    chargePack = new ChargePack();
  });

  it('initializes with active state on the field', () => {
    chargePack.init(5, 5, { damage: 180, radius: 5.0 });
    expect(chargePack.isActive).toBe(true);
    expect(chargePack.x).toBe(5);
    expect(chargePack.z).toBe(5);
  });

  it('detonates only when explicitly triggered', () => {
    const onDetonate = vi.fn();
    chargePack.init(5, 5, { damage: 180, radius: 5.0, onDetonate });

    // Regular updates do not detonate
    chargePack.update(1.0);
    expect(chargePack.isActive).toBe(true);
    expect(onDetonate).not.toHaveBeenCalled();

    // Trigger command
    chargePack.detonate();
    expect(chargePack.isActive).toBe(false);
    expect(onDetonate).toHaveBeenCalled();
  });

  it('supports cluster explode mode', () => {
    const subExplosions: { x: number; z: number }[] = [];
    chargePack.init(0, 0, {
      damage: 180,
      radius: 5.0,
      hasCluster: true,
      onSpawnSubExplosion: (x, z) => subExplosions.push({ x, z }),
    });

    chargePack.detonate();
    expect(subExplosions.length).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/entities/ChargePack.test.ts`
Expected: FAIL with "Cannot find module '../../src/entities/ChargePack'".

- [ ] **Step 3: Write minimal implementation**

Create `src/entities/ChargePack.ts`:
- Compact block visual with red indicator LED and `#111111` edge outlines.
- Explicit `detonate()` method, damage delivery, cluster sub-explosions, and particle pool bursts.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/entities/ChargePack.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/ChargePack.ts tests/entities/ChargePack.test.ts
git commit -m "feat(entities): implement Charge Pack remote C-4 explosive entity"
```

---

### Task 5: Railgun Piercing Hitscan Beam Action

**Files:**
- Create: `src/weapons/Railgun.ts`
- Test: `tests/weapons/Railgun.test.ts`

**Interfaces:**
- Consumes: 2D segment-circle and segment-AABB math, `ParticlePool`, Three.js scene.
- Produces:
  - `class RailgunBeam`: High-energy line trace across 60m range piercing all enemies and barricades in line.
  - Visual laser line mesh that flashes for 0.12s with opacity fade out.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/weapons/Railgun.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { RailgunBeam } from '../../src/weapons/Railgun';

describe('Railgun Piercing Hitscan Beam', () => {
  let railgun: RailgunBeam;

  beforeEach(() => {
    railgun = new RailgunBeam();
  });

  it('detects all enemies intersecting the 60m ray in sequence', () => {
    // Firing along +X axis from (0, 0)
    const enemies = [
      { id: 1, x: 10, z: 0.2, radius: 0.65, isDead: false }, // Hit
      { id: 2, x: 25, z: -0.3, radius: 0.65, isDead: false }, // Hit
      { id: 3, x: 15, z: 5.0, radius: 0.65, isDead: false },  // Miss
      { id: 4, x: 45, z: 0.0, radius: 0.65, isDead: false },  // Hit
    ];

    const hitEnemies = railgun.trace(0, 0, 0, 60, enemies as any);
    expect(hitEnemies.length).toBe(3);
    expect(hitEnemies.map(e => e.id)).toEqual([1, 2, 4]);
  });

  it('scales beam damage when Long Shot upgrade is applied', () => {
    railgun.setDamage(100);
    expect(railgun.damage).toBe(100);

    railgun.setDamage(200); // Long Shot (x125)
    expect(railgun.damage).toBe(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/weapons/Railgun.test.ts`
Expected: FAIL with "Cannot find module '../../src/weapons/Railgun'".

- [ ] **Step 3: Write minimal implementation**

Create `src/weapons/Railgun.ts`:
- Ray-circle segment intersection testing.
- Three.js glowing cyan laser beam mesh with `opacity` fade timer ($0.12\text{s}$) and particle ionization trail.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/weapons/Railgun.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/weapons/Railgun.ts tests/weapons/Railgun.test.ts
git commit -m "feat(weapons): implement Railgun piercing laser hitscan beam"
```

---

### Task 6: Procedural Web Audio Additions

**Files:**
- Modify: `src/core/Audio.ts`
- Test: `tests/core/AudioUpgrades.test.ts`

**Interfaces:**
- Consumes: `AudioContext`.
- Produces:
  - `AudioManager.playClaymoreBeep(): void`
  - `AudioManager.playRemoteClick(): void`
  - `AudioManager.playRailgunLaser(): void`
  - `AudioManager.playUpgradeFanfare(): void`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/core/AudioUpgrades.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager } from '../../src/core/Audio';

describe('AudioManager New Weapon Sounds', () => {
  let audio: AudioManager;

  beforeEach(() => {
    audio = new AudioManager();
  });

  it('exposes methods for Claymore beep, Charge Pack click, Railgun laser, and Upgrade fanfare', () => {
    expect(typeof audio.playClaymoreBeep).toBe('function');
    expect(typeof audio.playRemoteClick).toBe('function');
    expect(typeof audio.playRailgunLaser).toBe('function');
    expect(typeof audio.playUpgradeFanfare).toBe('function');
  });

  it('safely runs audio triggers without error in headless/mocked environment', () => {
    expect(() => {
      audio.playClaymoreBeep();
      audio.playRemoteClick();
      audio.playRailgunLaser();
      audio.playUpgradeFanfare();
    }).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/AudioUpgrades.test.ts`
Expected: FAIL with missing method errors.

- [ ] **Step 3: Write minimal implementation**

Add procedural Web Audio synthesizers in `src/core/Audio.ts` for Claymore warning beep ($1200\text{Hz}$ sine burst), Charge Pack mechanical trigger, Railgun laser discharge, and milestone fanfare.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/AudioUpgrades.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/Audio.ts tests/core/AudioUpgrades.test.ts
git commit -m "feat(audio): add procedural sound effects for Claymore, Charge Pack, Railgun, and upgrades"
```

---

### Task 7: 10-Slot Retro HUD Overlay & Flash Pop-Up Toasts

**Files:**
- Modify: `src/ui/HUD.ts`
- Test: `tests/ui/HUD10Slots.test.ts`

**Interfaces:**
- Consumes: `WeaponInventory`, `UPGRADE_LADDER`.
- Produces:
  - 10 weapon slots `[1] PISTOL` through `[0] RAILGUN` rendered in hotbar.
  - Number keys `1`–`9` and `0` weapon slot selection.
  - `HUD.showUpgradeToast(title: string, subtitle: string, isWeaponUnlock: boolean): void`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/ui/HUD10Slots.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { HUD } from '../../src/ui/HUD';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';

describe('HUD 10 Weapon Slots & Toasts', () => {
  let hud: HUD;
  let inventory: WeaponInventory;

  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-overlay"></div>';
    inventory = new WeaponInventory();
    hud = new HUD({ inventory });
  });

  it('renders all 10 weapon slots in the hotbar', () => {
    const slots = document.querySelectorAll('.hud-weapon-slot');
    expect(slots.length).toBe(10);
  });

  it('displays correct keys [1] to [9] and [0] for Railgun', () => {
    const keyLabels = Array.from(document.querySelectorAll('.hud-slot-key')).map(el => el.textContent?.trim());
    expect(keyLabels).toEqual(['[1]', '[2]', '[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[0]']);
  });

  it('renders upgrade and unlock toasts', () => {
    hud.showUpgradeToast('NEW WEAPON: CLAYMORE (KEY 7)', 'UNLOCKED AT x40', true);
    const toast = document.querySelector('.hud-unlock-toast');
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain('NEW WEAPON: CLAYMORE (KEY 7)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/HUD10Slots.test.ts`
Expected: FAIL with "expected 7 to be 10".

- [ ] **Step 3: Write minimal implementation**

Modify `src/ui/HUD.ts`:
- Expand hotbar generation to loop over 10 slots.
- Format key label `[0]` for slot 10.
- Handle click and dataset slot selection for all 10 slots.
- Implement animated pop-up toast with gold border for weapon unlocks and cyan for upgrades.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/HUD10Slots.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/HUD.ts tests/ui/HUD10Slots.test.ts
git commit -m "feat(ui): expand HUD to 10 weapon slots and add upgrade notification toasts"
```

---

### Task 8: Full Gameplay Loop Integration & System Verification

**Files:**
- Modify: `src/core/Game.ts`
- Modify: `src/core/Input.ts`
- Test: `tests/core/GameUpgradesIntegration.test.ts`

**Interfaces:**
- Consumes: All components from Tasks 1–7.
- Produces:
  - Firing logic for Claymore placement and proximity detonation.
  - Firing logic for Charge Pack placement and remote trigger via Spacebar / click.
  - Firing logic for Railgun instantaneous hitscan beam.
  - Milestone check loop in `Game.update()` triggering sounds and toasts.
  - Complete regression pass across all 240+ tests.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/core/GameUpgradesIntegration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/core/Game';

describe('Game Full Upgrade System Integration', () => {
  let game: Game;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container">
        <div id="damage-overlay"></div>
        <div id="hud-overlay"></div>
      </div>
    `;
    game = new Game({ autoStart: false });
  });

  it('triggers upgrade milestones and toasts when combo scales up', () => {
    // Simulate killing zombies to get combo x5 (UZI unlock)
    const inventory = (game as any).inventory;
    expect(inventory.isUnlocked('uzi')).toBe(false);

    (game as any).comboSystem.multiplier = 5;
    game.update(0.016);

    expect(inventory.isUnlocked('uzi')).toBe(true);
  });

  it('supports Key 0 to select Railgun when unlocked', () => {
    const inventory = (game as any).inventory;
    (game as any).comboSystem.multiplier = 70;
    game.update(0.016);

    expect(inventory.isUnlocked('railgun')).toBe(true);
    inventory.selectWeaponBySlot(10);
    expect(inventory.getActiveWeaponId()).toBe('railgun');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/core/GameUpgradesIntegration.test.ts`
Expected: FAIL with key selection or update dispatch errors.

- [ ] **Step 3: Write minimal implementation**

Modify `src/core/Game.ts` and `src/core/Input.ts`:
- Add key listener for `'0'` (Digit0 / Numpad0) to select slot 10.
- In `handleFiring()`, dispatch placement for Claymores, Charge Packs, and firing for Railgun beam.
- Check milestones on combo change, triggering `audioManager.playUpgradeFanfare()` and `hud.showUpgradeToast()`.
- Add Spacebar detonator trigger when holding Charge Pack with active charges deployed.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/core/GameUpgradesIntegration.test.ts`
Expected: PASS.

- [ ] **Step 5: Run full test suite and build**

Run: `npm run test && npm run build`
Expected: PASS (all 12+ test files pass, zero build errors).

- [ ] **Step 6: Commit**

```bash
git add src/core/Game.ts src/core/Input.ts tests/core/GameUpgradesIntegration.test.ts
git commit -m "feat(core): integrate 10-weapon suite, remote detonator, and 58-milestone upgrade engine"
```

---

## 6. Execution Options
Plan complete and saved to `docs/superpowers/plans/2026-09-12-boxhead-weapon-upgrades.md`.
