import * as THREE from 'three';
import {
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_MAX_HP,
  PLAYER_MASS,
  COLOR_PLAYER_TORSO,
  COLOR_PLAYER2_TORSO,
  COLOR_PLAYER_SKIN,
  COLOR_PLAYER_HAIR,
  AABB,
  Circle,
} from '../core/Constants';
import { InputManager } from '../core/Input';
import { resolveCircleAABB } from '../physics/Collision2D';

export class Player {
  public static readonly State_Normal = 'State_Normal';
  public static readonly State_BulletHit = 'State_BulletHit';
  public static readonly State_Sleep = 'State_Sleep';
  public static readonly State_Dead = 'State_Dead';

  public mesh: THREE.Group;
  public pos: { x: number; z: number };
  public radius: number = PLAYER_RADIUS;
  public hp: number = PLAYER_MAX_HP;
  public maxHp: number = PLAYER_MAX_HP;
  public speed: number = PLAYER_SPEED;
  public mass: number = PLAYER_MASS;
  public rotationAngle: number = 0;
  public playerIndex: 1 | 2 = 1;
  public isCoop: boolean = false;
  public controlScheme: 'all' | 'arrows' | 'wasd' = 'all';

  // Spawn invulnerability timer in seconds
  public invincibilityTimer: number = 0;

  public get invulnerableTimer(): number {
    return this.invincibilityTimer;
  }

  public set invulnerableTimer(val: number) {
    this.invincibilityTimer = val;
  }

  public get isInvulnerable(): boolean {
    return this.invincibilityTimer > 0;
  }

  // Option A Retro Controls: keyboard 8-way aiming by default, mouse aiming disabled unless toggled
  public mouseAimEnabled: boolean = false;

  // Combat Hitstun & Knockback State Machine
  public state: string = Player.State_Normal;
  public vx: number = 0;
  public vz: number = 0;
  public flinchTilt: number = 0;
  public stunFrames: number = 0;
  public stunTimer: number = 0;
  public options?: { torsoColor?: number; controlScheme?: 'all' | 'arrows' | 'wasd' };
  public torsoColor: number = COLOR_PLAYER_TORSO;

  constructor(
    x: number = 0,
    z: number = 0,
    playerIndex: 1 | 2 = 1,
    isCoopOrOptions?: boolean | { torsoColor?: number; controlScheme?: 'all' | 'arrows' | 'wasd' }
  ) {
    this.pos = { x, z };
    this.playerIndex = playerIndex;
    if (typeof isCoopOrOptions === 'boolean') {
      this.isCoop = isCoopOrOptions;
      if (playerIndex === 2) {
        this.controlScheme = 'wasd';
      } else if (isCoopOrOptions) {
        this.controlScheme = 'arrows';
      } else {
        this.controlScheme = 'all';
      }
    } else if (isCoopOrOptions) {
      this.options = isCoopOrOptions;
      if (isCoopOrOptions.controlScheme) {
        this.controlScheme = isCoopOrOptions.controlScheme;
      } else if (playerIndex === 2) {
        this.controlScheme = 'wasd';
      } else {
        this.controlScheme = 'all';
      }
      if (isCoopOrOptions.torsoColor !== undefined) {
        this.torsoColor = isCoopOrOptions.torsoColor;
      }
    } else {
      this.controlScheme = playerIndex === 2 ? 'wasd' : 'all';
    }

    const defaultTorsoColor = playerIndex === 2 ? COLOR_PLAYER2_TORSO : COLOR_PLAYER_TORSO;
    const torsoColor = typeof isCoopOrOptions === 'object' && isCoopOrOptions?.torsoColor !== undefined
      ? isCoopOrOptions.torsoColor
      : defaultTorsoColor;
    this.torsoColor = torsoColor;
    this.options = { torsoColor, controlScheme: this.controlScheme };
    this.mesh = this.createMesh(torsoColor);
    this.mesh.position.set(x, 0, z);
  }

  private createMesh(torsoColor: number = COLOR_PLAYER_TORSO): THREE.Group {
    const group = new THREE.Group();
    group.name = this.playerIndex === 2 ? 'player2' : 'player';

    // 1. Torso, size: 0.8 x 0.9 x 0.5
    const torsoGeo = new THREE.BoxGeometry(0.8, 0.9, 0.5);
    const torsoMat = new THREE.MeshLambertMaterial({
      color: torsoColor,
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
      color: torsoColor,
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

    // Peach hands at end of arms
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

  public get isInputLocked(): boolean {
    return (
      this.state === Player.State_BulletHit ||
      this.state === Player.State_Sleep ||
      this.stunFrames > 0 ||
      this.hp <= 0
    );
  }

  public get canMove(): boolean {
    return !this.isInputLocked;
  }

  public get canShoot(): boolean {
    return !this.isInputLocked;
  }

  public get isStunned(): boolean {
    return this.isInputLocked && this.hp > 0;
  }

  public applyKnockback(dirX: number, dirZ: number, damage?: number): void {
    if (this.hp <= 0) return;

    if (typeof damage === 'number') {
      const len = Math.hypot(dirX, dirZ);
      const ndx = len > 1e-6 ? dirX / len : 0;
      const ndz = len > 1e-6 ? dirZ / len : 0;
      // Knockback impulse = damage / 5 * 2 / mass
      const impulse = (damage / 5) * 2 / this.mass;
      this.vx += ndx * impulse;
      this.vz += ndz * impulse;
    } else {
      this.vx += dirX;
      this.vz += dirZ;
    }

    this.state = Player.State_BulletHit;
    this.flinchTilt = -0.25; // Flinch tilt backwards
    this.stunFrames = 3; // 3 frames (~0.05s) pure stun recovery delay
    this.stunTimer = 3 / 60;
  }

  public triggerSpawnInvincibility(duration: number = 8.0): void {
    this.invincibilityTimer = duration;
    this.mesh.visible = true;
  }

  public respawn(x: number = 0, z: number = 0): void {
    this.pos.x = x;
    this.pos.z = z;
    this.mesh.position.set(x, 0, z);
    this.hp = this.maxHp;
    this.state = Player.State_Normal;
    this.vx = 0;
    this.vz = 0;
    this.flinchTilt = 0;
    this.stunFrames = 0;
    this.stunTimer = 0;
    this.triggerSpawnInvincibility(8.0);
  }

  public takeDamage(amount: number, dirX?: number, dirZ?: number): boolean {
    if (this.isInvulnerable || this.invincibilityTimer > 0) {
      return false;
    }
    if (amount <= 0 || this.hp <= 0) {
      return this.hp <= 0;
    }
    this.hp = Math.max(0, this.hp - amount);

    if (this.hp <= 0) {
      this.state = Player.State_Dead;
      this.vx = 0;
      this.vz = 0;
      return true;
    }

    if (dirX !== undefined && dirZ !== undefined) {
      this.applyKnockback(dirX, dirZ, amount);
    }

    return this.hp <= 0;
  }

  public heal(amount: number): void {
    if (amount <= 0 || this.hp <= 0) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  public get isDead(): boolean {
    return this.hp <= 0;
  }

  private resolveWalls(walls: AABB[]): void {
    if (walls.length === 0) return;
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

  public update(dt: number, input?: InputManager, walls: AABB[] = [], isCoop?: boolean): void {
    // 0. Update Spawn Invincibility Timer & Blinking Effect
    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer = Math.max(0, this.invincibilityTimer - dt);
      if (this.invincibilityTimer > 0) {
        const isBlinkVisible = Math.floor(this.invincibilityTimer * 10) % 2 === 0;
        this.mesh.visible = isBlinkVisible;
      } else if (this.hp > 0) {
        this.mesh.visible = true;
      }
    } else if (this.hp > 0) {
      this.mesh.visible = true;
    }
    // 1. Passive Regeneration: over 30s (hp += maxHp / (60 * 30) * dt * 60) up to 200 HP
    if (this.hp > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(
        this.maxHp,
        this.hp + (this.maxHp / (60 * 30)) * dt * 60
      );
    }

    if (!input) {
      return;
    }

    // 2. Combat Hitstun & Knockback State Processing
    if (this.state === Player.State_BulletHit) {
      // Apply knockback displacement
      this.pos.x += this.vx * dt;
      this.pos.z += this.vz * dt;

      // Velocity damping factor = 0.65 per frame
      const damping = Math.pow(0.65, dt * 60);
      this.vx *= damping;
      this.vz *= damping;

      this.resolveWalls(walls);

      // Flinch tilt backwards
      this.mesh.rotation.x = this.flinchTilt;
      this.mesh.rotation.y = this.rotationAngle;
      this.mesh.position.set(this.pos.x, 0, this.pos.z);

      // Transition to State_Sleep (pure stun recovery delay for remaining frames)
      this.stunFrames--;
      this.stunTimer -= dt;
      if (this.stunFrames <= 0 || this.stunTimer <= 0) {
        this.stunFrames = 0;
        this.stunTimer = 0;
        this.state = Player.State_Normal;
        this.flinchTilt = 0;
        this.mesh.rotation.x = 0;
        this.vx = 0;
        this.vz = 0;
      } else {
        this.state = Player.State_Sleep;
      }
      return;
    }

    if (this.state === Player.State_Sleep) {
      // Remaining knockback displacement & damping during stun delay
      this.pos.x += this.vx * dt;
      this.pos.z += this.vz * dt;

      const damping = Math.pow(0.65, dt * 60);
      this.vx *= damping;
      this.vz *= damping;

      this.resolveWalls(walls);

      this.mesh.rotation.x = this.flinchTilt;
      this.mesh.rotation.y = this.rotationAngle;
      this.mesh.position.set(this.pos.x, 0, this.pos.z);

      this.stunFrames--;
      this.stunTimer -= dt;

      if (this.stunFrames <= 0 || this.stunTimer <= 0) {
        this.stunFrames = 0;
        this.stunTimer = 0;
        this.state = Player.State_Normal;
        this.flinchTilt = 0;
        this.mesh.rotation.x = 0;
        this.vx = 0;
        this.vz = 0;
      }
      return;
    }

    // Normal state: Reset flinch tilt
    this.mesh.rotation.x = 0;

    // 3. Movement & Aiming Vector Calculation
    const coopMode = isCoop !== undefined ? isCoop : this.isCoop;
    let moveX = 0;
    let moveZ = 0;

    if (typeof (input as any).getPlayerInput === 'function' && !this.options?.controlScheme) {
      const pInput = (input as any).getPlayerInput(this.playerIndex, coopMode);
      moveX = pInput.moveX;
      moveZ = pInput.moveZ;
    } else {
      const useArrows = this.controlScheme === 'all' || this.controlScheme === 'arrows' || (coopMode && this.playerIndex === 1);
      const useWasd = this.controlScheme === 'all' || this.controlScheme === 'wasd' || (coopMode && this.playerIndex === 2);

      if (
        (useWasd && (input.keys.has('w') || input.keys.has('keyw'))) ||
        (useArrows && input.keys.has('arrowup'))
      ) {
        moveZ -= 1;
      }
      if (
        (useWasd && (input.keys.has('s') || input.keys.has('keys'))) ||
        (useArrows && input.keys.has('arrowdown'))
      ) {
        moveZ += 1;
      }
      if (
        (useWasd && (input.keys.has('a') || input.keys.has('keya'))) ||
        (useArrows && input.keys.has('arrowleft'))
      ) {
        moveX -= 1;
      }
      if (
        (useWasd && (input.keys.has('d') || input.keys.has('keyd'))) ||
        (useArrows && input.keys.has('arrowright'))
      ) {
        moveX += 1;
      }
    }

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      const len = Math.hypot(moveX, moveZ);
      const vx = (moveX / len) * this.speed;
      const vz = (moveZ / len) * this.speed;
      this.pos.x += vx * dt;
      this.pos.z += vz * dt;

      // Option A Retro: Facing angle strictly aligns with 8-directional movement vector
      this.rotationAngle = Math.atan2(moveX, moveZ);
    } else {
      // Option A Retro: Snapping to last facing angle when stationary
      // Unless mouse aim is explicitly enabled (P1 single-player only)
      const isMouseAim = this.playerIndex === 1 && !coopMode && (this.mouseAimEnabled || input.mouseAimEnabled);
      if (isMouseAim) {
        const dx = input.pointerGroundPos.x - this.pos.x;
        const dz = input.pointerGroundPos.z - this.pos.z;
        if (dx * dx + dz * dz > 1e-6) {
          this.rotationAngle = Math.atan2(dx, dz);
        }
      }
    }

    // 4. Wall collision & sliding resolution
    this.resolveWalls(walls);

    // 5. Synchronize mesh transform
    this.mesh.rotation.y = this.rotationAngle;
    this.mesh.position.set(this.pos.x, 0, this.pos.z);
  }
}
