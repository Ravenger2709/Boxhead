import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { ConnectionStatus, NetMessage, PlayerAction } from '../types';

export interface NetworkCallbacks {
  onStatusChange: (status: ConnectionStatus, message?: string) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onRemoteInput?: (action: PlayerAction, isDown: boolean) => void;
  onLatency?: (latencyMs: number) => void;
}

export class NetworkManager {
  private peer: Peer | null = null;
  private dataConn: DataConnection | null = null;
  private mediaCall: MediaConnection | null = null;
  private callbacks: NetworkCallbacks;
  private isHost: boolean = false;
  private roomCode: string = '';
  private pingInterval: number | null = null;
  private pingSeq: number = 0;
  private localStream: MediaStream | null = null;

  constructor(callbacks: NetworkCallbacks) {
    this.callbacks = callbacks;
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public isConnected(): boolean {
    return this.dataConn?.open === true;
  }

  /**
   * Host starts a room and waits for a guest to connect
   */
  public async hostRoom(localStream: MediaStream | null): Promise<string> {
    this.cleanup();
    this.isHost = true;
    this.localStream = localStream;

    const shortCode = this.generateRoomCode();
    this.roomCode = shortCode;
    const peerId = `bh2play-${shortCode.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      this.callbacks.onStatusChange('hosting_waiting', shortCode);

      this.peer = new Peer(peerId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
          ],
        },
      });

      this.peer.on('open', (id) => {
        console.log('[Network] Peer opened with ID:', id);
        resolve(shortCode);
      });

      this.peer.on('connection', (conn) => {
        console.log('[Network] Incoming data connection from:', conn.peer);
        this.setupDataConnection(conn);

        // Send media stream to connecting guest if available
        if (this.localStream && this.peer) {
          console.log('[Network] Calling guest with local media stream...');
          const call = this.peer.call(conn.peer, this.localStream);
          this.mediaCall = call;
          call.on('error', (err) => console.error('[Network] Media call error:', err));
        }
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Peer error:', err);
        this.callbacks.onStatusChange('error', err.message);
        reject(err);
      });

      this.peer.on('disconnected', () => {
        this.callbacks.onStatusChange('disconnected', 'Disconnected from signaling server.');
      });
    });
  }

  /**
   * Guest joins an existing room by code
   */
  public async joinRoom(rawCode: string): Promise<void> {
    this.cleanup();
    this.isHost = false;
    const sanitized = rawCode.trim().toUpperCase().replace(/^BH2-/, '').replace(/^BH-/, '');
    this.roomCode = sanitized;
    const targetPeerId = `bh2play-${sanitized.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      this.callbacks.onStatusChange('connecting', `Connecting to room ${sanitized}...`);

      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
          ],
        },
      });

      this.peer.on('open', () => {
        console.log('[Network] Guest peer ready. Connecting to host:', targetPeerId);
        const conn = this.peer!.connect(targetPeerId, { reliable: true });
        this.setupDataConnection(conn);
        resolve();
      });

      // Listen for incoming media call from Host
      this.peer.on('call', (call) => {
        console.log('[Network] Received media call from host.');
        this.mediaCall = call;
        call.answer(); // Guest receives stream
        call.on('stream', (remoteStream) => {
          console.log('[Network] Received remote stream tracks:', remoteStream.getTracks().length);
          if (this.callbacks.onRemoteStream) {
            this.callbacks.onRemoteStream(remoteStream);
          }
        });
        call.on('error', (err) => console.error('[Network] Media stream error:', err));
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Guest peer error:', err);
        this.callbacks.onStatusChange('error', 'Failed to connect: ' + err.message);
        reject(err);
      });
    });
  }

  private setupDataConnection(conn: DataConnection): void {
    this.dataConn = conn;

    conn.on('open', () => {
      console.log('[Network] Data channel connected!');
      this.callbacks.onStatusChange('connected', this.roomCode);
      this.startPingLoop();
    });

    conn.on('data', (data: any) => {
      const msg = data as NetMessage;
      if (!msg || !msg.type) return;

      if (msg.type === 'input') {
        if (this.callbacks.onRemoteInput) {
          this.callbacks.onRemoteInput(msg.action, msg.isDown);
        }
      } else if (msg.type === 'ping') {
        // Echo pong back immediately
        conn.send({ type: 'pong', id: msg.id, time: msg.time });
      } else if (msg.type === 'pong') {
        const latency = Math.max(1, Math.round(performance.now() - msg.time));
        if (this.callbacks.onLatency) {
          this.callbacks.onLatency(latency);
        }
      }
    });

    conn.on('close', () => {
      console.log('[Network] Data channel closed.');
      this.callbacks.onStatusChange('disconnected', 'Peer disconnected.');
      this.stopPingLoop();
    });

    conn.on('error', (err) => {
      console.error('[Network] Data connection error:', err);
      this.callbacks.onStatusChange('error', err.message);
    });
  }

  public sendInput(action: PlayerAction, isDown: boolean): void {
    if (this.dataConn && this.dataConn.open) {
      this.dataConn.send({
        type: 'input',
        action,
        isDown,
        seq: ++this.pingSeq,
      });
    }
  }

  private startPingLoop(): void {
    this.stopPingLoop();
    this.pingInterval = window.setInterval(() => {
      if (this.dataConn && this.dataConn.open) {
        this.dataConn.send({
          type: 'ping',
          id: ++this.pingSeq,
          time: performance.now(),
        });
      }
    }, 1500);
  }

  private stopPingLoop(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public cleanup(): void {
    this.stopPingLoop();
    if (this.mediaCall) {
      this.mediaCall.close();
      this.mediaCall = null;
    }
    if (this.dataConn) {
      this.dataConn.close();
      this.dataConn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
    this.roomCode = '';
  }
}
