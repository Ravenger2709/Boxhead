import { Game } from './core/Game';

let gameInstance: Game | null = null;

function init(): void {
  try {
    console.log('[Boxhead] Initializing game...');
    const container = document.getElementById('game-container') || document.body;
    gameInstance = new Game({
      container,
      autoStart: true,
    });
    console.log('[Boxhead] Game initialized successfully!');
  } catch (err) {
    console.error('[Boxhead] Init error:', err);
    const errDiv = document.createElement('div');
    errDiv.id = 'init-error';
    errDiv.style.color = '#ff3333';
    errDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
    errDiv.style.padding = '20px';
    errDiv.style.fontFamily = 'monospace';
    errDiv.style.fontSize = '16px';
    errDiv.style.whiteSpace = 'pre-wrap';
    errDiv.style.position = 'fixed';
    errDiv.style.top = '10px';
    errDiv.style.left = '10px';
    errDiv.style.right = '10px';
    errDiv.style.zIndex = '999999';
    errDiv.textContent = 'Boxhead Init Error:\n' + String(err) + '\n\n' + ((err as any)?.stack || '');
    document.body.appendChild(errDiv);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

export { gameInstance as game };
