import * as THREE from "three";
// import { DirectionalLight } from "three";
// import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _light: THREE.DirectionalLight;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    divContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    this._scene = scene;

    const light = new THREE.DirectionalLight;
    this._light = light;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  private _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);
    this._camera = camera;
    this._scene.add(camera);
  }

  private _setupLight() {

    /** 지표면 반사광
     * - 상단 광원, 하단 광원, 광원 세기 */
    const hemiLight = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 0.5);
    this._scene.add(hemiLight);

    /** 직선광
     * - position에서 시작해 target을 직선으로 비추는 광원
     */
    const directLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directLight.position.set(0, 5, 0);
    directLight.target.position.set(0, 0, 0);

    this._scene.add(directLight.target);
    this._scene.add(directLight);

    directLight.shadow.camera.top = directLight.shadow.camera.right = 6;
    directLight.shadow.camera.bottom = directLight.shadow.camera.left = -6;
    directLight.shadow.mapSize.width = directLight.shadow.mapSize.height = 1024;
    directLight.shadow.radius = 8;

    this._light = directLight;
    directLight.castShadow = true;
  }

  private _setupModel() {
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.4, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.receiveShadow = true;

    const sphereGeo = new THREE.TorusKnotGeometry(1, 0.3, 128, 64, 2, 3);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2 });
    const bigSphere = new THREE.Mesh(sphereGeo, sphereMat);
    bigSphere.position.y = 2;
    bigSphere.receiveShadow = true;
    bigSphere.castShadow = true;

    const torusGeo = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMat = new THREE.MeshStandardMaterial({ color: "9b59b6", roughness: 0.5, metalness: 0.9 });

    for (let i = 0; i < 8; i++) {
      const pivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.castShadow = true;
      torus.receiveShadow = true;
      pivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      pivot.add(torus);
      this._scene.add(pivot);
    }

    const smallGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const smallMat = new THREE.MeshStandardMaterial({ color: "#e74c3c", roughness: 0.2, metalness: 0.4 });
    const smallpv = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(smallGeo, smallMat);
    smallSphere.castShadow = true;
    smallSphere.receiveShadow = true;
    smallSphere.position.set(3, 0.5, 0);
    smallpv.add(smallSphere);
    smallpv.name = "smallSpherePivot";

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

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  update(time: number) {
    time *= 0.001;
    const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

      if (this._light.target) {
        const sm = smallSpherePivot.children[0];
        sm.getWorldPosition(this._light.target.position);
      }
    }
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