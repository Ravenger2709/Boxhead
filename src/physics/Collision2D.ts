import type { AABB, Circle } from '../core/Constants';

export type { AABB, Circle };

export interface CollisionResult {
  collided: boolean;
  normalX: number;
  normalZ: number;
  depth: number;
}

/**
 * Checks if two 2D circles overlap or touch.
 */
export function checkCircleCircle(c1: Circle, c2: Circle): boolean {
  const dx = c2.x - c1.x;
  const dz = c2.z - c1.z;
  const radSum = c1.radius + c2.radius;
  return dx * dx + dz * dz <= radSum * radSum;
}

/**
 * Tests whether a point (x, z) is inside or on the boundary of an AABB.
 */
export function pointInAABB(x: number, z: number, box: AABB): boolean {
  return x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ;
}

/**
 * Resolves collision and penetration between a 2D Circle and an AABB box.
 *
 * When the circle penetrates the box:
 * - collided: true
 * - depth: > 0 (distance needed to push the circle out)
 * - (normalX, normalZ): unit vector pointing OUT of the box towards the circle center
 *   so that moving circle along (normalX * depth, normalZ * depth) resolves penetration cleanly.
 *
 * Handles edge penetration, corner collisions, and cases where the circle center
 * is located inside the AABB.
 */
export function resolveCircleAABB(circle: Circle, box: AABB): CollisionResult {
  // Find closest point on AABB to circle center
  const clampedX = Math.max(box.minX, Math.min(circle.x, box.maxX));
  const clampedZ = Math.max(box.minZ, Math.min(circle.z, box.maxZ));

  const dx = circle.x - clampedX;
  const dz = circle.z - clampedZ;
  const distSq = dx * dx + dz * dz;

  // Check if circle center is inside or on the boundary of the AABB
  const isInside =
    circle.x >= box.minX &&
    circle.x <= box.maxX &&
    circle.z >= box.minZ &&
    circle.z <= box.maxZ;

  if (isInside) {
    const distLeft = circle.x - box.minX;
    const distRight = box.maxX - circle.x;
    const distBottom = circle.z - box.minZ;
    const distTop = box.maxZ - circle.z;

    const minDist = Math.min(distLeft, distRight, distBottom, distTop);

    let normalX = 0;
    let normalZ = 0;

    if (minDist === distLeft) {
      normalX = -1;
    } else if (minDist === distRight) {
      normalX = 1;
    } else if (minDist === distBottom) {
      normalZ = -1;
    } else {
      normalZ = 1;
    }

    return {
      collided: true,
      normalX,
      normalZ,
      depth: minDist + circle.radius,
    };
  }

  // Circle center is outside AABB
  if (distSq < circle.radius * circle.radius) {
    const dist = Math.sqrt(distSq);
    if (dist > 1e-6) {
      return {
        collided: true,
        normalX: dx / dist,
        normalZ: dz / dist,
        depth: circle.radius - dist,
      };
    } else {
      // Extremely close to boundary edge/corner
      return {
        collided: true,
        normalX: 1,
        normalZ: 0,
        depth: circle.radius,
      };
    }
  }

  return {
    collided: false,
    normalX: 0,
    normalZ: 0,
    depth: 0,
  };
}
