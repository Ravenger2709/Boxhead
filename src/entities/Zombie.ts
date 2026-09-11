import * as THREE from 'three';
import {
  AABB,
  Circle,
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
} from '../core/Constants';
import { resolveCircleAABB } from '../physics/Collision2D';
import { SpatialGrid, GridEntry } from '../physics/SpatialGrid';

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
    if (this.hp <= 0) {
      this.alive = false;
    }
    return this.hp <= 0;
  }

  public update(
    dt: number,
    playerPos: { x: number; z: number },
    obstacles: AABB[],
    spatialGrid: SpatialGrid
  ): void {
    if (!this.alive) return;

    this.updateCooldown(dt);

    // 1. Target vector towards player
    const toPlayerX = playerPos.x - this.pos.x;
    const toPlayerZ = playerPos.z - this.pos.z;
    const targetDist = Math.hypot(toPlayerX, toPlayerZ);
    const targetDirX = targetDist > 1e-6 ? toPlayerX / targetDist : 0;
    const targetDirZ = targetDist > 1e-6 ? toPlayerZ / targetDist : 0;

    // 2. Swarm separation steering from neighbor enemies within separation radius
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

    // 3. Blend target vector and separation vector: normalize(targetDir * 1.0 + F_sep * 0.75)
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

      // 5. Obstacle collision & sliding resolution (resolveCircleAABB)
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

    // 6. Mesh rotation and position update
    if (moveDirX * moveDirX + moveDirZ * moveDirZ > 1e-6) {
      this.rotationAngle = Math.atan2(moveDirX, moveDirZ);
      this.mesh.rotation.y = this.rotationAngle;
    }
    this.mesh.position.set(this.pos.x, 0, this.pos.z);
  }
}
