import { describe, it, expect } from 'vitest';
import {
  Circle,
  AABB,
  checkCircleCircle,
  resolveCircleAABB,
  pointInAABB,
} from '../../src/physics/Collision2D';

describe('Collision2D', () => {
  describe('checkCircleCircle', () => {
    it('returns false for non-overlapping circles', () => {
      const c1: Circle = { x: 0, z: 0, radius: 1 };
      const c2: Circle = { x: 5, z: 0, radius: 1 };
      expect(checkCircleCircle(c1, c2)).toBe(false);
    });

    it('returns true for overlapping circles', () => {
      const c1: Circle = { x: 0, z: 0, radius: 2 };
      const c2: Circle = { x: 3, z: 0, radius: 2 };
      expect(checkCircleCircle(c1, c2)).toBe(true);
    });

    it('returns true for touching circles', () => {
      const c1: Circle = { x: 0, z: 0, radius: 1 };
      const c2: Circle = { x: 2, z: 0, radius: 1 };
      expect(checkCircleCircle(c1, c2)).toBe(true);
    });

    it('returns true for concentric circles', () => {
      const c1: Circle = { x: 10, z: -5, radius: 1 };
      const c2: Circle = { x: 10, z: -5, radius: 3 };
      expect(checkCircleCircle(c1, c2)).toBe(true);
    });

    it('returns true for diagonal overlap', () => {
      const c1: Circle = { x: 0, z: 0, radius: 1.5 };
      const c2: Circle = { x: 1, z: 1, radius: 1.5 };
      // Distance is sqrt(2) ~ 1.414 < 3.0
      expect(checkCircleCircle(c1, c2)).toBe(true);
    });

    it('returns false for diagonally separated circles', () => {
      const c1: Circle = { x: 0, z: 0, radius: 1 };
      const c2: Circle = { x: 2, z: 2, radius: 1 };
      // Distance is sqrt(8) ~ 2.828 > 2.0
      expect(checkCircleCircle(c1, c2)).toBe(false);
    });
  });

  describe('pointInAABB', () => {
    const box: AABB = { minX: -5, maxX: 5, minZ: -3, maxZ: 3 };

    it('returns true for a point strictly inside the box', () => {
      expect(pointInAABB(0, 0, box)).toBe(true);
      expect(pointInAABB(2, 1, box)).toBe(true);
    });

    it('returns true for a point on the box boundary', () => {
      expect(pointInAABB(5, 0, box)).toBe(true);
      expect(pointInAABB(-5, 0, box)).toBe(true);
      expect(pointInAABB(0, 3, box)).toBe(true);
      expect(pointInAABB(0, -3, box)).toBe(true);
      expect(pointInAABB(5, 3, box)).toBe(true);
    });

    it('returns false for points outside the box', () => {
      expect(pointInAABB(5.1, 0, box)).toBe(false);
      expect(pointInAABB(-5.1, 0, box)).toBe(false);
      expect(pointInAABB(0, 3.1, box)).toBe(false);
      expect(pointInAABB(0, -3.1, box)).toBe(false);
      expect(pointInAABB(10, 10, box)).toBe(false);
    });
  });

  describe('resolveCircleAABB', () => {
    const box: AABB = { minX: -5, maxX: 5, minZ: -5, maxZ: 5 };

    it('returns no collision when circle is far away', () => {
      const circle: Circle = { x: 10, z: 0, radius: 2 };
      const result = resolveCircleAABB(circle, box);
      expect(result.collided).toBe(false);
      expect(result.depth).toBe(0);
      expect(result.normalX).toBe(0);
      expect(result.normalZ).toBe(0);
    });

    it('returns no collision when circle is just outside touching distance', () => {
      const circle: Circle = { x: 7.001, z: 0, radius: 2 };
      const result = resolveCircleAABB(circle, box);
      expect(result.collided).toBe(false);
      expect(result.depth).toBe(0);
    });

    it('resolves collision from the right (+X side)', () => {
      // Circle at x = 6, penetrates right edge (maxX = 5) by 1 unit (radius = 2, distance = 1)
      const circle: Circle = { x: 6, z: 0, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeCloseTo(1);
      expect(result.normalX).toBeCloseTo(1);
      expect(result.normalZ).toBeCloseTo(0);

      // Moving circle along normal * depth resolves penetration cleanly
      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedX).toBeCloseTo(7);
      expect(resolvedZ).toBeCloseTo(0);
    });

    it('resolves collision from the left (-X side)', () => {
      // Circle at x = -6, penetrates left edge (minX = -5) by 1 unit
      const circle: Circle = { x: -6, z: 0, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeCloseTo(1);
      expect(result.normalX).toBeCloseTo(-1);
      expect(result.normalZ).toBeCloseTo(0);

      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedX).toBeCloseTo(-7);
      expect(resolvedZ).toBeCloseTo(0);
    });

    it('resolves collision from the top (+Z side)', () => {
      // Circle at z = 6, penetrates top edge (maxZ = 5) by 1 unit
      const circle: Circle = { x: 0, z: 6, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeCloseTo(1);
      expect(result.normalX).toBeCloseTo(0);
      expect(result.normalZ).toBeCloseTo(1);

      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedX).toBeCloseTo(0);
      expect(resolvedZ).toBeCloseTo(7);
    });

    it('resolves collision from the bottom (-Z side)', () => {
      // Circle at z = -6, penetrates bottom edge (minZ = -5) by 1 unit
      const circle: Circle = { x: 0, z: -6, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeCloseTo(1);
      expect(result.normalX).toBeCloseTo(0);
      expect(result.normalZ).toBeCloseTo(-1);

      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedX).toBeCloseTo(0);
      expect(resolvedZ).toBeCloseTo(-7);
    });

    it('resolves corner collision cleanly with normalized diagonal normal', () => {
      // Circle at (6, 6) near corner (5, 5) with radius 2
      // dx = 1, dz = 1, distance = sqrt(2) ~ 1.4142
      // depth = 2 - sqrt(2) ~ 0.5858
      // normal = (1/sqrt(2), 1/sqrt(2)) ~ (0.7071, 0.7071)
      const circle: Circle = { x: 6, z: 6, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeCloseTo(2 - Math.SQRT2);
      expect(result.normalX).toBeCloseTo(Math.SQRT1_2);
      expect(result.normalZ).toBeCloseTo(Math.SQRT1_2);

      // Verify normal is a unit vector
      const normalLength = Math.hypot(result.normalX, result.normalZ);
      expect(normalLength).toBeCloseTo(1);

      // Verify moving circle by normal * depth puts its distance to corner at exactly radius
      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      const distToCorner = Math.hypot(resolvedX - 5, resolvedZ - 5);
      expect(distToCorner).toBeCloseTo(2);
    });

    it('resolves collision when circle center is inside the box', () => {
      // Circle at (4, 0) with radius 2 inside box [-5, 5, -5, 5]
      // Closest edge is right edge (maxX = 5) at distance 1
      // Should push circle out to the right (+X)
      // Penetration depth = (5 - 4) + 2 = 3
      const circle: Circle = { x: 4, z: 0, radius: 2 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.normalX).toBe(1);
      expect(result.normalZ).toBe(0);
      expect(result.depth).toBeCloseTo(3);

      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedX).toBeCloseTo(7);
      expect(resolvedZ).toBeCloseTo(0);
    });

    it('resolves collision when circle center is near bottom edge inside box', () => {
      // Circle at (0, -4.5) with radius 1 inside box [-5, 5, -5, 5]
      // Closest edge is bottom edge (minZ = -5) at distance 0.5
      // Normal should push circle downward (-Z): normalZ = -1
      // Depth = 0.5 + 1 = 1.5
      const circle: Circle = { x: 0, z: -4.5, radius: 1 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.normalX).toBe(0);
      expect(result.normalZ).toBe(-1);
      expect(result.depth).toBeCloseTo(1.5);

      const resolvedZ = circle.z + result.normalZ * result.depth;
      expect(resolvedZ).toBeCloseTo(-6);
    });

    it('resolves collision when circle center is at center of box', () => {
      const circle: Circle = { x: 0, z: 0, radius: 1 };
      const result = resolveCircleAABB(circle, box);

      expect(result.collided).toBe(true);
      expect(result.depth).toBeGreaterThan(0);
      // Verify normal is unit vector
      expect(Math.hypot(result.normalX, result.normalZ)).toBeCloseTo(1);

      // Verify that after resolution, circle is outside the box
      const resolvedX = circle.x + result.normalX * result.depth;
      const resolvedZ = circle.z + result.normalZ * result.depth;
      const recheck = resolveCircleAABB({ x: resolvedX, z: resolvedZ, radius: 1 }, box);
      expect(recheck.collided).toBe(false);
    });
  });
});
