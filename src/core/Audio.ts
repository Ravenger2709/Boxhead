/**
 * Procedural Web Audio Sound Synthesizer
 *
 * Implements arcade-authentic procedural sound effects with zero external audio assets:
 * - Pistol: short white noise burst with bandpass filter
 * - Uzi: fast high-pitched clipped noise snap
 * - Shotgun: low punch sine + wide noise burst
 * - Explosion: low sine pitch drop (120Hz -> 20Hz) + distorted low-pass noise
 * - Zombie Groan: modulated low pitch saw/square wave (60-90Hz)
 * - Devil Fireball: descending triangle tone + noise
 * - Pickup: two-tone rising chime (C5 -> G5)
 * - Claymore Beep: sharp 1200Hz warning tone burst
 * - Remote Click: high-pass metallic click for Charge Pack detonator
 * - Railgun Laser: swept oscillator with white noise burst and resonant filter
 * - Upgrade Fanfare: rising tri-tone chime for upgrade milestones
 * - Mute toggle support & headless/Vitest SSR resilience
 */

export class AudioManager {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public isMuted: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  constructor(context?: AudioContext) {
    this.playClaymoreBeep = this.playClaymoreBeep.bind(this);
    this.playRemoteClick = this.playRemoteClick.bind(this);
    this.playRailgunLaser = this.playRailgunLaser.bind(this);
    this.playUpgradeFanfare = this.playUpgradeFanfare.bind(this);

    if (context) {
      this.ctx = context;
    } else if (typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        try {
          this.ctx = new AudioContextClass();
        } catch {
          this.ctx = null;
        }
      }
    }

    if (this.ctx) {
      try {
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.8;
      } catch {
        this.masterGain = null;
      }
    }
  }

  /**
   * Resumes AudioContext if suspended by browser autoplay policy.
   */
  public async resumeContext(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Silently continue if autoplay policy blocks before user gesture
      }
    }
  }

  /**
   * Generates or retrieves a cached 1-second white noise buffer.
   */
  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noiseBuffer) {
      try {
        const sampleRate = this.ctx.sampleRate || 44100;
        const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < sampleRate; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;
      } catch {
        return null;
      }
    }
    return this.noiseBuffer;
  }

  /**
   * Toggles sound output muting.
   * Returns current muted state.
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.8,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  /**
   * Pistol shot: Short white noise burst with bandpass filter.
   */
  public playPistol(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      const noise = this.getNoiseBuffer();
      if (!noise) return;

      const source = this.ctx.createBufferSource();
      source.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + 0.08);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Uzi shot: Fast high-pitched clipped noise snap.
   */
  public playUzi(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      const noise = this.getNoiseBuffer();
      if (!noise) return;

      const source = this.ctx.createBufferSource();
      source.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + 0.045);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Shotgun blast: Low punch sine + wide noise burst.
   */
  public playShotgun(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // 1. Low punch sine body
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

      oscGain.gain.setValueAtTime(0.6, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);

      // 2. Wide noise burst
      const noise = this.getNoiseBuffer();
      if (noise) {
        const source = this.ctx.createBufferSource();
        source.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);
        filter.Q.setValueAtTime(1.5, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.55, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        source.start(now);
        source.stop(now + 0.22);
      }
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Explosion: Low sine pitch drop (120Hz -> 20Hz) + distorted low-pass noise.
   */
  public playExplosion(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // 1. Deep sub-bass pitch drop (120Hz -> 20Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);

      oscGain.gain.setValueAtTime(0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);

      // 2. Heavy distorted low-pass noise rumble
      const noise = this.getNoiseBuffer();
      if (noise) {
        const source = this.ctx.createBufferSource();
        source.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, now);
        filter.Q.setValueAtTime(2.5, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.85, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        source.start(now);
        source.stop(now + 0.6);
      }
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Zombie Groan: Modulated low pitch saw/square wave (60-90Hz).
   */
  public playZombieGroan(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      // Modulate frequency between 60Hz and 90Hz
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.linearRampToValueAtTime(62, now + 0.25);
      osc.frequency.linearRampToValueAtTime(70, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Devil Fireball: Descending triangle tone + noise.
   */
  public playDevilFireball(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // Descending triangle tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);

      // Sizzle noise
      const noise = this.getNoiseBuffer();
      if (noise) {
        const source = this.ctx.createBufferSource();
        source.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        source.start(now);
        source.stop(now + 0.25);
      }
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Fireball Fizzle / Impact: Short descending noise fizzle on wall collision.
   */
  public playFireballFizzle(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      const noise = this.getNoiseBuffer();
      if (!noise) return;

      const source = this.ctx.createBufferSource();
      source.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + 0.12);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Pickup: Two-tone rising chime (C5 -> G5: 523.25Hz -> 783.99Hz).
   */
  public playPickup(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);

      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2: G5 (783.99 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.08);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.35, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.26);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Claymore warning beep: Sharp 1200Hz warning tone burst (sine wave, ~0.08s).
   */
  public playClaymoreBeep(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Remote detonator click: High-pass metallic click for Charge Pack detonator (~0.04s).
   */
  public playRemoteClick(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // 1. Snappy high-pass filtered noise burst transient
      const noise = this.getNoiseBuffer();
      if (noise) {
        const source = this.ctx.createBufferSource();
        source.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(4.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        source.start(now);
        source.stop(now + 0.04);
      }

      // 2. High metallic click ping
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

      oscGain.gain.setValueAtTime(0.25, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Railgun laser: Swept oscillator with white noise burst and resonant filter (~0.25s).
   */
  public playRailgunLaser(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;

      // 1. Swept high-energy sci-fi oscillator (2800Hz -> 160Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);

      // 2. Resonant white noise burst sweep
      const noise = this.getNoiseBuffer();
      if (noise) {
        const source = this.ctx.createBufferSource();
        source.buffer = noise;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);
        filter.Q.setValueAtTime(4.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        source.start(now);
        source.stop(now + 0.22);
      }
    } catch {
      // Graceful error recovery
    }
  }

  /**
   * Upgrade fanfare: Rising tri-tone chime for upgrade milestones (C5 -> E5 -> G5 -> C6).
   */
  public playUpgradeFanfare(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      // Rising arpeggio: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
      const notes = [
        { freq: 523.25, start: 0.00, dur: 0.12 },
        { freq: 659.25, start: 0.08, dur: 0.12 },
        { freq: 783.99, start: 0.16, dur: 0.14 },
        { freq: 1046.50, start: 0.24, dur: 0.28 },
      ];

      for (const note of notes) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        const noteStart = now + note.start;
        osc.frequency.setValueAtTime(note.freq, noteStart);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.3, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + note.dur);
      }
    } catch {
      // Graceful error recovery
    }
  }
}

// Global singleton instance for easy cross-system access
export const audioManager = new AudioManager();
