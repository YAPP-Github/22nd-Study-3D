import * as THREE from "three";
import {
  DoubleSide,
  FrontSide,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  RectAreaLight,
  SphereGeometry,
  SpotLight,
  TorusGeometry,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

class App {
  divContainer: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  light?:
    | THREE.DirectionalLight
    | THREE.HemisphereLight
    | THREE.SpotLight
    | THREE.RectAreaLight;
  lightHelper?: THREE.SpotLightHelper;
  mesh: THREE.Mesh | THREE.Group;
  solarSystem?: THREE.Object3D;
  earthOrbit?: THREE.Object3D;
  moonOrbit?: THREE.Object3D;

  constructor() {
    const container = document.getElementById("webgl-container") as HTMLElement;
    this.divContainer = container;
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // 랜더러 객체
    this.renderer = renderer;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // canvas elemnent인 renderer.domElement를 container에 추가
    this.divContainer.appendChild(renderer.domElement);

    //씬 생성
    this.scene = new THREE.Scene();

    // 카메라 생성
    this.camera = this.setupCamera();

    // 메시 생성
    this.mesh = this.generateCube();

    //카메라, 빛, 모델 세팅
    this.setUpLight();
    this.setUpModel();
    this.setupControls();
    //이벤트핸들러에 this 바인딩 해서 콜백함수 전달.
    window.onresize = this.resize.bind(this);

    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  setUpModel() {
    const groundGeometry = new PlaneGeometry(10, 10);
    const groundMetarial = new MeshStandardMaterial({
      color: "#2c3e50",
      roughness: 0.5,
      metalness: 0.5,
      side: DoubleSide,
    });
    const ground = new Mesh(groundGeometry, groundMetarial);
    ground.rotation.x = MathUtils.degToRad(-90);
    this.scene.add(ground);

    const bigSphereGeometry = new SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const bigSphereMaterial = new MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.2,
    });
    const bigSphere = new Mesh(bigSphereGeometry, bigSphereMaterial);
    bigSphere.rotation.x = MathUtils.degToRad(-90);
    this.scene.add(bigSphere);

    const torusGeometry = new TorusGeometry(0.4, 0.1, 32, 32);
    const torusMaterial = new MeshStandardMaterial({
      color: "#9b59b6",
      roughness: 0.5,
      metalness: 0.9,
    });
    for (let i = 0; i < 8; i++) {
      const torusPivot = new Object3D();
      const torus = new Mesh(torusGeometry, torusMaterial);
      torusPivot.rotation.y = MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      torusPivot.add(torus);
      this.scene.add(torusPivot);
    }

    const smallSphereGeometry = new SphereGeometry(0.3, 32, 32);
    const smallSphereMetarial = new MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0.2,
      metalness: 0.5,
      side: FrontSide,
    });
    const smallSpherePivot = new Object3D();
    const smallSphere = new Mesh(smallSphereGeometry, smallSphereMetarial);
    smallSpherePivot.add(smallSphere);
    smallSpherePivot.name = "smallSpherePivot";
    smallSphere.position.set(3, 0.5, 0);
    this.scene.add(smallSpherePivot);

    const targetPivot = new Object3D();
    const target = new Object3D();
    targetPivot.add(target);
    targetPivot.name = "targetPivot";
    target.position.set(3, 0.5, 0);
    this.scene.add(targetPivot);
  }

  setupCamera() {
    //divContainer의 width, height를 가져옴
    const { clientWidth: width, clientHeight: height } = this.divContainer;
    //카메라 인스턴스 생성 후 camera에 할당

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    // const camera = new THREE.OrthographicCamera(
    //   -10 * aspect, // xLeft
    //   10 * aspect, // xRight
    //   10, // yTop
    //   -10, // yBottom
    //   0.1, // zNear
    //   100 // zFar
    // );

    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);
    this.scene.add(camera);
    return camera;
  }
  setUpLight() {
    RectAreaLightUniformsLib.init();

    const light = new RectAreaLight(0xffffff, 10, 3, 5);
    light.position.set(0, 5, 0);
    light.rotation.x = MathUtils.degToRad(-90);

    const helper = new RectAreaLightHelper(light);
    light.add(helper);

    this.scene.add(light);
    this.light = light;
  }

  generateCube() {
    // box 형태의 geometry 생성, 가로 세로 깊이
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 파란색 계열의 재질 생성
    const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

    // geometry와 material을 이용해 mesh 생성
    return new THREE.Mesh(geometry, material);
  }

  resize() {
    // 리사이즈 이후, width height 가져오기
    const { clientWidth: width, clientHeight: height } = this.divContainer;
    const aspect = width / height;

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect;
    }
    // 카메라 속성값 설정,
    else {
      this.camera.left = -10 * aspect;
      this.camera.right = 10 * aspect;
    }

    //랜더러 사이즈 설정
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupControls() {
    new OrbitControls(this.camera, this.divContainer);
  }
  update(time: number) {
    time *= 0.001;
    const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot");
    const targetPivot = this.scene.getObjectByName("targetPivot");

    if (!smallSpherePivot) return;
    if (!targetPivot) return;

    smallSpherePivot.rotation.y = MathUtils.degToRad(time * 50);
    targetPivot.rotation.y = MathUtils.degToRad(time * 50 + 10); //빨간색 구 이동 위치보다 10도 앞에 위치,

    const smallSphere = smallSpherePivot.children[0];
    smallSphere.getWorldPosition(this.camera.position);

    const target = targetPivot.children[0];
    const pt = new Vector3();
    target.getWorldPosition(pt);

    this.camera.lookAt(pt);

    if (this.light instanceof SpotLight && this.light?.target) {
      smallSphere.getWorldPosition(this.light.target.position);
      if (this.lightHelper) this.lightHelper.update();
    }
  }

  render(time: number) {
    this.renderer.render(this.scene, this.camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
