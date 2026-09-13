import { FLASH_P1_KEYS, FLASH_P2_KEYS, FlashKeyDetails } from '../controls/KeyMapping';
import { PlayerAction } from '../types';

export class RuffleHost {
  private container: HTMLElement;
  private player: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private mediaStream: MediaStream | null = null;
  private audioStreamDest: MediaStreamAudioDestinationNode | null = null;
  private audioTapped: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupAudioInterception();
  }

  /**
   * Intercept Web Audio API connections so all Ruffle game sounds
   * are duplicated into a MediaStream for WebRTC transmission.
   */
  private setupAudioInterception(): void {
    if (this.audioTapped) return;
    this.audioTapped = true;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const self = this;
    const origConnect = AudioNode.prototype.connect;

    AudioNode.prototype.connect = function (destination: any, ...args: any[]): any {
      const result = (origConnect as any).apply(this, [destination, ...args]);
      try {
        if (
          destination &&
          destination === destination.context?.destination &&
          self.audioStreamDest &&
          self.audioStreamDest.context === destination.context
        ) {
          (origConnect as any).apply(this, [self.audioStreamDest, ...args]);
        }
      } catch (err) {
        // Fallback gracefully if node connection duplicate fails
      }
      return result;
    };
  }

  public async init(swfUrl: string = '/Boxhead_2Play.swf'): Promise<void> {
    this.container.innerHTML = '';

    // Wait for Ruffle script if needed
    if (!(window as any).RufflePlayer) {
      await this.loadRuffleScript();
    }

    const ruffle = (window as any).RufflePlayer?.newest();
    if (!ruffle) {
      throw new Error('Ruffle WebAssembly player failed to load.');
    }

    this.player = ruffle.createPlayer();
    this.player.style.width = '100%';
    this.player.style.height = '100%';
    this.player.id = 'ruffle-game-player';
    this.container.appendChild(this.player);

    await this.player.load({
      url: swfUrl,
      autoplay: 'on',
      letterbox: 'on',
      quality: 'high',
      scale: 'showAll',
      allowScriptAccess: true,
      openInNewTab: false,
    });

    // Poll for inner canvas
    await this.resolveCanvas();
  }

  private loadRuffleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/ruffle/ruffle.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(new Error('Could not load Ruffle script: ' + e));
      document.head.appendChild(script);
    });
  }

  private async resolveCanvas(): Promise<void> {
    for (let i = 0; i < 60; i++) {
      const c =
        this.player.shadowRoot?.querySelector('canvas') ||
        this.player.querySelector('canvas') ||
        this.container.querySelector('canvas');
      if (c) {
        this.canvas = c as HTMLCanvasElement;
        return;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  /**
   * Capture 60fps video + game audio into a MediaStream for WebRTC
   */
  public getMediaStream(): MediaStream | null {
    if (this.mediaStream) {
      return this.mediaStream;
    }

    if (!this.canvas && this.player) {
      this.canvas =
        this.player.shadowRoot?.querySelector('canvas') ||
        this.player.querySelector('canvas');
    }

    if (!this.canvas) {
      console.warn('[RuffleHost] Canvas not found yet for captureStream.');
      return null;
    }

    try {
      const videoStream = (this.canvas as any).captureStream
        ? (this.canvas as any).captureStream(60)
        : null;

      if (!videoStream) {
        console.warn('[RuffleHost] captureStream not supported on canvas.');
        return null;
      }

      this.mediaStream = new MediaStream();
      videoStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        this.mediaStream?.addTrack(track);
      });

      // Try hooking audio context if present
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        // Look for existing audio contexts
        // Create an audio stream destination if not created
        const dummyCtx = new AudioCtx();
        this.audioStreamDest = dummyCtx.createMediaStreamDestination();
        this.audioStreamDest.stream.getAudioTracks().forEach((track) => {
          this.mediaStream?.addTrack(track);
        });
      }

      return this.mediaStream;
    } catch (err) {
      console.error('[RuffleHost] Error creating MediaStream:', err);
      return null;
    }
  }

  /**
   * Dispatch action to Player 1 or Player 2 in Ruffle
   */
  public dispatchPlayerAction(playerNum: 1 | 2, action: PlayerAction, isDown: boolean): void {
    const keyMap = playerNum === 1 ? FLASH_P1_KEYS : FLASH_P2_KEYS;
    const details = keyMap[action];
    if (!details) return;

    this.sendKeyEvent(details, isDown);
  }

  public sendKeyEvent(details: FlashKeyDetails, isDown: boolean): void {
    const eventType = isDown ? 'keydown' : 'keyup';
    const evt = new KeyboardEvent(eventType, {
      key: details.key,
      code: details.code,
      keyCode: details.keyCode,
      which: details.keyCode,
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    Object.defineProperty(evt, 'keyCode', { get: () => details.keyCode });
    Object.defineProperty(evt, 'which', { get: () => details.keyCode });
    (evt as any).__bh_synthetic = true;

    // Ruffle registers its keydown/keyup listener on window (bubble phase).
    // Dispatching directly to window is sufficient—dispatching to canvas and
    // shadowRoot too would cause Ruffle to fire AVM1's onKeyDown multiple times.
    window.dispatchEvent(evt);
  }

  public destroy(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.player) {
      this.player.remove();
      this.player = null;
    }
    this.canvas = null;
  }
}
