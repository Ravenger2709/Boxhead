import * as THREE from 'three';
import {
  CAMERA_BASE_VIEW_HEIGHT,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
} from '../core/Constants';

export interface CameraManager {
  camera: THREE.OrthographicCamera;
  update(playerPos: { x: number; z: number }): void;
  updateCoop(p1Pos: { x: number; z: number }, p2Pos: { x: number; z: number }): { x: number; z: number };
  handleResize(): void;
  keepDistance(
    p1: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    p2: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    maxDistance?: number
  ): void;
  KeepDistance(
    p1: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    p2: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    maxDistance?: number
  ): void;
}

export class CameraManagerImpl implements CameraManager {
  public camera: THREE.OrthographicCamera;

  constructor() {
    const width = typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 800;
    const height = typeof window !== 'undefined' && window.innerHeight > 0 ? window.innerHeight : 600;
    const aspect = width / height;

    const halfH = CAMERA_BASE_VIEW_HEIGHT / 2;
    const halfW = halfH * aspect;

    this.camera = new THREE.OrthographicCamera(
      -halfW,
      halfW,
      halfH,
      -halfH,
      0.1,
      1000
    );

    this.camera.position.set(0, CAMERA_OFFSET_Y, CAMERA_OFFSET_Z);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  public update(playerPos: { x: number; z: number }): void {
    this.camera.position.set(
      playerPos.x,
      CAMERA_OFFSET_Y,
      playerPos.z + CAMERA_OFFSET_Z
    );
    this.camera.lookAt(playerPos.x, 0, playerPos.z);
    this.camera.updateMatrixWorld();
  }

  /**
   * Tracks the midpoint between two players: ((p1.x + p2.x)/2, (p1.z + p2.z)/2).
   */
  public updateCoop(
    p1Pos: { x: number; z: number },
    p2Pos: { x: number; z: number }
  ): { x: number; z: number } {
    const midX = (p1Pos.x + p2Pos.x) / 2;
    const midZ = (p1Pos.z + p2Pos.z) / 2;
    this.update({ x: midX, z: midZ });
    return { x: midX, z: midZ };
  }

  /**
   * Clamps players so they cannot move beyond max distance (e.g. 20 units)
   * or off the shared screen view.
   */
  public keepDistance(
    p1: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    p2: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    maxDistance: number = 20
  ): void {
    const dx = p2.pos.x - p1.pos.x;
    const dz = p2.pos.z - p1.pos.z;
    const dist = Math.hypot(dx, dz);

    if (dist > maxDistance && dist > 1e-6) {
      const excess = dist - maxDistance;
      const nx = dx / dist;
      const nz = dz / dist;
      p1.pos.x += nx * (excess / 2);
      p1.pos.z += nz * (excess / 2);
      p2.pos.x -= nx * (excess / 2);
      p2.pos.z -= nz * (excess / 2);

      if (p1.mesh) p1.mesh.position.set(p1.pos.x, 0, p1.pos.z);
      if (p2.mesh) p2.mesh.position.set(p2.pos.x, 0, p2.pos.z);
    }

    // Keep both players clamped within the visible screen frustum around their midpoint
    const midX = (p1.pos.x + p2.pos.x) / 2;
    const midZ = (p1.pos.z + p2.pos.z) / 2;
    const maxHalfW = Math.max(10, (this.camera.right - this.camera.left) / 2 - 1.5);
    const maxHalfH = Math.max(10, (this.camera.top - this.camera.bottom) / 2 - 1.5);

    const clampPlayer = (p: { pos: { x: number; z: number }; mesh?: THREE.Object3D }) => {
      const clampedX = Math.max(midX - maxHalfW, Math.min(midX + maxHalfW, p.pos.x));
      const clampedZ = Math.max(midZ - maxHalfH, Math.min(midZ + maxHalfH, p.pos.z));
      p.pos.x = clampedX;
      p.pos.z = clampedZ;
      if (p.mesh) p.mesh.position.set(p.pos.x, 0, p.pos.z);
    };

    clampPlayer(p1);
    clampPlayer(p2);
  }

  public KeepDistance(
    p1: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    p2: { pos: { x: number; z: number }; mesh?: THREE.Object3D },
    maxDistance: number = 20
  ): void {
    this.keepDistance(p1, p2, maxDistance);
  }

  public handleResize(): void {
    const width = typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 800;
    const height = typeof window !== 'undefined' && window.innerHeight > 0 ? window.innerHeight : 600;
    const aspect = width / height;

    const halfH = CAMERA_BASE_VIEW_HEIGHT / 2;
    const halfW = halfH * aspect;

    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();
  }
}

export const CameraManager = CameraManagerImpl;
