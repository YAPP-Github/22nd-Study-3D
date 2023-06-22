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
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(
      "three/examples/textures/uv_grid_opengl.jpg",
      texture => {
        texture.repeat.x = 2;
        texture.repeat.y = 2;

        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;

        texture.offset.x = 1; //UV좌표 시작값을 지정
        texture.offset.y = 1; //(0,0) (0,1) (1,0) (1,1) 

        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.NearestMipMapLinearFilter;

      });

    const mat = new THREE.MeshStandardMaterial({
      map: map
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat)
    box.position.set(0, 0, 2);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), mat);
    sphere.position.set(0, 0, 0);
    this._scene.add(box, sphere);
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