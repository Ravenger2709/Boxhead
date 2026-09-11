import * as THREE from 'three';
import {
  AABB,
  ARENA_WIDTH,
  ARENA_DEPTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
  PILLAR_SIZE,
  PILLAR_POSITIONS,
  COLOR_FLOOR,
  COLOR_WALL,
  COLOR_OUTLINE,
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_COLOR,
  DIRECTIONAL_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_POS,
} from '../core/Constants';
import type { Player } from '../entities/Player';

export interface SceneManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  walls: AABB[];
  floorMesh?: THREE.Mesh;
  camera?: THREE.Camera;
  player?: Player;
  attachPlayer(player: Player): void;
  initArena(): void;
  render(camera?: THREE.Camera): void;
  handleResize(): void;
}

export class SceneManagerImpl implements SceneManager {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public walls: AABB[] = [];
  public floorMesh?: THREE.Mesh;
  public camera?: THREE.Camera;

  private _player?: Player;
  private arenaObjects: THREE.Object3D[] = [];

  constructor(canvas?: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });
      const width = typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 800;
      const height = typeof window !== 'undefined' && window.innerHeight > 0 ? window.innerHeight : 600;
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(
        typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
      );
    } catch {
      // Fallback for headless/vitest environments without WebGL
      this.renderer = {
        domElement: (canvas ||
          (typeof document !== 'undefined'
            ? document.createElement('canvas')
            : {})) as HTMLCanvasElement,
        setSize: () => {},
        setPixelRatio: () => {},
        render: () => {},
        dispose: () => {},
      } as unknown as THREE.WebGLRenderer;
    }

    this.initLights();
    this.initArena();
  }

  public get player(): Player | undefined {
    return this._player;
  }

  public set player(player: Player | undefined) {
    if (this._player && this._player.mesh.parent === this.scene) {
      this.scene.remove(this._player.mesh);
    }
    this._player = player;
    if (player) {
      this.scene.add(player.mesh);
    }
  }

  public attachPlayer(player: Player): void {
    this.player = player;
  }

  private initLights(): void {
    // Directional light from top-left, crisp diffuse shading (no soft shadows)
    const dirLight = new THREE.DirectionalLight(
      DIRECTIONAL_LIGHT_COLOR,
      DIRECTIONAL_LIGHT_INTENSITY
    );
    dirLight.position.set(
      DIRECTIONAL_LIGHT_POS.x,
      DIRECTIONAL_LIGHT_POS.y,
      DIRECTIONAL_LIGHT_POS.z
    );
    dirLight.target.position.set(0, 0, 0);
    this.scene.add(dirLight);
    this.scene.add(dirLight.target);

    // Ambient light
    const ambLight = new THREE.AmbientLight(
      AMBIENT_LIGHT_COLOR,
      AMBIENT_LIGHT_INTENSITY
    );
    this.scene.add(ambLight);
  }

  public initArena(): void {
    // Clean up existing arena meshes to avoid accumulating duplicates on re-invocation
    for (const obj of this.arenaObjects) {
      this.scene.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
      for (const child of obj.children) {
        if (child instanceof THREE.LineSegments) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      }
    }
    this.arenaObjects = [];
    this.walls = [];

    // 1. Floor Plane (ARENA_WIDTH x ARENA_DEPTH)
    const floorGeo = new THREE.PlaneGeometry(ARENA_WIDTH, ARENA_DEPTH);
    const floorMat = new THREE.MeshLambertMaterial({
      color: COLOR_FLOOR,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.set(0, 0, 0);
    this.floorMesh.name = 'arenaFloor';
    this.scene.add(this.floorMesh);
    this.arenaObjects.push(this.floorMesh);

    // 2. Boundary Walls (North, South, West, East)
    const halfW = ARENA_WIDTH / 2;
    const halfD = ARENA_DEPTH / 2;
    const T = WALL_THICKNESS;
    const H = WALL_HEIGHT;

    // North Wall (-Z)
    this.addStaticBlock(
      0,
      H / 2,
      -halfD - T / 2,
      ARENA_WIDTH + 2 * T,
      H,
      T,
      {
        minX: -halfW - T,
        maxX: halfW + T,
        minZ: -halfD - T,
        maxZ: -halfD,
      },
      'wallNorth'
    );

    // South Wall (+Z)
    this.addStaticBlock(
      0,
      H / 2,
      halfD + T / 2,
      ARENA_WIDTH + 2 * T,
      H,
      T,
      {
        minX: -halfW - T,
        maxX: halfW + T,
        minZ: halfD,
        maxZ: halfD + T,
      },
      'wallSouth'
    );

    // West Wall (-X)
    this.addStaticBlock(
      -halfW - T / 2,
      H / 2,
      0,
      T,
      H,
      ARENA_DEPTH,
      {
        minX: -halfW - T,
        maxX: -halfW,
        minZ: -halfD,
        maxZ: halfD,
      },
      'wallWest'
    );

    // East Wall (+X)
    this.addStaticBlock(
      halfW + T / 2,
      H / 2,
      0,
      T,
      H,
      ARENA_DEPTH,
      {
        minX: halfW,
        maxX: halfW + T,
        minZ: -halfD,
        maxZ: halfD,
      },
      'wallEast'
    );

    // 3. Four Symmetrical Interior Columns at (±14, ±8)
    PILLAR_POSITIONS.forEach(([px, pz], index) => {
      const halfPillar = PILLAR_SIZE / 2;
      this.addStaticBlock(
        px,
        H / 2,
        pz,
        PILLAR_SIZE,
        H,
        PILLAR_SIZE,
        {
          minX: px - halfPillar,
          maxX: px + halfPillar,
          minZ: pz - halfPillar,
          maxZ: pz + halfPillar,
        },
        `pillar_${index}`
      );
    });
  }

  private addStaticBlock(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number,
    aabb: AABB,
    name?: string
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshLambertMaterial({
      color: COLOR_WALL,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    if (name) mesh.name = name;

    // EdgesGeometry outline (#111111)
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
    const line = new THREE.LineSegments(edges, lineMat);
    mesh.add(line);

    this.scene.add(mesh);
    this.arenaObjects.push(mesh);
    this.walls.push(aabb);

    return mesh;
  }

  public handleResize(): void {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width > 0 && height > 0) {
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  public render(camera?: THREE.Camera): void {
    const cam = camera ?? this.camera;
    if (cam) {
      this.renderer.render(this.scene, cam);
    }
  }
}

// Export both the class as SceneManager (for new SceneManager()) and interface
export const SceneManager = SceneManagerImpl;
