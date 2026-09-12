import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../src/ui/HUD';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import { UPGRADE_LADDER } from '../../src/core/Constants';

// Minimal DOM simulation for Vitest Node environment
interface MockElement {
  id?: string;
  tagName: string;
  className: string;
  _className?: string;
  style: Record<string, string>;
  textContent: string;
  _textContent?: string;
  dataset: Record<string, string>;
  children: MockElement[];
  parentNode: MockElement | null;
  appendChild(child: MockElement): MockElement;
  removeChild(child: MockElement): MockElement;
  addEventListener(event: string, handler: Function): void;
  removeEventListener(event: string, handler: Function): void;
  dispatchEvent(event: { type: string }): boolean;
  classList: {
    add(cls: string): void;
    remove(cls: string): void;
    contains(cls: string): boolean;
    toggle(cls: string): boolean;
  };
  querySelector(selector: string): MockElement | null;
  querySelectorAll(selector: string): MockElement[];
}

function createMockElement(tag: string = 'div'): MockElement {
  const classes = new Set<string>();
  const listeners: Record<string, Function[]> = {};

  const el: MockElement = {
    tagName: tag.toUpperCase(),
    _className: '',
    get className(): string {
      return this._className ?? '';
    },
    set className(val: string) {
      this._className = val;
      classes.clear();
      if (val) {
        val.split(/\s+/).filter(Boolean).forEach((c: string) => classes.add(c));
      }
    },
    style: {},
    dataset: {},
    children: [],
    parentNode: null,
    _textContent: '',
    get textContent(): string {
      if (this.children.length > 0) {
        return this.children.map((c: MockElement) => c.textContent).join(' ');
      }
      return this._textContent ?? '';
    },
    set textContent(val: string) {
      this._textContent = val;
    },
    appendChild(child: MockElement) {
      el.children.push(child);
      child.parentNode = el;
      return child;
    },
    removeChild(child: MockElement) {
      const idx = el.children.indexOf(child);
      if (idx !== -1) {
        el.children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    },
    addEventListener(event: string, handler: Function) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener(event: string, handler: Function) {
      if (!listeners[event]) return;
      const idx = listeners[event].indexOf(handler);
      if (idx !== -1) listeners[event].splice(idx, 1);
    },
    dispatchEvent(event: { type: string }) {
      const handlers = listeners[event.type] || [];
      for (const h of handlers) {
        h(event);
      }
      return true;
    },
    classList: {
      add(cls: string) {
        classes.add(cls);
        el._className = Array.from(classes).join(' ');
      },
      remove(cls: string) {
        classes.delete(cls);
        el._className = Array.from(classes).join(' ');
      },
      contains(cls: string) {
        return classes.has(cls);
      },
      toggle(cls: string) {
        if (classes.has(cls)) {
          classes.delete(cls);
          el._className = Array.from(classes).join(' ');
          return false;
        }
        classes.add(cls);
        el._className = Array.from(classes).join(' ');
        return true;
      },
    },
    querySelector(selector: string): MockElement | null {
      const all = el.querySelectorAll(selector);
      return all.length > 0 ? all[0] : null;
    },
    querySelectorAll(selector: string): MockElement[] {
      const results: MockElement[] = [];
      const match = (node: MockElement) => {
        if (selector.startsWith('.')) {
          const cls = selector.slice(1);
          if (node.classList.contains(cls) || node.className.split(' ').includes(cls)) {
            results.push(node);
          }
        } else if (selector.startsWith('#')) {
          const id = selector.slice(1);
          if (node.id === id) results.push(node);
        } else if (node.tagName.toLowerCase() === selector.toLowerCase()) {
          results.push(node);
        }
        for (const c of node.children) {
          match(c);
        }
      };
      for (const c of el.children) {
        match(c);
      }
      return results;
    },
  } as any;
  return el;
}

function setupMockDocument() {
  const body = createMockElement('body');
  (body as any)._innerHTML = '';
  Object.defineProperty(body, 'innerHTML', {
    get() {
      return (body as any)._innerHTML;
    },
    set(val: string) {
      (body as any)._innerHTML = val;
      body.children = [];
      if (val.includes('id="hud-overlay"')) {
        const overlay = createMockElement('div');
        overlay.id = 'hud-overlay';
        body.appendChild(overlay);
      }
    },
  });

  const doc = {
    body,
    createElement(tag: string) {
      return createMockElement(tag);
    },
    getElementById(id: string) {
      if (id === 'hud-overlay') {
        return body.querySelector('#hud-overlay');
      }
      return null;
    },
    querySelector(selector: string) {
      return body.querySelector(selector);
    },
    querySelectorAll(selector: string) {
      return body.querySelectorAll(selector);
    },
  };

  (globalThis as any).document = doc;
}

describe('HUD 10 Weapon Slots & Toasts', () => {
  let hud: HUD;
  let inventory: WeaponInventory;

  beforeEach(() => {
    setupMockDocument();
    document.body.innerHTML = '<div id="hud-overlay"></div>';
    inventory = new WeaponInventory();
    hud = new HUD({ inventory });
  });

  afterEach(() => {
    delete (globalThis as any).document;
  });

  it('renders all 10 weapon slots in the hotbar', () => {
    const slots = document.querySelectorAll('.hud-weapon-slot');
    expect(slots.length).toBe(10);
  });

  it('displays correct keys [1] to [9] and [0] for Railgun', () => {
    const keyLabels = Array.from(document.querySelectorAll('.hud-slot-key')).map(el => el.textContent?.trim());
    expect(keyLabels).toEqual(['[1]', '[2]', '[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[0]']);
  });

  it('displays authentic uppercase names for all 10 weapon slots', () => {
    const names = Array.from(document.querySelectorAll('.hud-slot-name')).map(el => el.textContent?.trim());
    expect(names).toEqual([
      'PISTOL',
      'UZI',
      'SHOTGUN',
      'BARRELS',
      'GRENADES',
      'FAKE WALLS',
      'CLAYMORE',
      'ROCKETS',
      'CHARGE PACK',
      'RAILGUN',
    ]);
  });

  it('displays authentic unlock thresholds on locked slots 2 through 10', () => {
    const expectedThresholds = ['5x', '10x', '15x', '20x', '30x', '40x', '50x', '55x', '70x'];
    for (let slot = 2; slot <= 10; slot++) {
      const lockEl = hud.slotLockElements.get(slot);
      expect(lockEl).toBeDefined();
      expect(lockEl?.textContent).toContain(expectedThresholds[slot - 2]);
    }
  });

  it('renders upgrade and unlock toasts', () => {
    hud.showUpgradeToast('NEW WEAPON: CLAYMORE (KEY 7)', 'UNLOCKED AT x40', true);
    const toast = document.querySelector('.hud-unlock-toast');
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain('NEW WEAPON: CLAYMORE (KEY 7)');
    expect(toast?.textContent).toContain('UNLOCKED AT x40');
  });

  it('applies gold styling for weapon unlocks and cyan styling for stat upgrades', () => {
    // Weapon unlock toast -> gold border
    hud.showUpgradeToast('NEW WEAPON: RAILGUN (KEY 0)', 'UNLOCKED AT x70', true);
    expect(hud.toastEl?.style.display).not.toBe('none');
    expect(hud.toastEl?.style.borderColor.toLowerCase()).toContain('#f1c40f');

    // Stat upgrade toast -> cyan border
    hud.showUpgradeToast('UZI+: RAPID FIRE', 'COOLDOWN 0.08s -> 0.05s', false);
    const border = hud.toastEl?.style.borderColor.toLowerCase();
    expect(border === '#00ffff' || border === 'rgb(0, 255, 255)' || border?.includes('00ffff') || border?.includes('3498db')).toBe(true);
  });

  it('auto-hides toast after timeout', () => {
    vi.useFakeTimers();
    hud.showUpgradeToast('NEW WEAPON: UZI (KEY 2)', 'UNLOCKED AT x5', true);
    expect(hud.toastEl?.style.display).not.toBe('none');

    vi.advanceTimersByTime(3000);
    expect(hud.toastEl?.style.display).toBe('none');
    vi.useRealTimers();
  });

  it('allows clicking unlocked slots and ignores clicks on locked slots', () => {
    const onSelect = vi.fn();
    const testHud = new HUD({ inventory, onSelectWeapon: onSelect });

    // Slot 1 (Pistol) is unlocked
    testHud.slotElements.get(1)?.dispatchEvent({ type: 'click' });
    expect(onSelect).toHaveBeenCalledWith(1);

    // Slot 10 (Railgun) is locked initially
    testHud.slotElements.get(10)?.dispatchEvent({ type: 'click' });
    expect(onSelect).toHaveBeenCalledTimes(1);

    // Unlock Railgun via milestones
    inventory.applyMilestone(UPGRADE_LADDER.find(m => m.weaponId === 'railgun' && m.type === 'unlock')!);
    const activeDef = inventory.getActiveWeaponDef();
    testHud.update(100, 100, 70, 0, activeDef, -1, 1, 5000, false, inventory);

    // Clicking slot 10 now selects Railgun
    testHud.slotElements.get(10)?.dispatchEvent({ type: 'click' });
    expect(onSelect).toHaveBeenCalledWith(10);
  });

  it('updates all 10 slots dynamically with ammo and active states', () => {
    // Unlock all weapons
    for (const m of UPGRADE_LADDER) {
      if (m.type === 'unlock') {
        inventory.applyMilestone(m);
      }
    }

    // Select Railgun (slot 10)
    inventory.selectWeaponBySlot(10);
    const activeDef = inventory.getActiveWeaponDef();

    hud.update(90, 100, 70, 0.5, activeDef, 25, 10, 100000, false, inventory);

    expect(hud.slotElements.get(10)?.classList.contains('active')).toBe(true);
    expect(hud.slotElements.get(1)?.classList.contains('active')).toBe(false);
    expect(hud.slotAmmoElements.get(10)?.textContent).toBe('25');
    expect(hud.slotAmmoElements.get(1)?.textContent).toBe('∞');

    // Verify all 10 slots have locked class removed
    for (let slot = 1; slot <= 10; slot++) {
      expect(hud.slotElements.get(slot)?.classList.contains('locked')).toBe(false);
      expect(hud.slotLockElements.get(slot)?.style.display).toBe('none');
    }
  });
});
