import { WeaponDef, WEAPONS } from '../weapons/WeaponTypes';
import type { WeaponInventory } from '../weapons/WeaponInventory';
import { DifficultyLevel, DIFFICULTY_PRESETS } from '../core/Constants';

export interface HUDOptions {
  container?: HTMLElement | null;
  inventory?: WeaponInventory;
  slotCount?: number;
  onToggleMute?: () => boolean | void;
  onSelectWeapon?: (slot: number) => void;
  onSelectRoom?: (roomName: string) => void;
  rooms?: string[];
  currentRoom?: string;
  onSelectDifficulty?: (difficulty: DifficultyLevel) => void;
  onToggleDevils?: (enabled: boolean) => void;
  difficulty?: DifficultyLevel;
  devilsEnabled?: boolean;
  gameSpeed?: number;
  onSelectGameSpeed?: (speed: number) => void;
}

export type SlotElementsMap<V = any> = Map<number, V>;

export interface MinimalElement {
  style: Record<string, string>;
  textContent: string;
  innerHTML: string;
  className: string;
  value?: string;
  dataset: Record<string, string>;
  children: MinimalElement[];
  parentNode: MinimalElement | null;
  appendChild(child: MinimalElement): MinimalElement;
  removeChild(child: MinimalElement): MinimalElement;
  addEventListener(event: string, handler: Function): void;
  removeEventListener(event: string, handler: Function): void;
  dispatchEvent(event: { type: string }): boolean;
  classList: {
    add(cls: string): void;
    remove(cls: string): void;
    contains(cls: string): boolean;
    toggle(cls: string): boolean;
  };
}

function createMockElement(_tag: string = 'div'): MinimalElement {
  const classes = new Set<string>();
  const listeners: Record<string, Function[]> = {};

  const el: MinimalElement = {
    style: {},
    textContent: '',
    innerHTML: '',
    className: '',
    value: '',
    dataset: {},
    children: [],
    parentNode: null,
    appendChild(child: MinimalElement) {
      el.children.push(child);
      child.parentNode = el;
      return child;
    },
    removeChild(child: MinimalElement) {
      const idx = el.children.indexOf(child);
      if (idx !== -1) {
        el.children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    },
    addEventListener(event: string, handler: Function) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener(event: string, handler: Function) {
      if (!listeners[event]) return;
      const idx = listeners[event].indexOf(handler);
      if (idx !== -1) listeners[event].splice(idx, 1);
    },
    dispatchEvent(event: { type: string }) {
      const handlers = listeners[event.type] || [];
      for (const h of handlers) {
        h(event);
      }
      return true;
    },
    classList: {
      add(cls: string) {
        if (el.className) {
          el.className.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
        }
        classes.add(cls);
        el.className = Array.from(classes).join(' ');
      },
      remove(cls: string) {
        if (el.className) {
          el.className.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
        }
        classes.delete(cls);
        el.className = Array.from(classes).join(' ');
      },
      contains(cls: string) {
        if (el.className) {
          el.className.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
        }
        return classes.has(cls);
      },
      toggle(cls: string) {
        if (el.className) {
          el.className.split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
        }
        if (classes.has(cls)) {
          classes.delete(cls);
          el.className = Array.from(classes).join(' ');
          return false;
        }
        classes.add(cls);
        el.className = Array.from(classes).join(' ');
        return true;
      },
    },
  };
  return el;
}

function createElementHelper(tag: string, className?: string): any {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }
  const mock = createMockElement(tag);
  if (className) mock.className = className;
  return mock;
}

export class HUD {
  public container: any = null;
  public rootElement: any = null;
  public inventory?: WeaponInventory;

  // Header Left: HP & Score
  public hpFillEl: any = null;
  public hpTextEl: any = null;
  public scoreEl: any = null;

  // Header Center: Combo Multiplier & Drain Gauge
  public comboBadgeEl: any = null;
  public comboValEl: any = null;
  public comboDrainBarEl: any = null;

  // Header Right: Mute, Wave & Enemies, Room Selector
  public roomSelectEl: any = null;
  public muteBtnEl: any = null;
  public waveEl: any = null;
  public enemiesEl: any = null;

  // Milestone unlock toast
  public toastEl: any = null;
  public toastTitleEl: any = null;
  public toastSubtitleEl: any = null;
  public toastTextEl: any = null;
  private toastTimeout: any = null;

  // Bottom weapon slots (1..10)
  public slotElements: Map<number, any> = new Map();
  public slotAmmoElements: Map<number, any> = new Map();
  public slotLockElements: Map<number, any> = new Map();

  public difficultySelectEl: any = null;
  public devilToggleBtnEl: any = null;
  public gameSpeedSelectEl: any = null;
  public currentDifficulty: DifficultyLevel = 'beginner';
  public devilsEnabled: boolean = true;
  public currentGameSpeed: number = 1.0;
  private options: HUDOptions;
  private onToggleMute?: () => boolean | void;
  private onSelectWeapon?: (slot: number) => void;
  private onSelectRoom?: (roomName: string) => void;
  private onSelectDifficulty?: (difficulty: DifficultyLevel) => void;
  private onToggleDevils?: (enabled: boolean) => void;
  private onSelectGameSpeed?: (speed: number) => void;

  constructor(options: HUDOptions = {}) {
    this.options = options;
    this.onToggleMute = options.onToggleMute;
    this.onSelectWeapon = options.onSelectWeapon;
    this.onSelectRoom = options.onSelectRoom;
    this.onSelectDifficulty = options.onSelectDifficulty;
    this.onToggleDevils = options.onToggleDevils;
    this.onSelectGameSpeed = options.onSelectGameSpeed;
    this.inventory = options.inventory;
    if (options.difficulty) this.currentDifficulty = options.difficulty;
    if (options.devilsEnabled !== undefined) this.devilsEnabled = options.devilsEnabled;
    if (options.gameSpeed !== undefined) this.currentGameSpeed = options.gameSpeed;

    this.slotElements = new Map();
    this.slotAmmoElements = new Map();
    this.slotLockElements = new Map();

    if (options.container) {
      this.container = options.container;
    } else if (typeof document !== 'undefined') {
      this.container =
        document.getElementById('hud-overlay') ||
        document.getElementById('game-container') ||
        document.body;
    }

    this.initDOM();
  }

  public setRoom(roomName: string): void {
    if (this.roomSelectEl) {
      this.roomSelectEl.value = roomName;
    }
  }

  private initDOM(): void {
    this.rootElement = createElementHelper('div', 'hud-root');
    this.rootElement.style.position = 'absolute';
    this.rootElement.style.inset = '0';
    this.rootElement.style.pointerEvents = 'none';
    this.rootElement.style.userSelect = 'none';
    this.rootElement.style.fontFamily = "'Impact', 'Arial Black', sans-serif";

    // ==========================================
    // 1. Top HUD Header
    // ==========================================
    const topBar = createElementHelper('div', 'hud-top-bar');
    topBar.style.position = 'absolute';
    topBar.style.top = '0';
    topBar.style.left = '0';
    topBar.style.right = '0';
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'flex-start';
    topBar.style.padding = '14px 20px';

    // Top-Left: Score and HP Bar
    const topLeft = createElementHelper('div', 'hud-top-left');

    const scoreBox = createElementHelper('div', 'hud-score-box');
    scoreBox.style.color = '#ffffff';
    scoreBox.style.fontSize = '22px';
    scoreBox.style.textShadow = '2px 2px 3px #000000';
    scoreBox.style.marginBottom = '6px';
    scoreBox.textContent = 'SCORE: ';

    this.scoreEl = createElementHelper('span', 'hud-score-val');
    this.scoreEl.textContent = '0';
    scoreBox.appendChild(this.scoreEl);
    topLeft.appendChild(scoreBox);

    const hpBarContainer = createElementHelper('div', 'hud-hp-container');
    hpBarContainer.style.width = '240px';
    hpBarContainer.style.height = '24px';
    hpBarContainer.style.backgroundColor = '#1a1a1a';
    hpBarContainer.style.border = '2px solid #555555';
    hpBarContainer.style.borderRadius = '3px';
    hpBarContainer.style.position = 'relative';
    hpBarContainer.style.overflow = 'hidden';
    hpBarContainer.style.boxShadow = 'inset 0 0 5px #000';

    this.hpFillEl = createElementHelper('div', 'hud-hp-fill');
    this.hpFillEl.style.width = '100.0%';
    this.hpFillEl.style.height = '100%';
    this.hpFillEl.style.background = 'linear-gradient(to bottom, #2ecc71, #27ae60)';
    this.hpFillEl.style.transition = 'width 0.1s ease-out';
    hpBarContainer.appendChild(this.hpFillEl);

    this.hpTextEl = createElementHelper('div', 'hud-hp-text');
    this.hpTextEl.style.position = 'absolute';
    this.hpTextEl.style.inset = '0';
    this.hpTextEl.style.display = 'flex';
    this.hpTextEl.style.alignItems = 'center';
    this.hpTextEl.style.justifyContent = 'center';
    this.hpTextEl.style.color = '#ffffff';
    this.hpTextEl.style.fontSize = '14px';
    this.hpTextEl.style.fontWeight = 'bold';
    this.hpTextEl.style.textShadow = '1px 1px 2px #000';
    this.hpTextEl.textContent = 'HP: 100 / 100';
    hpBarContainer.appendChild(this.hpTextEl);

    topLeft.appendChild(hpBarContainer);
    topBar.appendChild(topLeft);

    // Top-Center: Large Combo Multiplier and Animated Decay Bar
    const topCenter = createElementHelper('div', 'hud-top-center');
    topCenter.style.display = 'flex';
    topCenter.style.flexDirection = 'column';
    topCenter.style.alignItems = 'center';

    this.comboBadgeEl = createElementHelper('div', 'hud-combo-badge');
    this.comboBadgeEl.style.textAlign = 'center';

    const comboLabel = createElementHelper('div', 'hud-combo-label');
    comboLabel.style.fontSize = '13px';
    comboLabel.style.color = '#bdc3c7';
    comboLabel.style.letterSpacing = '2px';
    comboLabel.style.textShadow = '1px 1px 2px #000';
    comboLabel.textContent = 'COMBO';
    this.comboBadgeEl.appendChild(comboLabel);

    this.comboValEl = createElementHelper('div', 'hud-combo-val');
    this.comboValEl.style.fontSize = '42px';
    this.comboValEl.style.color = '#f1c40f';
    this.comboValEl.style.textShadow = '2px 2px 6px rgba(241, 196, 15, 0.6), 2px 2px 0 #000';
    this.comboValEl.style.lineHeight = '1.0';
    this.comboValEl.textContent = 'x1';
    this.comboBadgeEl.appendChild(this.comboValEl);
    topCenter.appendChild(this.comboBadgeEl);

    const comboDrainContainer = createElementHelper('div', 'hud-combo-drain-container');
    comboDrainContainer.style.width = '180px';
    comboDrainContainer.style.height = '8px';
    comboDrainContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    comboDrainContainer.style.border = '1px solid #555555';
    comboDrainContainer.style.borderRadius = '2px';
    comboDrainContainer.style.marginTop = '4px';
    comboDrainContainer.style.overflow = 'hidden';

    this.comboDrainBarEl = createElementHelper('div', 'hud-combo-drain-bar');
    this.comboDrainBarEl.style.width = '0.0%';
    this.comboDrainBarEl.style.height = '100%';
    this.comboDrainBarEl.style.backgroundColor = '#f39c12';
    comboDrainContainer.appendChild(this.comboDrainBarEl);
    topCenter.appendChild(comboDrainContainer);

    topBar.appendChild(topCenter);

    // Top-Right: Sound Mute Toggle, Room Selector, Wave Tracker, Enemies Left
    const topRight = createElementHelper('div', 'hud-top-right');
    topRight.style.display = 'flex';
    topRight.style.flexDirection = 'column';
    topRight.style.alignItems = 'flex-end';

    const controlsRow = createElementHelper('div', 'hud-controls-row');
    controlsRow.style.display = 'flex';
    controlsRow.style.gap = '6px';
    controlsRow.style.marginBottom = '8px';
    controlsRow.style.alignItems = 'center';

    // Room / Level Selector Dropdown
    this.roomSelectEl = createElementHelper('select', 'hud-room-select');
    this.roomSelectEl.id = 'room-select';
    this.roomSelectEl.style.pointerEvents = 'auto';
    this.roomSelectEl.style.backgroundColor = '#1f2937';
    this.roomSelectEl.style.color = '#f1c40f';
    this.roomSelectEl.style.border = '2px solid #7f8c8d';
    this.roomSelectEl.style.borderRadius = '4px';
    this.roomSelectEl.style.padding = '3px 6px';
    this.roomSelectEl.style.fontSize = '12px';
    this.roomSelectEl.style.fontWeight = 'bold';
    this.roomSelectEl.style.cursor = 'pointer';
    this.roomSelectEl.style.fontFamily = "'Impact', 'Arial Black', sans-serif";
    this.roomSelectEl.style.outline = 'none';

    const roomNames = this.options.rooms ?? [
      'BOXY', 'MAZEY', 'GLADIATOR', 'STRIP', 'TIGHT', 'COLUMNS',
      'CASTLE', 'BIG BOXY', 'RECTY', 'PATCHY', 'FOREST BOX', 'TIGHT 2',
      'MASSIVE', 'THIN LINE', '4 CASTLES', 'THE STRIPS', 'BIG ONE', 'ROOM 18'
    ];

    for (const name of roomNames) {
      const opt = createElementHelper('option');
      opt.value = name;
      opt.textContent = name;
      this.roomSelectEl.appendChild(opt);
    }

    if (this.options.currentRoom) {
      this.roomSelectEl.value = this.options.currentRoom;
    } else if (roomNames.length > 0) {
      this.roomSelectEl.value = roomNames[0];
    }

    this.roomSelectEl.addEventListener('change', () => {
      const val = this.roomSelectEl.value;
      if (val && this.onSelectRoom) {
        this.onSelectRoom(val);
      }
    });
    controlsRow.appendChild(this.roomSelectEl);

    // Difficulty Select
    const diffSelect = createElementHelper('select', 'hud-difficulty-select');
    diffSelect.style.pointerEvents = 'auto';
    diffSelect.style.backgroundColor = '#2c3e50';
    diffSelect.style.color = '#ecf0f1';
    diffSelect.style.border = '2px solid #7f8c8d';
    diffSelect.style.borderRadius = '4px';
    diffSelect.style.padding = '3px 6px';
    diffSelect.style.fontSize = '12px';
    diffSelect.style.fontWeight = 'bold';
    diffSelect.style.cursor = 'pointer';
    diffSelect.style.fontFamily = "'Impact', 'Arial Black', sans-serif";

    const diffKeys: DifficultyLevel[] = ['beginner', 'intermediate', 'expert', 'nightmare'];
    diffKeys.forEach((diff) => {
      const opt = createElementHelper('option');
      opt.value = diff;
      opt.textContent = DIFFICULTY_PRESETS[diff].name.toUpperCase();
      if (diff === this.currentDifficulty) {
        opt.selected = true;
      }
      diffSelect.appendChild(opt);
    });

    diffSelect.addEventListener('change', (e: any) => {
      const val = (e.target?.value || diffSelect.value) as DifficultyLevel;
      if (val) {
        this.currentDifficulty = val;
        this.onSelectDifficulty?.(val);
      }
    });
    this.difficultySelectEl = diffSelect;
    controlsRow.appendChild(diffSelect);

    // Devil Toggle Button
    this.devilToggleBtnEl = createElementHelper('button', 'hud-devil-btn');
    this.devilToggleBtnEl.style.pointerEvents = 'auto';
    this.devilToggleBtnEl.style.backgroundColor = this.devilsEnabled ? '#c0392b' : '#555555';
    this.devilToggleBtnEl.style.color = '#ffffff';
    this.devilToggleBtnEl.style.border = '2px solid #7f8c8d';
    this.devilToggleBtnEl.style.borderRadius = '4px';
    this.devilToggleBtnEl.style.padding = '3px 8px';
    this.devilToggleBtnEl.style.fontSize = '12px';
    this.devilToggleBtnEl.style.fontWeight = 'bold';
    this.devilToggleBtnEl.style.cursor = 'pointer';
    this.devilToggleBtnEl.style.userSelect = 'none';
    this.devilToggleBtnEl.style.fontFamily = "'Impact', 'Arial Black', sans-serif";
    this.devilToggleBtnEl.textContent = this.devilsEnabled ? '😈 DEVILS: ON' : '😈 DEVILS: OFF';
    this.devilToggleBtnEl.addEventListener('click', () => {
      this.devilsEnabled = !this.devilsEnabled;
      this.devilToggleBtnEl.textContent = this.devilsEnabled ? '😈 DEVILS: ON' : '😈 DEVILS: OFF';
      this.devilToggleBtnEl.style.backgroundColor = this.devilsEnabled ? '#c0392b' : '#555555';
      this.onToggleDevils?.(this.devilsEnabled);
    });
    controlsRow.appendChild(this.devilToggleBtnEl);

    // Game Speed Select (options: 0.5, 1.0, 2.0)
    const speedSelect = createElementHelper('select', 'hud-speed-select');
    speedSelect.style.pointerEvents = 'auto';
    speedSelect.style.backgroundColor = '#2c3e50';
    speedSelect.style.color = '#ecf0f1';
    speedSelect.style.border = '2px solid #7f8c8d';
    speedSelect.style.borderRadius = '4px';
    speedSelect.style.padding = '3px 6px';
    speedSelect.style.fontSize = '12px';
    speedSelect.style.fontWeight = 'bold';
    speedSelect.style.cursor = 'pointer';
    speedSelect.style.fontFamily = "'Impact', 'Arial Black', sans-serif";

    const speedOptions = [0.5, 1.0, 2.0];
    speedOptions.forEach((spd) => {
      const opt = createElementHelper('option');
      opt.value = String(spd);
      opt.textContent = `${spd}x SPEED`;
      if (spd === this.currentGameSpeed) {
        opt.selected = true;
      }
      speedSelect.appendChild(opt);
    });

    speedSelect.addEventListener('change', (e: any) => {
      const val = parseFloat(e.target?.value || speedSelect.value);
      if (!isNaN(val)) {
        this.currentGameSpeed = val;
        this.onSelectGameSpeed?.(val);
      }
    });
    this.gameSpeedSelectEl = speedSelect;
    controlsRow.appendChild(speedSelect);

    this.muteBtnEl = createElementHelper('button', 'hud-mute-btn');
    this.muteBtnEl.style.pointerEvents = 'auto';
    this.muteBtnEl.style.backgroundColor = '#2c3e50';
    this.muteBtnEl.style.color = '#ecf0f1';
    this.muteBtnEl.style.border = '2px solid #7f8c8d';
    this.muteBtnEl.style.borderRadius = '4px';
    this.muteBtnEl.style.padding = '4px 10px';
    this.muteBtnEl.style.fontSize = '12px';
    this.muteBtnEl.style.fontWeight = 'bold';
    this.muteBtnEl.style.cursor = 'pointer';
    this.muteBtnEl.style.userSelect = 'none';
    this.muteBtnEl.textContent = '🔊 SOUND ON';
    this.muteBtnEl.addEventListener('click', () => {
      this.onToggleMute?.();
    });
    controlsRow.appendChild(this.muteBtnEl);

    topRight.appendChild(controlsRow);

    const waveBox = createElementHelper('div', 'hud-wave-box');
    waveBox.style.color = '#ffffff';
    waveBox.style.fontSize = '24px';
    waveBox.style.textShadow = '2px 2px 3px #000';
    waveBox.textContent = 'WAVE ';

    this.waveEl = createElementHelper('span', 'hud-wave-val');
    this.waveEl.textContent = '1';
    waveBox.appendChild(this.waveEl);
    topRight.appendChild(waveBox);

    const enemiesBox = createElementHelper('div', 'hud-enemies-box');
    enemiesBox.style.color = '#e74c3c';
    enemiesBox.style.fontSize = '16px';
    enemiesBox.style.textShadow = '1px 1px 2px #000';
    enemiesBox.textContent = 'ENEMIES: ';

    this.enemiesEl = createElementHelper('span', 'hud-enemies-val');
    this.enemiesEl.textContent = '0';
    enemiesBox.appendChild(this.enemiesEl);
    topRight.appendChild(enemiesBox);

    topBar.appendChild(topRight);
    this.rootElement.appendChild(topBar);

    // ==========================================
    // 2. Center Toast Notification for Milestone Unlocks & Upgrades
    // ==========================================
    this.toastEl = createElementHelper('div', 'hud-unlock-toast');
    this.toastEl.style.position = 'absolute';
    this.toastEl.style.top = '100px';
    this.toastEl.style.left = '50%';
    this.toastEl.style.transform = 'translateX(-50%)';
    this.toastEl.style.backgroundColor = 'rgba(15, 18, 24, 0.95)';
    this.toastEl.style.border = '3px solid #f1c40f';
    this.toastEl.style.boxShadow = '0 0 25px rgba(241, 196, 15, 0.7)';
    this.toastEl.style.padding = '12px 32px';
    this.toastEl.style.borderRadius = '6px';
    this.toastEl.style.color = '#ffffff';
    this.toastEl.style.textAlign = 'center';
    this.toastEl.style.display = 'none';
    this.toastEl.style.zIndex = '50';
    this.toastEl.style.pointerEvents = 'none';

    this.toastTitleEl = createElementHelper('div', 'hud-toast-title');
    this.toastTitleEl.style.fontSize = '18px';
    this.toastTitleEl.style.fontWeight = 'bold';
    this.toastTitleEl.style.letterSpacing = '1.5px';
    this.toastTitleEl.style.textShadow = '2px 2px 4px #000000';
    this.toastEl.appendChild(this.toastTitleEl);

    this.toastSubtitleEl = createElementHelper('div', 'hud-toast-subtitle');
    this.toastSubtitleEl.style.fontSize = '13px';
    this.toastSubtitleEl.style.color = '#bdc3c7';
    this.toastSubtitleEl.style.marginTop = '4px';
    this.toastSubtitleEl.style.letterSpacing = '1px';
    this.toastSubtitleEl.style.textShadow = '1px 1px 2px #000000';
    this.toastEl.appendChild(this.toastSubtitleEl);

    this.toastTextEl = createElementHelper('span', 'hud-toast-text');
    this.toastTextEl.style.display = 'none';
    this.toastEl.appendChild(this.toastTextEl);

    this.rootElement.appendChild(this.toastEl);

    // ==========================================
    // 3. Bottom Weapon Inventory Bar (Slots 1..10)
    // ==========================================
    const weaponBar = createElementHelper('div', 'hud-weapon-bar');
    weaponBar.style.position = 'absolute';
    weaponBar.style.bottom = '16px';
    weaponBar.style.left = '50%';
    weaponBar.style.transform = 'translateX(-50%)';
    weaponBar.style.display = 'flex';
    weaponBar.style.gap = '6px';
    weaponBar.style.pointerEvents = 'auto';

    const slotNames: Record<number, string> = {
      1: 'PISTOL',
      2: 'UZI',
      3: 'SHOTGUN',
      4: 'BARRELS',
      5: 'GRENADES',
      6: 'FAKE WALLS',
      7: 'CLAYMORE',
      8: 'ROCKETS',
      9: 'CHARGE PACK',
      10: 'RAILGUN',
    };

    const slotUnlockMultipliers: Record<number, number> = {
      1: 1,
      2: 5,
      3: 10,
      4: 15,
      5: 20,
      6: 30,
      7: 40,
      8: 50,
      9: 55,
      10: 70,
    };

    for (let slot = 1; slot <= 10; slot++) {
      const def = WEAPONS[slot];
      const slotEl = createElementHelper('div', 'hud-weapon-slot');
      slotEl.dataset.slot = slot.toString();
      slotEl.style.width = '72px';
      slotEl.style.height = '58px';
      slotEl.style.backgroundColor = 'rgba(20, 24, 30, 0.88)';
      slotEl.style.border = slot === 1 ? '2px solid #f1c40f' : '2px solid #444444';
      slotEl.style.borderRadius = '4px';
      slotEl.style.padding = '4px 5px';
      slotEl.style.display = 'flex';
      slotEl.style.flexDirection = 'column';
      slotEl.style.justifyContent = 'space-between';
      slotEl.style.cursor = 'pointer';
      slotEl.style.position = 'relative';
      slotEl.style.boxSizing = 'border-box';
      slotEl.style.transition = 'transform 0.1s, border-color 0.1s';

      if (slot === 1) {
        slotEl.classList.add('active');
      }

      // Slot Key Badge: [1] to [9], and [0] for Railgun (slot 10)
      const keyBadge = createElementHelper('div', 'hud-slot-key');
      keyBadge.style.fontSize = '9px';
      keyBadge.style.color = '#7f8c8d';
      keyBadge.style.fontWeight = 'bold';
      keyBadge.textContent = slot === 10 ? '[0]' : `[${slot}]`;
      slotEl.appendChild(keyBadge);

      // Weapon Name
      const nameEl = createElementHelper('div', 'hud-slot-name');
      nameEl.style.fontSize = '10px';
      nameEl.style.color = '#ffffff';
      nameEl.style.fontWeight = 'bold';
      nameEl.style.whiteSpace = 'nowrap';
      nameEl.style.overflow = 'hidden';
      nameEl.style.textOverflow = 'ellipsis';
      nameEl.textContent = slotNames[slot] ?? def?.name?.toUpperCase() ?? `SLOT ${slot}`;
      slotEl.appendChild(nameEl);

      // Ammo counter
      const ammoEl = createElementHelper('div', 'hud-slot-ammo');
      ammoEl.style.fontSize = '12px';
      ammoEl.style.color = '#f1c40f';
      ammoEl.style.fontWeight = 'bold';
      ammoEl.style.textAlign = 'right';
      ammoEl.textContent = slot === 1 ? '∞' : '0';
      slotEl.appendChild(ammoEl);

      // Lock indicator
      const lockMultiplier = slotUnlockMultipliers[slot] ?? def?.unlockMultiplier;
      const lockEl = createElementHelper('div', 'hud-slot-lock');
      lockEl.style.position = 'absolute';
      lockEl.style.inset = '0';
      lockEl.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
      lockEl.style.borderRadius = '3px';
      lockEl.style.display = slot === 1 ? 'none' : 'flex';
      lockEl.style.alignItems = 'center';
      lockEl.style.justifyContent = 'center';
      lockEl.style.color = '#e74c3c';
      lockEl.style.fontSize = '11px';
      lockEl.style.fontWeight = 'bold';
      lockEl.textContent = `🔒 ${lockMultiplier}x`;
      slotEl.appendChild(lockEl);

      if (slot > 1) {
        slotEl.classList.add('locked');
      }

      slotEl.addEventListener('click', () => {
        if (!slotEl.classList.contains('locked')) {
          this.onSelectWeapon?.(slot);
        }
      });

      this.slotElements.set(slot, slotEl);
      this.slotAmmoElements.set(slot, ammoEl);
      this.slotLockElements.set(slot, lockEl);
      weaponBar.appendChild(slotEl);
    }

    this.rootElement.appendChild(weaponBar);

    if (this.container) {
      this.container.appendChild(this.rootElement);
    }
  }

  /**
   * Updates HUD state dynamically to reflect current gameplay.
   */
  public update(
    playerHp: number,
    playerMaxHp: number,
    multiplier: number,
    decayProgress: number,
    activeWeapon: WeaponDef,
    ammo: number,
    wave: number,
    score: number,
    isMuted: boolean,
    inventory?: WeaponInventory,
    remainingEnemies?: number
  ): void {
    // 1. Health Bar & Numeric text
    const clampedHp = Math.max(0, Math.min(playerMaxHp, playerHp));
    const hpPercent = playerMaxHp > 0 ? (clampedHp / playerMaxHp) * 100 : 0;
    if (this.hpFillEl) {
      this.hpFillEl.style.width = `${hpPercent.toFixed(1)}%`;
      if (hpPercent > 50) {
        this.hpFillEl.style.background = 'linear-gradient(to bottom, #2ecc71, #27ae60)';
      } else if (hpPercent > 25) {
        this.hpFillEl.style.background = 'linear-gradient(to bottom, #f39c12, #e67e22)';
      } else {
        this.hpFillEl.style.background = 'linear-gradient(to bottom, #e74c3c, #c0392b)';
      }
    }
    if (this.hpTextEl) {
      this.hpTextEl.textContent = `HP: ${Math.ceil(clampedHp)} / ${playerMaxHp}`;
    }

    // 2. Score
    if (this.scoreEl) {
      this.scoreEl.textContent = Math.round(score).toLocaleString();
    }

    // 3. Combo Multiplier & Decay Drain Bar
    if (this.comboValEl) {
      this.comboValEl.textContent = `x${Math.max(1, Math.round(multiplier))}`;
    }
    if (this.comboDrainBarEl) {
      const clampedDecay = Math.max(0, Math.min(1.0, decayProgress));
      if (multiplier <= 1) {
        this.comboDrainBarEl.style.width = '0.0%';
      } else {
        this.comboDrainBarEl.style.width = `${(clampedDecay * 100).toFixed(1)}%`;
      }
    }

    // 4. Wave & Enemies
    if (this.waveEl) {
      this.waveEl.textContent = wave.toString();
    }
    if (this.enemiesEl && remainingEnemies !== undefined) {
      this.enemiesEl.textContent = remainingEnemies.toString();
    }

    // 5. Mute Button
    if (this.muteBtnEl) {
      this.muteBtnEl.textContent = isMuted ? '🔇 MUTED' : '🔊 SOUND ON';
      if (isMuted) {
        this.muteBtnEl.classList.add('muted');
        this.muteBtnEl.style.backgroundColor = '#7f8c8d';
      } else {
        this.muteBtnEl.classList.remove('muted');
        this.muteBtnEl.style.backgroundColor = '#2c3e50';
      }
    }

    // 6. Weapon Slots (1..10)
    const activeInv = inventory || this.inventory;
    for (let slot = 1; slot <= 10; slot++) {
      const slotEl = this.slotElements.get(slot);
      const ammoEl = this.slotAmmoElements.get(slot);
      const lockEl = this.slotLockElements.get(slot);
      if (!slotEl) continue;

      const isCurrentActive = activeWeapon.slot === slot;
      if (isCurrentActive) {
        slotEl.classList.add('active');
        slotEl.style.borderColor = '#f1c40f';
        slotEl.style.boxShadow = '0 0 10px rgba(241, 196, 15, 0.8)';
        slotEl.style.transform = 'translateY(-3px)';
      } else {
        slotEl.classList.remove('active');
        slotEl.style.borderColor = '#444444';
        slotEl.style.boxShadow = 'none';
        slotEl.style.transform = 'none';
      }

      if (activeInv) {
        const unlocked = activeInv.isUnlocked(slot);
        if (unlocked) {
          slotEl.classList.remove('locked');
          if (lockEl) lockEl.style.display = 'none';
          const curAmmo = isCurrentActive && ammo >= 0 ? ammo : activeInv.getAmmo(slot);
          if (ammoEl) {
            ammoEl.textContent = slot === 1 ? '∞' : curAmmo.toString();
          }
        } else {
          slotEl.classList.add('locked');
          if (lockEl) lockEl.style.display = 'flex';
          if (ammoEl) ammoEl.textContent = '0';
        }
      } else {
        if (isCurrentActive && ammoEl) {
          ammoEl.textContent = ammo === -1 ? '∞' : ammo.toString();
        }
      }
    }
  }

  /**
   * Displays an animated pop-up toast for weapon unlocks or stat upgrades.
   * Weapon unlocks: gold border (#f1c40f) and gold glow.
   * Stat upgrades: cyan border (#00ffff) and cyan glow.
   * Auto-hides after ~2.8s.
   */
  public showUpgradeToast(title: string, subtitle?: string, isWeaponUnlock: boolean = true): void {
    if (!this.toastEl) return;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    if (isWeaponUnlock) {
      this.toastEl.style.borderColor = '#f1c40f';
      this.toastEl.style.border = '3px solid #f1c40f';
      this.toastEl.style.boxShadow = '0 0 25px rgba(241, 196, 15, 0.7)';
      if (this.toastTitleEl) {
        this.toastTitleEl.style.color = '#f1c40f';
      }
    } else {
      this.toastEl.style.borderColor = '#00ffff';
      this.toastEl.style.border = '3px solid #00ffff';
      this.toastEl.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.7)';
      if (this.toastTitleEl) {
        this.toastTitleEl.style.color = '#00ffff';
      }
    }

    if (this.toastTitleEl) {
      this.toastTitleEl.textContent = title;
    }
    if (this.toastSubtitleEl) {
      if (subtitle) {
        this.toastSubtitleEl.textContent = subtitle;
        this.toastSubtitleEl.style.display = 'block';
      } else {
        this.toastSubtitleEl.textContent = '';
        this.toastSubtitleEl.style.display = 'none';
      }
    }
    if (this.toastTextEl) {
      this.toastTextEl.textContent = subtitle ? `${title} - ${subtitle}` : title;
    }

    this.toastEl.style.display = 'block';

    if (typeof setTimeout !== 'undefined') {
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 2800);
    }
  }

  /**
   * Dismisses the unlock/upgrade toast.
   */
  public hideToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    if (this.toastEl) {
      this.toastEl.style.display = 'none';
    }
  }

  /**
   * Legacy method: displays an animated toast message when a new weapon milestone is unlocked.
   */
  public showMilestoneUnlock(weaponName: string): void {
    if (!this.toastEl) return;
    this.showUpgradeToast(`★ NEW WEAPON UNLOCKED: ${weaponName.toUpperCase()}! ★`, undefined, true);
    if (this.toastTextEl) {
      this.toastTextEl.textContent = `★ NEW WEAPON UNLOCKED: ${weaponName.toUpperCase()}! ★`;
    }
  }

  /**
   * Dismisses the milestone unlock banner.
   */
  public hideMilestoneUnlock(): void {
    this.hideToast();
  }

  public setDifficulty(difficulty: DifficultyLevel): void {
    this.currentDifficulty = difficulty;
    if (this.difficultySelectEl) {
      this.difficultySelectEl.value = difficulty;
    }
  }

  public setDevilsEnabled(enabled: boolean): void {
    this.devilsEnabled = enabled;
    if (this.devilToggleBtnEl) {
      this.devilToggleBtnEl.textContent = enabled ? '😈 DEVILS: ON' : '😈 DEVILS: OFF';
      this.devilToggleBtnEl.style.backgroundColor = enabled ? '#c0392b' : '#555555';
    }
  }

  public setGameSpeed(speed: number): void {
    this.currentGameSpeed = speed;
    if (this.gameSpeedSelectEl) {
      this.gameSpeedSelectEl.value = String(speed);
    }
  }

  /**
   * Cleans up HUD elements and listeners.
   */
  public dispose(): void {
    this.hideToast();
    if (this.rootElement?.parentNode) {
      this.rootElement.parentNode.removeChild(this.rootElement);
    }
  }
}
