import * as THREE from "three";
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
    // Metarial 기본 속성
    // const metarial = new THREE.MeshBasicMaterial({
    //   visible: true,
    //   transparent: true,
    //   opacity: 0.4,
    //   depthTest: true,
    //   depthWrite: true,
    //   side: THREE.FrontSide,
    //   color: 0xffffff,
    //   wireframe: true,
    // });

    // const metarial = new THREE.MeshLambertMaterial({
    //   transparent: true,
    //   opacity: 0.4,
    //   side: THREE.DoubleSide,
    //   color: 0xffffff,
    //   emissive: 0x221231, // 재질 자체에서 방출하는 색깔, 기본은 검정색(0x000000)
    // });

    // const metarial = new THREE.MeshPhongMaterial({
    //   //픽셀 단위로 광원에 영향받음
    //   color: 0xffffff,
    //   emissive: 0x221231, // 재질 자체에서 방출하는 색깔,  meshLembart와 동일한속성
    //   specular: 0x119911, // 재질이 반사하는 색깔
    //   shininess: 10, // 재질이 반사하는 정도
    //   flatShading: true, // 물체의 표면을 평평하게 할것인지?
    //   side: THREE.DoubleSide,
    //   wireframe: true,
    // });

    // 많이 쓰는 머테리얼
    // const metarial = new THREE.MeshStandardMaterial({
    //   color: 0xffffff,
    //   emissive: 0x221231,
    //   roughness: 0.25, // 거칠기 표현
    //   metalness: 0.2, // 금속감 표현
    //   side: THREE.FrontSide,
    // });

    // 가장 발전된? 머테리얼
    // const metarial = new THREE.MeshPhysicalMaterial({
    //   color: 0xffffff,
    //   emissive: 0x221231,
    //   roughness: 1, // 거칠기 표현
    //   metalness: 0, // 금속감 표현
    //   clearcoat: 1, // 0~1, 코팅 된 정도
    //   clearcoatRoughness: 0, // 코팅에 대한 거칠기값
    //   side: THREE.DoubleSide,
    // });

    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("./images.jpeg", (texture) => {
      texture.repeat.x = 5; //텍스쳐 반복
      texture.repeat.y = 5;
      texture.wrapS = THREE.RepeatWrapping; // 리피트 끝나고?
      texture.wrapT = THREE.RepeatWrapping;
      texture.offset.x = 0.5; //텍스쳐 Offset 변경
      texture.offset.y = 0.5;
      texture.rotation = THREE.MathUtils.degToRad(45); //텍스쳐 회전
      texture.center.x = 0.5; //텍스쳐 anchor
      texture.center.y = 0.5;

      texture.magFilter = THREE.LinearFilter; // 확대했을때 필터
      texture.minFilter = THREE.NearestMipmapLinearFilter; // 축소했을때 필터
    }); 

    const metarial = new THREE.MeshStandardMaterial({
      map,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), metarial);
    box.position.set(-1, 0, 0);
    this.scene.add(box);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      metarial
    );
    box.position.set(1, 0, 0);
    this.scene.add(sphere);
  }
  /**
   *
   * Line-metrial
   */
  // setUpModel() {
  //   const vertices = [-1, 1, 0, 1, 1, 0, -1 - 1, 0, 1, -1, 0]; //3차원 좌표 순서대로라인을 연결함
  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(vertices, 3)
  //   );
  //   // const metarial = new THREE.LineBasicMaterial({
  //   //   //선의 색상만 정의하는 LineMetarial
  //   //   color: 0xff0000,
  //   // });
  //   const metarial2 = new THREE.LineDashedMaterial({
  //     //선의 색상만 정의하는 LineMetarial
  //     color: 0xff0000,
  //     dashSize: 0.2, // 점선의 크기
  //     gapSize: 0.1, // 점선 사이 간격 크기
  //     scale: 1, // 표현 횟수를 몇번 할것인지?, 비율이 달라진다.
  //   });
  //   // const metarial3 = new THREE.LineBasicMaterial({
  //   //   //선의 색상만 정의하는 LineMetarial
  //   //   color: 0xff0000,
  //   // });

  //   const line = new THREE.Line(geometry, metarial2);
  //   this.scene.add(line);
  // }

  /**
   * 점 sprite
   */
  // setUpModel() {
  //   const vertices = [];
  //   for (let i = 0; i < 10000; i++) {
  //     const x = THREE.MathUtils.randFloatSpread(5);
  //     const y = THREE.MathUtils.randFloatSpread(5);
  //     const z = THREE.MathUtils.randFloatSpread(5);
  //     vertices.push(x, y, z);
  //   }
  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(vertices, 3)
  //   ); // 숫자 3은 3차원을 의미

  //   // 이미지에서 텍스쳐를 로드할수도 있다.
  //   // const sprite = new THREE.TextureLoader().load( ...   )//
  //   //   const metarial = new THREE.PointsMaterial({
  //   //   map: sprite, // 텍스쳐 매핑
  //   //   alphaTest:0.5, // 픽셀 의 alpha값이 이것보다 클때만 랜더링
  //   //   color:"#00ffff"
  //   //   sizeAttenuation: true, //카메라 위치에 맞게 크기 변동
  //   // });

  //   const metarial = new THREE.PointsMaterial({
  //     color: 0x00ffff, //점의 색깔
  //     size: 0.01,
  //     sizeAttenuation: true, //카메라 위치에 맞게 크기 변동
  //   });

  //   const points = new THREE.Points(geometry, metarial);
  //   this.scene.add(points);
  // }

  /**
   * 태양계 모델 setup 코드
   */
  // setUpModel() {
  //   const solarSystem = new THREE.Object3D(); //Object3D 씬 그래프로 만들예정
  //   this.solarSystem = solarSystem;
  //   this.scene.add(solarSystem);

  //   const radius = 1;
  //   const widthSegments = 12;
  //   const hiehgtSegmints = 12;
  //   const sphereGeometry = new THREE.SphereGeometry(
  //     radius,
  //     widthSegments,
  //     hiehgtSegmints
  //   );

  //   const sunMetarial = new THREE.MeshPhongMaterial({
  //     emissive: 0xffff00,
  //     flatShading: true,
  //   });

  //   const sunMesh = new THREE.Mesh(sphereGeometry, sunMetarial);
  //   sunMesh.scale.set(3, 3, 3);
  //   solarSystem.add(sunMesh);

  //   const earthOrbit = new THREE.Object3D();
  //   solarSystem.add(earthOrbit);
  //   this.earthOrbit = earthOrbit;

  //   const earthMeterial = new THREE.MeshPhongMaterial({
  //     color: 0x2233ff,
  //     emissive: 0x112244,
  //     flatShading: true,
  //   });

  //   const earthMesh = new THREE.Mesh(sphereGeometry, earthMeterial);
  //   earthOrbit.position.x = 10; // sun의 자식, sun에서 10만큼 떨어진 위치에 배치
  //   earthOrbit.add(earthMesh);

  //   const moonOrbit = new THREE.Object3D();
  //   moonOrbit.position.x = 2; //earth의 자식, earth에서 2만큼 떨어진 위치에 배치
  //   earthOrbit.add(moonOrbit);
  //   this.moonOrbit = moonOrbit;

  //   const moonMetarial = new THREE.MeshPhongMaterial({
  //     color: 0x888888,
  //     emissive: 0x222222,
  //     flatShading: true,
  //   });

  //   const moonMesh = new THREE.Mesh(sphereGeometry, moonMetarial);
  //   moonMesh.scale.set(0.5, 0.5, 0.5);
  //   moonOrbit.add(moonMesh);
  // }

  setupCamera() {
    //divContainer의 width, height를 가져옴
    const { clientWidth: width, clientHeight: height } = this.divContainer;
    //카메라 인스턴스 생성 후 camera에 할당
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 7;
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
