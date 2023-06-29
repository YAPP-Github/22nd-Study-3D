import * as THREE from "three";
// import { DirectionalLight } from "three";
// import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _light: THREE.PointLight;
  private _lightHelper: THREE.PointLightHelper;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);

    divContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    this._scene = scene;

    const light = new THREE.PointLight;
    this._light = light;

    const lightHelper = new THREE.PointLightHelper(light);
    this._lightHelper = lightHelper;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.render.bind(this));

    this._divContainer.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    // const aspect = window.innerWidth / window.innerHeight;
    // const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 0.1, 100);

    // camera.zoom = 0.15; 

    // camera.position.set(7, 7, 0);
    // camera.lookAt(0, 0, 0);

    this._camera = camera;
    this._scene.add(camera);
  }

  private _setupLight() {
    /** 주변환경 광 */
    const light = new THREE.AmbientLight(0xffffff, 0.4)
    this._scene.add(light);

    /** 지표면 반사광
     * - 상단 광원, 하단 광원, 광원 세기 */
    const hemiLight = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 0.1);
    this._scene.add(hemiLight);

    /** 직선광
     * - position에서 시작해 target을 직선으로 비추는 광원
     */
    const directLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directLight.position.set(1, 1, 1);
    directLight.target.position.set(0, 0, 0);
    this._scene.add(directLight.target);
    this._scene.add(directLight);

    /** 포인트 광
     * - 전구 모양의 광원
     */
    const pointLight = new THREE.PointLight(0xAAAAAA, 0.35);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.bias = 0.0001;
    this._scene.add(pointLight);
    this._light = pointLight;

    const helper = new THREE.PointLightHelper(pointLight);
    this._scene.add(helper);
    this._lightHelper = helper;

    /** 스팟 라이트
     * - 스포트라이트라고 부르는 그것
     */
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(1, 1, 1);
    spotLight.target.position.set(0, 0, 0);
    spotLight.angle = THREE.MathUtils.degToRad(40);
    spotLight.penumbra = 0.4
    this._scene.add(spotLight.target);
    this._scene.add(spotLight);
  }

  private _setupModel() {
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.4, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);

    const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2 });
    const bigSphere = new THREE.Mesh(sphereGeo, sphereMat);
    bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);

    const torusGeo = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMat = new THREE.MeshStandardMaterial({ color: "9b59b6", roughness: 0.5, metalness: 0.9 });

    for (let i = 0; i < 8; i++) {
      const pivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeo, torusMat);
      pivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      pivot.add(torus);
      this._scene.add(pivot);
    }

    const smallGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const smallMat = new THREE.MeshStandardMaterial({ color: "#e74c3c", roughness: 0.2, metalness: 0.4 });
    const smallpv = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(smallGeo, smallMat);
    smallpv.add(smallSphere);
    smallpv.name = "smallSpherePivot";
    smallSphere.position.set(3, 0.5, 0);

    const targetPv = new THREE.Object3D();
    const t = new THREE.Object3D();
    targetPv.add(t);
    targetPv.name = 'targetPivot';
    targetPv.position.set(3, 0.5, 0);
    this._scene.add(targetPv);


    this._scene.add(ground);
    this._scene.add(bigSphere);
    this._scene.add(smallpv);
  }


  private _setupControls() {
    new OrbitControls(this._camera, this._divContainer); // camera,webgl_container
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const aspect = width / height;

    if (this._camera instanceof THREE.PerspectiveCamera) {
      // perspective 이면 aspect를 지정하고
      this._camera.aspect = aspect;
    } else {
      // orthographic camera이면 xLeft와 xRight를 지정한다
      // this._camera.left = -1 * aspect; //xLeft
      // this._camera.right = aspect; //xRight
    }

    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  update(time: number) {
    time *= 0.001;
    const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

      const smallSphere = smallSpherePivot.children[0];

      const t = smallSphere.children[0];
      const pt = new THREE.Vector3();

      t.getWorldPosition(pt);
      this._camera.lookAt(pt);

      // const tPv = this._scene.getObjectByName("targetPivot");
      // if (tPv) {
      //   tPv.rotation.y = THREE.MathUtils.degToRad(time * 50 + 10);

      //   const pt = new THREE.Vector3();

      //   t.getWorldPosition(pt);
      //   this._camera.lookAt(pt);
      // }
    }
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(this._camera);
    const dir = vector.sub(this._camera.position).normalize();
    const distance = -this._camera.position.z / dir.z;
    const pos = this._camera.position.clone().add(dir.multiplyScalar(distance));
    this._light.position.copy(pos);
    this._lightHelper.position.copy(pos);
  }


  render(time: number) {

    this.update(time);
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};