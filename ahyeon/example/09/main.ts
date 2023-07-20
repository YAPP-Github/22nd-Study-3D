import * as THREE from "three";
import { CubeTexture, Texture } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _canvas: HTMLCanvasElement;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer!.appendChild(renderer.domElement);

    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupControls();
    this._setupBackground();

    window.onresize = this.resize.bind(this);
    this.resize();

    const _canvas = document.querySelector("canvas");
    this._canvas = _canvas as HTMLCanvasElement;
    this._canvas.height = document.body.clientHeight;
    this._canvas.width = document.body.clientWidth;

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupModel() {
    const pmremG = new THREE.PMREMGenerator(this._renderer);
    const renderTarget: THREE.WebGLRenderTarget = pmremG.fromEquirectangular(this._scene.background as Texture);

    const geometry = new THREE.SphereGeometry(1);

    const material = new THREE.MeshStandardMaterial({
      color: 0x44a88,
      roughness: 0,
      metalness: 0.9,
      envMap: renderTarget.texture,
    });

    const material2 = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0,
      metalness: 0.9,
      envMap: renderTarget.texture,
    });

    const rangeMin = -20.0,
      rangeMax = 20.0;
    const gap = 10.0;
    let flag = true;

    for (let x = rangeMin; x <= rangeMax; x += gap) {
      for (let y = rangeMin; y <= rangeMax; y += gap) {
        for (let z = rangeMin; z <= rangeMax; z += gap) {
          flag = !flag;
          const cube = new THREE.Mesh(geometry, flag ? material : material2);
          cube.position.set(x, y, z);
          this._scene.add(cube);
        }
      }
    }
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.z = 100;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupBackground() {
    const loader = new THREE.TextureLoader();
    loader.load("./assets/data/cannon.jpeg", (texture) => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
      renderTarget.fromEquirectangularTexture(this._renderer, texture);
      this._scene.background = renderTarget.texture;
      this._setupModel();
    });
  }

  update(time: number) {
    time *= 0.001; // second unit
  }

  render(time: number) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }
}

window.onload = function () {
  new App();
};
