import * as THREE from "three";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "./three.js-master/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "./three.js-master/examples/jsm/lights/RectAreaLightUniformsLib";
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

  _getOrthographicCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1 * aspect,
      1 * aspect, // xLeft, xRight
      1,
      -1, // yTop, yBottom
      0.1,
      100, // zNear, zFar
    );
    camera.zoom = 0.15;
    return camera;
  }

  _getPerspectiveCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    return camera
  }

  _setupCamera() {
    const camera = this._getPerspectiveCamera();
    // const camera = this._getOrthographicCamera();
    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);
    this._camera = camera;
  }

  _getGroundMesh() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial({
      color: "#2c3e50",
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = THREE.MathUtils.degToRad(-90);
    return mesh;
  }

  _getBigSphereMesh() {
    const geometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = THREE.MathUtils.degToRad(-90);
    return mesh;
  }

  _getTorusMesh() {
    const geometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: "#9b59b6",
      roughness: 0.5,
      metalness: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  _getSmallShpereMesh() {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0.2,
      metalness: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  _setTorusPivot() {
    for (let i = 0; i < 8; i++) {
      const torusPivot = new THREE.Object3D();
      torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      const torus = this._getTorusMesh();
      torus.position.set(3, 0.5, 0);
      torusPivot.add(torus);
      this._scene.add(torusPivot);
    }
  }

  _setSmallShperePivot() {
    const spherePivot = new THREE.Object3D();
    const smallShpere = this._getSmallShpereMesh();
    smallShpere.position.set(3, 0.5, 0);
    spherePivot.add(smallShpere);
    spherePivot.name = "smallShperePivot"; // 이름으로 scene에서 언제든 조회할 수 있음
    this._scene.add(spherePivot);
  }

  _setupLight() {
    RectAreaLightUniformsLib.init();
    const light = new THREE.RectAreaLight(0xffffff, 50, 2, 0.5);
    light.position.set(0, 5, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);

    const helper = new RectAreaLightHelper(light);
    this._scene.add(helper);
    this._lightHelper = helper;

    this._scene.add(light);
    this._light = light;
  }

  _setupModel() {
    const ground = this._getGroundMesh();
    this._scene.add(ground);
    const bigSphere = this._getBigSphereMesh();
    this._scene.add(bigSphere);

    this._setTorusPivot();
    this._setSmallShperePivot();

    // 카메라가 빨간색 원을 따라가도록 하기 위한 객체 추가
    const targetPivot = new THREE.Object3D();
    const target = new THREE.Object3D();
    targetPivot.add(target);
    targetPivot.name = "targetPivot";
    target.position.set(3, 0.5, 0);
    this._scene.add(targetPivot);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const aspect = width / height;
    if (this._camera instanceof THREE.PerspectiveCamera) {
      this._camera.aspect = aspect;
    } else {
      this._camera.left = -1 * aspect;
      this._camera.right = 1 * aspect;
    }

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

    const smallShperePivot = this._scene.getObjectByName("smallShperePivot");
    if (smallShperePivot) {
      smallShperePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

      // 카메라가 smallSpere을 따라가도록 설정
      const smallSphere = smallShperePivot.children[0];
      smallSphere.getWorldPosition(this._camera.position);

      const targetPivot = this._scene.getObjectByName('targetPivot');
      if(targetPivot) {
        targetPivot.rotation.y = THREE.MathUtils.degToRad(time * 50 + 10)

        const target = targetPivot.children[0];
        const pt = new THREE.Vector3();

        target.getWorldPosition(pt);
        this._camera.lookAt(pt)
      }
      if (this._light.target) {
        const smallShpere = smallShperePivot.children[0];
        smallShpere.getWorldPosition(this._light.target.position);
        // smallSphere의 world 좌표계의 위치를 구해서 광원의 target 위치에 지정

        if (this._lightHelper) this._lightHelper.update();
      }
    }
  }
}

window.onload = function () {
  new App();
};
