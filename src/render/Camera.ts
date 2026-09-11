import * as THREE from 'three';
import {
  CAMERA_BASE_VIEW_HEIGHT,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
} from '../core/Constants';

export interface CameraManager {
  camera: THREE.OrthographicCamera;
  update(playerPos: { x: number; z: number }): void;
  handleResize(): void;
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

// Export both the class as CameraManager (for new CameraManager()) and interface
export const CameraManager = CameraManagerImpl;
