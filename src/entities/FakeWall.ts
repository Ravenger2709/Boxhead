import * as THREE from 'three';
import {
  AABB,
  COLOR_FAKE_WALL,
  COLOR_OUTLINE,
} from '../core/Constants';

export class FakeWall {
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public hp: number = 150;
  public maxHp: number = 150;
  public size: number = 1.5;
  public alive: boolean = true;

  constructor(x: number = 0, z: number = 0) {
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'fakeWall';

    // Wooden barricade block: 1.5 x 1.5 x 1.5
    const blockGeo = new THREE.BoxGeometry(this.size, this.size, this.size);
    const blockMat = new THREE.MeshLambertMaterial({
      color: COLOR_FAKE_WALL,
      flatShading: true,
    });
    const blockMesh = new THREE.Mesh(blockGeo, blockMat);
    blockMesh.position.set(0, this.size * 0.5, 0);
    group.add(blockMesh);

    // Outlines: EdgesGeometry + LineSegments with #111111 per visual constraints
    const edgesGeo = new THREE.EdgesGeometry(blockGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: COLOR_OUTLINE });
    const outline = new THREE.LineSegments(edgesGeo, lineMat);
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
    }
    return !this.alive;
  }
}
