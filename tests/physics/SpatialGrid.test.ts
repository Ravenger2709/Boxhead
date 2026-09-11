import { describe, it, expect } from 'vitest';
import { SpatialGrid } from '../../src/physics/SpatialGrid';

describe('SpatialGrid', () => {
  it('initializes with default cell size of 4.0', () => {
    const grid = new SpatialGrid();
    expect(grid.cellSize).toBe(4.0);
  });

  it('accepts a custom cell size', () => {
    const grid = new SpatialGrid(8.0);
    expect(grid.cellSize).toBe(8.0);
  });

  it('inserts an entity and finds it when querying within radius', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, 10, 10);

    const results = grid.query(10, 10, 2);
    expect(results).toEqual([1]);
  });

  it('does not return entity when query radius does not reach it', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, 10, 10);

    const results = grid.query(10, 15, 2); // distance is 5 > 2
    expect(results).toEqual([]);
  });

  it('queries entities across adjacent cells within radius', () => {
    // Cell boundaries for size 4: [0, 4), [4, 8)
    const grid = new SpatialGrid(4.0);
    // Entity 1 at (3.5, 2.0) -> cell (0, 0)
    grid.insert(1, 3.5, 2.0);
    // Entity 2 at (4.5, 2.0) -> cell (1, 0)
    grid.insert(2, 4.5, 2.0);
    // Entity 3 at (10.0, 2.0) -> cell (2, 0)
    grid.insert(3, 10.0, 2.0);

    // Query from (3.8, 2.0) with radius 1.5
    // Distance to 1: 0.3 <= 1.5 -> IN
    // Distance to 2: 0.7 <= 1.5 -> IN
    // Distance to 3: 6.2 > 1.5 -> OUT
    const results = grid.query(3.8, 2.0, 1.5);
    expect(results).toHaveLength(2);
    expect(results).toContain(1);
    expect(results).toContain(2);
    expect(results).not.toContain(3);
  });

  it('filters out entities in neighbor cells that exceed radial distance (Euclidean check)', () => {
    const grid = new SpatialGrid(4.0);
    // Entity 1 is at (3, 3) in cell (0, 0)
    grid.insert(1, 3, 3);
    // Entity 2 is at (5, 5) in cell (1, 1) - neighbor cell!
    // Distance from (2, 2) to (5, 5) is sqrt((5-2)^2 + (5-2)^2) = sqrt(18) ~ 4.24
    grid.insert(2, 5, 5);

    // Query at (2, 2) with radius 3.5
    // Cell (1, 1) will be checked as a neighbor cell, but entity 2 distance is ~4.24 > 3.5
    const results = grid.query(2, 2, 3.5);
    expect(results).toContain(1);
    expect(results).not.toContain(2);
  });

  it('returns unique IDs when multiple items share IDs or locations', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(42, 1, 1);
    grid.insert(42, 1, 1);

    const results = grid.query(1, 1, 2);
    expect(results).toEqual([42]);
  });

  it('correctly handles negative coordinates across quadrants', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, -15, -15);
    grid.insert(2, -14, -14);
    grid.insert(3, 15, 15);

    // Distance between (-15, -15) and (-14, -14) is sqrt(2) ~ 1.414 <= 2
    const results = grid.query(-15, -15, 2);
    expect(results).toHaveLength(2);
    expect(results).toContain(1);
    expect(results).toContain(2);
    expect(results).not.toContain(3);
  });

  it('clears all entities on clear()', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, 0, 0);
    grid.insert(2, 5, 5);
    grid.insert(3, -5, -5);

    expect(grid.query(0, 0, 10)).toHaveLength(3);

    grid.clear();

    expect(grid.query(0, 0, 10)).toEqual([]);
    expect(grid.query(5, 5, 10)).toEqual([]);
  });

  it('can be reused after clear()', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, 0, 0);
    grid.clear();

    grid.insert(99, 2, 2);
    const results = grid.query(2, 2, 1);
    expect(results).toEqual([99]);
  });

  it('returns empty array when querying with negative radius', () => {
    const grid = new SpatialGrid(4.0);
    grid.insert(1, 0, 0);
    expect(grid.query(0, 0, -1)).toEqual([]);
  });
});
