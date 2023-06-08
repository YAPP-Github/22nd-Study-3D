import * as THREE from "three";
// import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


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
    camera.position.z = 50;
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
    const v: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const x = THREE.MathUtils.randFloatSpread(5);
      const y = THREE.MathUtils.randFloatSpread(5);
      const z = THREE.MathUtils.randFloatSpread(5);

      v.push(x, y, z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3))

    const sprite = new THREE.TextureLoader().load(
      "../examples/textures/sprites/disc.png"
    );

    const mat = new THREE.PointsMaterial({
      map: sprite,
      alphaTest: 0.5, // pt의 alpha값이 이보다 클때만 픽셀이 렌더링된다. 
      color: 0xff00ff,
      size: 5,
      sizeAttenuation: false
    })

    const pt = new THREE.Points(geo, mat)
    this._scene.add(pt)
  }

  private _setupControls() {
    new OrbitControls(this._camera, this._divContainer); // camera,webgl_container
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

  render(time: number) {
    this._renderer.render(this._scene, this._camera);
    // this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};