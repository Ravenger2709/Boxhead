import { Game } from './core/Game';

let gameInstance: Game | null = null;

function init(): void {
  const container = document.getElementById('game-container') || document.body;
  gameInstance = new Game({
    container,
    autoStart: true,
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

export { gameInstance as game };
