import {
  RoomData,
  RoomPoint,
  getRoom,
} from './RoomData';
import { AABB, WALL_SIZE, WALL_THICKNESS } from '../core/Constants';
import { Barrel } from '../entities/Barrel';
import { FakeWall } from '../entities/FakeWall';
import type * as THREE from 'three';

export interface WorldPoint {
  x: number;
  z: number;
}

export interface PlayerWorldStart {
  x: number;
  z: number;
  angle: number;
}

export class MapManager {
  public activeRoom: RoomData;
  public cellSize: number;

  constructor(
    roomOrName: RoomData | string = 'BOXY',
    cellSize: number = WALL_SIZE
  ) {
    this.activeRoom =
      typeof roomOrName === 'string' ? getRoom(roomOrName) : roomOrName;
    this.cellSize = cellSize > 0 ? cellSize : WALL_SIZE;
  }

  /**
   * Sets the active room by RoomData object or room name/id.
   */
  public setRoom(roomOrName: RoomData | string): RoomData {
    this.activeRoom =
      typeof roomOrName === 'string' ? getRoom(roomOrName) : roomOrName;
    return this.activeRoom;
  }

  /**
   * Gets current active room.
   */
  public getActiveRoom(): RoomData {
    return this.activeRoom;
  }

  /**
   * Returns cell size used for coordinate conversions.
   */
  public getCellSize(): number {
    return this.cellSize;
  }

  /**
   * Updates cell size scaling.
   */
  public setCellSize(cellSize: number): void {
    this.cellSize = cellSize > 0 ? cellSize : WALL_SIZE;
  }

  /**
   * Total arena width in world coordinates.
   */
  public getArenaWidth(): number {
    return this.activeRoom.width * this.cellSize;
  }

  /**
   * Total arena depth in world coordinates.
   */
  public getArenaDepth(): number {
    return this.activeRoom.height * this.cellSize;
  }

  /**
   * World bounding box for the current arena floor.
   */
  public getBounds(): AABB {
    const halfW = this.getArenaWidth() / 2;
    const halfD = this.getArenaDepth() / 2;
    return {
      minX: -halfW,
      maxX: halfW,
      minZ: -halfD,
      maxZ: halfD,
    };
  }

  /**
   * Converts room grid/cell coordinates to centered 3D world coordinates (x, z).
   */
  public cellToWorld(cellX: number, cellY: number): WorldPoint {
    const halfW = this.activeRoom.width / 2;
    const halfH = this.activeRoom.height / 2;
    return {
      x: (cellX - halfW) * this.cellSize,
      z: (cellY - halfH) * this.cellSize,
    };
  }

  /**
   * Converts centered 3D world coordinates (x, z) to room grid/cell coordinates.
   */
  public worldToCell(worldX: number, worldZ: number): RoomPoint {
    const halfW = this.activeRoom.width / 2;
    const halfH = this.activeRoom.height / 2;
    return {
      x: worldX / this.cellSize + halfW,
      y: worldZ / this.cellSize + halfH,
    };
  }

  /**
   * Converts all solid rectangles in the active room to world collision AABBs.
   */
  public getSolidAABBs(): AABB[] {
    const halfW = this.activeRoom.width / 2;
    const halfH = this.activeRoom.height / 2;

    return this.activeRoom.solids.map((solid) => {
      const minX = (solid.x - halfW) * this.cellSize;
      const maxX = (solid.x + solid.width - halfW) * this.cellSize;
      const minZ = (solid.y - halfH) * this.cellSize;
      const maxZ = (solid.y + solid.height - halfH) * this.cellSize;

      return {
        minX: Math.min(minX, maxX),
        maxX: Math.max(minX, maxX),
        minZ: Math.min(minZ, maxZ),
        maxZ: Math.max(minZ, maxZ),
      };
    });
  }

  /**
   * Computes perimeter boundary walls (North, South, West, East) enclosing the arena.
   */
  public getPerimeterWallAABBs(thickness: number = WALL_THICKNESS): AABB[] {
    const halfW = this.getArenaWidth() / 2;
    const halfD = this.getArenaDepth() / 2;
    const T = thickness;

    return [
      // North Wall (-Z)
      {
        minX: -halfW - T,
        maxX: halfW + T,
        minZ: -halfD - T,
        maxZ: -halfD,
      },
      // South Wall (+Z)
      {
        minX: -halfW - T,
        maxX: halfW + T,
        minZ: halfD,
        maxZ: halfD + T,
      },
      // West Wall (-X)
      {
        minX: -halfW - T,
        maxX: -halfW,
        minZ: -halfD,
        maxZ: halfD,
      },
      // East Wall (+X)
      {
        minX: halfW,
        maxX: halfW + T,
        minZ: -halfD,
        maxZ: halfD,
      },
    ];
  }

  /**
   * Returns all collision obstacles for the active room:
   * perimeter boundary walls + interior solid rectangles.
   */
  public getObstacles(thickness: number = WALL_THICKNESS): AABB[] {
    return [...this.getPerimeterWallAABBs(thickness), ...this.getSolidAABBs()];
  }

  /**
   * Convenience alias for getObstacles.
   */
  public populateObstacles(thickness?: number): AABB[] {
    return this.getObstacles(thickness);
  }

  /**
   * Returns player start position and angle in world coordinates.
   * playerIndex: 1 for Player 1, 2 for Player 2.
   */
  public getPlayerStart(playerIndex: 1 | 2 = 1): PlayerWorldStart {
    const p = playerIndex === 2 ? this.activeRoom.player2 : this.activeRoom.player1;
    const pos = this.cellToWorld(p.x, p.y);
    return {
      x: pos.x,
      z: pos.z,
      angle: p.angle ?? 0,
    };
  }

  /**
   * Returns world coordinates for starting barrels.
   */
  public getStartingBarrels(): WorldPoint[] {
    return this.activeRoom.barrels.map((b) => this.cellToWorld(b.x, b.y));
  }

  /**
   * Alias for getStartingBarrels.
   */
  public getBarrels(): WorldPoint[] {
    return this.getStartingBarrels();
  }

  /**
   * Returns world coordinates for starting barricade walls.
   */
  public getStartingWalls(): WorldPoint[] {
    return this.activeRoom.walls.map((w) => this.cellToWorld(w.x, w.y));
  }

  /**
   * Alias for getStartingWalls.
   */
  public getWalls(): WorldPoint[] {
    return this.getStartingWalls();
  }

  /**
   * Returns world coordinates for zombie spawn portals.
   */
  public getZombieSpawnPoints(): WorldPoint[] {
    return this.activeRoom.zombies.map((z) => this.cellToWorld(z.x, z.y));
  }

  /**
   * Returns world coordinates for devil spawn portals.
   */
  public getDevilSpawnPoints(): WorldPoint[] {
    return this.activeRoom.devils.map((d) => this.cellToWorld(d.x, d.y));
  }

  /**
   * Returns world coordinates for crate/pickup spawn points.
   */
  public getCrateSpawnPoints(): WorldPoint[] {
    return this.activeRoom.pickups.map((p) => this.cellToWorld(p.x, p.y));
  }

  /**
   * Instantiates starting Barrel entities and optionally adds them to the scene.
   */
  public populateBarrels(scene?: THREE.Scene | THREE.Group): Barrel[] {
    return this.getStartingBarrels().map((pos) => {
      const barrel = new Barrel(pos.x, pos.z);
      if (scene) {
        scene.add(barrel.mesh);
      }
      return barrel;
    });
  }

  /**
   * Instantiates starting FakeWall barricade entities and optionally adds them to the scene.
   */
  public populateWalls(scene?: THREE.Scene | THREE.Group): FakeWall[] {
    return this.getStartingWalls().map((pos) => {
      const wall = new FakeWall(pos.x, pos.z);
      if (scene) {
        scene.add(wall.mesh);
      }
      return wall;
    });
  }
}
