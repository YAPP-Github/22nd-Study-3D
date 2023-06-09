import * as THREE from "three";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "./three.js-master/examples/jsm/helpers/VertexNormalsHelper";
class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    /* Renderer 객체 생성 */
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias: 3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현됨
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement); // renderer.domElement: canvas 타입의 dom 객체
    this._renderer = renderer;

    /* Scene 객체 생성 */
    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    /* resize 이벤트 처리 */
    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 5;
    this._camera = camera;
    this._scene.add(camera); // 광원이 카메라와 함께 이동하도록 설정
  }

  _setupLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this._scene.add(ambientLight);

    // 광원 생성 시 광원의 색상과 세기, 위치 값이 필요
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // this._scene.add(light);
    this._camera.add(light); // 광원이 카메라와 함께 이동하도록 설정
  }

  _setupModel() {
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("/assets/images/glass/Glass_Window_002_basecolor.jpg");
    const mapAO = textureLoader.load("/assets/images/glass/Glass_Window_002_ambientOcclusion.jpg");
    const mapHeight = textureLoader.load("/assets/images/glass/Glass_Window_002_height.png");
    const mapNormal = textureLoader.load("/assets/images/glass/Glass_Window_002_normal.jpg");
    const mapRoughness = textureLoader.load("/assets/images/glass/Glass_Window_002_roughness.jpg");
    const mapMetalic = textureLoader.load("/assets/images/glass/Glass_Window_002_metallic.jpg");
    const mapAlpha = textureLoader.load("/assets/images/glass/Glass_Window_002_opacity.jpg");

    const material = new THREE.MeshStandardMaterial({
      map,
      normalMap: mapNormal,

      displacementMap: mapHeight,
      displacementScale: 0.2,
      displacementBias: -0.15,

      aoMap: mapAO,
      aoMapIntensity: 1,

      roughnessMap: mapRoughness,
      roughness: 0.5,

      metalnessMap: mapMetalic,
      metalness: 0.5,

      alphaMap: mapAlpha,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256, 256, 256), material);
    box.position.set(-1, 0, 0);
    this._scene.add(box);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 512), material);
    sphere.position.set(1, 0, 0);
    this._scene.add(sphere);

    // aoMap을 위한 속성 지정
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  /**
   * @param {number} time 렌더링이 처음 시작된 이후 경과된 시간값(ms).
   * scene의 애니메이션에 이용
   */
  render(time) {
    this._renderer.render(this._scene, this._camera); // renderer가 scene을 camera의 시점으로 렌더링함
    this.update(time); // 속성값을 변경하여 애니메이션 효과 구현
    requestAnimationFrame(this.render.bind(this)); // render 메소드를 적당한 시점에, 최대한 빠르게 반복 호출
  }

  update(time) {
    time *= 0.001; // ms -> s
    // 시간은 계속 변하므로 큐브가 계속 회전함
  }
}

window.onload = function () {
  new App();
};
