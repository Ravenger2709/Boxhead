import { describe, it, expect, beforeEach } from 'vitest';
import {
  KeyMappingManager,
  FLASH_P1_KEYS,
  FLASH_P2_KEYS,
  WASD_BINDINGS,
  ARROWS_BINDINGS,
} from '../../src/controls/KeyMapping';

describe('KeyMappingManager', () => {
  let manager: KeyMappingManager;

  beforeEach(() => {
    KeyMappingManager.clearStorage();
    manager = new KeyMappingManager();
  });

  it('provides authentic Flash scan codes for Player 1', () => {
    expect(FLASH_P1_KEYS.up.keyCode).toBe(38); // ArrowUp
    expect(FLASH_P1_KEYS.down.keyCode).toBe(40); // ArrowDown
    expect(FLASH_P1_KEYS.left.keyCode).toBe(37); // ArrowLeft
    expect(FLASH_P1_KEYS.right.keyCode).toBe(39); // ArrowRight
    expect(FLASH_P1_KEYS.shoot.keyCode).toBe(191); // Slash
    expect(FLASH_P1_KEYS.next_weapon.keyCode).toBe(190); // Period
    expect(FLASH_P1_KEYS.prev_weapon.keyCode).toBe(188); // Comma
  });

  it('provides authentic Flash scan codes for Player 2', () => {
    expect(FLASH_P2_KEYS.up.keyCode).toBe(87); // W
    expect(FLASH_P2_KEYS.down.keyCode).toBe(83); // S
    expect(FLASH_P2_KEYS.left.keyCode).toBe(65); // A
    expect(FLASH_P2_KEYS.right.keyCode).toBe(68); // D
    expect(FLASH_P2_KEYS.shoot.keyCode).toBe(32); // Space
    expect(FLASH_P2_KEYS.next_weapon.keyCode).toBe(69); // E
    expect(FLASH_P2_KEYS.prev_weapon.keyCode).toBe(81); // Q
  });

  it('correctly maps code to player action', () => {
    const actionW = manager.getActionForCode('KeyW', WASD_BINDINGS);
    expect(actionW).toBe('up');

    const actionSpace = manager.getActionForCode('Space', WASD_BINDINGS);
    expect(actionSpace).toBe('shoot');

    const actionUp = manager.getActionForCode('ArrowUp', ARROWS_BINDINGS);
    expect(actionUp).toBe('up');

    const actionSlash = manager.getActionForCode('Slash', ARROWS_BINDINGS);
    expect(actionSlash).toBe('shoot');
  });

  it('persists customized key bindings in localStorage', () => {
    const custom = { ...WASD_BINDINGS, shoot: 'KeyJ' };
    manager.setP1Bindings(custom);

    const reloaded = new KeyMappingManager();
    expect(reloaded.getP1Bindings().shoot).toBe('KeyJ');
  });
});
