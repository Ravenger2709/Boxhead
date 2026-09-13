import { KeyBindings, PlayerAction } from '../types';

export interface FlashKeyDetails {
  keyCode: number;
  code: string;
  key: string;
}

// Flash AS2 scan codes according to Boxhead 2Play CSaveData
export const FLASH_P1_KEYS: Record<PlayerAction, FlashKeyDetails> = {
  up: { keyCode: 38, code: 'ArrowUp', key: 'ArrowUp' },
  down: { keyCode: 40, code: 'ArrowDown', key: 'ArrowDown' },
  left: { keyCode: 37, code: 'ArrowLeft', key: 'ArrowLeft' },
  right: { keyCode: 39, code: 'ArrowRight', key: 'ArrowRight' },
  shoot: { keyCode: 191, code: 'Slash', key: '/' },
  next_weapon: { keyCode: 190, code: 'Period', key: '.' },
  prev_weapon: { keyCode: 188, code: 'Comma', key: ',' },
};

export const FLASH_P2_KEYS: Record<PlayerAction, FlashKeyDetails> = {
  up: { keyCode: 87, code: 'KeyW', key: 'w' },
  down: { keyCode: 83, code: 'KeyS', key: 's' },
  left: { keyCode: 65, code: 'KeyA', key: 'a' },
  right: { keyCode: 68, code: 'KeyD', key: 'd' },
  shoot: { keyCode: 32, code: 'Space', key: ' ' },
  next_weapon: { keyCode: 69, code: 'KeyE', key: 'e' },
  prev_weapon: { keyCode: 81, code: 'KeyQ', key: 'q' },
};

export const DEFAULT_P1_BINDINGS: KeyBindings = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  shoot: 'Slash',
  next_weapon: 'Period',
  prev_weapon: 'Comma',
};

// Also offer standard WASD preset for Player 1 when playing solo or if P1 prefers WASD
export const WASD_BINDINGS: KeyBindings = {
  up: 'KeyW',
  down: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  shoot: 'Space',
  next_weapon: 'KeyE',
  prev_weapon: 'KeyQ',
};

export const ARROWS_BINDINGS: KeyBindings = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  shoot: 'Slash',
  next_weapon: 'Period',
  prev_weapon: 'Comma',
};

export class KeyMappingManager {
  private p1Bindings: KeyBindings;
  private p2Bindings: KeyBindings;

  constructor() {
    this.p1Bindings = this.loadBindings('bh2_p1_keys', WASD_BINDINGS);
    this.p2Bindings = this.loadBindings('bh2_p2_keys', WASD_BINDINGS);
  }

  public getP1Bindings(): KeyBindings {
    return { ...this.p1Bindings };
  }

  public getP2Bindings(): KeyBindings {
    return { ...this.p2Bindings };
  }

  public setP1Bindings(bindings: KeyBindings): void {
    this.p1Bindings = { ...bindings };
    this.saveBindings('bh2_p1_keys', this.p1Bindings);
  }

  public setP2Bindings(bindings: KeyBindings): void {
    this.p2Bindings = { ...bindings };
    this.saveBindings('bh2_p2_keys', this.p2Bindings);
  }

  public getActionForCode(code: string, bindings: KeyBindings): PlayerAction | null {
    for (const [action, boundCode] of Object.entries(bindings)) {
      if (boundCode === code) {
        return action as PlayerAction;
      }
    }
    return null;
  }

  private static memoryStorage: Record<string, string> = {};

  private loadBindings(storageKey: string, fallback: KeyBindings): KeyBindings {
    try {
      let stored: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        stored = window.localStorage.getItem(storageKey);
      } else {
        stored = KeyMappingManager.memoryStorage[storageKey] || null;
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...fallback, ...parsed };
      }
    } catch {
      // Ignore storage errors
    }
    return { ...fallback };
  }

  private saveBindings(storageKey: string, bindings: KeyBindings): void {
    try {
      const val = JSON.stringify(bindings);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, val);
      } else {
        KeyMappingManager.memoryStorage[storageKey] = val;
      }
    } catch {
      // Ignore storage errors
    }
  }

  public static clearStorage(): void {
    KeyMappingManager.memoryStorage = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  }
}
