import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DummyScene from "./src/Scene.js";

function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  const renderer = new WebGLRenderer({ antialias: true });

  // camera
  camera.position.set(6, 3, -10);
  camera.lookAt(new Vector3(0, 0, 0));

  // renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x7ec0ee, 1);

  // resize
  const windowResizeHanlder = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  windowResizeHanlder();
  window.addEventListener("resize", windowResizeHanlder);

  // dom
  const container = document.querySelector("#webgl-container");
  container.appendChild(renderer.domElement);

  // render loop
  const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, camera);
    scene.children.forEach((object) => object.update && object.update(timeStamp));
    window.requestAnimationFrame(onAnimationFrameHandler);
  };

  const render = () => window.requestAnimationFrame(onAnimationFrameHandler);

  return { scene, camera, render, container };
}

function setupControls(camera, container) {
  new OrbitControls(camera, container);
}

window.onload = async () => {
  const { scene, render, camera, container } = init();
  const dummyScene = new DummyScene();
  scene.add(dummyScene);

  setupControls(camera, container);
  render();
};
