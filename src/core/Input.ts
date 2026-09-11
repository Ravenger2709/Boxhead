import * as THREE from 'three';

export interface InputManager {
  keys: Set<string>;
  pointerGroundPos: { x: number; z: number };
  isMouseDown: boolean;
  activeSlot: number;
  init(domElement?: HTMLElement): void;
  updateRaycast(camera: THREE.Camera): void;
  dispose(): void;
}

export class InputManagerImpl implements InputManager {
  public keys: Set<string> = new Set<string>();
  public pointerGroundPos: { x: number; z: number } = { x: 0, z: 0 };
  public isMouseDown: boolean = false;
  public activeSlot: number = 1;

  public domElement?: HTMLElement;

  private pointerNdc: THREE.Vector2 = new THREE.Vector2(0, 0);
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private groundPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private intersectTarget: THREE.Vector3 = new THREE.Vector3();

  private boundKeyDown?: (e: KeyboardEvent) => void;
  private boundKeyUp?: (e: KeyboardEvent) => void;
  private boundMouseMove?: (e: MouseEvent) => void;
  private boundMouseDown?: (e: MouseEvent) => void;
  private boundMouseUp?: (e: MouseEvent) => void;
  private boundWheel?: (e: WheelEvent) => void;
  private boundBlur?: () => void;
  private boundContextMenu?: (e: MouseEvent) => void;

  constructor(domElement?: HTMLElement) {
    if (domElement) {
      this.init(domElement);
    }
  }

  public init(domElement?: HTMLElement): void {
    if (domElement) {
      this.domElement = domElement;
    }

    if (typeof window === 'undefined') {
      return;
    }

    // Clean up any previously attached listeners first
    this.dispose();

    this.boundKeyDown = (e: KeyboardEvent) => {
      this.handleKeyDown(e.key, e.code);
    };

    this.boundKeyUp = (e: KeyboardEvent) => {
      this.handleKeyUp(e.key, e.code);
    };

    this.boundMouseMove = (e: MouseEvent) => {
      this.handleMouseMove(e);
    };

    this.boundMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        this.isMouseDown = true;
      }
    };

    this.boundMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    };

    this.boundWheel = (e: WheelEvent) => {
      // Cycle slots 1-7 on wheel
      if (e.deltaY > 0) {
        this.activeSlot = this.activeSlot >= 7 ? 1 : this.activeSlot + 1;
      } else if (e.deltaY < 0) {
        this.activeSlot = this.activeSlot <= 1 ? 7 : this.activeSlot - 1;
      }
    };

    this.boundBlur = () => {
      this.keys.clear();
      this.isMouseDown = false;
    };

    this.boundContextMenu = (e: MouseEvent) => {
      // Prevent context menu during gameplay
      e.preventDefault();
    };

    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    window.addEventListener('blur', this.boundBlur);

    const target = this.domElement || window;
    target.addEventListener('mousemove', this.boundMouseMove as EventListener);
    target.addEventListener('mousedown', this.boundMouseDown as EventListener);
    target.addEventListener('mouseup', this.boundMouseUp as EventListener);
    target.addEventListener('wheel', this.boundWheel as EventListener, { passive: true });
    target.addEventListener('contextmenu', this.boundContextMenu as EventListener);
  }

  public handleKeyDown(key: string, code?: string): void {
    this.keys.add(key.toLowerCase());
    if (code) {
      this.keys.add(code.toLowerCase());
    }

    // Active weapon slot switching 1-7
    const num = parseInt(key, 10);
    if (!Number.isNaN(num) && num >= 1 && num <= 7) {
      this.activeSlot = num;
    } else if (code && code.startsWith('Digit')) {
      const digit = parseInt(code.slice(5), 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= 7) {
        this.activeSlot = digit;
      }
    }
  }

  public handleKeyUp(key: string, code?: string): void {
    this.keys.delete(key.toLowerCase());
    if (code) {
      this.keys.delete(code.toLowerCase());
    }
  }

  public handleMouseMove(e: MouseEvent): void {
    if (this.domElement && typeof this.domElement.getBoundingClientRect === 'function') {
      const rect = this.domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        return;
      }
    }

    if (typeof window !== 'undefined' && window.innerWidth > 0 && window.innerHeight > 0) {
      this.pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  }

  public setPointerNdc(x: number, y: number): void {
    this.pointerNdc.set(x, y);
  }

  public updateRaycast(camera: THREE.Camera): void {
    this.raycaster.setFromCamera(this.pointerNdc, camera);
    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.intersectTarget);
    if (hit) {
      this.pointerGroundPos.x = hit.x;
      this.pointerGroundPos.z = hit.z;
    }
  }

  public dispose(): void {
    if (typeof window !== 'undefined') {
      if (this.boundKeyDown) window.removeEventListener('keydown', this.boundKeyDown);
      if (this.boundKeyUp) window.removeEventListener('keyup', this.boundKeyUp);
      if (this.boundBlur) window.removeEventListener('blur', this.boundBlur);

      const target = this.domElement || window;
      if (this.boundMouseMove) target.removeEventListener('mousemove', this.boundMouseMove as EventListener);
      if (this.boundMouseDown) target.removeEventListener('mousedown', this.boundMouseDown as EventListener);
      if (this.boundMouseUp) target.removeEventListener('mouseup', this.boundMouseUp as EventListener);
      if (this.boundWheel) target.removeEventListener('wheel', this.boundWheel as EventListener);
      if (this.boundContextMenu) target.removeEventListener('contextmenu', this.boundContextMenu as EventListener);
    }

    this.keys.clear();
    this.isMouseDown = false;
  }
}

export const InputManager = InputManagerImpl;
