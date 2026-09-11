import * as THREE from 'three';
import { AABB, Circle } from '../core/Constants';
import { resolveCircleAABB } from '../physics/Collision2D';
import { SpatialGrid, GridEntry } from '../physics/SpatialGrid';

export interface SteeringParams {
  id: number;
  pos: { x: number; z: number };
  radius: number;
  speed: number;
  targetPos: { x: number; z: number };
  obstacles: AABB[];
  spatialGrid: SpatialGrid;
  separationRadius?: number;
  separationWeight?: number;
  targetWeight?: number;
}

export interface MoveResult {
  moveDirX: number;
  moveDirZ: number;
  rotationAngle?: number;
}

/**
 * Computes inverse-square flocking separation force from neighbors within the spatial grid.
 * F_sep = sum((p_self - p_neighbor) / max(dist^2, 0.01))
 */
export function computeSeparationForce(
  id: number,
  pos: { x: number; z: number },
  spatialGrid: SpatialGrid,
  separationRadius: number = 1.6
): { x: number; z: number } {
  let fSepX = 0;
  let fSepZ = 0;

  const neighbors: GridEntry[] = spatialGrid.queryNearby
    ? spatialGrid.queryNearby(pos.x, pos.z, separationRadius)
    : (spatialGrid.query(pos.x, pos.z, separationRadius)
        .map((neighborId) => spatialGrid.getEntry(neighborId))
        .filter((e): e is GridEntry => !!e));

  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    if (neighbor.id === id) continue;

    let dx = pos.x - neighbor.x;
    let dz = pos.z - neighbor.z;
    let distSq = dx * dx + dz * dz;

    if (distSq === 0) {
      dx = (id % 2 === 0 ? 1 : -1) * 0.01;
      distSq = 0.0001;
    }

    const denom = Math.max(distSq, 0.01);
    fSepX += dx / denom;
    fSepZ += dz / denom;
  }

  return { x: fSepX, z: fSepZ };
}

/**
 * Resolves obstacle collisions and sliding for a 2D circle against an array of AABB obstacles (3-pass).
 */
export function resolveObstacleCollisions(
  pos: { x: number; z: number },
  radius: number,
  obstacles: AABB[]
): void {
  if (obstacles.length === 0) return;

  const circle: Circle = {
    x: pos.x,
    z: pos.z,
    radius,
  };

  for (let iter = 0; iter < 3; iter++) {
    let anyCollision = false;
    for (let i = 0; i < obstacles.length; i++) {
      const res = resolveCircleAABB(circle, obstacles[i]);
      if (res.collided && res.depth > 1e-7) {
        pos.x += res.normalX * res.depth;
        pos.z += res.normalZ * res.depth;
        circle.x = pos.x;
        circle.z = pos.z;
        anyCollision = true;
      }
    }
    if (!anyCollision) break;
  }
}

/**
 * Executes full flocking separation steering, target tracking, sub-stepped position integration,
 * obstacle collision sliding, and mesh synchronization.
 */
export function applyEnemyMovement(
  params: SteeringParams,
  dt: number,
  mesh?: THREE.Object3D
): MoveResult {
  const {
    id,
    pos,
    radius,
    speed,
    targetPos,
    obstacles,
    spatialGrid,
    separationRadius = 1.6,
    separationWeight = 0.75,
    targetWeight = 1.0,
  } = params;

  // 1. Target vector towards target position
  const toTargetX = targetPos.x - pos.x;
  const toTargetZ = targetPos.z - pos.z;
  const targetDist = Math.hypot(toTargetX, toTargetZ);
  const targetDirX = targetDist > 1e-6 ? toTargetX / targetDist : 0;
  const targetDirZ = targetDist > 1e-6 ? toTargetZ / targetDist : 0;

  // 2. Swarm separation steering from neighbor enemies
  const fSep = computeSeparationForce(id, pos, spatialGrid, separationRadius);

  // 3. Blend target vector and separation vector
  const combinedX = targetDirX * targetWeight + fSep.x * separationWeight;
  const combinedZ = targetDirZ * targetWeight + fSep.z * separationWeight;
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
  const totalDist = speed * dt;
  const maxStep = radius * 0.5;
  const steps = Math.max(1, Math.ceil(totalDist / maxStep));
  const stepDt = dt / steps;

  for (let s = 0; s < steps; s++) {
    pos.x += moveDirX * speed * stepDt;
    pos.z += moveDirZ * speed * stepDt;

    resolveObstacleCollisions(pos, radius, obstacles);
  }

  // 5. Mesh rotation and position update
  let rotationAngle: number | undefined;
  if (moveDirX * moveDirX + moveDirZ * moveDirZ > 1e-6) {
    rotationAngle = Math.atan2(moveDirX, moveDirZ);
    if (mesh) {
      mesh.rotation.y = rotationAngle;
    }
  }
  if (mesh) {
    mesh.position.set(pos.x, 0, pos.z);
  }

  return { moveDirX, moveDirZ, rotationAngle };
}
