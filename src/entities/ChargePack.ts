import * as THREE from 'three';
import { AABB, COLOR_OUTLINE } from '../core/Constants';

export const COLOR_CHARGEPACK_BODY = 0x2C3E50;
export const COLOR_CHARGEPACK_LED = 0xE74C3C;

export interface ChargePackOptions {
  damage?: number;
  radius?: number;
  hasCluster?: boolean;
  onDetonate?: (x: number, z: number, damage: number, radius: number, hasCluster: boolean) => void;
  onSpawnSubExplosion?: (x: number, z: number) => void;
  onDestroy?: (chargePack: ChargePack) => void;
}

// Module-level shared static geometries & materials to avoid GPU buffer leaks
let sharedChargePackBodyGeo: THREE.BoxGeometry | null = null;
let sharedChargePackBodyMat: THREE.MeshLambertMaterial | null = null;
let sharedChargePackLedGeo: THREE.BoxGeometry | null = null;
let sharedChargePackLedMat: THREE.MeshLambertMaterial | null = null;
let sharedChargePackEdgesGeo: THREE.EdgesGeometry | null = null;
let sharedChargePackLineMat: THREE.LineBasicMaterial | null = null;

interface ChargePackResources {
  bodyGeo: THREE.BoxGeometry;
  bodyMat: THREE.MeshLambertMaterial;
  ledGeo: THREE.BoxGeometry;
  ledMat: THREE.MeshLambertMaterial;
  edgesGeo: THREE.EdgesGeometry;
  lineMat: THREE.LineBasicMaterial;
}

function getChargePackResources(): ChargePackResources {
  if (
    !sharedChargePackBodyGeo ||
    !sharedChargePackBodyMat ||
    !sharedChargePackLedGeo ||
    !sharedChargePackLedMat ||
    !sharedChargePackEdgesGeo ||
    !sharedChargePackLineMat
  ) {
    // Compact satchel block: 0.7 x 0.25 x 0.7 units
    sharedChargePackBodyGeo = new THREE.BoxGeometry(0.7, 0.25, 0.7);
    sharedChargePackBodyMat = new THREE.MeshLambertMaterial({
      color: COLOR_CHARGEPACK_BODY,
      flatShading: true,
    });

    // Blinking red indicator LED: 0.15 x 0.08 x 0.15 units
    sharedChargePackLedGeo = new THREE.BoxGeometry(0.15, 0.08, 0.15);
    sharedChargePackLedMat = new THREE.MeshLambertMaterial({
      color: COLOR_CHARGEPACK_LED,
      flatShading: true,
    });

    // Outlines with #111111 per visual constraints
    sharedChargePackEdgesGeo = new THREE.EdgesGeometry(sharedChargePackBodyGeo);
    sharedChargePackLineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
  }

  return {
    bodyGeo: sharedChargePackBodyGeo,
    bodyMat: sharedChargePackBodyMat,
    ledGeo: sharedChargePackLedGeo,
    ledMat: sharedChargePackLedMat,
    edgesGeo: sharedChargePackEdgesGeo,
    lineMat: sharedChargePackLineMat,
  };
}

export class ChargePack {
  public mesh: THREE.Group;
  public ledMesh: THREE.Mesh;
  public pos: { x: number; z: number } = { x: 0, z: 0 };
  public isActive: boolean = true;
  public damage: number = 180;
  public radius: number = 5.0;
  public hasCluster: boolean = false;
  public blinkTimer: number = 0;
  public subExplosions: Array<{ x: number; z: number }> = [];

  public onDetonate?: (x: number, z: number, damage: number, radius: number, hasCluster: boolean) => void;
  public onSpawnSubExplosion?: (x: number, z: number) => void;
  public onDestroy?: (chargePack: ChargePack) => void;

  public get active(): boolean {
    return this.isActive;
  }

  public set active(value: boolean) {
    this.isActive = value;
  }

  public get x(): number {
    return this.pos.x;
  }

  public set x(value: number) {
    this.pos.x = value;
    this.mesh.position.x = value;
  }

  public get z(): number {
    return this.pos.z;
  }

  public set z(value: number) {
    this.pos.z = value;
    this.mesh.position.z = value;
  }

  constructor(x: number = 0, z: number = 0, options?: ChargePackOptions) {
    const res = getChargePackResources();

    this.mesh = new THREE.Group();
    this.mesh.name = 'chargepack';

    // Body mesh sitting on floor: y = 0.25 / 2 = 0.125
    const bodyMesh = new THREE.Mesh(res.bodyGeo, res.bodyMat);
    bodyMesh.position.set(0, 0.125, 0);
    this.mesh.add(bodyMesh);

    // Indicator LED on top of satchel: y = 0.25 + 0.08 / 2 = 0.29
    this.ledMesh = new THREE.Mesh(res.ledGeo, res.ledMat);
    this.ledMesh.position.set(0, 0.29, 0);
    this.mesh.add(this.ledMesh);

    // Outline (#111111) around satchel block
    const outline = new THREE.LineSegments(res.edgesGeo, res.lineMat);
    outline.position.set(0, 0.125, 0);
    this.mesh.add(outline);

    this.init(x, z, options);
  }

  public init(x: number, z: number, options?: ChargePackOptions): void {
    this.pos = { x, z };
    this.mesh.position.set(x, 0, z);
    this.mesh.visible = true;

    this.isActive = true;
    this.blinkTimer = 0;
    this.ledMesh.visible = true;
    this.subExplosions = [];

    this.damage = options?.damage ?? 180;
    this.radius = options?.radius ?? 5.0;
    this.hasCluster = options?.hasCluster ?? false;

    this.onDetonate = options?.onDetonate;
    this.onSpawnSubExplosion = options?.onSpawnSubExplosion;
    this.onDestroy = options?.onDestroy;
  }

  public update(dt: number): void {
    if (!this.isActive) return;

    // Subtle blinking indicator LED: 0.25s ON, 0.25s OFF
    this.blinkTimer += dt;
    this.ledMesh.visible = (this.blinkTimer % 0.5) < 0.25;

    // Charge pack does NOT detonate automatically on timer or proximity
  }

  public detonate(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.mesh.visible = false;

    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }

    // Trigger radial main blast callback
    this.onDetonate?.(this.pos.x, this.pos.z, this.damage, this.radius, this.hasCluster);

    // Cluster sub-explosions: 4 radial sub-explosions ~1.8 units out
    if (this.hasCluster) {
      const offset = 1.8;
      this.onSpawnSubExplosion?.(this.pos.x + offset, this.pos.z);
      this.onSpawnSubExplosion?.(this.pos.x - offset, this.pos.z);
      this.onSpawnSubExplosion?.(this.pos.x, this.pos.z + offset);
      this.onSpawnSubExplosion?.(this.pos.x, this.pos.z - offset);
    }

    this.onDestroy?.(this);
  }

  public recycle(): void {
    this.isActive = false;
    this.mesh.visible = false;
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }

  public reset(): void {
    this.recycle();
  }

  public getAABB(): AABB {
    const halfSize = 0.35;
    return {
      minX: this.pos.x - halfSize,
      maxX: this.pos.x + halfSize,
      minZ: this.pos.z - halfSize,
      maxZ: this.pos.z + halfSize,
    };
  }
}
