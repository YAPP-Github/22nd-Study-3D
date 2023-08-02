import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  divContainer: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
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
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(
      "./images/glass/Glass_Window_002_basecolor.jpg"
    );
    const mapAO = textureLoader.load(
      "./images/glass/Glass_Window_002_ambientOcclusion.jpg"
    );
    const mapHeight = textureLoader.load(
      "./images/glass/Glass_Window_002_height.png"
    );
    const mapNormal = textureLoader.load(
      "./images/glass/Glass_Window_002_normal.jpg"
    );
    const mapRoughness = textureLoader.load(
      "./images/glass/Glass_Window_002_roughness.jpg"
    );
    const mapMetalic = textureLoader.load(
      "./images/glass/Glass_Window_002_metallic.jpg"
    );
    const mapAlpha = textureLoader.load(
      "./images/glass/Glass_Window_002_opacity.jpg"
    );

    const metarial = new THREE.MeshStandardMaterial({
      map,
      normalMap: mapNormal,
      displacementMap: mapHeight,
      displacementBias: -0.15,
      displacementScale: 0.2,
      aoMap: mapAO,
      aoMapIntensity: 1,
      roughnessMap: mapRoughness,
      roughness: 0.5,
      metalnessMap: mapMetalic,
      metalness: 0.5,

      alphaMap: mapAlpha,
      transparent: true,
      side: DoubleSide,
    });

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
      metarial
    );
    box.position.set(-1, 0, 0);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    this.scene.add(box);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 512, 512),
      metarial
    );
    sphere.position.set(1, 0, 0);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;

    this.scene.add(sphere);
  }

  setupCamera() {
    //divContainer의 width, height를 가져옴
    const { clientWidth: width, clientHeight: height } = this.divContainer;
    //카메라 인스턴스 생성 후 camera에 할당
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 7;
    this.scene.add(camera);
    return camera;
  }
  setUpLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    //빛의 색깔
    const color = 0xffffff;
    //빛의 강도
    const instensity = 1;
    //DirectionalLight 생성
    const light = new THREE.DirectionalLight(color, instensity);
    light.position.set(-1, 2, 4);

    // this.scene.add(light);
    this.camera.add(light);
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

    // 카메라 속성값 설정,
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    //랜더러 사이즈 설정
    this.renderer.setSize(width, height);
  }

  setupControls() {
    new OrbitControls(this.camera, this.divContainer);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // this.update(time);

    requestAnimationFrame(this.render.bind(this));
  }

  // update(time: number) {
  //   time *= 0.001; // 초 단위로 변환
  //   this.solarSystem!.rotation.y = time / 2; // 태양의 자전, 지구 + 달의 공전
  //   this.earthOrbit!.rotation.y = time * 2; // 지구의 자전, 달의 공전
  //   this.moonOrbit!.rotation.y = time * 5; // 달의 자전
  // }
}

export default App;
