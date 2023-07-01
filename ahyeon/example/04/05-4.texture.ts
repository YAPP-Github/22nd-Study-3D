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
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("images/glass/Glass_Window_004_basecolor.jpg");
    const mapAO = textureLoader.load("images/glass/Glass_Window_004_ambientOcclusion.jpg");
    const mapHeight = textureLoader.load("images/glass/Glass_Window_004_height.jpg");
    const mapNormal = textureLoader.load("images/glass/Glass_Window_004_normal.jpg");
    const mapRough = textureLoader.load("images/glass/Glass_Window_004_roughness.jpg");
    const mapMetal = textureLoader.load("images/glass/Glass_Window_004_metalic.jpg");
    const mapAlpha = textureLoader.load("images/glass/Glass_Window_004_opacity.jpg");
    const mat = new THREE.MeshStandardMaterial({
      map: map,

      // mesh에 대한 광원값 계산. 각 픽셀 별 좌표에 대한 법선 벡터를 이미지 내 rgb값으로 계산
      normalMap: mapNormal,

      // hiehgt map 속성, Scale은 말그대로 높이의 값이고 Bias
      displacementMap: mapHeight,
      displacementScale: 0.2,
      // displacementBias: 0.2,

      // 환경맵 속성. Ambient light랑 함께 작동한다.
      aoMap: mapAO,
      aoMapIntensity: 1,

      // texture roughness
      roughnessMap: mapRough,
      roughness: 0.2,

      // metal texture
      metalnessMap: mapMetal,
      metalness: 0.9,

      // opacity properties
      alphaMap: mapAlpha,
      transparent: true,
      side: THREE.DoubleSide, //glass 텍스쳐의 양면 렌더링

      // 텍스쳐로 만들 수 있는 light map. 별도의 이미지 필요
      // lightMap: map,
      // lightMapIntensity: 1,
      // lightMapType: THREE.PCFSoftShadowMap,
      // lightMapEncoding: THREE.sRGBEncoding,
      // lightMapRepeat: new THREE.Vector2(1024, 1024),
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256, 256, 256), mat)
    box.position.set(0, 0, 2);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 128, 128), mat);
    sphere.position.set(0, 0, 0);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
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

  render() {
    this._renderer.render(this._scene, this._camera);
    // this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};