import { describe, it, expect } from 'vitest';
import { NetMessageInput, NetMessagePing, NetMessagePong } from '../../src/types';

describe('Network Protocol', () => {
  it('serializes and deserializes input messages', () => {
    const inputMsg: NetMessageInput = {
      type: 'input',
      action: 'shoot',
      isDown: true,
      seq: 42,
    };

    const json = JSON.stringify(inputMsg);
    const parsed: NetMessageInput = JSON.parse(json);

    expect(parsed.type).toBe('input');
    expect(parsed.action).toBe('shoot');
    expect(parsed.isDown).toBe(true);
    expect(parsed.seq).toBe(42);
  });

  it('calculates latency correctly from ping and pong timestamps', () => {
    const sendTime = 1000.0;
    const receiveTime = 1032.5;

    const pingMsg: NetMessagePing = {
      type: 'ping',
      id: 1,
      time: sendTime,
    };

    const pongMsg: NetMessagePong = {
      type: 'pong',
      id: pingMsg.id,
      time: pingMsg.time,
    };

    const latency = Math.round(receiveTime - pongMsg.time);
    expect(latency).toBe(33);
  });
});
