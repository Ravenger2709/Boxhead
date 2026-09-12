import * as THREE from 'three';
import {
  COLOR_WOOD_CRATE,
  COLOR_OUTLINE,
} from '../core/Constants';
import type { Player } from './Player';
import type { WeaponInventory } from '../weapons/WeaponInventory';
import type { ParticlePool } from '../fx/ParticlePool';
import { audioManager } from '../core/Audio';

export interface CrateCollectContext {
  particlePool?: ParticlePool;
  audio?: { playPickup: () => void };
}

// Module-level static geometries & materials to avoid GPU buffer leaks
let sharedCrateGeo: THREE.BoxGeometry | null = null;
let sharedCrateMat: THREE.MeshLambertMaterial | null = null;
let sharedCrateEdgesGeo: THREE.EdgesGeometry | null = null;
let sharedCrateLineMat: THREE.LineBasicMaterial | null = null;

export function getCrateResources() {
  if (!sharedCrateGeo || !sharedCrateMat || !sharedCrateEdgesGeo || !sharedCrateLineMat) {
    sharedCrateGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    sharedCrateMat = new THREE.MeshLambertMaterial({
      color: COLOR_WOOD_CRATE,
      flatShading: true,
    });
    sharedCrateEdgesGeo = new THREE.EdgesGeometry(sharedCrateGeo);
    sharedCrateLineMat = new THREE.LineBasicMaterial({
      color: COLOR_OUTLINE,
      linewidth: 2,
    });
  }
  return {
    geo: sharedCrateGeo,
    mat: sharedCrateMat,
    edgesGeo: sharedCrateEdgesGeo,
    lineMat: sharedCrateLineMat,
  };
}

export class Crate {
  public pos: { x: number; z: number };
  public radius: number = 0.6;
  public collected: boolean = false;
  public mesh: THREE.Group;

  constructor(x: number = 0, z: number = 0, scene?: THREE.Scene | THREE.Group) {
    this.pos = { x, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);

    if (scene) {
      scene.add(this.mesh);
    }
  }

  private createMesh(): THREE.Group {
    const res = getCrateResources();
    const group = new THREE.Group();
    group.name = 'crate';

    const body = new THREE.Mesh(res.geo, res.mat);
    body.name = 'crateBody';
    body.position.set(0, 0.5, 0);
    group.add(body);

    const outline = new THREE.LineSegments(res.edgesGeo, res.lineMat);
    outline.name = 'crateOutline';
    outline.position.set(0, 0.5, 0);
    group.add(outline);

    return group;
  }

  /**
   * Circle-circle collision test against player.
   */
  public checkCollision(player: { pos: { x: number; z: number }; radius: number }): boolean {
    if (this.collected) return false;
    const dx = player.pos.x - this.pos.x;
    const dz = player.pos.z - this.pos.z;
    const combinedRadius = this.radius + player.radius;
    return dx * dx + dz * dz <= combinedRadius * combinedRadius;
  }

  /**
   * Collects the crate:
   * - Restores +25% max HP to player
   * - Refills secondary weapon ammo by +35% (via inventory.addAmmo(0.35))
   * - Spawns wooden splinter particles
   * - Plays pickup sound
   * - Removes mesh from parent scene
   */
  public collect(
    player: Player,
    inventory: WeaponInventory,
    context?: CrateCollectContext
  ): boolean {
    if (this.collected) return false;
    this.collected = true;

    // Restore +25 HP
    player.heal(25);

    // Refill secondary weapon ammo
    inventory.addAmmo(0.35);

    // Spawn splinter particle burst
    if (context?.particlePool) {
      context.particlePool.spawnBurst(
        this.pos.x,
        this.pos.z,
        15,
        COLOR_WOOD_CRATE,
        4.0,
        0.5
      );
    }

    // Play pickup audio chime
    if (context?.audio) {
      context.audio.playPickup();
    } else {
      audioManager.playPickup();
    }

    // Remove from scene
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }

    return true;
  }

  /**
   * Frame update: checks collision with player and triggers collect if touching.
   */
  public update(
    _dt: number,
    player: Player,
    inventory: WeaponInventory,
    context?: CrateCollectContext
  ): boolean {
    if (this.collected) return false;
    if (this.checkCollision(player)) {
      return this.collect(player, inventory, context);
    }
    return false;
  }

  public destroy(scene?: THREE.Scene | THREE.Group): void {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    } else if (scene) {
      scene.remove(this.mesh);
    }
  }

  public static spawnRandom(
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    scene?: THREE.Scene | THREE.Group
  ): Crate {
    const x = minX + Math.random() * (maxX - minX);
    const z = minZ + Math.random() * (maxZ - minZ);
    return new Crate(x, z, scene);
  }
}
