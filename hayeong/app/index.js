import GltfRenderer from "./src/GltfRenderer.js";

window.onload = async () => {
  const renderer = new GltfRenderer("/assets/DummyModel.glb");
  await renderer.init();
  renderer.render();
};
