import { SceneManager } from './render/Scene';
import { CameraManager } from './render/Camera';

function init(): void {
  const container = document.getElementById('game-container') || document.body;

  const sceneManager = new SceneManager();
  container.appendChild(sceneManager.renderer.domElement);

  const cameraManager = new CameraManager();
  sceneManager.camera = cameraManager.camera;

  const onResize = () => {
    cameraManager.handleResize();
    sceneManager.handleResize();
  };

  window.addEventListener('resize', onResize);

  function animate(): void {
    requestAnimationFrame(animate);
    cameraManager.update({ x: 0, z: 0 });
    sceneManager.render();
  }

  animate();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
