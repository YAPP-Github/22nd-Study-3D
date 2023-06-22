import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ExtrudeObject } from "./geometry";

class App {
  divContainer: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  // mesh: THREE.Mesh | THREE.Group;

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
    // this.mesh = this.generateMesh();

    //카메라, 빛, 모델 세팅
    this.setUpLight();
    this.setUpModel(new ExtrudeObject());
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
    camera.position.z = 15;
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

    this.scene.add(light);
  }

  // generateMesh() {
  //   const geometry = shpere;
  //   const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
  //   const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

  //   const line = new THREE.LineSegments(
  //     new THREE.WireframeGeometry(geometry), // 와이어프레임 형태로 Geometry 표현, 없으면 모든 외곽선이 나오지 않을수 있음
  //     lineMaterial
  //   );
  //   const obj = new THREE.Mesh(geometry, fillMaterial);
  //   const group = new THREE.Group();

  //   group.add(obj);
  //   group.add(line);

  //   return group;
  // }

  setUpModel(obj: THREE.Object3D) {
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
  //   this.mesh.rotation.x = time; // 시간에 따라 회전
  //   this.mesh.rotation.y = time;
  // }
}

export default App;
