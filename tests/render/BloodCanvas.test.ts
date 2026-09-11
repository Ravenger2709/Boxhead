import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { BloodCanvas } from '../../src/render/BloodCanvas';
import { SceneManager } from '../../src/render/Scene';
import { ARENA_WIDTH, ARENA_DEPTH } from '../../src/core/Constants';

describe('Task 5: BloodCanvas & Dynamic Decal System', () => {
  describe('Coordinate Mapping (World to UV & Canvas)', () => {
    it('should map arena center (0, 0) to UV (0.5, 0.5) and canvas center (512, 512)', () => {
      const bloodCanvas = new BloodCanvas(ARENA_WIDTH, ARENA_DEPTH, 1024);
      const uv = bloodCanvas.worldToUV(0, 0);
      expect(uv.u).toBeCloseTo(0.5);
      expect(uv.v).toBeCloseTo(0.5);

      const canvasCoord = bloodCanvas.worldToCanvas(0, 0);
      expect(canvasCoord.x).toBeCloseTo(512);
      expect(canvasCoord.y).toBeCloseTo(512);
    });

    it('should map top-left corner (-ARENA_WIDTH/2, -ARENA_DEPTH/2) to UV (0, 0) and canvas (0, 0)', () => {
      const bloodCanvas = new BloodCanvas(ARENA_WIDTH, ARENA_DEPTH, 1024);
      const uv = bloodCanvas.worldToUV(-ARENA_WIDTH / 2, -ARENA_DEPTH / 2);
      expect(uv.u).toBeCloseTo(0.0);
      expect(uv.v).toBeCloseTo(0.0);

      const canvasCoord = bloodCanvas.worldToCanvas(-ARENA_WIDTH / 2, -ARENA_DEPTH / 2);
      expect(canvasCoord.x).toBeCloseTo(0);
      expect(canvasCoord.y).toBeCloseTo(0);
    });

    it('should map bottom-right corner (ARENA_WIDTH/2, ARENA_DEPTH/2) to UV (1, 1) and canvas (1024, 1024)', () => {
      const bloodCanvas = new BloodCanvas(ARENA_WIDTH, ARENA_DEPTH, 1024);
      const uv = bloodCanvas.worldToUV(ARENA_WIDTH / 2, ARENA_DEPTH / 2);
      expect(uv.u).toBeCloseTo(1.0);
      expect(uv.v).toBeCloseTo(1.0);

      const canvasCoord = bloodCanvas.worldToCanvas(ARENA_WIDTH / 2, ARENA_DEPTH / 2);
      expect(canvasCoord.x).toBeCloseTo(1024);
      expect(canvasCoord.y).toBeCloseTo(1024);
    });

    it('should map intermediate coordinate (13, -9) correctly', () => {
      // With ARENA_WIDTH=52, ARENA_DEPTH=36:
      // u = (13 + 26) / 52 = 39 / 52 = 0.75
      // v = (-9 + 18) / 36 = 9 / 36 = 0.25
      const bloodCanvas = new BloodCanvas(52, 36, 1024);
      const uv = bloodCanvas.worldToUV(13, -9);
      expect(uv.u).toBeCloseTo(0.75);
      expect(uv.v).toBeCloseTo(0.25);

      const canvasCoord = bloodCanvas.worldToCanvas(13, -9);
      expect(canvasCoord.x).toBeCloseTo(768);
      expect(canvasCoord.y).toBeCloseTo(256);
    });
  });

  describe('Canvas Texture & Throttled Updates', () => {
    it('should initialize with a CanvasTexture, clean dirty state, and 0 splatterCount', () => {
      const bloodCanvas = new BloodCanvas();
      expect(bloodCanvas.texture).toBeInstanceOf(THREE.CanvasTexture);
      expect(bloodCanvas.dirty).toBe(false);
      expect(bloodCanvas.splatterCount).toBe(0);
      expect(bloodCanvas.canvasWidth).toBe(1024);
      expect(bloodCanvas.canvasHeight).toBe(1024);
    });

    it('should mark dirty flag when splatter is added', () => {
      const bloodCanvas = new BloodCanvas();
      expect(bloodCanvas.dirty).toBe(false);

      bloodCanvas.addSplatter(0, 0);
      expect(bloodCanvas.dirty).toBe(true);
      expect(bloodCanvas.splatterCount).toBe(1);
    });

    it('should update texture and reset dirty flag on update() when dirty', () => {
      const bloodCanvas = new BloodCanvas();
      const initialVersion = bloodCanvas.texture.version;

      bloodCanvas.addSplatter(5, 5);
      expect(bloodCanvas.dirty).toBe(true);

      bloodCanvas.update();
      expect(bloodCanvas.dirty).toBe(false);
      expect(bloodCanvas.texture.version).toBeGreaterThan(initialVersion);
    });

    it('should not trigger texture update on update() if dirty is false', () => {
      const bloodCanvas = new BloodCanvas();
      bloodCanvas.update(); // Already not dirty
      const version = bloodCanvas.texture.version;

      bloodCanvas.update();
      expect(bloodCanvas.texture.version).toBe(version);
    });

    it('should coalesce multiple splatters into a single texture update', () => {
      const bloodCanvas = new BloodCanvas();
      const initialVersion = bloodCanvas.texture.version;

      bloodCanvas.addSplatter(-10, -5);
      bloodCanvas.addSplatter(10, 5);
      bloodCanvas.addSplatter(0, 0);
      expect(bloodCanvas.splatterCount).toBe(3);
      expect(bloodCanvas.dirty).toBe(true);

      bloodCanvas.update();
      expect(bloodCanvas.dirty).toBe(false);
      expect(bloodCanvas.texture.version).toBe(initialVersion + 1);
    });
  });

  describe('Splatter Capping and Clear', () => {
    it('should cap active splatters at 1,000 when many splatters are added', () => {
      const bloodCanvas = new BloodCanvas(ARENA_WIDTH, ARENA_DEPTH, 1024);
      expect(bloodCanvas.maxSplatters).toBe(1000);

      for (let i = 0; i < 1050; i++) {
        bloodCanvas.addSplatter((i % 50) - 25, ((i * 3) % 30) - 15);
      }

      expect(bloodCanvas.splatterCount).toBe(1000);
    });

    it('should reset splatter count and set dirty flag on clear()', () => {
      const bloodCanvas = new BloodCanvas();
      bloodCanvas.addSplatter(0, 0);
      bloodCanvas.addSplatter(2, 3);
      bloodCanvas.update();
      expect(bloodCanvas.dirty).toBe(false);
      expect(bloodCanvas.splatterCount).toBe(2);

      bloodCanvas.clear();
      expect(bloodCanvas.splatterCount).toBe(0);
      expect(bloodCanvas.dirty).toBe(true);

      bloodCanvas.update();
      expect(bloodCanvas.dirty).toBe(false);
    });
  });

  describe('Headless / Mock 2D Context Resilience', () => {
    it('should operate safely in Node environment without real DOM canvas', () => {
      expect(() => {
        const bloodCanvas = new BloodCanvas();
        bloodCanvas.addSplatter(1, 1, 2.0, 10);
        bloodCanvas.update();
        bloodCanvas.clear();
      }).not.toThrow();
    });

    it('should invoke 2D drawing primitives on the canvas context when adding splatter', () => {
      const bloodCanvas = new BloodCanvas();
      const fillSpy = vi.spyOn(bloodCanvas.ctx, 'fill');
      const beginPathSpy = vi.spyOn(bloodCanvas.ctx, 'beginPath');

      bloodCanvas.addSplatter(0, 0, 1.5, 6);

      expect(beginPathSpy).toHaveBeenCalled();
      expect(fillSpy).toHaveBeenCalled();
    });
  });

  describe('SceneManager Integration', () => {
    it('should expose bloodCanvas on SceneManager instance', () => {
      const sceneManager = new SceneManager();
      expect(sceneManager.bloodCanvas).toBeInstanceOf(BloodCanvas);
    });

    it('should bind bloodCanvas.texture to floorMesh material map', () => {
      const sceneManager = new SceneManager();
      expect(sceneManager.floorMesh).toBeDefined();

      const mat = sceneManager.floorMesh?.material as THREE.MeshLambertMaterial;
      expect(mat).toBeDefined();
      expect(mat.map).toBe(sceneManager.bloodCanvas.texture);
    });

    it('should update bloodCanvas when sceneManager.update() is called', () => {
      const sceneManager = new SceneManager();
      const updateSpy = vi.spyOn(sceneManager.bloodCanvas, 'update');

      sceneManager.update(0.016);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
