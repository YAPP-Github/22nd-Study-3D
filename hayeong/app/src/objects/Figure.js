import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Figure extends Group {
  constructor(name) {
    const loader = new GLTFLoader();

    super();
    this.name = name;

    loader.load('/assets/Figure.gltf', (gltf) => {
      this.add(gltf.scene);
    });
  }

  update(timeStamp) {
    this.rotation.x = timeStamp / 1000;
  }
}
