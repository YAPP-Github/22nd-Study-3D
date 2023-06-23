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
    camera.position.z = 3;
    this._camera = camera;
    this._scene.add(camera);
  }

  private _setupLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this._scene.add(ambientLight); // 환경 광원이기때문에 scene에 추가

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._camera.add(light);
  }

  private _setupModel() {
    const rawPos = [
      -1, -1, 0,
      1, -1, 0,
      -1, 1, 0,
      1, 1, 0
    ]
    const rawNorm = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ]
    const rawCol = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      1, 1, 0
    ]
    const rawUV = [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ]
    const pos = new Float32Array(rawPos);
    const norm = new Float32Array(rawNorm);
    const col = new Float32Array(rawCol);
    const uv = new Float32Array(rawUV);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(norm, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(col, 3)); // 적용을 위해선 'vertexColors" 옵션을 Material에서 true
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geometry.setIndex([0, 1, 2, 2, 1, 3])

    // 자동으로 법선 vector를 연산해주는 method
    // geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, vertexColors: true });
    const mesh = new THREE.Mesh(geometry, material);
    this._scene.add(mesh);

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

  render() {
    this._renderer.render(this._scene, this._camera);
    // this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};