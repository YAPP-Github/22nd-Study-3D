import * as THREE from "three";
import { VertexNormalsHelper } from "./three.js-master/examples/jsm/helpers/VertexNormalsHelper";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls";

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
    camera.position.z = 2;
    this._camera = camera;
  }

  _setupLight() {
    // 광원 생성 시 광원의 색상과 세기, 위치 값이 필요
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    const rawPositions = [-1 - 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];

    const positions = new Float32Array(rawPositions);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("poisition", new THREE.BufferAttribute(positions, 3)); // 하나의 정점이 (x, y, z) 3개의 항목으로 구성됨
    // Vertex index 지정. 정점의 배치 순서가 반시계 방향이어여야 한다
    geometry.setIndex([0, 1, 2, 2, 1, 3]);

    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geometry, material);
    this._scene.add(box);

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
    this._cube.rotation.x = time;
    this._cube.rotation.y = time;
    // 시간은 계속 변하므로 큐브가 계속 회전함
  }
}

window.onload = function () {
  new App();
};
