import * as THREE from "three";

import "./style.css";

class App {
  _divContainer: HTMLElement;
  _renderer: THREE.WebGLRenderer;
  _scene: THREE.Scene;
  _camera: THREE.PerspectiveCamera;
  _cube: THREE.Mesh;

  constructor() {
    const container = document.getElementById("webgl-container") as HTMLElement;
    this._divContainer = container;
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // 랜더러 객체
    this._renderer = renderer;
    this._renderer.setPixelRatio(window.devicePixelRatio);

    // canvas elemnent인 renderer.domElement를 container에 추가
    this._divContainer.appendChild(renderer.domElement);

    //씬 생성
    this._scene = new THREE.Scene();

    //카메라, 빛, 모델 세팅
    this._camera = this._setupCamera();
    this._setUpLight();
    this._cube = this._generateCube();
    this._setUpModel(this._cube);

    //이벤트핸들러에 this 바인딩 해서 콜백함수 전달.
    window.onresize = this.resize.bind(this);

    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    //divContainer의 width, height를 가져옴
    const { clientWidth: width, clientHeight: height } = this._divContainer;
    //카메라 인스턴스 생성 후 _camera에 할당
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2;
    return camera;
  }
  _setUpLight() {
    //빛의 색깔
    const color = 0xffffff;
    //빛의 강도
    const instensity = 1;
    //DirectionalLight 생성
    const light = new THREE.DirectionalLight(color, instensity);
    light.position.set(-1, 2, 4);

    console.log(light);
    this._scene.add(light);
  }

  _generateCube() {
    // box 형태의 geometry 생성, 가로 세로 깊이
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 파란색 계열의 재질 생성
    const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

    // geometry와 material을 이용해 mesh 생성
    return new THREE.Mesh(geometry, material);
  }
  _setUpModel(obj: THREE.Mesh) {
    // scene에 mesh 추가
    this._scene.add(obj);
  }

  resize() {
    // 리사이즈 이후, width height 가져오기
    const { clientWidth: width, clientHeight: height } = this._divContainer;

    // 카메라 속성값 설정,
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    //랜더러 사이즈 설정
    this._renderer.setSize(width, height);
  }

  render(time: number) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time: number) {
    time *= 0.001; // 초 단위로 변환
    this._cube.rotation.x = time; // 시간에 따라 회전
    this._cube.rotation.y = time;
  }
}

export default App;
