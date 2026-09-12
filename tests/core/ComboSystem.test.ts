import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { ComboSystem } from '../../src/core/ComboSystem';
import { WaveDirector } from '../../src/core/WaveDirector';
import { Crate } from '../../src/entities/Crate';
import { AudioManager, audioManager } from '../../src/core/Audio';
import { Player } from '../../src/entities/Player';
import { EnemyManager } from '../../src/entities/EnemyManager';
import { WeaponInventory } from '../../src/weapons/WeaponInventory';
import { WeaponId } from '../../src/weapons/WeaponTypes';
import { ParticlePool } from '../../src/fx/ParticlePool';
import {
  COLOR_WOOD_CRATE,
  COLOR_OUTLINE,
  PLAYER_RADIUS,
} from '../../src/core/Constants';

describe('Task 8: Combo Multiplier, Wave Director, Crate Pickups & Procedural Audio', () => {
  describe('ComboSystem', () => {
    let combo: ComboSystem;

    beforeEach(() => {
      combo = new ComboSystem();
    });

    it('should initialize with multiplier 1x, decayTimer 3.5s, and maxMultiplierAchieved 1', () => {
      expect(combo.multiplier).toBe(1);
      expect(combo.decayTimer).toBeCloseTo(3.5);
      expect(combo.maxMultiplierAchieved).toBe(1);
      expect(combo.drainRate).toBeCloseTo(1.05); // 1.0 + (1 * 0.05)
      expect(combo.decayProgress).toBeCloseTo(1.0);
    });

    it('should calculate drainRate accurately according to formula: drainRate = 1.0 + (multiplier * 0.05)', () => {
      // 1x -> 1.05
      expect(combo.drainRate).toBeCloseTo(1.0 + 1 * 0.05);

      // Simulate kills and verify drain rates
      combo.onKill(); // 2x
      expect(combo.multiplier).toBe(2);
      expect(combo.drainRate).toBeCloseTo(1.10);

      for (let i = 0; i < 8; i++) {
        combo.onKill();
      }
      // 10x -> 1.50
      expect(combo.multiplier).toBe(10);
      expect(combo.drainRate).toBeCloseTo(1.50);

      for (let i = 0; i < 10; i++) {
        combo.onKill();
      }
      // 20x -> 2.00
      expect(combo.multiplier).toBe(20);
      expect(combo.drainRate).toBeCloseTo(2.00);

      for (let i = 0; i < 20; i++) {
        combo.onKill();
      }
      // 40x -> 3.00
      expect(combo.multiplier).toBe(40);
      expect(combo.drainRate).toBeCloseTo(3.00);
    });

    it('should increment multiplier on kill and reset decayTimer to 3.5s', () => {
      combo.update(1.0); // timer ticks down
      expect(combo.decayTimer).toBeLessThan(3.5);

      combo.onKill();
      expect(combo.multiplier).toBe(2);
      expect(combo.decayTimer).toBeCloseTo(3.5);
      expect(combo.maxMultiplierAchieved).toBe(2);
    });

    it('should track maxMultiplierAchieved accurately across combo drops and rises', () => {
      for (let i = 0; i < 5; i++) {
        combo.onKill();
      }
      expect(combo.multiplier).toBe(6);
      expect(combo.maxMultiplierAchieved).toBe(6);

      // Force decay down to multiplier 3
      combo.decayTimer = 0;
      combo.update(0.01);
      expect(combo.multiplier).toBe(5);
      expect(combo.maxMultiplierAchieved).toBe(6);

      combo.decayTimer = 0;
      combo.update(0.01);
      expect(combo.multiplier).toBe(4);
      expect(combo.maxMultiplierAchieved).toBe(6);
    });

    it('should decrement decayTimer by dt * drainRate in update(dt)', () => {
      const initialTimer = combo.decayTimer; // 3.5
      const dt = 0.5;
      const expectedDrain = dt * combo.drainRate; // 0.5 * 1.05 = 0.525

      combo.update(dt);
      expect(combo.decayTimer).toBeCloseTo(initialTimer - expectedDrain, 5);
    });

    it('should drop multiplier by 1 and reset decayTimer to 3.5 when decayTimer <= 0 and multiplier > 1', () => {
      combo.onKill(); // 2x
      combo.onKill(); // 3x
      expect(combo.multiplier).toBe(3);

      // Set decayTimer almost at 0
      combo.decayTimer = 0.05;
      // Drain rate at 3x: 1.0 + 3 * 0.05 = 1.15. 0.1 * 1.15 = 0.115 > 0.05 -> <= 0
      combo.update(0.1);

      expect(combo.multiplier).toBe(2);
      expect(combo.decayTimer).toBeCloseTo(3.5);
    });

    it('should keep decayTimer at 0 when decayTimer <= 0 and multiplier === 1', () => {
      // At 1x multiplier, let timer expire
      combo.decayTimer = 0.05;
      combo.update(0.1);

      expect(combo.multiplier).toBe(1);
      expect(combo.decayTimer).toBe(0);
      expect(combo.decayProgress).toBe(0);

      // Subsequent updates at 1x should keep decayTimer at 0
      combo.update(0.5);
      expect(combo.multiplier).toBe(1);
      expect(combo.decayTimer).toBe(0);
      expect(combo.decayProgress).toBe(0);
    });

    it('should expose decayProgress normalized from 1.0 down to 0.0', () => {
      combo.decayTimer = 3.5;
      expect(combo.decayProgress).toBeCloseTo(1.0);

      combo.decayTimer = 1.75;
      expect(combo.decayProgress).toBeCloseTo(0.5);

      combo.decayTimer = 0;
      expect(combo.decayProgress).toBeCloseTo(0.0);
    });

    it('should reset properly on reset()', () => {
      for (let i = 0; i < 10; i++) combo.onKill();
      combo.reset();
      expect(combo.multiplier).toBe(1);
      expect(combo.decayTimer).toBeCloseTo(3.5);
      expect(combo.maxMultiplierAchieved).toBe(1);
    });
  });

  describe('WaveDirector', () => {
    let director: WaveDirector;
    let enemyManager: EnemyManager;

    beforeEach(() => {
      director = new WaveDirector({
        baseQuota: 10,
        quotaIncrement: 5,
        spawnInterval: 0.5,
        intermissionDuration: 3.0,
      });
      enemyManager = new EnemyManager();
    });

    it('should initialize at wave 1 with positive quota and not in intermission', () => {
      expect(director.currentWave).toBe(1);
      expect(director.remainingToSpawn).toBe(10);
      expect(director.isIntermission).toBe(false);
      expect(director.intermissionTimer).toBe(0);
    });

    it('should calculate wave quota with escalation (10 for W1, 15 for W2, 20 for W3)', () => {
      expect(director.calculateWaveQuota(1)).toBe(10);
      expect(director.calculateWaveQuota(2)).toBe(15);
      expect(director.calculateWaveQuota(3)).toBe(20);
      expect(director.calculateWaveQuota(4)).toBe(25);
    });

    it('should spawn enemies at interval from perimeter during active wave', () => {
      const spawnSpy = vi.spyOn(enemyManager, 'spawnAtPerimeter');

      // First update with dt >= spawnInterval should spawn
      director.update(0.5, enemyManager);
      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(director.remainingToSpawn).toBe(9);

      // Another 0.5s ticks next spawn
      director.update(0.5, enemyManager);
      expect(spawnSpy).toHaveBeenCalledTimes(2);
      expect(director.remainingToSpawn).toBe(8);
    });

    it('should spawn only standard zombies for Waves 1-3', () => {
      const spawnSpy = vi.spyOn(enemyManager, 'spawnAtPerimeter');

      // Exhaust wave 1 spawns
      while (director.remainingToSpawn > 0) {
        director.update(0.5, enemyManager);
      }

      // Check all calls were 'zombie'
      for (const call of spawnSpy.mock.calls) {
        expect(call[0]).toBe('zombie');
      }
    });

    it('should spawn Red Devils in Wave 4+', () => {
      director.startWave(4);
      expect(director.currentWave).toBe(4);
      expect(director.remainingToSpawn).toBe(25);

      const spawnSpy = vi.spyOn(enemyManager, 'spawnAtPerimeter');

      // Exhaust wave 4 spawns (25 enemies with probability of devil)
      for (let i = 0; i < 100 && director.remainingToSpawn > 0; i++) {
        director.update(0.5, enemyManager);
      }

      const types = spawnSpy.mock.calls.map((c) => c[0]);
      expect(types).toContain('devil');
      expect(types).toContain('zombie');
    });

    it('should trigger 3.0s intermission when all quota spawned and all enemies killed', () => {
      // Mock remainingToSpawn = 0 and active enemies = 0
      director.remainingToSpawn = 0;
      enemyManager.enemies = [];

      director.update(0.1, enemyManager);
      expect(director.isIntermission).toBe(true);
      expect(director.intermissionTimer).toBeCloseTo(3.0);
    });

    it('should advance to next wave after intermission finishes', () => {
      director.remainingToSpawn = 0;
      enemyManager.enemies = [];
      director.update(0.1, enemyManager);
      expect(director.isIntermission).toBe(true);

      // Tick through intermission (3.0s)
      director.update(1.5, enemyManager);
      expect(director.isIntermission).toBe(true);
      expect(director.intermissionTimer).toBeCloseTo(1.5);

      // Finish intermission
      director.update(1.6, enemyManager);
      expect(director.isIntermission).toBe(false);
      expect(director.currentWave).toBe(2);
      expect(director.remainingToSpawn).toBe(15); // wave 2 quota
    });

    it('should clamp spawnInterval to positive minimum (>= 0.01)', () => {
      const clampedDirector = new WaveDirector({ spawnInterval: 0 });
      expect(clampedDirector.spawnInterval).toBe(0.01);
      const defaultDirector = new WaveDirector();
      expect(defaultDirector.spawnInterval).toBe(0.5);
    });
  });

  describe('Crate Entity & Pickups', () => {
    let scene: THREE.Scene;
    let player: Player;
    let inventory: WeaponInventory;

    beforeEach(() => {
      scene = new THREE.Scene();
      player = new Player(0, 0);
      inventory = new WeaponInventory();
    });

    it('should instantiate wooden crate with radius 0.6 and Boxhead visual aesthetics', () => {
      const crate = new Crate(5, 5, scene);
      expect(crate.pos.x).toBe(5);
      expect(crate.pos.z).toBe(5);
      expect(crate.radius).toBeCloseTo(0.6);
      expect(crate.collected).toBe(false);

      // Verify mesh hierarchy: crate group with body mesh and line segments outline
      expect(crate.mesh).toBeDefined();
      expect(scene.children).toContain(crate.mesh);

      const body = crate.mesh.getObjectByName('crateBody') as THREE.Mesh;
      expect(body).toBeDefined();
      const bodyMat = body.material as THREE.MeshLambertMaterial;
      expect(bodyMat.color.getHex()).toBe(COLOR_WOOD_CRATE);

      const outline = crate.mesh.getObjectByName('crateOutline') as THREE.LineSegments;
      expect(outline).toBeDefined();
      const outlineMat = outline.material as THREE.LineBasicMaterial;
      expect(outlineMat.color.getHex()).toBe(COLOR_OUTLINE);
    });

    it('should reuse shared geometries and materials to avoid GPU buffer leaks', () => {
      const crate1 = new Crate(0, 0);
      const crate2 = new Crate(10, 10);

      const body1 = crate1.mesh.getObjectByName('crateBody') as THREE.Mesh;
      const body2 = crate2.mesh.getObjectByName('crateBody') as THREE.Mesh;

      expect(body1.geometry).toBe(body2.geometry);
      expect(body1.material).toBe(body2.material);
    });

    it('should detect circle-circle collision with Player (radius 0.6 + 0.7)', () => {
      const crate = new Crate(0, 0);
      expect(player.radius).toBe(PLAYER_RADIUS);
      player.pos.x = 0;
      player.pos.z = 1.2; // distance 1.2 <= 0.6 + 0.7 = 1.3 -> collision
      expect(crate.checkCollision(player)).toBe(true);

      player.pos.z = 1.5; // distance 1.5 > 1.3 -> no collision
      expect(crate.checkCollision(player)).toBe(false);
    });

    it('should restore +25% max HP and add 35% ammo to inventory upon collection', () => {
      const crate = new Crate(0, 0, scene);
      player.hp = 50; // Max is 100
      player.maxHp = 100;

      // Unlock Uzi (maxAmmo: 200) and set ammo to 50
      inventory.unlocked.add(WeaponId.Uzi);
      inventory.ammo.set(WeaponId.Uzi, 50);

      const mockAudio = { playPickup: vi.fn() };
      const particlePool = new ParticlePool(scene);
      const spawnBurstSpy = vi.spyOn(particlePool, 'spawnBurst');

      const collected = crate.collect(player, inventory, {
        audio: mockAudio,
        particlePool,
      });

      expect(collected).toBe(true);
      expect(crate.collected).toBe(true);

      // HP restored: +25% of 100 = +25 HP -> 75 HP
      expect(player.hp).toBe(75);

      // Ammo refilled: Uzi maxAmmo 100 * 0.35 = 35 -> 50 + 35 = 85
      expect(inventory.getAmmo(WeaponId.Uzi)).toBe(85);

      // Particle pool burst spawned
      expect(spawnBurstSpy).toHaveBeenCalledTimes(1);

      // Pickup sound played
      expect(mockAudio.playPickup).toHaveBeenCalledTimes(1);

      // Mesh removed from scene
      expect(scene.children).not.toContain(crate.mesh);
    });

    it('should not allow multiple collections of the same crate', () => {
      const crate = new Crate(0, 0, scene);
      player.hp = 50;

      const first = crate.collect(player, inventory);
      expect(first).toBe(true);
      expect(player.hp).toBe(75);

      const second = crate.collect(player, inventory);
      expect(second).toBe(false);
      expect(player.hp).toBe(75); // unmanipulated
    });

    it('should fall back to imported audioManager.playPickup() if context.audio is not supplied', () => {
      const crate = new Crate(0, 0, scene);
      const audioSpy = vi.spyOn(audioManager, 'playPickup');

      crate.collect(player, inventory);

      expect(audioSpy).toHaveBeenCalled();
    });
  });

  describe('Procedural AudioManager', () => {
    it('should instantiate gracefully without throwing in headless Vitest environment', () => {
      const audio = new AudioManager();
      expect(audio).toBeDefined();
      expect(audio.isMuted).toBe(false);
    });

    it('should toggle mute state and return new state', () => {
      const audio = new AudioManager();
      expect(audio.isMuted).toBe(false);

      const muted = audio.toggleMute();
      expect(muted).toBe(true);
      expect(audio.isMuted).toBe(true);

      const unmuted = audio.toggleMute();
      expect(unmuted).toBe(false);
      expect(audio.isMuted).toBe(false);
    });

    it('should safely execute all sound methods without errors in headless mode', () => {
      const audio = new AudioManager();
      expect(() => {
        audio.playPistol();
        audio.playUzi();
        audio.playShotgun();
        audio.playExplosion();
        audio.playZombieGroan();
        audio.playDevilFireball();
        audio.playPickup();
      }).not.toThrow();
    });

    it('should synthesize sounds using AudioContext nodes when context is provided', () => {
      const mockGainNode = {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          value: 1,
        },
        connect: vi.fn(),
      };

      const mockOscillatorNode = {
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

      const mockBufferSource = {
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };

      const mockBiquadFilter = {
        type: 'bandpass',
        frequency: {
          setValueAtTime: vi.fn(),
          value: 1000,
        },
        Q: {
          setValueAtTime: vi.fn(),
          value: 1,
        },
        connect: vi.fn(),
      };

      const mockBuffer = {
        getChannelData: vi.fn().mockReturnValue(new Float32Array(1024)),
      };

      const mockContext = {
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

      const audio = new AudioManager(mockContext);

      audio.playPistol();
      expect(mockContext.createBufferSource).toHaveBeenCalled();
      expect(mockContext.createBiquadFilter).toHaveBeenCalled();

      audio.playShotgun();
      expect(mockContext.createOscillator).toHaveBeenCalled();

      audio.playExplosion();
      expect(mockContext.createOscillator).toHaveBeenCalled();

      audio.playPickup();
      expect(mockContext.createOscillator).toHaveBeenCalled();

      audio.playZombieGroan();
      expect(mockContext.createOscillator).toHaveBeenCalled();

      audio.playDevilFireball();
      expect(mockContext.createOscillator).toHaveBeenCalled();
    });
  });
});
