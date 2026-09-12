import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager, audioManager } from '../../src/core/Audio';

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

  it('exposes methods on the exported audioManager singleton', () => {
    expect(typeof audioManager.playClaymoreBeep).toBe('function');
    expect(typeof audioManager.playRemoteClick).toBe('function');
    expect(typeof audioManager.playRailgunLaser).toBe('function');
    expect(typeof audioManager.playUpgradeFanfare).toBe('function');
  });

  it('safely runs audio triggers without error in headless/mocked environment', () => {
    expect(() => {
      audio.playClaymoreBeep();
      audio.playRemoteClick();
      audio.playRailgunLaser();
      audio.playUpgradeFanfare();
    }).not.toThrow();
  });

  it('allows detached invocation of methods on the exported singleton without `this` errors', () => {
    const { playClaymoreBeep, playRemoteClick, playRailgunLaser, playUpgradeFanfare } = audioManager;
    expect(() => {
      playClaymoreBeep();
      playRemoteClick();
      playRailgunLaser();
      playUpgradeFanfare();
    }).not.toThrow();
  });

  describe('with mocked AudioContext', () => {
    let mockGainNode: any;
    let mockOscillatorNode: any;
    let mockBufferSource: any;
    let mockBiquadFilter: any;
    let mockBuffer: any;
    let mockContext: AudioContext;
    let audioWithCtx: AudioManager;

    beforeEach(() => {
      mockGainNode = {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          value: 1,
        },
        connect: vi.fn(),
      };

      mockOscillatorNode = {
        type: 'sine',
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          value: 440,
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };

      mockBufferSource = {
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };

      mockBiquadFilter = {
        type: 'bandpass',
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          value: 1000,
        },
        Q: {
          setValueAtTime: vi.fn(),
          value: 1,
        },
        connect: vi.fn(),
      };

      mockBuffer = {
        getChannelData: vi.fn().mockReturnValue(new Float32Array(1024)),
      };

      mockContext = {
        currentTime: 0,
        sampleRate: 44100,
        state: 'running',
        createGain: vi.fn().mockReturnValue(mockGainNode),
        createOscillator: vi.fn().mockReturnValue(mockOscillatorNode),
        createBufferSource: vi.fn().mockReturnValue(mockBufferSource),
        createBiquadFilter: vi.fn().mockReturnValue(mockBiquadFilter),
        createBuffer: vi.fn().mockReturnValue(mockBuffer),
        destination: {},
        resume: vi.fn().mockResolvedValue(undefined),
      } as unknown as AudioContext;

      audioWithCtx = new AudioManager(mockContext);
    });

    it('synthesizes Claymore warning beep with sharp 1200Hz tone burst', () => {
      audioWithCtx.playClaymoreBeep();

      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillatorNode.type).toBe('sine');
      expect(mockOscillatorNode.frequency.setValueAtTime).toHaveBeenCalledWith(1200, 0);
      expect(mockOscillatorNode.start).toHaveBeenCalledWith(0);
      expect(mockOscillatorNode.stop).toHaveBeenCalled();
      expect(mockGainNode.connect).toHaveBeenCalled();
    });

    it('synthesizes Charge Pack remote click with highpass transient and metallic click', () => {
      audioWithCtx.playRemoteClick();

      expect(mockContext.createGain).toHaveBeenCalled();
      // Should create filter and buffer source or oscillator
      expect(mockContext.createBiquadFilter).toHaveBeenCalled();
      expect(mockBiquadFilter.type).toBe('highpass');
    });

    it('synthesizes Railgun laser with swept oscillator and resonant white noise burst', () => {
      audioWithCtx.playRailgunLaser();

      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillatorNode.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
      expect(mockContext.createBufferSource).toHaveBeenCalled();
      expect(mockContext.createBiquadFilter).toHaveBeenCalled();
    });

    it('synthesizes Upgrade fanfare with rising chime notes', () => {
      audioWithCtx.playUpgradeFanfare();

      // Fanfare plays multiple notes (tri-tone or 4-tone chime e.g. C5 -> E5 -> G5 -> C6)
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect((mockContext.createOscillator as any).mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('does not play sounds when audio is muted', () => {
      audioWithCtx.isMuted = true;

      vi.clearAllMocks();

      audioWithCtx.playClaymoreBeep();
      audioWithCtx.playRemoteClick();
      audioWithCtx.playRailgunLaser();
      audioWithCtx.playUpgradeFanfare();

      expect(mockContext.createOscillator).not.toHaveBeenCalled();
      expect(mockContext.createBufferSource).not.toHaveBeenCalled();
      expect(mockContext.createBiquadFilter).not.toHaveBeenCalled();
    });
  });
});
