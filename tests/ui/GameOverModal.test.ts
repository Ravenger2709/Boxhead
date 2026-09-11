import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameOverModal } from '../../src/ui/GameOverModal';

describe('Task 9: GameOverModal Component', () => {
  let modal: GameOverModal;

  beforeEach(() => {
    modal = new GameOverModal();
  });

  describe('Initialization', () => {
    it('should create GameOverModal with elements and initially hidden', () => {
      expect(modal).toBeDefined();
      expect(modal.rootElement).toBeDefined();
      expect(modal.scoreValEl).toBeDefined();
      expect(modal.comboValEl).toBeDefined();
      expect(modal.waveValEl).toBeDefined();
      expect(modal.restartBtnEl).toBeDefined();
      expect(modal.visible).toBe(false);
      expect(modal.rootElement?.style.display).toBe('none');
    });
  });

  describe('Show Modal & Stats Display', () => {
    it('should populate score, combo multiplier, and waves survived', () => {
      const onRestart = vi.fn();
      modal.show(48250, 18, 6, onRestart);

      expect(modal.visible).toBe(true);
      expect(modal.rootElement?.style.display).not.toBe('none');
      expect(modal.scoreValEl?.textContent).toContain('48,250');
      expect(modal.comboValEl?.textContent).toBe('x18');
      expect(modal.waveValEl?.textContent).toBe('6');
    });
  });

  describe('Restart Triggers', () => {
    it('should invoke onRestart and hide modal when restart button is clicked', () => {
      const onRestart = vi.fn();
      modal.show(12000, 5, 2, onRestart);

      modal.restartBtnEl?.dispatchEvent({ type: 'click' });

      expect(onRestart).toHaveBeenCalledTimes(1);
      expect(modal.visible).toBe(false);
      expect(modal.rootElement?.style.display).toBe('none');
    });

    it('should trigger restart on Spacebar or Enter keydown', () => {
      const onRestart = vi.fn();
      modal.show(25000, 10, 4, onRestart);

      modal.handleKeyDown({ code: 'Space', key: ' ', preventDefault: vi.fn() } as any);
      expect(onRestart).toHaveBeenCalledTimes(1);
      expect(modal.visible).toBe(false);

      // Subsequent keypress should not invoke onRestart again
      modal.handleKeyDown({ code: 'Enter', key: 'Enter', preventDefault: vi.fn() } as any);
      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('should hide modal on hide() call', () => {
      modal.show(5000, 2, 1, vi.fn());
      expect(modal.visible).toBe(true);

      modal.hide();
      expect(modal.visible).toBe(false);
      expect(modal.rootElement?.style.display).toBe('none');
    });

    it('should guard against duplicate keydown listeners on repeated show() calls', () => {
      const removeSpy = vi.fn();
      const addSpy = vi.fn();
      (globalThis as any).window = {
        addEventListener: addSpy,
        removeEventListener: removeSpy,
      };

      modal.show(1000, 1, 1, vi.fn());
      const addCountBefore = addSpy.mock.calls.length;

      // Call show() again while already showing
      modal.show(2000, 2, 2, vi.fn());

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(addSpy.mock.calls.length).toBe(addCountBefore + 1);

      modal.hide();
      delete (globalThis as any).window;
    });
  });
});
