import './style.css';
import { KeyMappingManager } from './controls/KeyMapping';
import { RuffleHost } from './engine/RuffleHost';
import { NetworkManager } from './net/NetworkManager';
import { UIManager } from './ui/UIManager';
import { PlayerAction } from './types';

class BoxheadApp {
  private keyManager: KeyMappingManager;
  private ruffleHost: RuffleHost | null = null;
  private netManager: NetworkManager | null = null;
  private uiManager: UIManager;
  private viewport: HTMLElement;
  private remoteVideo: HTMLVideoElement | null = null;
  private mode: 'none' | 'solo' | 'host' | 'guest' = 'none';

  constructor() {
    this.keyManager = new KeyMappingManager();
    this.viewport = document.getElementById('game-viewport')!;

    this.uiManager = new UIManager(
      {
        onStartSolo: () => this.startSolo(),
        onHostGame: () => this.hostGame(),
        onJoinGame: (code) => this.joinGame(code),
        onDisconnect: () => this.disconnect(),
        onToggleFullscreen: () => this.toggleFullscreen(),
      },
      this.keyManager
    );

    this.setupGlobalInputHandlers();
    this.checkAutoJoinParam();
  }

  private checkAutoJoinParam(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    if (room) {
      console.log('[App] Auto-joining room from URL parameter:', room);
      // Clean up URL parameter without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
      this.joinGame(room);
    }
  }

  /**
   * Solo Mode
   */
  private async startSolo(): Promise<void> {
    this.disconnect();
    this.mode = 'solo';
    this.uiManager.setRoomCode(null);
    this.uiManager.setLatency(null);

    this.ruffleHost = new RuffleHost(this.viewport);
    try {
      await this.ruffleHost.init('/Boxhead_2Play.swf');
    } catch (err) {
      console.error('[App] Failed to start solo game:', err);
      alert('Failed to load Boxhead 2Play SWF in Ruffle: ' + err);
      this.uiManager.showLobby();
    }
  }

  /**
   * Host Online Game
   */
  private async hostGame(): Promise<string> {
    this.disconnect();
    this.mode = 'host';

    this.ruffleHost = new RuffleHost(this.viewport);
    await this.ruffleHost.init('/Boxhead_2Play.swf');

    // Allow canvas to mount before capturing stream
    await new Promise((r) => setTimeout(r, 600));
    const mediaStream = this.ruffleHost.getMediaStream();

    this.netManager = new NetworkManager({
      onStatusChange: (status, msg) => {
        console.log('[App Host] Status:', status, msg);
        if (status === 'connected') {
          this.uiManager.hideLobby();
          this.uiManager.setRoomCode(this.netManager?.getRoomCode() || '');
        } else if (status === 'disconnected' || status === 'error') {
          if (this.mode === 'host') {
            this.uiManager.setRoomCode(null);
            this.uiManager.setLatency(null);
          }
        }
      },
      onRemoteInput: (action: PlayerAction, isDown: boolean) => {
        // Guest input received -> Dispatch to Ruffle as Player 2
        if (this.ruffleHost) {
          this.ruffleHost.dispatchPlayerAction(2, action, isDown);
        }
      },
      onLatency: (latencyMs: number) => {
        this.uiManager.setLatency(latencyMs);
      },
    });

    const roomCode = await this.netManager.hostRoom(mediaStream);
    this.uiManager.setRoomCode(roomCode);
    return roomCode;
  }

  /**
   * Join Online Game
   */
  private async joinGame(rawCode: string): Promise<void> {
    this.disconnect();
    this.mode = 'guest';

    this.viewport.innerHTML = '';
    this.remoteVideo = document.createElement('video');
    this.remoteVideo.id = 'remote-game-stream';
    this.remoteVideo.autoplay = true;
    this.remoteVideo.playsInline = true;
    this.viewport.appendChild(this.remoteVideo);

    this.netManager = new NetworkManager({
      onStatusChange: (status, msg) => {
        console.log('[App Guest] Status:', status, msg);
        if (status === 'connected') {
          this.uiManager.hideLobby();
          this.uiManager.setRoomCode(this.netManager?.getRoomCode() || '');
        } else if (status === 'disconnected' || status === 'error') {
          if (this.mode === 'guest') {
            this.uiManager.setRoomCode(null);
            this.uiManager.setLatency(null);
            alert('Disconnected from Host: ' + (msg || 'Connection lost'));
            this.uiManager.showLobby();
          }
        }
      },
      onRemoteStream: (stream: MediaStream) => {
        console.log('[App Guest] Received remote media stream, attaching to video element...');
        if (this.remoteVideo) {
          this.remoteVideo.srcObject = stream;
          this.remoteVideo.play().catch((err) => {
            console.warn('[App Guest] Autoplay blocked, will play on next click:', err);
            window.addEventListener(
              'click',
              () => {
                this.remoteVideo?.play().catch(console.error);
              },
              { once: true }
            );
          });
        }
      },
      onLatency: (latencyMs: number) => {
        this.uiManager.setLatency(latencyMs);
      },
    });

    await this.netManager.joinRoom(rawCode);
  }

  private disconnect(): void {
    if (this.netManager) {
      this.netManager.cleanup();
      this.netManager = null;
    }
    if (this.ruffleHost) {
      this.ruffleHost.destroy();
      this.ruffleHost = null;
    }
    if (this.remoteVideo) {
      this.remoteVideo.srcObject = null;
      this.remoteVideo.remove();
      this.remoteVideo = null;
    }
    this.viewport.innerHTML = '';
    this.mode = 'none';
    this.uiManager.setRoomCode(null);
    this.uiManager.setLatency(null);
  }

  private setupGlobalInputHandlers(): void {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      // Ignore synthetic events generated by our own wrapper
      if ((e as any).__bh_synthetic) return;

      // Ignore when typing into text inputs
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (this.mode === 'guest') {
        // Guest mode: map pressed key according to Player 2 bindings and transmit
        const p2Bindings = this.keyManager.getP2Bindings();
        const action = this.keyManager.getActionForCode(e.code, p2Bindings);
        if (action) {
          e.preventDefault();
          // stopImmediatePropagation prevents other window listeners (e.g. Ruffle)
          // from receiving this raw event. We send it over the network instead.
          e.stopImmediatePropagation();
          this.netManager?.sendInput(action, isDown);
        }
      } else if (this.mode === 'host' || this.mode === 'solo') {
        // Host or Solo mode: map pressed key according to Player 1 bindings
        const p1Bindings = this.keyManager.getP1Bindings();
        const action = this.keyManager.getActionForCode(e.code, p1Bindings);
        if (action && this.ruffleHost) {
          e.preventDefault();
          // stopImmediatePropagation prevents the original key (e.g. 'w') from
          // reaching Ruffle's keydown listener on window, which would otherwise
          // trigger Flash's Player 2 bindings while we re-dispatch the correct
          // Player 1 Flash key (e.g. ArrowUp) as a synthetic event below.
          e.stopImmediatePropagation();
          this.ruffleHost.dispatchPlayerAction(1, action, isDown);
        }
      }
    };

    // Use capture phase so our handler fires before Ruffle's bubble-phase
    // listener on window, guaranteeing stopImmediatePropagation works.
    window.addEventListener('keydown', (e) => handleKey(e, true), { capture: true });
    window.addEventListener('keyup', (e) => handleKey(e, false), { capture: true });
  }

  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  }
}

// Start application when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BoxheadApp());
  } else {
    new BoxheadApp();
  }
}
