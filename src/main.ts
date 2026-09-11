import { SceneManager } from './render/Scene';
import { CameraManager } from './render/Camera';
import { InputManager } from './core/Input';
import { Player } from './entities/Player';

function init(): void {
  const container = document.getElementById('game-container') || document.body;

  const sceneManager = new SceneManager();
  container.appendChild(sceneManager.renderer.domElement);

  const cameraManager = new CameraManager();
  sceneManager.camera = cameraManager.camera;

  const inputManager = new InputManager(sceneManager.renderer.domElement);

  const player = new Player(0, 0);
  sceneManager.attachPlayer(player);
  cameraManager.update(player.pos);

  const onResize = () => {
    cameraManager.handleResize();
    sceneManager.handleResize();
  };

  window.addEventListener('resize', onResize);

  let lastTime = performance.now();

  function animate(currentTime: number): void {
    requestAnimationFrame(animate);

    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    inputManager.updateRaycast(cameraManager.camera);
    player.update(dt, inputManager, sceneManager.walls);
    cameraManager.update(player.pos);
    sceneManager.render();
  }

  requestAnimationFrame(animate);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
