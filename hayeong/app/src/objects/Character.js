import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Character extends Group {
  constructor(name) {
    const loader = new GLTFLoader();

    super();
    this.name = name;

    loader.load('/assets/Character.glb', (gltf) => {
      this.add(gltf.scene);
    });
  }

  update(timeStamp) {
    this.rotation.y = timeStamp / 1000;
  }
}
