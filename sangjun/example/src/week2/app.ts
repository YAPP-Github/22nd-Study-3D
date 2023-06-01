import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  divContainer: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cube: THREE.Mesh | THREE.Group;

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

    // 큐브 생성
    this.cube = this.generateCube();

    //카메라, 빛, 모델 세팅
    this.setUpLight();
    this.setUpModel(this.cube);
    this.setupControls();
    //이벤트핸들러에 this 바인딩 해서 콜백함수 전달.
    window.onresize = this.resize.bind(this);

    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  setupCamera() {
    //divContainer의 width, height를 가져옴
    const { clientWidth: width, clientHeight: height } = this.divContainer;
    //카메라 인스턴스 생성 후 camera에 할당
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2;
    return camera;
  }
  setUpLight() {
    //빛의 색깔
    const color = 0xffffff;
    //빛의 강도
    const instensity = 1;
    //DirectionalLight 생성
    const light = new THREE.DirectionalLight(color, instensity);
    light.position.set(-1, 2, 4);

    console.log(light);
    this.scene.add(light);
  }

  // 파란 큐브에서 노란 선이 있는 큐브로 변화
  generateCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

    const line = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry), // 와이어프레임 형태로 Geometry 표현, 없으면 모든 외곽선이 나오지 않을수 있음
      lineMaterial
    );
    const cube = new THREE.Mesh(geometry, fillMaterial);
    const group = new THREE.Group();

    group.add(cube);
    group.add(line);

    return group;
  }

  setUpModel(obj: THREE.Mesh | THREE.Group) {
    this.scene.add(obj);
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

  // update(time: number) {
  //   time *= 0.001; // 초 단위로 변환
  //   this.cube.rotation.x = time; // 시간에 따라 회전
  //   this.cube.rotation.y = time;
  // }
}

export default App;
