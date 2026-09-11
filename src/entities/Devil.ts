import * as THREE from 'three';
import {
  AABB,
  Circle,
  COLOR_DEVIL_BODY,
  COLOR_DEVIL_EYES,
  DEVIL_HP,
  DEVIL_RADIUS,
  DEVIL_SPEED,
  DEVIL_CONTACT_DAMAGE,
  DEVIL_FIREBALL_COOLDOWN,
  DEVIL_FIREBALL_DAMAGE,
  DEVIL_FIREBALL_SPEED,
  DEVIL_CAST_DURATION,
  DEVIL_STAGGER_DURATION,
  ZOMBIE_SEPARATION_RADIUS,
  ZOMBIE_SEPARATION_WEIGHT,
  ZOMBIE_TARGET_WEIGHT,
} from '../core/Constants';
import { resolveCircleAABB } from '../physics/Collision2D';
import { SpatialGrid, GridEntry } from '../physics/SpatialGrid';
import type { ProjectilePool } from '../weapons/ProjectilePool';

let nextDevilId = 10000;

export class Devil {
  public readonly id: number;
  public readonly type = 'devil' as const;
  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public hp: number = DEVIL_HP;
  public maxHp: number = DEVIL_HP;
  public radius: number = DEVIL_RADIUS;
  public speed: number = DEVIL_SPEED;
  public contactDamage: number = DEVIL_CONTACT_DAMAGE;
  public attackCooldown: number = DEVIL_FIREBALL_COOLDOWN;
  public attackTimer: number = 0;
  public alive: boolean = true;
  public rotationAngle: number = 0;

  public isCasting: boolean = false;
  public castTimer: number = 0;
  public castDuration: number = DEVIL_CAST_DURATION;

  public isStaggered: boolean = false;
  public staggerTimer: number = 0;
  public staggerDuration: number = DEVIL_STAGGER_DURATION;

  public separationRadius: number = ZOMBIE_SEPARATION_RADIUS;
  public separationWeight: number = ZOMBIE_SEPARATION_WEIGHT;
  public targetWeight: number = ZOMBIE_TARGET_WEIGHT;

  public projectilePool?: ProjectilePool;
  public onShootFireball?: (devil: Devil, dirX: number, dirZ: number) => void;

  constructor(x: number = 0, z: number = 0, id?: number) {
    this.id = id ?? nextDevilId++;
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'devil';

    // 1. Deep crimson torso: #C0392B, size: 1.0 x 1.1 x 0.6
    const torsoGeo = new THREE.BoxGeometry(1.0, 1.1, 0.6);
    const torsoMat = new THREE.MeshLambertMaterial({
      color: COLOR_DEVIL_BODY,
      flatShading: true,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.name = 'torso';
    torso.position.set(0, 0.55, 0);
    group.add(torso);

    // 2. Crimson Head: #C0392B, size: 0.75 x 0.75 x 0.75
    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const headMat = new THREE.MeshLambertMaterial({
      color: COLOR_DEVIL_BODY,
      flatShading: true,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.name = 'head';
    head.position.set(0, 1.45, 0);
    group.add(head);

    // 3. Glowing Yellow Eyes: #F1C40F, size: 0.14 x 0.14 x 0.05
    const eyeGeo = new THREE.BoxGeometry(0.14, 0.14, 0.05);
    const eyeMat = new THREE.MeshLambertMaterial({
      color: COLOR_DEVIL_EYES,
      flatShading: true,
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.name = 'leftEye';
    leftEye.position.set(-0.18, 1.5, 0.38);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.name = 'rightEye';
    rightEye.position.set(0.18, 1.5, 0.38);
    group.add(rightEye);

    // 4. Crimson Horns: size: 0.14 x 0.28 x 0.14
    const hornGeo = new THREE.BoxGeometry(0.14, 0.28, 0.14);
    const hornMat = new THREE.MeshLambertMaterial({
      color: COLOR_DEVIL_BODY,
      flatShading: true,
    });

    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.name = 'leftHorn';
    leftHorn.position.set(-0.26, 1.95, 0);
    group.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeo, hornMat);
    rightHorn.name = 'rightHorn';
    rightHorn.position.set(0.26, 1.95, 0);
    group.add(rightHorn);

    // 5. Arms
    const armGeo = new THREE.BoxGeometry(0.24, 0.24, 0.55);
    const armMat = new THREE.MeshLambertMaterial({
      color: COLOR_DEVIL_BODY,
      flatShading: true,
    });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.name = 'leftArm';
    leftArm.position.set(-0.58, 0.75, 0.2);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.name = 'rightArm';
    rightArm.position.set(0.58, 0.75, 0.2);
    group.add(rightArm);

    return group;
  }

  public takeDamage(amount: number): boolean {
    if (amount <= 0 || this.hp <= 0) {
      return this.hp <= 0;
    }
    this.hp = Math.max(0, this.hp - amount);

    // Stagger Devil on incoming damage and interrupt casting!
    this.isCasting = false;
    this.castTimer = 0;
    this.isStaggered = true;
    this.staggerTimer = this.staggerDuration;

    if (this.hp <= 0) {
      this.alive = false;
    }
    return this.hp <= 0;
  }

  public shootFireball(targetPos: { x: number; z: number }): void {
    const toPlayerX = targetPos.x - this.pos.x;
    const toPlayerZ = targetPos.z - this.pos.z;
    const dist = Math.hypot(toPlayerX, toPlayerZ);
    const dirX = dist > 1e-6 ? toPlayerX / dist : 0;
    const dirZ = dist > 1e-6 ? toPlayerZ / dist : 1;

    if (this.onShootFireball) {
      this.onShootFireball(this, dirX, dirZ);
    } else if (this.projectilePool) {
      this.projectilePool.spawn(
        'fireball',
        this.pos.x + dirX * this.radius,
        this.pos.z + dirZ * this.radius,
        dirX,
        dirZ,
        DEVIL_FIREBALL_DAMAGE,
        DEVIL_FIREBALL_SPEED
      );
    }
  }

  public update(
    dt: number,
    playerPos: { x: number; z: number },
    obstacles: AABB[],
    spatialGrid: SpatialGrid
  ): void {
    if (!this.alive) return;

    // 1. Handle Stagger State (paused movement and casting)
    if (this.isStaggered) {
      this.staggerTimer -= dt;
      if (this.staggerTimer <= 0) {
        this.isStaggered = false;
      }
      this.mesh.position.set(this.pos.x, 0, this.pos.z);
      return;
    }

    // 2. Handle Casting State (paused movement, aiming toward player)
    if (this.isCasting) {
      this.castTimer += dt;
      const toPlayerX = playerPos.x - this.pos.x;
      const toPlayerZ = playerPos.z - this.pos.z;
      if (toPlayerX * toPlayerX + toPlayerZ * toPlayerZ > 1e-6) {
        this.rotationAngle = Math.atan2(toPlayerX, toPlayerZ);
        this.mesh.rotation.y = this.rotationAngle;
      }
      this.mesh.position.set(this.pos.x, 0, this.pos.z);

      if (this.castTimer >= this.castDuration) {
        this.isCasting = false;
        this.castTimer = 0;
        this.attackTimer = 0;
        this.shootFireball(playerPos);
      }
      return;
    }

    // 3. Attack timer accumulation
    this.attackTimer += dt;
    if (this.attackTimer >= this.attackCooldown) {
      // Enter casting pause
      this.isCasting = true;
      this.castTimer = 0;
      const toPlayerX = playerPos.x - this.pos.x;
      const toPlayerZ = playerPos.z - this.pos.z;
      if (toPlayerX * toPlayerX + toPlayerZ * toPlayerZ > 1e-6) {
        this.rotationAngle = Math.atan2(toPlayerX, toPlayerZ);
        this.mesh.rotation.y = this.rotationAngle;
      }
      this.mesh.position.set(this.pos.x, 0, this.pos.z);
      return;
    }

    // 4. Normal Movement & Separation Steering
    const toPlayerX = playerPos.x - this.pos.x;
    const toPlayerZ = playerPos.z - this.pos.z;
    const targetDist = Math.hypot(toPlayerX, toPlayerZ);
    const targetDirX = targetDist > 1e-6 ? toPlayerX / targetDist : 0;
    const targetDirZ = targetDist > 1e-6 ? toPlayerZ / targetDist : 0;

    let fSepX = 0;
    let fSepZ = 0;

    const neighbors: GridEntry[] = spatialGrid.queryNearby
      ? spatialGrid.queryNearby(this.pos.x, this.pos.z, this.separationRadius)
      : (spatialGrid.query(this.pos.x, this.pos.z, this.separationRadius)
          .map((id) => spatialGrid.getEntry(id))
          .filter((e): e is GridEntry => !!e));

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (neighbor.id === this.id) continue;

      let dx = this.pos.x - neighbor.x;
      let dz = this.pos.z - neighbor.z;
      let distSq = dx * dx + dz * dz;

      if (distSq === 0) {
        dx = (this.id % 2 === 0 ? 1 : -1) * 0.01;
        distSq = 0.0001;
      }

      const denom = Math.max(distSq, 0.01);
      fSepX += dx / denom;
      fSepZ += dz / denom;
    }

    const combinedX = targetDirX * this.targetWeight + fSepX * this.separationWeight;
    const combinedZ = targetDirZ * this.targetWeight + fSepZ * this.separationWeight;
    const combinedLen = Math.hypot(combinedX, combinedZ);

    let moveDirX = 0;
    let moveDirZ = 0;
    if (combinedLen > 1e-6) {
      moveDirX = combinedX / combinedLen;
      moveDirZ = combinedZ / combinedLen;
    } else if (targetDist > 1e-6) {
      moveDirX = targetDirX;
      moveDirZ = targetDirZ;
    }

    // 4. Sub-stepped movement & obstacle collision to prevent tunneling
    const totalDist = this.speed * dt;
    const maxStep = this.radius * 0.5;
    const steps = Math.max(1, Math.ceil(totalDist / maxStep));
    const stepDt = dt / steps;

    for (let s = 0; s < steps; s++) {
      this.pos.x += moveDirX * this.speed * stepDt;
      this.pos.z += moveDirZ * this.speed * stepDt;

      // Obstacle sliding
      if (obstacles.length > 0) {
        const circle: Circle = {
          x: this.pos.x,
          z: this.pos.z,
          radius: this.radius,
        };

        for (let iter = 0; iter < 3; iter++) {
          let anyCollision = false;
          for (let i = 0; i < obstacles.length; i++) {
            const res = resolveCircleAABB(circle, obstacles[i]);
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
    }

    // Mesh rotation and position update
    if (moveDirX * moveDirX + moveDirZ * moveDirZ > 1e-6) {
      this.rotationAngle = Math.atan2(moveDirX, moveDirZ);
      this.mesh.rotation.y = this.rotationAngle;
    }
    this.mesh.position.set(this.pos.x, 0, this.pos.z);
  }
}
