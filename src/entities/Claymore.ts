import * as THREE from 'three';
import { AABB, COLOR_OUTLINE } from '../core/Constants';
import { createExplosionRing } from '../weapons/ExplosionRing';

export const COLOR_CLAYMORE_BODY = 0xE0E0E0;
export const COLOR_CLAYMORE_STRAP = 0x556B2F;

export type ClaymoreState = 'arming' | 'armed' | 'tripped' | 'detonated' | 'recycled';

export interface ClaymoreOptions {
  damage?: number;
  radius?: number;
  triggerRadius?: number;
  hasCluster?: boolean;
  hasBigBang?: boolean;
  hasBiggerBang?: boolean;
  onBeep?: () => void;
  onExplode?: (x: number, z: number, damage: number, radius: number, hasCluster: boolean) => void;
  onSpawnSubExplosion?: (x: number, z: number) => void;
  onDestroy?: (claymore: Claymore) => void;
}

export interface ClaymoreEnemyTarget {
  id?: number;
  x?: number;
  z?: number;
  pos?: { x: number; z: number };
  radius?: number;
  isDead?: boolean;
  alive?: boolean;
  hp?: number;
  takeDamage?: (amount: number) => boolean;
}

// Module-level shared static geometries & materials to avoid GPU buffer leaks
let sharedClaymoreBodyGeo: THREE.BoxGeometry | null = null;
let sharedClaymoreBodyMat: THREE.MeshLambertMaterial | null = null;
let sharedClaymoreStrapGeo: THREE.BoxGeometry | null = null;
let sharedClaymoreStrapMat: THREE.MeshLambertMaterial | null = null;
let sharedClaymoreEdgesGeo: THREE.EdgesGeometry | null = null;
let sharedClaymoreLineMat: THREE.LineBasicMaterial | null = null;

interface ClaymoreResources {
  bodyGeo: THREE.BoxGeometry;
  bodyMat: THREE.MeshLambertMaterial;
  strapGeo: THREE.BoxGeometry;
  strapMat: THREE.MeshLambertMaterial;
  edgesGeo: THREE.EdgesGeometry;
  lineMat: THREE.LineBasicMaterial;
}

function getClaymoreResources(): ClaymoreResources {
  if (
    !sharedClaymoreBodyGeo ||
    !sharedClaymoreBodyMat ||
    !sharedClaymoreStrapGeo ||
    !sharedClaymoreStrapMat ||
    !sharedClaymoreEdgesGeo ||
    !sharedClaymoreLineMat
  ) {
    // Flat parcel block: 0.8 x 0.2 x 0.5 units
    sharedClaymoreBodyGeo = new THREE.BoxGeometry(0.8, 0.2, 0.5);
    sharedClaymoreBodyMat = new THREE.MeshLambertMaterial({
      color: COLOR_CLAYMORE_BODY,
      flatShading: true,
    });

    // Olive strapping across center
    sharedClaymoreStrapGeo = new THREE.BoxGeometry(0.25, 0.21, 0.52);
    sharedClaymoreStrapMat = new THREE.MeshLambertMaterial({
      color: COLOR_CLAYMORE_STRAP,
      flatShading: true,
    });

    // Outlines with #111111 per visual constraints
    sharedClaymoreEdgesGeo = new THREE.EdgesGeometry(sharedClaymoreBodyGeo);
    sharedClaymoreLineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
  }

  return {
    bodyGeo: sharedClaymoreBodyGeo,
    bodyMat: sharedClaymoreBodyMat,
    strapGeo: sharedClaymoreStrapGeo,
    strapMat: sharedClaymoreStrapMat,
    edgesGeo: sharedClaymoreEdgesGeo,
    lineMat: sharedClaymoreLineMat,
  };
}

export class Claymore {
  public mesh: THREE.Group;
  public pos: { x: number; z: number } = { x: 0, z: 0 };
  public state: ClaymoreState = 'arming';
  public damage: number = 100;
  public radius: number = 4.0;
  public triggerRadius: number = 1.2;
  public hasCluster: boolean = false;
  public hasBigBang: boolean = false;
  public hasBiggerBang: boolean = false;
  public armingTimer: number = 0.5;
  public fuseTimer: number = 2.0;
  public beepInterval: number = 0.4;
  private beepTimer: number = 0;
  public active: boolean = true;
  public subExplosions: Array<{ x: number; z: number }> = [];

  public onBeep?: () => void;
  public onExplode?: (x: number, z: number, damage: number, radius: number, hasCluster: boolean) => void;
  public onSpawnSubExplosion?: (x: number, z: number) => void;
  public onDestroy?: (claymore: Claymore) => void;

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

  constructor(x: number = 0, z: number = 0, options?: ClaymoreOptions) {
    this.mesh = this.createMesh();
    this.init(x, z, options);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'claymore';

    const res = getClaymoreResources();

    // Light gray/concrete base: 0.8 x 0.2 x 0.5 sitting on ground (y = 0.1)
    const bodyMesh = new THREE.Mesh(res.bodyGeo, res.bodyMat);
    bodyMesh.position.set(0, 0.1, 0);
    group.add(bodyMesh);

    // Olive strapping
    const strapMesh = new THREE.Mesh(res.strapGeo, res.strapMat);
    strapMesh.position.set(0, 0.1, 0);
    group.add(strapMesh);

    // EdgesGeometry + LineSegments outline (#111111)
    const outline = new THREE.LineSegments(res.edgesGeo, res.lineMat);
    outline.position.set(0, 0.1, 0);
    group.add(outline);

    return group;
  }

  public init(x: number, z: number, options?: ClaymoreOptions): void {
    this.pos = { x, z };
    this.mesh.position.set(x, 0, z);
    this.mesh.visible = true;

    this.state = 'arming';
    this.active = true;
    this.armingTimer = 0.5;
    this.fuseTimer = 2.0;
    this.beepTimer = 0;
    this.subExplosions = [];

    this.damage = options?.damage ?? 100;
    this.radius = options?.radius ?? 4.0;
    this.triggerRadius = options?.triggerRadius ?? 1.2;
    this.hasCluster = options?.hasCluster ?? false;
    this.hasBigBang = options?.hasBigBang ?? false;
    this.hasBiggerBang = options?.hasBiggerBang ?? false;

    this.onBeep = options?.onBeep;
    this.onExplode = options?.onExplode;
    this.onSpawnSubExplosion = options?.onSpawnSubExplosion;
    this.onDestroy = options?.onDestroy;
  }

  public update(dt: number, enemies: ClaymoreEnemyTarget[] = []): void {
    if (this.state === 'detonated' || this.state === 'recycled') {
      return;
    }

    // 1. Arming countdown
    if (this.state === 'arming') {
      this.armingTimer -= dt;
      if (this.armingTimer <= 0) {
        this.state = 'armed';
      }
      return;
    }

    // 2. Armed proximity detection
    if (this.state === 'armed') {
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (!enemy) continue;

        // Skip dead enemies
        const isDead =
          enemy.isDead === true ||
          enemy.alive === false ||
          (typeof enemy.hp === 'number' && enemy.hp <= 0);
        if (isDead) continue;

        // Extract 2D coordinates
        const ex = typeof enemy.x === 'number' ? enemy.x : enemy.pos?.x ?? 0;
        const ez = typeof enemy.z === 'number' ? enemy.z : enemy.pos?.z ?? 0;
        const dist = Math.hypot(ex - this.pos.x, ez - this.pos.z);

        if (dist <= this.triggerRadius) {
          this.trip();
          break;
        }
      }
    }

    // 3. Tripped fuse countdown with periodic ticking beeps
    if (this.state === 'tripped') {
      this.fuseTimer -= dt;
      this.beepTimer += dt;
      if (this.beepTimer >= this.beepInterval) {
        this.beepTimer -= this.beepInterval;
        this.onBeep?.();
      }
      if (this.fuseTimer <= 0) {
        this.detonate();
      }
    }
  }

  public trip(): void {
    if (this.state !== 'armed') return;
    this.state = 'tripped';
    this.fuseTimer = 2.0;
    this.beepTimer = 0;
    this.onBeep?.();
  }

  public detonate(): void {
    if (this.state === 'detonated' || this.state === 'recycled') {
      return;
    }

    this.state = 'detonated';
    this.active = false;
    this.mesh.visible = false;

    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }

    // Radial main blast callback
    this.onExplode?.(this.pos.x, this.pos.z, this.damage, this.radius, this.hasCluster);

    // Cluster sub-explosions: 4 radial sub-explosions ~1.5 units out
    if (this.hasCluster) {
      const offset = 1.5;
      this.onSpawnSubExplosion?.(this.pos.x + offset, this.pos.z);
      this.onSpawnSubExplosion?.(this.pos.x - offset, this.pos.z);
      this.onSpawnSubExplosion?.(this.pos.x, this.pos.z + offset);
      this.onSpawnSubExplosion?.(this.pos.x, this.pos.z - offset);
    }

    // Expanding sub-explosion rings for BigBang / BiggerBang
    if (this.hasBigBang || this.hasBiggerBang) {
      const ringSubs = createExplosionRing(this.pos.x, this.pos.z, this.damage, this.radius, this.hasBiggerBang);
      for (let i = 0; i < ringSubs.length; i++) {
        const sub = ringSubs[i];
        this.subExplosions.push({ x: sub.x, z: sub.z });
        this.onSpawnSubExplosion?.(sub.x, sub.z);
      }
    }

    this.onDestroy?.(this);
  }

  public recycle(): void {
    this.state = 'recycled';
    this.active = false;
    this.mesh.visible = false;
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }

  public reset(): void {
    this.recycle();
  }

  public getAABB(): AABB {
    const halfX = 0.4;
    const halfZ = 0.25;
    return {
      minX: this.pos.x - halfX,
      maxX: this.pos.x + halfX,
      minZ: this.pos.z - halfZ,
      maxZ: this.pos.z + halfZ,
    };
  }
}
