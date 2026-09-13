export type PlayerAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'shoot'
  | 'next_weapon'
  | 'prev_weapon';

export interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
  shoot: string;
  next_weapon: string;
  prev_weapon: string;
}

export type ConnectionStatus =
  | 'disconnected'
  | 'hosting_waiting'
  | 'connecting'
  | 'connected'
  | 'error';

export interface NetMessageInput {
  type: 'input';
  action: PlayerAction;
  isDown: boolean;
  seq: number;
}

export interface NetMessagePing {
  type: 'ping';
  id: number;
  time: number;
}

export interface NetMessagePong {
  type: 'pong';
  id: number;
  time: number;
}

export type NetMessage = NetMessageInput | NetMessagePing | NetMessagePong;

export interface RoomInfo {
  roomCode: string;
  isHost: boolean;
}
