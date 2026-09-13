import * as THREE from 'three';

export interface PlayerInput {
  moveX: number;
  moveZ: number;
  shoot: boolean;
  cyclePrev: boolean;
  cycleNext: boolean;
  slotSelect: number | null;
}

export interface InputManager {
  keys: Set<string>;
  pointerGroundPos: { x: number; z: number };
  isMouseDown: boolean;
  mouseAimEnabled?: boolean;
  activeSlot: number;
  maxSlots?: number;
  wheelDelta?: number;
  onWheel?: (deltaY: number) => void;
  consumeWheelDelta?: () => number;
  init(domElement?: HTMLElement): void;
  handleKeyDown(key: string, code?: string): void;
  handleKeyUp(key: string, code?: string): void;
  updateRaycast(camera: THREE.Camera): void;
  dispose(): void;

  isCoop?: boolean;
  getP1Input(isCoop?: boolean): PlayerInput;
  getP2Input(): PlayerInput;
  getPlayerInput(playerIndex: 1 | 2, isCoop?: boolean): PlayerInput;
  getP1Movement(isCoop?: boolean): { x: number; z: number };
  getP2Movement(): { x: number; z: number };
  isP1Shooting(isCoop?: boolean): boolean;
  isP2Shooting(): boolean;
  isP1CyclePrev(): boolean;
  isP1CycleNext(): boolean;
  isP2CyclePrev(): boolean;
  isP2CycleNext(): boolean;
  consumeP1Cycle(): -1 | 0 | 1;
  consumeP2Cycle(): -1 | 0 | 1;
  p1CycleDelta?: number;
  p2CycleDelta?: number;
  getP1SlotSelect(): number | null;
}

export class InputManagerImpl implements InputManager {
  public keys: Set<string> = new Set<string>();
  public pointerGroundPos: { x: number; z: number } = { x: 0, z: 0 };
  public isMouseDown: boolean = false;
  public mouseAimEnabled: boolean = false;
  public activeSlot: number = 1;
  public maxSlots: number = 10;
  public wheelDelta: number = 0;
  public onWheel?: (deltaY: number) => void;
  public isCoop: boolean = false;
  public p1CycleDelta: number = 0;
  public p2CycleDelta: number = 0;

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

  constructor(domElement?: HTMLElement, maxSlots: number = 10) {
    this.maxSlots = maxSlots;
    if (domElement) {
      this.init(domElement);
    }
  }

  public init(domElement?: HTMLElement): void {
    // 1. Clean up any previously attached listeners on existing domElement / window first
    this.dispose();

    if (domElement) {
      this.domElement = domElement;
    }

    if (typeof window === 'undefined') {
      return;
    }

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
      this.wheelDelta += e.deltaY;
      if (this.onWheel) {
        this.onWheel(e.deltaY);
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

    // Attach keyboard and global window listeners
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    window.addEventListener('blur', this.boundBlur);
    window.addEventListener('mouseup', this.boundMouseUp as EventListener);

    // Target-specific interaction listeners
    const target = this.domElement || window;
    target.addEventListener('mousemove', this.boundMouseMove as EventListener);
    target.addEventListener('mousedown', this.boundMouseDown as EventListener);
    target.addEventListener('wheel', this.boundWheel as EventListener, { passive: true });
    target.addEventListener('contextmenu', this.boundContextMenu as EventListener);
  }

  public handleKeyDown(key: string, code?: string): void {
    this.keys.add(key.toLowerCase());
    if (code) {
      this.keys.add(code.toLowerCase());
    }

    if (key === ' ' || key.toLowerCase() === 'space' || code === 'Space') {
      this.keys.add(' ');
      this.keys.add('space');
    }

    if (key === '/' || key.toLowerCase() === 'slash' || code === 'Slash') {
      this.keys.add('/');
      this.keys.add('slash');
    }

    // Player 1 weapon cycle keys: ',' and '.'
    if (key === ',' || key.toLowerCase() === 'comma' || code === 'Comma') {
      this.keys.add(',');
      this.keys.add('comma');
      this.p1CycleDelta = -1;
    }
    if (key === '.' || key.toLowerCase() === 'period' || code === 'Period') {
      this.keys.add('.');
      this.keys.add('period');
      this.p1CycleDelta = 1;
    }

    // Player 2 weapon cycle keys: 'q' and 'e'
    if (key === 'q' || key.toLowerCase() === 'keyq' || code === 'KeyQ') {
      this.keys.add('q');
      this.keys.add('keyq');
      this.p2CycleDelta = -1;
    }
    if (key === 'e' || key.toLowerCase() === 'keye' || code === 'KeyE') {
      this.keys.add('e');
      this.keys.add('keye');
      this.p2CycleDelta = 1;
    }

    // Active weapon slot switching 1-10:
    // Keys '1' through '9' select slots 1-9; Key '0' (or Digit0/Numpad0) selects slot 10 (Railgun).
    let selectedSlot: number | null = null;
    if (key >= '1' && key <= '9') {
      selectedSlot = parseInt(key, 10);
    } else if (key === '0') {
      selectedSlot = 10;
    } else if (code) {
      if (code.startsWith('Digit')) {
        const digit = parseInt(code.slice(5), 10);
        if (digit >= 1 && digit <= 9) {
          selectedSlot = digit;
        } else if (digit === 0) {
          selectedSlot = 10;
        }
      } else if (code.startsWith('Numpad')) {
        const digit = parseInt(code.slice(6), 10);
        if (digit >= 1 && digit <= 9) {
          selectedSlot = digit;
        } else if (digit === 0) {
          selectedSlot = 10;
        }
      }
    }

    if (selectedSlot !== null && selectedSlot >= 1 && selectedSlot <= this.maxSlots) {
      this.activeSlot = selectedSlot;
    }
  }

  public handleKeyUp(key: string, code?: string): void {
    this.keys.delete(key.toLowerCase());
    if (code) {
      this.keys.delete(code.toLowerCase());
    }

    if (key === ' ' || key.toLowerCase() === 'space' || code === 'Space') {
      this.keys.delete(' ');
      this.keys.delete('space');
    }

    if (key === '/' || key.toLowerCase() === 'slash' || code === 'Slash') {
      this.keys.delete('/');
      this.keys.delete('slash');
    }

    if (key === ',' || key.toLowerCase() === 'comma' || code === 'Comma') {
      this.keys.delete(',');
      this.keys.delete('comma');
    }

    if (key === '.' || key.toLowerCase() === 'period' || code === 'Period') {
      this.keys.delete('.');
      this.keys.delete('period');
    }

    if (key === 'q' || key.toLowerCase() === 'keyq' || code === 'KeyQ') {
      this.keys.delete('q');
      this.keys.delete('keyq');
    }

    if (key === 'e' || key.toLowerCase() === 'keye' || code === 'KeyE') {
      this.keys.delete('e');
      this.keys.delete('keye');
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

  public consumeWheelDelta(): number {
    const delta = this.wheelDelta;
    this.wheelDelta = 0;
    return delta;
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
      if (this.boundMouseUp) window.removeEventListener('mouseup', this.boundMouseUp as EventListener);

      const target = this.domElement || window;
      if (this.boundMouseMove) target.removeEventListener('mousemove', this.boundMouseMove as EventListener);
      if (this.boundMouseDown) target.removeEventListener('mousedown', this.boundMouseDown as EventListener);
      if (this.boundWheel) target.removeEventListener('wheel', this.boundWheel as EventListener);
      if (this.boundContextMenu) target.removeEventListener('contextmenu', this.boundContextMenu as EventListener);
    }

    this.boundKeyDown = undefined;
    this.boundKeyUp = undefined;
    this.boundMouseMove = undefined;
    this.boundMouseDown = undefined;
    this.boundMouseUp = undefined;
    this.boundWheel = undefined;
    this.boundBlur = undefined;
    this.boundContextMenu = undefined;

    this.keys.clear();
    this.isMouseDown = false;
    this.p1CycleDelta = 0;
    this.p2CycleDelta = 0;
  }

  public getP1Movement(isCoop: boolean = this.isCoop): { x: number; z: number } {
    let moveX = 0;
    let moveZ = 0;
    if (this.keys.has('arrowup') || (!isCoop && (this.keys.has('w') || this.keys.has('keyw')))) {
      moveZ -= 1;
    }
    if (this.keys.has('arrowdown') || (!isCoop && (this.keys.has('s') || this.keys.has('keys')))) {
      moveZ += 1;
    }
    if (this.keys.has('arrowleft') || (!isCoop && (this.keys.has('a') || this.keys.has('keya')))) {
      moveX -= 1;
    }
    if (this.keys.has('arrowright') || (!isCoop && (this.keys.has('d') || this.keys.has('keyd')))) {
      moveX += 1;
    }
    return { x: moveX, z: moveZ };
  }

  public getP2Movement(): { x: number; z: number } {
    let moveX = 0;
    let moveZ = 0;
    if (this.keys.has('w') || this.keys.has('keyw')) {
      moveZ -= 1;
    }
    if (this.keys.has('s') || this.keys.has('keys')) {
      moveZ += 1;
    }
    if (this.keys.has('a') || this.keys.has('keya')) {
      moveX -= 1;
    }
    if (this.keys.has('d') || this.keys.has('keyd')) {
      moveX += 1;
    }
    return { x: moveX, z: moveZ };
  }

  public isP1Shooting(isCoop: boolean = this.isCoop): boolean {
    if (this.keys.has('/') || this.keys.has('slash')) {
      return true;
    }
    if (!isCoop) {
      return this.keys.has(' ') || this.keys.has('space') || this.isMouseDown;
    }
    return false;
  }

  public isP2Shooting(): boolean {
    return this.keys.has(' ') || this.keys.has('space');
  }

  public isP1CyclePrev(): boolean {
    return this.keys.has(',') || this.keys.has('comma');
  }

  public isP1CycleNext(): boolean {
    return this.keys.has('.') || this.keys.has('period');
  }

  public isP2CyclePrev(): boolean {
    return this.keys.has('q') || this.keys.has('keyq');
  }

  public isP2CycleNext(): boolean {
    return this.keys.has('e') || this.keys.has('keye');
  }

  public consumeP1Cycle(): -1 | 0 | 1 {
    const delta = this.p1CycleDelta;
    this.p1CycleDelta = 0;
    if (delta !== 0) return delta > 0 ? 1 : -1;
    return 0;
  }

  public consumeP2Cycle(): -1 | 0 | 1 {
    const delta = this.p2CycleDelta;
    this.p2CycleDelta = 0;
    if (delta !== 0) return delta > 0 ? 1 : -1;
    return 0;
  }

  public getP1SlotSelect(): number | null {
    for (let i = 1; i <= 9; i++) {
      if (this.keys.has(i.toString()) || this.keys.has(`digit${i}`) || this.keys.has(`numpad${i}`)) {
        return i;
      }
    }
    if (this.keys.has('0') || this.keys.has('digit0') || this.keys.has('numpad0')) {
      return 10;
    }
    return null;
  }

  public getP1Input(isCoop: boolean = this.isCoop): PlayerInput {
    const move = this.getP1Movement(isCoop);
    return {
      moveX: move.x,
      moveZ: move.z,
      shoot: this.isP1Shooting(isCoop),
      cyclePrev: this.isP1CyclePrev(),
      cycleNext: this.isP1CycleNext(),
      slotSelect: this.getP1SlotSelect(),
    };
  }

  public getP2Input(): PlayerInput {
    const move = this.getP2Movement();
    return {
      moveX: move.x,
      moveZ: move.z,
      shoot: this.isP2Shooting(),
      cyclePrev: this.isP2CyclePrev(),
      cycleNext: this.isP2CycleNext(),
      slotSelect: null,
    };
  }

  public getPlayerInput(playerIndex: 1 | 2, isCoop: boolean = this.isCoop): PlayerInput {
    return playerIndex === 2 ? this.getP2Input() : this.getP1Input(isCoop);
  }
}

export const InputManager = InputManagerImpl;
