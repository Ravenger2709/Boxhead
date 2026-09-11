import * as THREE from 'three';
import {
  AABB,
  COLOR_FAKE_WALL,
  COLOR_OUTLINE,
} from '../core/Constants';

// Module-level static geometries & materials to avoid GPU buffer leaks
let sharedWallGeo: THREE.BoxGeometry | null = null;
let sharedWallMat: THREE.MeshLambertMaterial | null = null;
let sharedWallEdgesGeo: THREE.EdgesGeometry | null = null;
let sharedWallLineMat: THREE.LineBasicMaterial | null = null;

interface FakeWallResources {
  blockGeo: THREE.BoxGeometry;
  blockMat: THREE.MeshLambertMaterial;
  edgesGeo: THREE.EdgesGeometry;
  lineMat: THREE.LineBasicMaterial;
}

function getFakeWallResources(size: number): FakeWallResources {
  if (!sharedWallGeo || !sharedWallMat || !sharedWallEdgesGeo || !sharedWallLineMat) {
    sharedWallGeo = new THREE.BoxGeometry(size, size, size);
    sharedWallMat = new THREE.MeshLambertMaterial({
      color: COLOR_FAKE_WALL,
      flatShading: true,
    });
    sharedWallEdgesGeo = new THREE.EdgesGeometry(sharedWallGeo);
    sharedWallLineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
  }
  return {
    blockGeo: sharedWallGeo,
    blockMat: sharedWallMat,
    edgesGeo: sharedWallEdgesGeo,
    lineMat: sharedWallLineMat,
  };
}

export class FakeWall {
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public hp: number = 150;
  public maxHp: number = 150;
  public size: number = 1.5;
  public alive: boolean = true;
  public aabb?: AABB;
  public onDestroy?: (wall: FakeWall) => void;

  public get x(): number {
    return this.pos.x;
  }

  public get z(): number {
    return this.pos.z;
  }

  constructor(x: number = 0, z: number = 0) {
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'fakeWall';

    const res = getFakeWallResources(this.size);

    // Wooden barricade block: 1.5 x 1.5 x 1.5
    const blockMesh = new THREE.Mesh(res.blockGeo, res.blockMat);
    blockMesh.position.set(0, this.size * 0.5, 0);
    group.add(blockMesh);

    // Outlines: EdgesGeometry + LineSegments with #111111 per visual constraints
    const outline = new THREE.LineSegments(res.edgesGeo, res.lineMat);
    outline.position.set(0, this.size * 0.5, 0);
    group.add(outline);

    return group;
  }

  public getAABB(): AABB {
    const half = this.size * 0.5;
    return {
      minX: this.pos.x - half,
      maxX: this.pos.x + half,
      minZ: this.pos.z - half,
      maxZ: this.pos.z + half,
    };
  }

  public takeDamage(amount: number): boolean {
    if (amount <= 0 || !this.alive) {
      return !this.alive;
    }

    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.alive = false;
      this.mesh.visible = false;
      if (this.mesh.parent) {
        this.mesh.parent.remove(this.mesh);
      }
      if (this.onDestroy) {
        this.onDestroy(this);
      }
    }
    return !this.alive;
  }
}
