import * as THREE from 'three';
import {
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_MAX_HP,
  COLOR_PLAYER_TORSO,
  COLOR_PLAYER_SKIN,
  COLOR_PLAYER_HAIR,
  AABB,
  Circle,
} from '../core/Constants';
import { InputManager } from '../core/Input';
import { resolveCircleAABB } from '../physics/Collision2D';

export class Player {
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public radius: number = PLAYER_RADIUS;
  public hp: number = PLAYER_MAX_HP;
  public maxHp: number = PLAYER_MAX_HP;
  public speed: number = PLAYER_SPEED;
  public rotationAngle: number = 0;

  constructor(x: number = 0, z: number = 0) {
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'player';

    // 1. Torso: #2980B9 (blue), size: 0.8 x 0.9 x 0.5
    const torsoGeo = new THREE.BoxGeometry(0.8, 0.9, 0.5);
    const torsoMat = new THREE.MeshLambertMaterial({
      color: COLOR_PLAYER_TORSO,
      flatShading: true,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.name = 'torso';
    torso.position.set(0, 0.45, 0);
    group.add(torso);

    // 2. Peach Head: #F3C59A, size: 0.6 x 0.6 x 0.6
    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMat = new THREE.MeshLambertMaterial({
      color: COLOR_PLAYER_SKIN,
      flatShading: true,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.name = 'head';
    head.position.set(0, 1.2, 0);
    group.add(head);

    // 3. Hair Block: #111111, size: 0.62 x 0.22 x 0.62
    const hairGeo = new THREE.BoxGeometry(0.62, 0.22, 0.62);
    const hairMat = new THREE.MeshLambertMaterial({
      color: COLOR_PLAYER_HAIR,
      flatShading: true,
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.name = 'hair';
    hair.position.set(0, 1.45, -0.02);
    group.add(hair);

    // 4. Arms holding weapon stance (pointing forward in +Z direction)
    const armGeo = new THREE.BoxGeometry(0.2, 0.22, 0.5);
    const armMat = new THREE.MeshLambertMaterial({
      color: COLOR_PLAYER_TORSO,
      flatShading: true,
    });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.name = 'leftArm';
    leftArm.position.set(-0.45, 0.6, 0.25);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.name = 'rightArm';
    rightArm.position.set(0.45, 0.6, 0.25);
    group.add(rightArm);

    // Optional weapon hands (peach hands at end of arms)
    const handGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const handMat = new THREE.MeshLambertMaterial({
      color: COLOR_PLAYER_SKIN,
      flatShading: true,
    });
    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.45, 0.6, 0.52);
    group.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(0.45, 0.6, 0.52);
    group.add(rightHand);

    return group;
  }

  public update(dt: number, input: InputManager, walls: AABB[]): void {
    // 1. Calculate movement vector from input keys
    let moveX = 0;
    let moveZ = 0;

    if (
      input.keys.has('w') ||
      input.keys.has('keyw') ||
      input.keys.has('arrowup')
    ) {
      moveZ -= 1;
    }
    if (
      input.keys.has('s') ||
      input.keys.has('keys') ||
      input.keys.has('arrowdown')
    ) {
      moveZ += 1;
    }
    if (
      input.keys.has('a') ||
      input.keys.has('keya') ||
      input.keys.has('arrowleft')
    ) {
      moveX -= 1;
    }
    if (
      input.keys.has('d') ||
      input.keys.has('keyd') ||
      input.keys.has('arrowright')
    ) {
      moveX += 1;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.hypot(moveX, moveZ);
      const vx = (moveX / len) * this.speed;
      const vz = (moveZ / len) * this.speed;
      this.pos.x += vx * dt;
      this.pos.z += vz * dt;
    }

    // 2. Wall collision & sliding resolution (iterative for corner pinches)
    if (walls.length > 0) {
      const circle: Circle = {
        x: this.pos.x,
        z: this.pos.z,
        radius: this.radius,
      };

      for (let iter = 0; iter < 3; iter++) {
        let anyCollision = false;
        for (let i = 0; i < walls.length; i++) {
          const res = resolveCircleAABB(circle, walls[i]);
          if (res.collided && res.depth > 1e-7) {
            this.pos.x += res.normalX * res.depth;
            this.pos.z += res.normalZ * res.depth;
            circle.x = this.pos.x;
            circle.z = this.pos.z;
            anyCollision = true;
          }
        }
        if (!anyCollision) break;
      }
    }

    // 3. Rotation towards pointer ground target
    const dx = input.pointerGroundPos.x - this.pos.x;
    const dz = input.pointerGroundPos.z - this.pos.z;
    if (dx * dx + dz * dz > 1e-6) {
      this.rotationAngle = Math.atan2(dx, dz);
      this.mesh.rotation.y = this.rotationAngle;
    }

    // 4. Synchronize mesh position
    this.mesh.position.set(this.pos.x, 0, this.pos.z);
  }

  public takeDamage(amount: number): boolean {
    if (amount <= 0 || this.hp <= 0) {
      return this.hp <= 0;
    }
    this.hp = Math.max(0, this.hp - amount);
    return this.hp <= 0;
  }

  public heal(amount: number): void {
    if (amount <= 0 || this.hp <= 0) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  public get isDead(): boolean {
    return this.hp <= 0;
  }
}
