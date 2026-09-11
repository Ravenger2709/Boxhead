import * as THREE from 'three';

export interface DamageNumber {
  id: number;
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  amount: number;
  isCrit: boolean;
  life: number;
  maxLife: number;
  element?: HTMLElement | null;
}

export const DAMAGE_NUMBER_CAPACITY = 60;

export class DamageNumberPool {
  readonly capacity = DAMAGE_NUMBER_CAPACITY;
  private items: DamageNumber[] = [];
  private freeList: DamageNumber[] = [];
  private activeList: DamageNumber[] = [];
  private projVector = new THREE.Vector3();

  constructor(container?: HTMLElement | null) {
    this.initPool(container);
  }

  private initPool(container?: HTMLElement | null): void {
    let parent: HTMLElement | null = null;

    if (container) {
      parent = container;
    } else if (typeof document !== 'undefined') {
      parent = document.getElementById('damage-overlay') || document.body || null;
    }

    for (let i = 0; i < this.capacity; i++) {
      let element: HTMLElement | null = null;

      if (parent && typeof document !== 'undefined' && typeof document.createElement === 'function') {
        element = document.createElement('div');
        element.className = 'damage-number';
        element.style.position = 'absolute';
        element.style.display = 'none';
        element.style.pointerEvents = 'none';
        element.style.fontWeight = 'bold';
        element.style.fontFamily = 'monospace, sans-serif';
        element.style.userSelect = 'none';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.textShadow = '1px 1px 2px #000';
        parent.appendChild(element);
      }

      const item: DamageNumber = {
        id: i,
        active: false,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        amount: 0,
        isCrit: false,
        life: 0,
        maxLife: 0.8,
        element,
      };

      this.items.push(item);
      this.freeList.push(item);
    }
  }

  spawn(x: number, z: number, amount: number, isCrit: boolean = false): DamageNumber | null {
    if (this.freeList.length === 0) {
      return null;
    }

    const item = this.freeList.pop()!;
    item.active = true;
    item.x = x;
    item.y = 1.2;
    item.z = z;
    item.amount = amount;
    item.isCrit = isCrit;
    item.life = 0;
    item.maxLife = 0.8;
    item.vy = 2.2;
    item.vx = (Math.random() - 0.5) * 0.4;

    if (item.element) {
      item.element.textContent = isCrit ? `${Math.round(amount)}!` : `${Math.round(amount)}`;
      item.element.style.color = isCrit ? '#FF3333' : '#FFFFFF';
      item.element.style.fontSize = isCrit ? '22px' : '16px';
      item.element.style.opacity = '1';
      item.element.style.display = 'block';
    }

    this.activeList.push(item);
    return item;
  }

  update(
    dt: number,
    camera?: THREE.Camera,
    width?: number,
    height?: number
  ): void {
    const viewWidth =
      width ?? (typeof window !== 'undefined' ? window.innerWidth : 800);
    const viewHeight =
      height ?? (typeof window !== 'undefined' ? window.innerHeight : 600);

    for (let i = this.activeList.length - 1; i >= 0; i--) {
      const item = this.activeList[i];
      item.life += dt;

      if (item.life >= item.maxLife) {
        this.recycleIndex(i);
        continue;
      }

      item.x += item.vx * dt;
      item.y += item.vy * dt;

      const progress = item.life / item.maxLife;
      const alpha = Math.max(0, 1 - progress);

      if (item.element) {
        item.element.style.opacity = alpha.toString();

        if (camera) {
          this.projVector.set(item.x, item.y, item.z);
          this.projVector.project(camera);
          const screenX = (this.projVector.x * 0.5 + 0.5) * viewWidth;
          const screenY = (-this.projVector.y * 0.5 + 0.5) * viewHeight;
          item.element.style.left = `${screenX.toFixed(1)}px`;
          item.element.style.top = `${screenY.toFixed(1)}px`;
        }
      }
    }
  }

  recycle(item: DamageNumber): void {
    if (!item.active) return;
    const index = this.activeList.indexOf(item);
    if (index !== -1) {
      this.recycleIndex(index);
    }
  }

  private recycleIndex(index: number): void {
    const item = this.activeList[index];
    item.active = false;

    if (item.element) {
      item.element.style.display = 'none';
    }

    const last = this.activeList.pop()!;
    if (index < this.activeList.length) {
      this.activeList[index] = last;
    }

    this.freeList.push(item);
  }

  clear(): void {
    while (this.activeList.length > 0) {
      this.recycleIndex(this.activeList.length - 1);
    }
  }

  getActive(): readonly DamageNumber[] {
    return this.activeList;
  }

  getActiveCount(): number {
    return this.activeList.length;
  }

  getFreeCount(): number {
    return this.freeList.length;
  }
}
