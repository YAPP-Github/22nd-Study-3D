import * as THREE from "three";
import { BufferGeometry, Mesh, TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

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
    const rawPositions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
    const positions = new Float32Array(rawPositions);
    const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const normals = new Float32Array(rawNormals);
    const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
    const colors = new Float32Array(rawColors);
    const rawUVs = [0, 0, 1, 0, 0, 1, 1, 1];
    const uvs = new Float32Array(rawUVs);

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    geometry.setIndex([0, 1, 2, 2, 1, 3]);

    const textureloader = new TextureLoader();
    const map = textureloader.load("./images.jpeg");

    const metarial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // vertexColors: true,
      map,
    });

    const box = new Mesh(geometry, metarial);
    this.scene.add(box);

    const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    this.scene.add(helper);
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

    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
