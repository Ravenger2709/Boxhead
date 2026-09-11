export interface GridEntry {
  id: number;
  x: number;
  z: number;
}

/**
 * 2D Spatial Partitioning Grid for fast neighborhood queries (e.g. flocking separation and radius checks).
 */
export class SpatialGrid {
  public readonly cellSize: number;
  private cells: Map<string, GridEntry[]> = new Map();
  private entriesById: Map<number, GridEntry> = new Map();

  constructor(cellSize: number = 4.0) {
    this.cellSize = cellSize > 0 ? cellSize : 4.0;
  }

  private getKey(cellX: number, cellZ: number): string {
    return `${cellX},${cellZ}`;
  }

  /**
   * Inserts an entity with given id and world position (x, z) into the corresponding cell.
   */
  public insert(id: number, x: number, z: number): void {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    const key = this.getKey(cx, cz);

    let cell = this.cells.get(key);
    if (!cell) {
      cell = [];
      this.cells.set(key, cell);
    }
    const entry: GridEntry = { id, x, z };
    cell.push(entry);
    this.entriesById.set(id, entry);
  }

  /**
   * Retrieves an entity's stored position entry by its id.
   */
  public getEntry(id: number): GridEntry | undefined {
    return this.entriesById.get(id);
  }

  /**
   * Queries unique entity IDs located within the specified radius around (x, z).
   * Checks neighbor cells covering the bounding box of the query circle and verifies Euclidean distance.
   */
  public query(x: number, z: number, radius: number): number[] {
    if (radius < 0) {
      return [];
    }

    const radiusSq = radius * radius;
    const minCellX = Math.floor((x - radius) / this.cellSize);
    const maxCellX = Math.floor((x + radius) / this.cellSize);
    const minCellZ = Math.floor((z - radius) / this.cellSize);
    const maxCellZ = Math.floor((z + radius) / this.cellSize);

    const resultSet = new Set<number>();

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cz = minCellZ; cz <= maxCellZ; cz++) {
        const key = this.getKey(cx, cz);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const entry = cell[i];
          if (resultSet.has(entry.id)) continue;

          const dx = entry.x - x;
          const dz = entry.z - z;
          if (dx * dx + dz * dz <= radiusSq) {
            resultSet.add(entry.id);
          }
        }
      }
    }

    return Array.from(resultSet);
  }

  /**
   * Queries entities located within the specified radius around (x, z), returning their full entries.
   */
  public queryNearby(x: number, z: number, radius: number): GridEntry[] {
    if (radius < 0) {
      return [];
    }

    const radiusSq = radius * radius;
    const minCellX = Math.floor((x - radius) / this.cellSize);
    const maxCellX = Math.floor((x + radius) / this.cellSize);
    const minCellZ = Math.floor((z - radius) / this.cellSize);
    const maxCellZ = Math.floor((z + radius) / this.cellSize);

    const result: GridEntry[] = [];
    const seen = new Set<number>();

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cz = minCellZ; cz <= maxCellZ; cz++) {
        const key = this.getKey(cx, cz);
        const cell = this.cells.get(key);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const entry = cell[i];
          if (seen.has(entry.id)) continue;

          const dx = entry.x - x;
          const dz = entry.z - z;
          if (dx * dx + dz * dz <= radiusSq) {
            seen.add(entry.id);
            result.push(entry);
          }
        }
      }
    }

    return result;
  }

  /**
   * Clears all entities and cells from the grid.
   */
  public clear(): void {
    this.cells.clear();
    this.entriesById.clear();
  }
}
