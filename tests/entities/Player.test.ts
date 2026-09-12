import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Player } from '../../src/entities/Player';
import { InputManager, InputManagerImpl } from '../../src/core/Input';
import {
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_MAX_HP,
  COLOR_PLAYER_TORSO,
  COLOR_PLAYER_SKIN,
  COLOR_PLAYER_HAIR,
  AABB,
} from '../../src/core/Constants';
import { CameraManager } from '../../src/render/Camera';

describe('Task 3: Input System & Player Entity', () => {
  describe('Player Initialization & Mesh Construction', () => {
    it('should initialize player with default constants and position', () => {
      const player = new Player(5, -3);
      expect(player.pos.x).toBe(5);
      expect(player.pos.z).toBe(-3);
      expect(player.radius).toBe(PLAYER_RADIUS);
      expect(player.speed).toBe(PLAYER_SPEED);
      expect(player.hp).toBe(PLAYER_MAX_HP);
      expect(player.maxHp).toBe(PLAYER_MAX_HP);
      expect(player.rotationAngle).toBe(0);
      expect(player.mesh).toBeInstanceOf(THREE.Group);
      expect(player.mesh.position.x).toBe(5);
      expect(player.mesh.position.z).toBe(-3);
    });

    it('should construct iconic Boxhead mesh with torso, peach head, hair block, and weapon-holding arms', () => {
      const player = new Player(0, 0);
      const meshes: THREE.Mesh[] = [];
      player.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      });

      // Must have at least torso, head, hair, left arm, right arm (>= 5 parts)
      expect(meshes.length).toBeGreaterThanOrEqual(4);

      // Verify flatShading is true on all MeshLambertMaterials
      meshes.forEach((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        expect(mat.flatShading).toBe(true);
      });

      // Find torso: color COLOR_PLAYER_TORSO (0x2980B9)
      const torso = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return mat.color.getHex() === COLOR_PLAYER_TORSO;
      });
      expect(torso).toBeDefined();
      const torsoGeo = torso!.geometry as THREE.BoxGeometry;
      expect(torsoGeo.parameters.width).toBeCloseTo(0.8);
      expect(torsoGeo.parameters.height).toBeCloseTo(0.9);
      expect(torsoGeo.parameters.depth).toBeCloseTo(0.5);

      // Find peach head: color COLOR_PLAYER_SKIN (0xF3C59A)
      const head = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return mat.color.getHex() === COLOR_PLAYER_SKIN &&
          (m.geometry as THREE.BoxGeometry).parameters.width >= 0.5;
      });
      expect(head).toBeDefined();
      const headGeo = head!.geometry as THREE.BoxGeometry;
      expect(headGeo.parameters.width).toBeCloseTo(0.6);
      expect(headGeo.parameters.height).toBeCloseTo(0.6);
      expect(headGeo.parameters.depth).toBeCloseTo(0.6);

      // Find hair block: color COLOR_PLAYER_HAIR (0x111111)
      const hair = meshes.find((m) => {
        const mat = m.material as THREE.MeshLambertMaterial;
        return mat.color.getHex() === COLOR_PLAYER_HAIR;
      });
      expect(hair).toBeDefined();

      // Verify arms exist (extended forward along weapon stance)
      const arms = meshes.filter((m) => {
        return m !== torso && m !== head && m !== hair;
      });
      expect(arms.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Movement Vector Calculation', () => {
    it('should move player in -Z on W key press', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('w');

      player.update(0.1, input, []);

      expect(player.pos.x).toBe(0);
      expect(player.pos.z).toBeCloseTo(-PLAYER_SPEED * 0.1);
      expect(player.mesh.position.z).toBeCloseTo(player.pos.z);
    });

    it('should move player in +Z on S key press', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('s');

      player.update(0.1, input, []);

      expect(player.pos.x).toBe(0);
      expect(player.pos.z).toBeCloseTo(PLAYER_SPEED * 0.1);
    });

    it('should move player in -X on A key press', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('a');

      player.update(0.1, input, []);

      expect(player.pos.x).toBeCloseTo(-PLAYER_SPEED * 0.1);
      expect(player.pos.z).toBe(0);
    });

    it('should move player in +X on D key press', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('d');

      player.update(0.1, input, []);

      expect(player.pos.x).toBeCloseTo(PLAYER_SPEED * 0.1);
      expect(player.pos.z).toBe(0);
    });

    it('should normalize diagonal movement so speed is exactly PLAYER_SPEED', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('w');
      input.keys.add('d');

      player.update(0.1, input, []);

      const expectedDelta = (PLAYER_SPEED / Math.SQRT2) * 0.1;
      expect(player.pos.x).toBeCloseTo(expectedDelta);
      expect(player.pos.z).toBeCloseTo(-expectedDelta);

      const totalDist = Math.hypot(player.pos.x, player.pos.z);
      expect(totalDist).toBeCloseTo(PLAYER_SPEED * 0.1);
    });

    it('should cancel out opposing directions (W+S or A+D)', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('w');
      input.keys.add('s');
      input.keys.add('a');
      input.keys.add('d');

      player.update(0.1, input, []);

      expect(player.pos.x).toBe(0);
      expect(player.pos.z).toBe(0);
    });

    it('should support Arrow keys in addition to WASD', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.keys.add('arrowup');

      player.update(0.1, input, []);

      expect(player.pos.z).toBeCloseTo(-PLAYER_SPEED * 0.1);
    });
  });

  describe('Wall Collision & Sliding', () => {
    it('should stop player against a flat North wall and prevent penetration', () => {
      // Wall from minZ: -20 to maxZ: -18, spanning X from -30 to 30
      const wall: AABB = { minX: -30, maxX: 30, minZ: -20, maxZ: -18 };
      // Player placed at z = -17.2, moving North into the wall
      const player = new Player(0, -17.2);
      const input = new InputManagerImpl();
      input.keys.add('w'); // moves in -Z

      // dt = 0.1 -> deltaZ without collision = -0.9 -> pos.z would be -18.1 (inside wall!)
      player.update(0.1, input, [wall]);

      // Player must be clamped exactly outside wall: maxZ (-18) + radius (0.7) = -17.3
      expect(player.pos.z).toBeCloseTo(-17.3, 3);
      expect(player.pos.x).toBe(0);
    });

    it('should slide along a wall when moving diagonally into it', () => {
      // North wall at maxZ: -18
      const wall: AABB = { minX: -30, maxX: 30, minZ: -20, maxZ: -18 };
      // Player at z = -17.3 (touching wall), moving North-East (W + D)
      const player = new Player(0, -17.3);
      const input = new InputManagerImpl();
      input.keys.add('w');
      input.keys.add('d');

      player.update(0.1, input, [wall]);

      // Z should remain clamped at wall boundary (-17.3)
      expect(player.pos.z).toBeCloseTo(-17.3, 3);
      // X should freely slide East (positive X)
      expect(player.pos.x).toBeGreaterThan(0);
      const expectedDx = (PLAYER_SPEED / Math.SQRT2) * 0.1;
      expect(player.pos.x).toBeCloseTo(expectedDx, 3);
    });

    it('should slide along a West wall when moving North-West', () => {
      // West wall from minX: -28 to maxX: -26, spanning Z from -20 to 20
      const wall: AABB = { minX: -28, maxX: -26, minZ: -20, maxZ: 20 };
      const player = new Player(-25.3, 0); // touching boundary: maxX (-26) + radius (0.7) = -25.3
      const input = new InputManagerImpl();
      input.keys.add('a'); // -X
      input.keys.add('w'); // -Z

      player.update(0.1, input, [wall]);

      // X should remain clamped at -25.3
      expect(player.pos.x).toBeCloseTo(-25.3, 3);
      // Z should freely slide North (-Z)
      expect(player.pos.z).toBeLessThan(0);
    });

    it('should resolve collisions with interior pillars cleanly', () => {
      // Symmetrical pillar at [14, 8], size 2.5 (from min: [12.75, 6.75] to max: [15.25, 9.25])
      const pillar: AABB = {
        minX: 12.75,
        maxX: 15.25,
        minZ: 6.75,
        maxZ: 9.25,
      };
      // Player right next to west face of pillar, moving East into it
      const player = new Player(12.75 - 0.6, 8.0);
      const input = new InputManagerImpl();
      input.keys.add('d'); // moves +X into pillar

      player.update(0.1, input, [pillar]);

      // Player must be pushed back to west of pillar (minX - radius = 12.75 - 0.7 = 12.05)
      expect(player.pos.x).toBeCloseTo(12.05, 3);
    });

    it('should handle corner pinching between two perpendicular walls', () => {
      // Corner formed by North wall (maxZ: -18) and West wall (maxX: -26)
      const northWall: AABB = { minX: -30, maxX: 30, minZ: -22, maxZ: -18 };
      const westWall: AABB = { minX: -30, maxX: -26, minZ: -22, maxZ: 22 };

      const player = new Player(-25.2, -17.2); // inside collision zone of both
      const input = new InputManagerImpl();
      input.keys.add('a'); // moving further into corner
      input.keys.add('w');

      player.update(0.1, input, [northWall, westWall]);

      // Player should be resolved outside both: x >= -25.3, z >= -17.3
      expect(player.pos.x).toBeGreaterThanOrEqual(-25.301);
      expect(player.pos.z).toBeGreaterThanOrEqual(-17.301);
    });
  });

  describe('Damage Taking & Health', () => {
    it('should decrease HP on damage and return false when player survives', () => {
      const player = new Player();
      const isDead = player.takeDamage(30);

      expect(player.hp).toBe(70);
      expect(isDead).toBe(false);
    });

    it('should return true and set HP to 0 on fatal damage', () => {
      const player = new Player();
      const isDead = player.takeDamage(100);

      expect(player.hp).toBe(0);
      expect(isDead).toBe(true);
    });

    it('should clamp HP at 0 and return true on overkill damage', () => {
      const player = new Player();
      player.hp = 20;
      const isDead = player.takeDamage(50);

      expect(player.hp).toBe(0);
      expect(isDead).toBe(true);
    });

    it('should ignore non-positive damage amounts', () => {
      const player = new Player();
      const isDead = player.takeDamage(0);
      expect(player.hp).toBe(100);
      expect(isDead).toBe(false);

      player.takeDamage(-20);
      expect(player.hp).toBe(100);
    });

    it('should heal HP without exceeding maxHp', () => {
      const player = new Player();
      player.takeDamage(50);
      expect(player.hp).toBe(50);

      player.heal(25);
      expect(player.hp).toBe(75);

      player.heal(100);
      expect(player.hp).toBe(100);
    });
  });

  describe('Rotation Calculation & Aiming', () => {
    it('should rotate player towards pointer ground target at South (dx=0, dz>0)', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.pointerGroundPos = { x: 0, z: 10 };

      player.update(0.016, input, []);

      expect(player.rotationAngle).toBeCloseTo(0);
      expect(player.mesh.rotation.y).toBeCloseTo(0);
    });

    it('should rotate player towards pointer ground target at East (dx>0, dz=0)', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.pointerGroundPos = { x: 10, z: 0 };

      player.update(0.016, input, []);

      expect(player.rotationAngle).toBeCloseTo(Math.PI / 2);
      expect(player.mesh.rotation.y).toBeCloseTo(Math.PI / 2);
    });

    it('should rotate player towards pointer ground target at North (dx=0, dz<0)', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.pointerGroundPos = { x: 0, z: -10 };

      player.update(0.016, input, []);

      expect(Math.abs(player.rotationAngle)).toBeCloseTo(Math.PI);
      expect(Math.abs(player.mesh.rotation.y)).toBeCloseTo(Math.PI);
    });

    it('should rotate player towards pointer ground target at West (dx<0, dz=0)', () => {
      const player = new Player(0, 0);
      const input = new InputManagerImpl();
      input.pointerGroundPos = { x: -10, z: 0 };

      player.update(0.016, input, []);

      expect(player.rotationAngle).toBeCloseTo(-Math.PI / 2);
      expect(player.mesh.rotation.y).toBeCloseTo(-Math.PI / 2);
    });

    it('should maintain current rotation if pointer is directly at player position', () => {
      const player = new Player(5, 5);
      player.rotationAngle = 1.23;
      player.mesh.rotation.y = 1.23;

      const input = new InputManagerImpl();
      input.pointerGroundPos = { x: 5, z: 5 };

      player.update(0.016, input, []);

      expect(player.rotationAngle).toBeCloseTo(1.23);
      expect(player.mesh.rotation.y).toBeCloseTo(1.23);
    });
  });

  describe('InputManager Raycasting & State', () => {
    it('should initialize with default states', () => {
      const input = new InputManager();
      expect(input.keys).toBeInstanceOf(Set);
      expect(input.keys.size).toBe(0);
      expect(input.isMouseDown).toBe(false);
      expect(input.activeSlot).toBe(1);
      expect(input.pointerGroundPos).toEqual({ x: 0, z: 0 });
    });

    it('should update activeSlot on number keys 1-10', () => {
      const input = new InputManagerImpl();
      input.handleKeyDown('3', 'Digit3');
      expect(input.activeSlot).toBe(3);

      input.handleKeyDown('7', 'Digit7');
      expect(input.activeSlot).toBe(7);

      input.handleKeyDown('8', 'Digit8');
      expect(input.activeSlot).toBe(8);

      input.handleKeyDown('0', 'Digit0');
      expect(input.activeSlot).toBe(10);

      // Non-slot keys should not change activeSlot
      input.handleKeyDown('p', 'KeyP');
      expect(input.activeSlot).toBe(10);
    });

    it('should track keydown and keyup in keys set', () => {
      const input = new InputManagerImpl();
      input.handleKeyDown('w', 'KeyW');
      expect(input.keys.has('w')).toBe(true);
      expect(input.keys.has('keyw')).toBe(true);

      input.handleKeyUp('w', 'KeyW');
      expect(input.keys.has('w')).toBe(false);
      expect(input.keys.has('keyw')).toBe(false);
    });

    it('should perform raycasting against y=0 ground plane with Camera', () => {
      const input = new InputManagerImpl();
      const cameraManager = new CameraManager();
      cameraManager.camera.position.set(0, 26, 18);
      cameraManager.camera.lookAt(0, 0, 0);
      cameraManager.camera.updateMatrixWorld();

      // Screen center (0, 0) should raycast to ground (0, 0)
      input.setPointerNdc(0, 0);
      input.updateRaycast(cameraManager.camera);

      expect(input.pointerGroundPos.x).toBeCloseTo(0, 2);
      expect(input.pointerGroundPos.z).toBeCloseTo(0, 2);
    });

    it('should reset isMouseDown on window mouseup even when clicked on canvas', () => {
      const windowListeners: Record<string, Function[]> = {};
      const mockWindow = {
        addEventListener: (type: string, fn: Function) => {
          windowListeners[type] = windowListeners[type] || [];
          windowListeners[type].push(fn);
        },
        removeEventListener: (type: string, fn: Function) => {
          if (windowListeners[type]) {
            windowListeners[type] = windowListeners[type].filter((f) => f !== fn);
          }
        },
        innerWidth: 1024,
        innerHeight: 768,
      };

      const elemListeners: Record<string, Function[]> = {};
      const mockElement = {
        addEventListener: (type: string, fn: Function) => {
          elemListeners[type] = elemListeners[type] || [];
          elemListeners[type].push(fn);
        },
        removeEventListener: (type: string, fn: Function) => {
          if (elemListeners[type]) {
            elemListeners[type] = elemListeners[type].filter((f) => f !== fn);
          }
        },
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      };

      const origWindow = (globalThis as any).window;
      (globalThis as any).window = mockWindow;

      try {
        const input = new InputManager();
        input.init(mockElement as any);

        // Click down on element
        expect(elemListeners['mousedown']).toBeDefined();
        elemListeners['mousedown'][0]({ button: 0 });
        expect(input.isMouseDown).toBe(true);

        // Global window mouseup should release mouse down
        expect(windowListeners['mouseup']).toBeDefined();
        windowListeners['mouseup'][0]({ button: 0 });
        expect(input.isMouseDown).toBe(false);
      } finally {
        (globalThis as any).window = origWindow;
      }
    });

    it('should reset isMouseDown and clear keys on window blur', () => {
      const windowListeners: Record<string, Function[]> = {};
      const mockWindow = {
        addEventListener: (type: string, fn: Function) => {
          windowListeners[type] = windowListeners[type] || [];
          windowListeners[type].push(fn);
        },
        removeEventListener: (type: string, fn: Function) => {
          if (windowListeners[type]) {
            windowListeners[type] = windowListeners[type].filter((f) => f !== fn);
          }
        },
        innerWidth: 1024,
        innerHeight: 768,
      };

      const origWindow = (globalThis as any).window;
      (globalThis as any).window = mockWindow;

      try {
        const input = new InputManager();
        input.init();

        input.handleKeyDown('w');
        input.isMouseDown = true;
        expect(input.keys.has('w')).toBe(true);
        expect(input.isMouseDown).toBe(true);

        // Trigger window blur
        expect(windowListeners['blur']).toBeDefined();
        windowListeners['blur'][0]();

        expect(input.isMouseDown).toBe(false);
        expect(input.keys.size).toBe(0);
      } finally {
        (globalThis as any).window = origWindow;
      }
    });

    it('should clean up old element listeners when re-initialized with a new element', () => {
      const mockWindow = {
        addEventListener: () => {},
        removeEventListener: () => {},
        innerWidth: 1024,
        innerHeight: 768,
      };

      let oldRemoved = 0;
      const oldElement = {
        addEventListener: () => {},
        removeEventListener: () => {
          oldRemoved++;
        },
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      };

      let newAdded = 0;
      const newElement = {
        addEventListener: () => {
          newAdded++;
        },
        removeEventListener: () => {},
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      };

      const origWindow = (globalThis as any).window;
      (globalThis as any).window = mockWindow;

      try {
        const input = new InputManager();
        input.init(oldElement as any);

        // Re-init with new element
        input.init(newElement as any);

        // Old element listeners should have been removed during dispose before reassigning
        expect(oldRemoved).toBeGreaterThanOrEqual(4);
        expect(newAdded).toBeGreaterThanOrEqual(4);
        expect(input.domElement).toBe(newElement);
      } finally {
        (globalThis as any).window = origWindow;
      }
    });
  });
});
