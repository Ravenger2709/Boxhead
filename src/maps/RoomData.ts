import rawRooms from './rooms.json';

export interface RoomSolid {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomPoint {
  x: number;
  y: number;
}

export interface PlayerStart {
  x: number;
  y: number;
  angle?: number;
}

export interface RoomData {
  id: string;
  name: string;
  width: number;
  height: number;
  solids: RoomSolid[];
  barrels: RoomPoint[];
  walls: RoomPoint[];
  zombies: RoomPoint[];
  devils: RoomPoint[];
  pickups: RoomPoint[];
  player1: PlayerStart;
  player2: PlayerStart;
}

const rooms: RoomData[] = rawRooms as RoomData[];

/**
 * Returns all 18 authentic Boxhead 2Play rooms.
 */
export function getAllRooms(): RoomData[] {
  return rooms;
}

/**
 * Retrieves a room by its ID (e.g. 'ROOM_Single_0001') or Name (e.g. 'BOXY').
 * Case-insensitive.
 */
export function getRoom(idOrName: string): RoomData {
  if (!idOrName) {
    throw new Error('Room id or name must be specified');
  }

  const query = idOrName.trim().toLowerCase();

  const found = rooms.find(
    (r) => r.id.toLowerCase() === query || r.name.toLowerCase() === query
  );

  if (found) {
    return found;
  }

  // Fallback check by 1-based or 0-based index if numeric string
  const num = parseInt(query, 10);
  if (!isNaN(num)) {
    if (num >= 1 && num <= rooms.length) {
      return rooms[num - 1];
    }
    if (num >= 0 && num < rooms.length) {
      return rooms[num];
    }
  }

  throw new Error(`Room not found: "${idOrName}"`);
}
