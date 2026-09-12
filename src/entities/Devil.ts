import * as THREE from 'three';
import {
  AABB,
  COLOR_DEVIL_BODY,
  COLOR_DEVIL_EYES,
  DEVIL_HP,
  DEVIL_RADIUS,
  DEVIL_SPEED,
  DEVIL_CONTACT_DAMAGE,
  DEVIL_ATTACK_COOLDOWN,
  DEVIL_FIREBALL_COOLDOWN,
  DEVIL_FIREBALL_DAMAGE,
  DEVIL_FIREBALL_SPEED,
  DEVIL_CAST_DURATION,
  DEVIL_STAGGER_DURATION,
  DEVIL_MASS,
  ZOMBIE_SEPARATION_RADIUS,
  ZOMBIE_SEPARATION_WEIGHT,
  ZOMBIE_TARGET_WEIGHT,
} from '../core/Constants';
import { SpatialGrid } from '../physics/SpatialGrid';
import type { ProjectilePool } from '../weapons/ProjectilePool';
import type { FakeWall } from './FakeWall';
import type { Barrel } from './Barrel';
import { applyEnemyMovement } from './EnemySteering';

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
  public contactAttackCooldown: number = 0;
  public contactAttackCooldownMax: number = DEVIL_ATTACK_COOLDOWN;
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

  public mass: number = DEVIL_MASS;

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

  public canAttack(): boolean {
    return this.contactAttackCooldown <= 0;
  }

  public triggerAttack(): void {
    this.contactAttackCooldown = this.contactAttackCooldownMax;
  }

  public updateCooldown(dt: number): void {
    if (this.contactAttackCooldown > 0) {
      this.contactAttackCooldown = Math.max(0, this.contactAttackCooldown - dt);
    }
  }

  public takeDamage(amount: number): boolean {
    if (amount <= 0 || this.hp <= 0) {
      return this.hp <= 0;
    }
    this.hp = Math.max(0, this.hp - amount);

    // Stagger Devil on incoming damage and interrupt casting!
    if (this.isCasting) {
      this.isCasting = false;
      this.castTimer = 0;
      this.attackTimer = 0;
    }
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

  public applyKnockback(kx: number, kz: number): void {
    const effKx = kx / this.mass;
    const effKz = kz / this.mass;
    this.pos.x += effKx * 0.05;
    this.pos.z += effKz * 0.05;
    this.isStaggered = true;
    this.staggerTimer = this.staggerDuration;
  }

  public demolishObstacle(obstacle: FakeWall | Barrel, explosionContext?: any): void {
    obstacle.takeDamage(100000, explosionContext);
  }

  public update(
    dt: number,
    playerPos: { x: number; z: number },
    obstacles: AABB[],
    spatialGrid: SpatialGrid,
    fakeWalls?: FakeWall[],
    barrels?: Barrel[],
    explosionContext?: any
  ): void {
    if (!this.alive) return;

    this.updateCooldown(dt);

    // Obstacle demolition: When colliding with Fake Wall or Barrel, deals 100,000 damage to immediately vaporize it
    if (fakeWalls && fakeWalls.length > 0) {
      for (let i = fakeWalls.length - 1; i >= 0; i--) {
        const wall = fakeWalls[i];
        if (!wall.alive) continue;
        const box = wall.aabb ?? wall.getAABB();
        const clampedX = Math.max(box.minX, Math.min(this.pos.x, box.maxX));
        const clampedZ = Math.max(box.minZ, Math.min(this.pos.z, box.maxZ));
        const distSq = (this.pos.x - clampedX) ** 2 + (this.pos.z - clampedZ) ** 2;
        const centerDist = Math.hypot(this.pos.x - wall.x, this.pos.z - wall.z);
        if (distSq <= this.radius * this.radius || centerDist <= this.radius + 0.8) {
          this.demolishObstacle(wall, explosionContext);
          if (wall.mesh?.parent) {
            wall.mesh.parent.remove(wall.mesh);
          }
          fakeWalls.splice(i, 1);
        }
      }
    }

    if (barrels && barrels.length > 0) {
      for (let i = barrels.length - 1; i >= 0; i--) {
        const barrel = barrels[i];
        if (!barrel.alive || barrel.exploded) continue;
        const bRad = (barrel as any).physicalRadius ?? 0.6;
        const dist = Math.hypot(this.pos.x - barrel.pos.x, this.pos.z - barrel.pos.z);
        if (dist <= this.radius + bRad) {
          this.demolishObstacle(barrel, explosionContext);
          if (barrel.mesh?.parent) {
            barrel.mesh.parent.remove(barrel.mesh);
          }
          barrels.splice(i, 1);
        }
      }
    }

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

    // 4. Normal Movement & Separation Steering using shared helper
    const result = applyEnemyMovement(
      {
        id: this.id,
        pos: this.pos,
        radius: this.radius,
        speed: this.speed,
        targetPos: playerPos,
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
