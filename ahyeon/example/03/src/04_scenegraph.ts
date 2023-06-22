import * as THREE from "three";
// import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _solarSystem: THREE.Object3D<THREE.Event>;
  private _earthOrbit: THREE.Object3D<THREE.Event>;
  private _moonOrbit: THREE.Object3D<THREE.Event>;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);

    divContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    this._scene = scene;

    this._solarSystem = new THREE.Object3D();
    this._earthOrbit = new THREE.Object3D();
    this._moonOrbit = new THREE.Object3D();

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
    const solarSystem = new THREE.Object3D();
    this._scene.add(solarSystem);

    const radius = 1;
    const widthSegments = 12;
    const heightSegments = 12;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const sunMat = new THREE.MeshPhongMaterial({ emissive: 0xffff00, flatShading: true });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMat);
    sunMesh.scale.set(3, 3, 3);
    solarSystem.add(sunMesh);


    const earthOrbit = new THREE.Object3D();
    const earthMat = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x112244, flatShading: true });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMat);
    earthMesh.scale.set(1, 1, 1);
    earthOrbit.position.x = 10;
    earthOrbit.add(earthMesh);
    solarSystem.add(earthOrbit);

    const moonOrbit = new THREE.Object3D();
    const moonMat = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMat);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonMesh.position.x = 2;
    moonOrbit.add(moonMesh);

    this._solarSystem = solarSystem;
    this._earthOrbit = earthOrbit;
    this._moonOrbit = moonOrbit;
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

  update(time: number) {
    time *= 0.001; // secondunit
    this._solarSystem.rotation.y = time / 2;
    this._earthOrbit.rotation.y = time / 2;
    this._moonOrbit.rotation.y = time / 4;
  }

  render(time: number) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};