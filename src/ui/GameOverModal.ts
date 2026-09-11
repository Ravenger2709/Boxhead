export interface GameOverModalOptions {
  container?: HTMLElement | null;
}

export interface MinimalElement {
  style: Record<string, string>;
  textContent: string;
  innerHTML: string;
  className: string;
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
        classes.add(cls);
        el.className = Array.from(classes).join(' ');
      },
      remove(cls: string) {
        classes.delete(cls);
        el.className = Array.from(classes).join(' ');
      },
      contains(cls: string) {
        return classes.has(cls);
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

export class GameOverModal {
  public container: any = null;
  public rootElement: any = null;

  public scoreValEl: any = null;
  public comboValEl: any = null;
  public waveValEl: any = null;
  public restartBtnEl: any = null;

  public visible: boolean = false;
  private onRestartCallback?: () => void;
  private boundKeyDown?: (e: KeyboardEvent) => void;

  constructor(options: GameOverModalOptions = {}) {
    if (options.container) {
      this.container = options.container;
    } else if (typeof document !== 'undefined') {
      this.container =
        document.getElementById('game-container') ||
        document.body;
    }

    this.initDOM();
  }

  private initDOM(): void {
    // Backdrop overlay
    this.rootElement = createElementHelper('div', 'game-over-overlay');
    this.rootElement.style.position = 'fixed';
    this.rootElement.style.inset = '0';
    this.rootElement.style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
    this.rootElement.style.display = 'none';
    this.rootElement.style.alignItems = 'center';
    this.rootElement.style.justifyContent = 'center';
    this.rootElement.style.zIndex = '1000';
    this.rootElement.style.userSelect = 'none';
    this.rootElement.style.fontFamily = "'Impact', 'Arial Black', sans-serif";

    // Dialog card
    const card = createElementHelper('div', 'game-over-card');
    card.style.backgroundColor = '#161616';
    card.style.border = '4px solid #c0392b';
    card.style.boxShadow = '0 0 50px rgba(192, 57, 43, 0.8), inset 0 0 15px rgba(0, 0, 0, 0.9)';
    card.style.borderRadius = '8px';
    card.style.padding = '36px 48px';
    card.style.textAlign = 'center';
    card.style.minWidth = '340px';
    card.style.maxWidth = '90%';

    // Title
    const title = createElementHelper('h1', 'game-over-title');
    title.style.color = '#e74c3c';
    title.style.fontSize = '52px';
    title.style.margin = '0 0 24px 0';
    title.style.letterSpacing = '3px';
    title.style.textShadow = '3px 3px 0 #000000, 0 0 20px rgba(231, 76, 60, 0.8)';
    title.textContent = 'GAME OVER';
    card.appendChild(title);

    // Stats Rows
    const statsContainer = createElementHelper('div', 'game-over-stats');
    statsContainer.style.display = 'flex';
    statsContainer.style.flexDirection = 'column';
    statsContainer.style.gap = '14px';
    statsContainer.style.marginBottom = '28px';

    // Score Row
    const scoreRow = createElementHelper('div', 'game-over-row');
    scoreRow.style.fontSize = '20px';
    scoreRow.style.color = '#ecf0f1';
    scoreRow.textContent = 'FINAL SCORE: ';
    this.scoreValEl = createElementHelper('span', 'game-over-score-val');
    this.scoreValEl.style.color = '#f1c40f';
    this.scoreValEl.style.fontWeight = 'bold';
    this.scoreValEl.textContent = '0';
    scoreRow.appendChild(this.scoreValEl);
    statsContainer.appendChild(scoreRow);

    // Combo Row
    const comboRow = createElementHelper('div', 'game-over-row');
    comboRow.style.fontSize = '20px';
    comboRow.style.color = '#ecf0f1';
    comboRow.textContent = 'HIGHEST COMBO: ';
    this.comboValEl = createElementHelper('span', 'game-over-combo-val');
    this.comboValEl.style.color = '#e67e22';
    this.comboValEl.style.fontWeight = 'bold';
    this.comboValEl.textContent = 'x1';
    comboRow.appendChild(this.comboValEl);
    statsContainer.appendChild(comboRow);

    // Waves Row
    const waveRow = createElementHelper('div', 'game-over-row');
    waveRow.style.fontSize = '20px';
    waveRow.style.color = '#ecf0f1';
    waveRow.textContent = 'WAVES SURVIVED: ';
    this.waveValEl = createElementHelper('span', 'game-over-wave-val');
    this.waveValEl.style.color = '#2ecc71';
    this.waveValEl.style.fontWeight = 'bold';
    this.waveValEl.textContent = '0';
    waveRow.appendChild(this.waveValEl);
    statsContainer.appendChild(waveRow);

    card.appendChild(statsContainer);

    // Restart Button
    this.restartBtnEl = createElementHelper('button', 'game-over-restart-btn');
    this.restartBtnEl.style.backgroundColor = '#e74c3c';
    this.restartBtnEl.style.color = '#ffffff';
    this.restartBtnEl.style.border = '2px solid #ffffff';
    this.restartBtnEl.style.borderRadius = '6px';
    this.restartBtnEl.style.padding = '12px 36px';
    this.restartBtnEl.style.fontSize = '24px';
    this.restartBtnEl.style.fontWeight = 'bold';
    this.restartBtnEl.style.cursor = 'pointer';
    this.restartBtnEl.style.letterSpacing = '1.5px';
    this.restartBtnEl.style.textShadow = '1px 1px 2px #000';
    this.restartBtnEl.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.6)';
    this.restartBtnEl.textContent = 'PLAY AGAIN';
    this.restartBtnEl.addEventListener('click', () => {
      this.triggerRestart();
    });
    card.appendChild(this.restartBtnEl);

    // Keyboard hint
    const hint = createElementHelper('div', 'game-over-hint');
    hint.style.fontSize = '12px';
    hint.style.color = '#7f8c8d';
    hint.style.marginTop = '12px';
    hint.style.letterSpacing = '0.5px';
    hint.textContent = 'PRESS SPACEBAR OR ENTER TO RESTART';
    card.appendChild(hint);

    this.rootElement.appendChild(card);

    if (this.container) {
      this.container.appendChild(this.rootElement);
    }
  }

  public handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.visible) return;
    if (
      e.code === 'Space' ||
      e.code === 'Enter' ||
      e.key === ' ' ||
      e.key === 'Enter'
    ) {
      e.preventDefault?.();
      this.triggerRestart();
    }
  };

  /**
   * Displays the Game Over modal overlay with final session statistics.
   */
  public show(
    score: number,
    maxCombo: number,
    wave: number,
    onRestart: () => void
  ): void {
    this.visible = true;
    this.onRestartCallback = onRestart;

    if (this.scoreValEl) {
      this.scoreValEl.textContent = Math.round(score).toLocaleString();
    }
    if (this.comboValEl) {
      this.comboValEl.textContent = `x${Math.max(1, Math.round(maxCombo))}`;
    }
    if (this.waveValEl) {
      // If player died on wave N, waves fully survived = max(0, wave - 1), or wave number
      this.waveValEl.textContent = Math.max(0, wave).toString();
    }

    if (this.rootElement) {
      this.rootElement.style.display = 'flex';
    }

    if (typeof window !== 'undefined') {
      if (this.boundKeyDown) window.removeEventListener('keydown', this.boundKeyDown);
      this.boundKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
      window.addEventListener('keydown', this.boundKeyDown);
    }
  }

  /**
   * Hides the Game Over modal and unbinds keyboard listeners.
   */
  public hide(): void {
    this.visible = false;
    if (this.rootElement) {
      this.rootElement.style.display = 'none';
    }

    if (typeof window !== 'undefined' && this.boundKeyDown) {
      window.removeEventListener('keydown', this.boundKeyDown);
      this.boundKeyDown = undefined;
    }
  }

  /**
   * Triggers the restart flow: hides modal and calls onRestart callback.
   */
  public triggerRestart(): void {
    if (!this.visible) return;
    const cb = this.onRestartCallback;
    this.hide();
    if (cb) {
      this.onRestartCallback = undefined;
      cb();
    }
  }

  /**
   * Cleans up modal elements and listeners.
   */
  public dispose(): void {
    this.hide();
    if (this.rootElement?.parentNode) {
      this.rootElement.parentNode.removeChild(this.rootElement);
    }
  }
}
