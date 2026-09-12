import * as THREE from 'three';
import {
  AABB,
  COLOR_ZOMBIE_TORSO,
  COLOR_ZOMBIE_SKIN,
  ZOMBIE_HP,
  ZOMBIE_RADIUS,
  ZOMBIE_SPEED,
  ZOMBIE_CONTACT_DAMAGE,
  ZOMBIE_ATTACK_COOLDOWN,
  ZOMBIE_SEPARATION_RADIUS,
  ZOMBIE_SEPARATION_WEIGHT,
  ZOMBIE_TARGET_WEIGHT,
  ZOMBIE_MASS,
  ZOMBIE_DAMPING,
  ZOMBIE_STUN_DELAY,
} from '../core/Constants';
import { SpatialGrid } from '../physics/SpatialGrid';
import { segmentIntersectsAABB } from '../physics/Collision2D';
import type { FakeWall } from './FakeWall';
import { applyEnemyMovement, resolveObstacleCollisions } from './EnemySteering';

let nextZombieId = 1;

export class Zombie {
  public readonly id: number;
  public readonly type = 'zombie' as const;
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public hp: number = ZOMBIE_HP;
  public maxHp: number = ZOMBIE_HP;
  public radius: number = ZOMBIE_RADIUS;
  public speed: number = ZOMBIE_SPEED;
  public contactDamage: number = ZOMBIE_CONTACT_DAMAGE;
  public attackCooldown: number = 0;
  public attackCooldownMax: number = ZOMBIE_ATTACK_COOLDOWN;
  public alive: boolean = true;
  public rotationAngle: number = 0;

  public separationRadius: number = ZOMBIE_SEPARATION_RADIUS;
  public separationWeight: number = ZOMBIE_SEPARATION_WEIGHT;
  public targetWeight: number = ZOMBIE_TARGET_WEIGHT;

  public mass: number = ZOMBIE_MASS;
  public damping: number = ZOMBIE_DAMPING;
  public stunDelay: number = ZOMBIE_STUN_DELAY;
  public stunTimer: number = 0;
  public vx: number = 0;
  public vz: number = 0;

  constructor(x: number = 0, z: number = 0, id?: number) {
    this.id = id ?? nextZombieId++;
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'zombie';

    // 1. Torso: #BDC3C7 (light gray), size: 0.8 x 0.9 x 0.5
    const torsoGeo = new THREE.BoxGeometry(0.8, 0.9, 0.5);
    const torsoMat = new THREE.MeshLambertMaterial({
      color: COLOR_ZOMBIE_TORSO,
      flatShading: true,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.name = 'torso';
    torso.position.set(0, 0.45, 0);
    group.add(torso);

    // 2. Head: #7F8C8D (dull greenish zombie skin), size: 0.6 x 0.6 x 0.6
    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMat = new THREE.MeshLambertMaterial({
      color: COLOR_ZOMBIE_SKIN,
      flatShading: true,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.name = 'head';
    head.position.set(0, 1.2, 0);
    group.add(head);

    // 3. Outstretched forward arms (classic Boxhead zombie stance pointing forward in +Z)
    const armGeo = new THREE.BoxGeometry(0.2, 0.22, 0.55);
    const armMat = new THREE.MeshLambertMaterial({
      color: COLOR_ZOMBIE_TORSO,
      flatShading: true,
    });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.name = 'leftArm';
    leftArm.position.set(-0.45, 0.65, 0.275);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.name = 'rightArm';
    rightArm.position.set(0.45, 0.65, 0.275);
    group.add(rightArm);

    // Zombie hands (dull greenish skin at front of outstretched arms)
    const handGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const handMat = new THREE.MeshLambertMaterial({
      color: COLOR_ZOMBIE_SKIN,
      flatShading: true,
    });

    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.name = 'leftHand';
    leftHand.position.set(-0.45, 0.65, 0.57);
    group.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.name = 'rightHand';
    rightHand.position.set(0.45, 0.65, 0.57);
    group.add(rightHand);

    return group;
  }

  public canAttack(): boolean {
    return this.attackCooldown <= 0;
  }

  public triggerAttack(): void {
    this.attackCooldown = this.attackCooldownMax;
  }

  public updateCooldown(dt: number): void {
    if (this.attackCooldown > 0) {
      this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    }
  }

  public takeDamage(amount: number): boolean {
    if (amount <= 0 || this.hp <= 0) {
      return this.hp <= 0;
    }
    this.hp = Math.max(0, this.hp - amount);
    this.stunTimer = this.stunDelay;
    if (this.hp <= 0) {
      this.alive = false;
    }
    return this.hp <= 0;
  }

  public applyKnockback(kx: number, kz: number): void {
    const effKx = kx / this.mass;
    const effKz = kz / this.mass;
    this.pos.x += effKx * 0.05;
    this.pos.z += effKz * 0.05;
    this.vx += effKx;
    this.vz += effKz;
    this.stunTimer = this.stunDelay;
  }

  public update(
    dt: number,
    playerPos: { x: number; z: number },
    obstacles: AABB[],
    spatialGrid: SpatialGrid,
    fakeWalls?: FakeWall[]
  ): void {
    if (!this.alive) return;

    this.updateCooldown(dt);

    // Apply residual knockback velocity & damping if present
    if (Math.abs(this.vx) > 0.001 || Math.abs(this.vz) > 0.001) {
      this.pos.x += this.vx * dt;
      this.pos.z += this.vz * dt;
      const damp = Math.pow(this.damping, dt * 25);
      this.vx *= damp;
      this.vz *= damp;
      resolveObstacleCollisions(this.pos, this.radius, obstacles);
      this.mesh.position.set(this.pos.x, 0, this.pos.z);
    } else {
      this.vx = 0;
      this.vz = 0;
    }

    // 3-frame stun delay: while stunned, pause movement steering
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
      return;
    }

    let targetPos = playerPos;
    if (fakeWalls && fakeWalls.length > 0) {
      let closestWall: FakeWall | null = null;
      let closestDistSq = Infinity;

      for (let i = 0; i < fakeWalls.length; i++) {
        const wall = fakeWalls[i];
        if (!wall.alive) continue;
        const box = wall.aabb ?? wall.getAABB();
        if (segmentIntersectsAABB(this.pos.x, this.pos.z, playerPos.x, playerPos.z, box)) {
          const wx = wall.x;
          const wz = wall.z;
          const distSq = (this.pos.x - wx) ** 2 + (this.pos.z - wz) ** 2;
          if (distSq < closestDistSq) {
            closestDistSq = distSq;
            closestWall = wall;
          }
        }
      }

      if (closestWall) {
        targetPos = {
          x: closestWall.x,
          z: closestWall.z,
        };
      }
    }

    const result = applyEnemyMovement(
      {
        id: this.id,
        pos: this.pos,
        radius: this.radius,
        speed: this.speed,
        targetPos,
        obstacles,
        spatialGrid,
        separationRadius: this.separationRadius,
        separationWeight: this.separationWeight,
        targetWeight: this.targetWeight,
      },
      dt,
      this.mesh
    );

    if (result.rotationAngle !== undefined) {
      this.rotationAngle = result.rotationAngle;
    }
  }
}
