import { describe, it, expect, beforeEach } from 'vitest';
import { getAllRooms, getRoom } from '../../src/maps/RoomData';
import { MapManager } from '../../src/maps/MapManager';
import { SceneManager } from '../../src/render/Scene';
import { Game } from '../../src/core/Game';
import { WALL_SIZE, WALL_THICKNESS } from '../../src/core/Constants';

describe('Map System & MapManager', () => {
  describe('RoomData loading and verification', () => {
    it('should load all 18 authentic Boxhead 2Play rooms', () => {
      const rooms = getAllRooms();
      expect(rooms).toHaveLength(18);

      const expectedNames = [
        'BOXY',
        'MAZEY',
        'GLADIATOR',
        'STRIP',
        'TIGHT',
        'COLUMNS',
        'CASTLE',
        'BIG BOXY',
        'RECTY',
        'PATCHY',
        'FOREST BOX',
        'TIGHT 2',
        'MASSIVE',
        'THIN LINE',
        '4 CASTLES',
        'THE STRIPS',
        'BIG ONE',
        'ROOM 18',
      ];

      expect(rooms.map((r) => r.name)).toEqual(expectedNames);
    });

    it('should verify every room has valid IDs, dimensions, and entity arrays', () => {
      const rooms = getAllRooms();
      rooms.forEach((room, index) => {
        const expectedId = `ROOM_Single_${String(index + 1).padStart(4, '0')}`;
        expect(room.id).toBe(expectedId);
        expect(room.name.length).toBeGreaterThan(0);
        expect(room.width).toBeGreaterThan(0);
        expect(room.height).toBeGreaterThan(0);
        expect(Array.isArray(room.solids)).toBe(true);
        expect(Array.isArray(room.barrels)).toBe(true);
        expect(Array.isArray(room.walls)).toBe(true);
        expect(Array.isArray(room.zombies)).toBe(true);
        expect(Array.isArray(room.devils)).toBe(true);
        expect(Array.isArray(room.pickups)).toBe(true);
        expect(room.player1).toBeDefined();
        expect(typeof room.player1.x).toBe('number');
        expect(typeof room.player1.y).toBe('number');
        expect(room.player2).toBeDefined();
      });
    });

    it('should look up room by name case-insensitively', () => {
      const boxy = getRoom('BOXY');
      expect(boxy.id).toBe('ROOM_Single_0001');

      const boxyLower = getRoom('boxy');
      expect(boxyLower.id).toBe('ROOM_Single_0001');

      const columns = getRoom('columns');
      expect(columns.name).toBe('COLUMNS');
      expect(columns.width).toBe(22);
      expect(columns.height).toBe(41);

      const room18 = getRoom('ROOM 18');
      expect(room18.id).toBe('ROOM_Single_0018');
    });

    it('should look up room by ID', () => {
      const room = getRoom('ROOM_Single_0007');
      expect(room.name).toBe('CASTLE');
    });

    it('should throw descriptive error for non-existent room', () => {
      expect(() => getRoom('NON_EXISTENT_ROOM')).toThrow(/Room not found/);
    });
  });

  describe('MapManager Bounds & Coordinate Transformations', () => {
    let mapManager: MapManager;

    beforeEach(() => {
      mapManager = new MapManager('BOXY');
    });

    it('should default to BOXY room and WALL_SIZE cell size', () => {
      expect(mapManager.activeRoom.name).toBe('BOXY');
      expect(mapManager.cellSize).toBe(WALL_SIZE);
      expect(mapManager.getArenaWidth()).toBe(22);
      expect(mapManager.getArenaDepth()).toBe(17);
    });

    it('should calculate correct centered arena bounds for BOXY', () => {
      const bounds = mapManager.getBounds();
      expect(bounds.minX).toBeCloseTo(-11);
      expect(bounds.maxX).toBeCloseTo(11);
      expect(bounds.minZ).toBeCloseTo(-8.5);
      expect(bounds.maxZ).toBeCloseTo(8.5);
    });

    it('should update bounds when switching to COLUMNS (22x41)', () => {
      mapManager.setRoom('COLUMNS');
      expect(mapManager.getArenaWidth()).toBe(22);
      expect(mapManager.getArenaDepth()).toBe(41);

      const bounds = mapManager.getBounds();
      expect(bounds.minX).toBeCloseTo(-11);
      expect(bounds.maxX).toBeCloseTo(11);
      expect(bounds.minZ).toBeCloseTo(-20.5);
      expect(bounds.maxZ).toBeCloseTo(20.5);
    });

    it('should update bounds when switching to ROOM 18 (87x87)', () => {
      mapManager.setRoom('ROOM 18');
      expect(mapManager.getArenaWidth()).toBe(87);
      expect(mapManager.getArenaDepth()).toBe(87);

      const bounds = mapManager.getBounds();
      expect(bounds.minX).toBeCloseTo(-43.5);
      expect(bounds.maxX).toBeCloseTo(43.5);
      expect(bounds.minZ).toBeCloseTo(-43.5);
      expect(bounds.maxZ).toBeCloseTo(43.5);
    });

    it('should correctly transform cell coordinates to centered world coordinates and back', () => {
      mapManager.setRoom('BOXY'); // width 22, height 17
      // Center cell: (11, 8.5) -> (0, 0)
      const centerWorld = mapManager.cellToWorld(11, 8.5);
      expect(centerWorld.x).toBeCloseTo(0);
      expect(centerWorld.z).toBeCloseTo(0);

      const centerCell = mapManager.worldToCell(0, 0);
      expect(centerCell.x).toBeCloseTo(11);
      expect(centerCell.y).toBeCloseTo(8.5);

      // Top-left cell: (0, 0) -> (-11, -8.5)
      const topLeftWorld = mapManager.cellToWorld(0, 0);
      expect(topLeftWorld.x).toBeCloseTo(-11);
      expect(topLeftWorld.z).toBeCloseTo(-8.5);

      // Bottom-right cell: (22, 17) -> (11, 8.5)
      const bottomRightWorld = mapManager.cellToWorld(22, 17);
      expect(bottomRightWorld.x).toBeCloseTo(11);
      expect(bottomRightWorld.z).toBeCloseTo(8.5);
    });

    it('should scale dimensions and coordinates proportionally when cellSize changes', () => {
      mapManager.setCellSize(2.0);
      expect(mapManager.getCellSize()).toBe(2.0);
      expect(mapManager.getArenaWidth()).toBe(44);
      expect(mapManager.getArenaDepth()).toBe(34);

      const bounds = mapManager.getBounds();
      expect(bounds.minX).toBeCloseTo(-22);
      expect(bounds.maxX).toBeCloseTo(22);
      expect(bounds.minZ).toBeCloseTo(-17);
      expect(bounds.maxZ).toBeCloseTo(17);
    });
  });

  describe('Solid Rectangles & Collision AABBs', () => {
    let mapManager: MapManager;

    beforeEach(() => {
      mapManager = new MapManager('BOXY');
    });

    it('should convert all solid rectangles to valid world collision AABBs', () => {
      const solids = mapManager.getSolidAABBs();
      expect(solids).toHaveLength(12);

      solids.forEach((box) => {
        expect(box.minX).toBeLessThan(box.maxX);
        expect(box.minZ).toBeLessThan(box.maxZ);
      });
    });

    it('should compute exact world coordinates for a specific solid rectangle in BOXY', () => {
      // First solid in BOXY: { x: 8.0, y: 1.0, width: 2.0, height: 2.0 }
      // Centered: width 22, height 17 -> halfW 11, halfD 8.5
      // minX = 8 - 11 = -3, maxX = 10 - 11 = -1
      // minZ = 1 - 8.5 = -7.5, maxZ = 3 - 8.5 = -5.5
      const solids = mapManager.getSolidAABBs();
      const firstSolid = solids[0];
      expect(firstSolid.minX).toBeCloseTo(-3);
      expect(firstSolid.maxX).toBeCloseTo(-1);
      expect(firstSolid.minZ).toBeCloseTo(-7.5);
      expect(firstSolid.maxZ).toBeCloseTo(-5.5);
    });

    it('should compute perimeter boundary wall AABBs surrounding the room', () => {
      const perimeter = mapManager.getPerimeterWallAABBs(WALL_THICKNESS);
      expect(perimeter).toHaveLength(4);

      const [north, south, west, east] = perimeter;
      // North: maxZ == -halfD = -8.5
      expect(north.maxZ).toBeCloseTo(-8.5);
      expect(north.minZ).toBeCloseTo(-8.5 - WALL_THICKNESS);

      // South: minZ == halfD = 8.5
      expect(south.minZ).toBeCloseTo(8.5);
      expect(south.maxZ).toBeCloseTo(8.5 + WALL_THICKNESS);

      // West: maxX == -halfW = -11
      expect(west.maxX).toBeCloseTo(-11);
      expect(west.minX).toBeCloseTo(-11 - WALL_THICKNESS);

      // East: minX == halfW = 11
      expect(east.minX).toBeCloseTo(11);
      expect(east.maxX).toBeCloseTo(11 + WALL_THICKNESS);
    });

    it('should return total obstacles combining perimeter walls and interior solids', () => {
      // 4 perimeter walls + 12 solids = 16 obstacles
      const obstacles = mapManager.getObstacles();
      expect(obstacles).toHaveLength(16);
    });

    it('should retrieve solid counts for other complex rooms', () => {
      mapManager.setRoom('COLUMNS');
      expect(mapManager.getSolidAABBs()).toHaveLength(34);

      mapManager.setRoom('MASSIVE');
      expect(mapManager.getSolidAABBs()).toHaveLength(199);

      mapManager.setRoom('GLADIATOR');
      expect(mapManager.getSolidAABBs()).toHaveLength(67);
    });
  });

  describe('Spawn Point Retrieval for Multiple Rooms', () => {
    let mapManager: MapManager;

    beforeEach(() => {
      mapManager = new MapManager('BOXY');
    });

    it('should retrieve player 1 and player 2 start positions in world coordinates', () => {
      // BOXY player1: { x: 8.53, y: 8.47, angle: 0.0 }
      const p1 = mapManager.getPlayerStart(1);
      expect(p1.x).toBeCloseTo(8.53 - 11);
      expect(p1.z).toBeCloseTo(8.47 - 8.5);
      expect(p1.angle).toBe(0.0);

      // BOXY player2: { x: 11.0, y: 4.0, angle: -1.571 }
      const p2 = mapManager.getPlayerStart(2);
      expect(p2.x).toBeCloseTo(11.0 - 11);
      expect(p2.z).toBeCloseTo(4.0 - 8.5);
      expect(p2.angle).toBeCloseTo(-1.571);
    });

    it('should retrieve starting barrels for rooms that have them', () => {
      const boxyBarrels = mapManager.getStartingBarrels();
      expect(boxyBarrels).toHaveLength(12);

      mapManager.setRoom('STRIP');
      expect(mapManager.getStartingBarrels()).toHaveLength(20);

      mapManager.setRoom('TIGHT 2');
      expect(mapManager.getStartingBarrels()).toHaveLength(0);

      mapManager.setRoom('THE STRIPS');
      expect(mapManager.getStartingBarrels()).toHaveLength(32);
    });

    it('should retrieve starting barricade walls for rooms that have them', () => {
      expect(mapManager.getStartingWalls()).toHaveLength(0); // BOXY has 0 walls

      mapManager.setRoom('GLADIATOR');
      expect(mapManager.getStartingWalls()).toHaveLength(12);

      mapManager.setRoom('THIN LINE');
      expect(mapManager.getStartingWalls()).toHaveLength(87);

      mapManager.setRoom('CASTLE');
      expect(mapManager.getStartingWalls()).toHaveLength(12);
    });

    it('should retrieve zombie spawn portals for multiple rooms', () => {
      expect(mapManager.getZombieSpawnPoints()).toHaveLength(4); // BOXY

      mapManager.setRoom('MAZEY');
      expect(mapManager.getZombieSpawnPoints()).toHaveLength(32);

      mapManager.setRoom('THIN LINE');
      expect(mapManager.getZombieSpawnPoints()).toHaveLength(50);

      mapManager.setRoom('ROOM 18');
      expect(mapManager.getZombieSpawnPoints()).toHaveLength(164);
    });

    it('should retrieve devil spawn portals for multiple rooms', () => {
      expect(mapManager.getDevilSpawnPoints()).toHaveLength(4); // BOXY

      mapManager.setRoom('FOREST BOX');
      expect(mapManager.getDevilSpawnPoints()).toHaveLength(13);

      mapManager.setRoom('THE STRIPS');
      expect(mapManager.getDevilSpawnPoints()).toHaveLength(20);

      mapManager.setRoom('CASTLE');
      expect(mapManager.getDevilSpawnPoints()).toHaveLength(6);
    });

    it('should retrieve crate/pickup spawn locations', () => {
      expect(mapManager.getCrateSpawnPoints()).toHaveLength(2); // BOXY

      mapManager.setRoom('RECTY');
      expect(mapManager.getCrateSpawnPoints()).toHaveLength(18);

      mapManager.setRoom('THIN LINE');
      expect(mapManager.getCrateSpawnPoints()).toHaveLength(20);

      mapManager.setRoom('4 CASTLES');
      expect(mapManager.getCrateSpawnPoints()).toHaveLength(10);
    });

    it('should populate Barrel and FakeWall entities in world coordinates', () => {
      mapManager.setRoom('BOXY');
      const barrels = mapManager.populateBarrels();
      expect(barrels).toHaveLength(12);
      expect(barrels[0].alive).toBe(true);

      mapManager.setRoom('GLADIATOR');
      const walls = mapManager.populateWalls();
      expect(walls).toHaveLength(12);
      expect(walls[0].alive).toBe(true);
      expect(walls[0].hp).toBe(150);
    });
  });

  describe('Integration with SceneManager and Game', () => {
    it('should load room in SceneManager, resizing floor and adding solids', () => {
      const sceneManager = new SceneManager();
      sceneManager.loadRoom('BOXY');

      expect(sceneManager.currentRoom?.name).toBe('BOXY');
      // 4 perimeter walls + 12 solids = 16
      expect(sceneManager.walls).toHaveLength(16);

      // Verify blood canvas dimensions
      expect(sceneManager.bloodCanvas.arenaWidth).toBe(22);
      expect(sceneManager.bloodCanvas.arenaDepth).toBe(17);

      // Load another room
      sceneManager.loadRoom('COLUMNS');
      expect(sceneManager.currentRoom?.name).toBe('COLUMNS');
      // 4 perimeter walls + 34 solids = 38
      expect(sceneManager.walls).toHaveLength(38);
      expect(sceneManager.bloodCanvas.arenaWidth).toBe(22);
      expect(sceneManager.bloodCanvas.arenaDepth).toBe(41);
    });

    it('should switch active room in Game via loadRoom()', () => {
      const game = new Game({ autoStart: false });

      // Initially default
      expect(game.mapManager.activeRoom.name).toBe('BOXY');

      // Load MAZEY
      game.loadRoom('MAZEY');
      expect(game.mapManager.activeRoom.name).toBe('MAZEY');
      expect(game.sceneManager.currentRoom?.name).toBe('MAZEY');

      // Check player positioned at MAZEY player 1 start
      const mazeyP1 = game.mapManager.getPlayerStart(1);
      expect(game.player.pos.x).toBeCloseTo(mazeyP1.x);
      expect(game.player.pos.z).toBeCloseTo(mazeyP1.z);

      // Barrels for MAZEY
      expect(game.barrels).toHaveLength(12);

      // Load GLADIATOR
      game.loadRoom('GLADIATOR');
      expect(game.mapManager.activeRoom.name).toBe('GLADIATOR');
      expect(game.barrels).toHaveLength(6);
      expect(game.fakeWalls).toHaveLength(12);

      game.dispose();
    });

    it('should allow initial room specification via GameOptions', () => {
      const game = new Game({ autoStart: false, room: 'COLUMNS' });
      expect(game.mapManager.activeRoom.name).toBe('COLUMNS');
      expect(game.sceneManager.currentRoom?.name).toBe('COLUMNS');
      expect(game.sceneManager.walls).toHaveLength(38);
      game.dispose();
    });

    it('should update HUD when room is selected', () => {
      const game = new Game({ autoStart: false });
      expect(game.hud.roomSelectEl).toBeDefined();

      game.loadRoom('CASTLE');
      expect(game.hud.roomSelectEl?.value).toBe('CASTLE');

      game.dispose();
    });
  });
});
