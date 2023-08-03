import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

console.log("main.ts file");
window.onload = () => {
  alert("hello");
};

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    divContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  private _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 5;
    this._camera = camera;
  }

  private _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  private _setupModel() {
    const loader = new GLTFLoader();
    const url = "./assets/test.glb";
    loader.load(url, (glb) => {
      const root = glb.scene;
      this._scene.add(root);
      this._zoomFit(root, this._camera);
    });
  }

  private _setupControls() {
    new OrbitControls(this._camera, this._divContainer); // camera,webgl_container
  }

  private _zoomFit(obj: THREE.Object3D, camera: THREE.PerspectiveCamera) {
    const box = new THREE.Box3().setFromObject(obj);
    const sizeBox = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const halfSizeModel = sizeBox * 0.5;
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);

    const dist = halfSizeModel / Math.tan(halfFov);
    const dir = new THREE.Vector3().subVectors(center, camera.position).normalize();

    const pos = dir.multiplyScalar(dist).add(center);
    camera.position.copy(pos);

    camera.near = sizeBox * 0.01;
    camera.far = sizeBox * 100;

    camera.updateProjectionMatrix();
    camera.lookAt(center.x, center.y, center.z);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  // update(time: number) {
  //   time *= 0.001; // secondunit
  // }

  render() {
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};
