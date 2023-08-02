import * as THREE from "three";
import { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class GltfRenderer {
  /**
   * @type {Scene}
   */
  scene;
  /**
   * @type {import("three/examples/jsm/loaders/GLTFLoader").GLTF}
   */
  gltf;

  constructor(glbUrl, containerId = "webgl-container") {
    const container = document.querySelector(`#${containerId}`);

    /* Renderer 객체 생성 */
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias: 3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현됨
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement); // renderer.domElement: canvas 타입의 dom 객체

    this._glbUrl = glbUrl;
    this._container = container;
    this._renderer = renderer;
  }

  async init() {
    const loader = new GLTFLoader();
    try {
      const scene = new THREE.Scene();
      const gltf = await loader.loadAsync(this._glbUrl);

      this.scene = scene;
      this.gltf = gltf;
    } catch (e) {
      console.error(`Failed to load gltf from ${this._glbUrl}`);
      throw e;
    }

    this._setupCamera();
    this._setupControls();
    this._setupLight();
  }

  render() {
    /* resize 이벤트 처리 */
    window.onresize = this._resize.bind(this);
    this._resize();

    requestAnimationFrame(this._render.bind(this));
  }

  _setupCamera() {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.y = 5;
    camera.position.z = 5;
    this._camera = camera;
  }

  _setupControls() {
    new OrbitControls(this._camera, this._container);
  }

  _setupLight() {
    // 광원 생성 시 광원의 색상과 세기, 위치 값이 필요
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._light = light;
  }

  _resize() {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  _render(time) {
    this.scene.add(this._light);
    this.gltf.scenes.forEach((scene) => {
      this.scene.add(scene);
    });
    this._renderer.render(this.scene, this._camera); // renderer가 scene을 camera의 시점으로 렌더링함
    // this._update(time); // 속성값을 변경하여 애니메이션 효과 구현
    requestAnimationFrame(this._render.bind(this)); // render 메소드를 적당한 시점에, 최대한 빠르게 반복 호출
  }
}

export default GltfRenderer;
