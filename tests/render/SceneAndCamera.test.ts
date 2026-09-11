import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  ARENA_WIDTH,
  ARENA_DEPTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
  PILLAR_SIZE,
  COLOR_FLOOR,
  COLOR_WALL,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
  CAMERA_BASE_VIEW_HEIGHT,
  PILLAR_POSITIONS,
} from '../../src/core/Constants';
import { CameraManager } from '../../src/render/Camera';
import { SceneManager } from '../../src/render/Scene';
import { Player } from '../../src/entities/Player';

describe('Task 1 & Task 3: Render Pipeline, Arena Environment & Player Attachment', () => {
  describe('Constants', () => {
    it('should define correct arena dimensions and colors', () => {
      expect(ARENA_WIDTH).toBe(52);
      expect(ARENA_DEPTH).toBe(36);
      expect(WALL_HEIGHT).toBe(2.5);
      expect(WALL_THICKNESS).toBe(1.5);
      expect(PILLAR_SIZE).toBe(2.5);
      expect(COLOR_FLOOR).toBe(0xD9C8A9);
      expect(COLOR_WALL).toBe(0xE5E5E5);
      expect(PILLAR_POSITIONS).toHaveLength(4);
    });
  });

  describe('CameraManager', () => {
    it('should create an OrthographicCamera with correct initial position and orientation', () => {
      const cameraManager = new CameraManager();
      expect(cameraManager.camera).toBeInstanceOf(THREE.OrthographicCamera);

      expect(cameraManager.camera.position.x).toBe(0);
      expect(cameraManager.camera.position.y).toBe(CAMERA_OFFSET_Y);
      expect(cameraManager.camera.position.z).toBe(CAMERA_OFFSET_Z);

      // Frustum height should match CAMERA_BASE_VIEW_HEIGHT
      const frustumHeight = cameraManager.camera.top - cameraManager.camera.bottom;
      expect(frustumHeight).toBe(CAMERA_BASE_VIEW_HEIGHT);
    });

    it('should update camera position tracking player position', () => {
      const cameraManager = new CameraManager();
      const playerPos = { x: 12.5, z: -7.2 };

      cameraManager.update(playerPos);

      expect(cameraManager.camera.position.x).toBeCloseTo(12.5);
      expect(cameraManager.camera.position.y).toBe(CAMERA_OFFSET_Y);
      expect(cameraManager.camera.position.z).toBeCloseTo(-7.2 + CAMERA_OFFSET_Z);
    });

    it('should dynamically update frustum bounds on resize', () => {
      const cameraManager = new CameraManager();
      cameraManager.handleResize();

      const frustumHeight = cameraManager.camera.top - cameraManager.camera.bottom;
      expect(frustumHeight).toBe(CAMERA_BASE_VIEW_HEIGHT);
      expect(cameraManager.camera.right).toBe(-cameraManager.camera.left);
    });
  });

  describe('SceneManager', () => {
    it('should initialize arena floor, lights, and static obstacle AABBs', () => {
      const sceneManager = new SceneManager();

      expect(sceneManager.scene).toBeInstanceOf(THREE.Scene);
      expect(sceneManager.floorMesh).toBeDefined();
      expect(sceneManager.floorMesh?.name).toBe('arenaFloor');

      // 4 boundary walls + 4 interior pillars = 8 static AABBs
      expect(sceneManager.walls).toHaveLength(8);

      // Verify pillars are at (±14, ±8)
      PILLAR_POSITIONS.forEach(([px, pz]) => {
        const matchingWall = sceneManager.walls.find(
          (w) =>
            Math.abs((w.minX + w.maxX) / 2 - px) < 0.001 &&
            Math.abs((w.minZ + w.maxZ) / 2 - pz) < 0.001
        );
        expect(matchingWall).toBeDefined();
      });

      // Verify boundary walls enclose the arena
      const northWall = sceneManager.walls.find((w) => w.maxZ === -ARENA_DEPTH / 2);
      const southWall = sceneManager.walls.find((w) => w.minZ === ARENA_DEPTH / 2);
      const westWall = sceneManager.walls.find((w) => w.maxX === -ARENA_WIDTH / 2);
      const eastWall = sceneManager.walls.find((w) => w.minX === ARENA_WIDTH / 2);

      expect(northWall).toBeDefined();
      expect(southWall).toBeDefined();
      expect(westWall).toBeDefined();
      expect(eastWall).toBeDefined();
    });

    it('should attach EdgesGeometry line segments to static wall meshes', () => {
      const sceneManager = new SceneManager();

      // Find children of scene that have line segments
      const meshesWithLines = sceneManager.scene.children.filter((child) => {
        return child.children.some((c) => c instanceof THREE.LineSegments);
      });

      // All 4 boundary walls and 4 pillars should have EdgesGeometry LineSegments
      expect(meshesWithLines).toHaveLength(8);
    });

    it('should include directional and ambient lights', () => {
      const sceneManager = new SceneManager();

      const dirLight = sceneManager.scene.children.find(
        (c) => c instanceof THREE.DirectionalLight
      );
      const ambLight = sceneManager.scene.children.find(
        (c) => c instanceof THREE.AmbientLight
      );

      expect(dirLight).toBeDefined();
      expect(ambLight).toBeDefined();
    });

    it('should render without throwing errors', () => {
      const sceneManager = new SceneManager();
      const cameraManager = new CameraManager();

      expect(() => {
        sceneManager.render(cameraManager.camera);
      }).not.toThrow();
    });

    it('should not accumulate duplicate meshes or AABBs if initArena is re-invoked', () => {
      const sceneManager = new SceneManager();
      const initialMeshCount = sceneManager.scene.children.length;
      expect(sceneManager.walls).toHaveLength(8);

      // Re-invoke initArena
      sceneManager.initArena();

      expect(sceneManager.walls).toHaveLength(8);
      expect(sceneManager.scene.children.length).toBe(initialMeshCount);
    });

    it('should attach and replace player mesh properly in scene', () => {
      const sceneManager = new SceneManager();
      const p1 = new Player(0, 0);

      sceneManager.attachPlayer(p1);
      expect(sceneManager.player).toBe(p1);
      expect(sceneManager.scene.children.includes(p1.mesh)).toBe(true);

      const p2 = new Player(10, 10);
      sceneManager.player = p2;
      expect(sceneManager.player).toBe(p2);
      expect(sceneManager.scene.children.includes(p1.mesh)).toBe(false);
      expect(sceneManager.scene.children.includes(p2.mesh)).toBe(true);
    });

    it('should guard handleResize against non-positive dimensions', () => {
      const sceneManager = new SceneManager();
      expect(() => {
        sceneManager.handleResize();
      }).not.toThrow();
    });
  });
});
