import { KeyBindings, PlayerAction } from '../types';
import { KeyMappingManager, WASD_BINDINGS, ARROWS_BINDINGS } from '../controls/KeyMapping';

export interface UICallbacks {
  onStartSolo: () => void;
  onHostGame: () => Promise<string>;
  onJoinGame: (code: string) => Promise<void>;
  onDisconnect: () => void;
  onToggleFullscreen: () => void;
}

export class UIManager {
  private callbacks: UICallbacks;
  private keyManager: KeyMappingManager;

  // DOM Elements
  private lobbyOverlay!: HTMLElement;
  private headerBar!: HTMLElement;
  private roomCodeBadge!: HTMLElement;
  private latencyBadge!: HTMLElement;
  private controlsModal!: HTMLElement;
  private hostSection!: HTMLElement;
  private joinSection!: HTMLElement;

  private activeListeningBtn: HTMLButtonElement | null = null;
  private activeListeningAction: { player: 1 | 2; action: PlayerAction } | null = null;

  constructor(callbacks: UICallbacks, keyManager: KeyMappingManager) {
    this.callbacks = callbacks;
    this.keyManager = keyManager;
    this.createDOM();
    this.attachEventListeners();
  }

  private createDOM(): void {
    // Header Bar
    this.headerBar = document.createElement('header');
    this.headerBar.id = 'app-header';
    this.headerBar.innerHTML = `
      <div class="header-left">
        <span class="logo-title">BOXHEAD <span class="accent-red">2PLAY</span> ONLINE</span>
        <span id="room-code-badge" class="badge badge-room hidden">Room: ---</span>
        <span id="latency-badge" class="badge badge-ping hidden">-- ms</span>
      </div>
      <div class="header-right">
        <button id="btn-controls" class="hdr-btn" title="Configure Controls">🎮 Controls</button>
        <button id="btn-fullscreen" class="hdr-btn" title="Toggle Fullscreen">⛶ Fullscreen</button>
        <button id="btn-lobby" class="hdr-btn hidden" title="Exit to Lobby">✕ Exit</button>
      </div>
    `;
    document.body.appendChild(this.headerBar);

    this.roomCodeBadge = this.headerBar.querySelector('#room-code-badge')!;
    this.latencyBadge = this.headerBar.querySelector('#latency-badge')!;

    // Lobby Overlay
    this.lobbyOverlay = document.createElement('div');
    this.lobbyOverlay.id = 'lobby-overlay';
    this.lobbyOverlay.innerHTML = `
      <div class="lobby-card">
        <div class="lobby-header">
          <h1>BOXHEAD <span class="accent-red">2PLAY</span></h1>
          <p class="subtitle">Classic Flash Action • Online Co-Op & Deathmatch</p>
        </div>

        <div id="lobby-main-options" class="lobby-options">
          <button id="btn-start-solo" class="primary-btn btn-solo">
            <span class="btn-title">Solo Play</span>
            <span class="btn-desc">Play 1-Player classic mode offline</span>
          </button>

          <div class="split-divider"><span>OR MULTIPLAYER</span></div>

          <div class="multiplayer-actions">
            <button id="btn-show-host" class="primary-btn btn-host">
              <span class="btn-title">Host Online Game</span>
              <span class="btn-desc">Create a room & invite a friend</span>
            </button>

            <button id="btn-show-join" class="secondary-btn btn-join">
              <span class="btn-title">Join Friend's Game</span>
              <span class="btn-desc">Enter a 5-character room code</span>
            </button>
          </div>
        </div>

        <!-- Host Waiting Section -->
        <div id="section-host" class="lobby-subview hidden">
          <h2>HOSTING GAME</h2>
          <p class="sub-desc">Send this room link or code to your friend:</p>
          <div class="code-container">
            <div id="generated-code" class="display-code">-----</div>
            <button id="btn-copy-link" class="btn-action">Copy Invite Link</button>
          </div>
          <div class="waiting-indicator">
            <div class="spinner"></div>
            <span id="host-status-msg">Waiting for Player 2 to join...</span>
          </div>
          <button id="btn-cancel-host" class="btn-back">Cancel</button>
        </div>

        <!-- Join Input Section -->
        <div id="section-join" class="lobby-subview hidden">
          <h2>JOIN ONLINE GAME</h2>
          <p class="sub-desc">Enter the 5-character Room Code:</p>
          <div class="input-container">
            <input type="text" id="input-room-code" placeholder="e.g. 9X7A" maxlength="6" autocomplete="off" />
            <button id="btn-connect" class="btn-action">Connect</button>
          </div>
          <p id="join-status-msg" class="status-msg"></p>
          <button id="btn-cancel-join" class="btn-back">Back</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.lobbyOverlay);

    this.hostSection = this.lobbyOverlay.querySelector('#section-host')!;
    this.joinSection = this.lobbyOverlay.querySelector('#section-join')!;

    // Controls Modal
    this.controlsModal = document.createElement('div');
    this.controlsModal.id = 'controls-modal';
    this.controlsModal.className = 'modal-overlay hidden';
    this.controlsModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2>CONTROLLER MAPPING</h2>
          <button id="btn-close-controls" class="btn-close">×</button>
        </div>
        <div class="modal-content">
          <div class="controls-columns">
            <div class="control-column">
              <h3>Player 1 (Host / Solo)</h3>
              <div class="preset-row">
                <button id="preset-p1-wasd" class="btn-preset">WASD + Space</button>
                <button id="preset-p1-arrows" class="btn-preset">Arrow Keys</button>
              </div>
              <div class="bindings-list" id="p1-bindings-list"></div>
            </div>

            <div class="control-column">
              <h3>Player 2 (Online Guest)</h3>
              <div class="preset-row">
                <button id="preset-p2-wasd" class="btn-preset">WASD + Space</button>
                <button id="preset-p2-arrows" class="btn-preset">Arrow Keys</button>
              </div>
              <div class="bindings-list" id="p2-bindings-list"></div>
            </div>
          </div>
          <p class="modal-tip">Tip: Click any button above, then press a key on your keyboard to rebind.</p>
        </div>
        <div class="modal-footer">
          <button id="btn-save-controls" class="primary-btn">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.controlsModal);

    this.renderBindingsUI();
  }

  private attachEventListeners(): void {
    // Solo
    this.lobbyOverlay.querySelector('#btn-start-solo')?.addEventListener('click', () => {
      this.hideLobby();
      this.callbacks.onStartSolo();
    });

    // Show Host
    this.lobbyOverlay.querySelector('#btn-show-host')?.addEventListener('click', async () => {
      this.lobbyOverlay.querySelector('#lobby-main-options')?.classList.add('hidden');
      this.hostSection.classList.remove('hidden');
      try {
        const code = await this.callbacks.onHostGame();
        const codeEl = this.hostSection.querySelector('#generated-code')!;
        codeEl.textContent = code;
      } catch (err) {
        console.error('Host failed:', err);
      }
    });

    // Copy Link
    this.hostSection.querySelector('#btn-copy-link')?.addEventListener('click', () => {
      const code = this.hostSection.querySelector('#generated-code')?.textContent || '';
      const url = `${window.location.origin}${window.location.pathname}?room=${code}`;
      navigator.clipboard.writeText(url).then(() => {
        const btn = this.hostSection.querySelector('#btn-copy-link') as HTMLButtonElement;
        const origText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = origText), 2000);
      });
    });

    // Cancel Host
    this.hostSection.querySelector('#btn-cancel-host')?.addEventListener('click', () => {
      this.callbacks.onDisconnect();
      this.resetLobby();
    });

    // Show Join
    this.lobbyOverlay.querySelector('#btn-show-join')?.addEventListener('click', () => {
      this.lobbyOverlay.querySelector('#lobby-main-options')?.classList.add('hidden');
      this.joinSection.classList.remove('hidden');
      (this.joinSection.querySelector('#input-room-code') as HTMLInputElement)?.focus();
    });

    // Cancel Join
    this.joinSection.querySelector('#btn-cancel-join')?.addEventListener('click', () => {
      this.resetLobby();
    });

    // Connect Button
    this.joinSection.querySelector('#btn-connect')?.addEventListener('click', () => {
      this.handleJoinSubmit();
    });

    // Enter key in join input
    this.joinSection.querySelector('#input-room-code')?.addEventListener('keydown', (e: any) => {
      if (e.key === 'Enter') {
        this.handleJoinSubmit();
      }
    });

    // Fullscreen
    this.headerBar.querySelector('#btn-fullscreen')?.addEventListener('click', () => {
      this.callbacks.onToggleFullscreen();
    });

    // Exit to Lobby
    this.headerBar.querySelector('#btn-lobby')?.addEventListener('click', () => {
      this.callbacks.onDisconnect();
      this.showLobby();
    });

    // Controls Modal
    this.headerBar.querySelector('#btn-controls')?.addEventListener('click', () => {
      this.openControlsModal();
    });
    this.controlsModal.querySelector('#btn-close-controls')?.addEventListener('click', () => {
      this.closeControlsModal();
    });
    this.controlsModal.querySelector('#btn-save-controls')?.addEventListener('click', () => {
      this.closeControlsModal();
    });

    // Presets
    this.controlsModal.querySelector('#preset-p1-wasd')?.addEventListener('click', () => {
      this.keyManager.setP1Bindings(WASD_BINDINGS);
      this.renderBindingsUI();
    });
    this.controlsModal.querySelector('#preset-p1-arrows')?.addEventListener('click', () => {
      this.keyManager.setP1Bindings(ARROWS_BINDINGS);
      this.renderBindingsUI();
    });
    this.controlsModal.querySelector('#preset-p2-wasd')?.addEventListener('click', () => {
      this.keyManager.setP2Bindings(WASD_BINDINGS);
      this.renderBindingsUI();
    });
    this.controlsModal.querySelector('#preset-p2-arrows')?.addEventListener('click', () => {
      this.keyManager.setP2Bindings(ARROWS_BINDINGS);
      this.renderBindingsUI();
    });

    // Global Key Listener for Rebinder
    window.addEventListener('keydown', (e) => {
      if (this.activeListeningAction && this.activeListeningBtn) {
        e.preventDefault();
        e.stopPropagation();

        const { player, action } = this.activeListeningAction;
        const currentBindings = player === 1 ? this.keyManager.getP1Bindings() : this.keyManager.getP2Bindings();
        currentBindings[action] = e.code;

        if (player === 1) {
          this.keyManager.setP1Bindings(currentBindings);
        } else {
          this.keyManager.setP2Bindings(currentBindings);
        }

        this.activeListeningBtn = null;
        this.activeListeningAction = null;
        this.renderBindingsUI();
      }
    });
  }

  private async handleJoinSubmit(): Promise<void> {
    const input = this.joinSection.querySelector('#input-room-code') as HTMLInputElement;
    const code = input?.value.trim();
    if (!code) return;

    const statusMsg = this.joinSection.querySelector('#join-status-msg')!;
    statusMsg.textContent = 'Connecting...';
    try {
      await this.callbacks.onJoinGame(code);
      this.hideLobby();
    } catch (err: any) {
      statusMsg.textContent = err?.message || 'Failed to connect. Please check the code.';
    }
  }

  public showLobby(): void {
    this.resetLobby();
    this.lobbyOverlay.classList.remove('hidden');
    this.headerBar.querySelector('#btn-lobby')?.classList.add('hidden');
    this.roomCodeBadge.classList.add('hidden');
    this.latencyBadge.classList.add('hidden');
  }

  public hideLobby(): void {
    this.lobbyOverlay.classList.add('hidden');
    this.headerBar.querySelector('#btn-lobby')?.classList.remove('hidden');
  }

  public resetLobby(): void {
    this.lobbyOverlay.querySelector('#lobby-main-options')?.classList.remove('hidden');
    this.hostSection.classList.add('hidden');
    this.joinSection.classList.add('hidden');
    const statusMsg = this.joinSection.querySelector('#join-status-msg');
    if (statusMsg) statusMsg.textContent = '';
  }

  public setRoomCode(code: string | null): void {
    if (code) {
      this.roomCodeBadge.textContent = `Room: ${code}`;
      this.roomCodeBadge.classList.remove('hidden');
    } else {
      this.roomCodeBadge.classList.add('hidden');
    }
  }

  public setLatency(ms: number | null): void {
    if (ms !== null) {
      this.latencyBadge.textContent = `${ms} ms`;
      this.latencyBadge.classList.remove('hidden');
      if (ms < 50) {
        this.latencyBadge.className = 'badge badge-ping ping-good';
      } else if (ms < 120) {
        this.latencyBadge.className = 'badge badge-ping ping-med';
      } else {
        this.latencyBadge.className = 'badge badge-ping ping-high';
      }
    } else {
      this.latencyBadge.classList.add('hidden');
    }
  }

  private openControlsModal(): void {
    this.renderBindingsUI();
    this.controlsModal.classList.remove('hidden');
  }

  private closeControlsModal(): void {
    this.activeListeningBtn = null;
    this.activeListeningAction = null;
    this.controlsModal.classList.add('hidden');
  }

  private renderBindingsUI(): void {
    this.renderPlayerBindings(1, this.keyManager.getP1Bindings(), '#p1-bindings-list');
    this.renderPlayerBindings(2, this.keyManager.getP2Bindings(), '#p2-bindings-list');
  }

  private renderPlayerBindings(playerNum: 1 | 2, bindings: KeyBindings, selector: string): void {
    const listEl = this.controlsModal.querySelector(selector);
    if (!listEl) return;
    listEl.innerHTML = '';

    const actionLabels: Record<PlayerAction, string> = {
      up: 'Move Up',
      down: 'Move Down',
      left: 'Move Left',
      right: 'Move Right',
      shoot: 'Shoot',
      prev_weapon: 'Prev Weapon',
      next_weapon: 'Next Weapon',
    };

    for (const [actionKey, label] of Object.entries(actionLabels)) {
      const action = actionKey as PlayerAction;
      const boundCode = bindings[action];

      const row = document.createElement('div');
      row.className = 'binding-row';

      const labelEl = document.createElement('span');
      labelEl.className = 'binding-label';
      labelEl.textContent = label;

      const btn = document.createElement('button');
      btn.className = 'binding-key-btn';
      btn.textContent = this.formatCodeName(boundCode);

      btn.addEventListener('click', () => {
        if (this.activeListeningBtn) {
          this.activeListeningBtn.classList.remove('listening');
        }
        this.activeListeningBtn = btn;
        this.activeListeningAction = { player: playerNum, action };
        btn.classList.add('listening');
        btn.textContent = 'Press any key...';
      });

      row.appendChild(labelEl);
      row.appendChild(btn);
      listEl.appendChild(row);
    }
  }

  private formatCodeName(code: string): string {
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Arrow')) return code.slice(5);
    if (code === 'Space') return 'Spacebar';
    if (code === 'Slash') return '/';
    if (code === 'Comma') return ',';
    if (code === 'Period') return '.';
    return code;
  }
}
