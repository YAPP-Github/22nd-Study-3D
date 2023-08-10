import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.OrthographicCamera;
  private _labelRenderer: CSS2DRenderer;

  constructor() {
    const divContainer = document.querySelector("#webgl-container") as HTMLElement;
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    divContainer.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    this._scene = scene;
    const labelRenderer = new CSS2DRenderer();
    this._labelRenderer = labelRenderer;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupMap();
    this._setupControls();
    this._setupLabel();

    window.onresize = this.resize.bind(this);
    this.resize();
    this._divContainer.addEventListener("click", this.handleLaycast.bind(this));
    this._divContainer.addEventListener("mousemove", this.handleMouseMove.bind(this));
    requestAnimationFrame(this.render.bind(this));
  }

  private _setupLabel() {
    // const labelDiv = document.createElement("div");
    // labelDiv.className = "label";
    // labelDiv.textContent = "Ahhyun Kim";
    // labelDiv.style.display = "none";
    // labelDiv.style.padding = "16px";
    // labelDiv.style.backgroundColor = "#ffffff";
    // labelDiv.style.borderRadius = "16px";
    // labelDiv.style.marginTop = "-1em";
    // const nameLabel = new CSS2DObject(labelDiv);
    // let pos = new THREE.Vector3();
    // pos = this._scene.getWorldPosition(pos);
    // nameLabel.position.copy(pos);
    // this._scene.add(nameLabel);
    // document.body.appendChild(this._labelRenderer.domElement);

    this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this._labelRenderer.domElement.style.position = "absolute";
    this._labelRenderer.domElement.style.top = "0px";
    this._labelRenderer.domElement.style.display = "none";
    this._labelRenderer.domElement.style.pointerEvents = "none";
    document.getElementById("webgl-container")!.appendChild(this._labelRenderer.domElement);
  }

  private _setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1 * aspect,
      1 * aspect, // xLeft, xRight
      1,
      -1, // yTop, yBottom
      1,
      100, // zNear, zFar
    );
    camera.position.z = 5;
    this._camera = camera;
  }

  private _setupLight() {
    const hemiLight = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 1);
    this._scene.add(hemiLight);

    const spotLightL = new THREE.SpotLight(0xffe2ec, 4);
    spotLightL.position.set(1, 1, 2);
    spotLightL.target.position.set(0, 0, 0);
    spotLightL.angle = THREE.MathUtils.degToRad(60);
    spotLightL.penumbra = 0.4;
    this._scene.add(spotLightL.target);
    this._scene.add(spotLightL);

    const spotLightR = new THREE.SpotLight(0x4b9fff, 0.5);
    spotLightR.position.set(-1, -1, 2);
    spotLightR.target.position.set(0, 0, 0);
    spotLightR.angle = THREE.MathUtils.degToRad(40);
    spotLightR.penumbra = 0.4;
    this._scene.add(spotLightR.target);
    this._scene.add(spotLightR);

    // const helperLeft = new THREE.SpotLightHelper(spotLightL);
    // this._scene.add(helperLeft);
    // const helperRight = new THREE.SpotLightHelper(spotLightR);
    // this._scene.add(helperRight);
  }

  private _setupMap() {
    const loader = new EXRLoader();
    loader.load("./assets/background.exr", (exr) => {
      const pmremGenerator = new THREE.PMREMGenerator(this._renderer);
      const hdrTexture = pmremGenerator.fromEquirectangular(exr).texture;

      const toneMappingOptions = {
        None: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
        Custom: THREE.CustomToneMapping,
      };

      // this._scene.background = hdrTexture;
      this._scene.environment = hdrTexture;

      hdrTexture.dispose();
      pmremGenerator.dispose();

      this._renderer.toneMapping = toneMappingOptions.ACESFilmic;
      this._renderer.toneMappingExposure = 1;
    });
  }

  private _setupModel() {
    // const pivot = new THREE.Object3D();
    // pivot.name = "pivot";

    const loader = new GLTFLoader();
    const head = "./assets/test.glb";
    loader.load(head, (glb) => {
      glb.scene.traverse((obj) => {
        obj.children.forEach((child) => {
          if ((child as THREE.Mesh).isMesh) child.castShadow = child.receiveShadow = true;
        });
      });
      const glbScene = glb.scene;

      const text = document.createElement("div");
      text.className = "label";
      text.textContent = "뭔가 라벨을 붙일수있어요";
      text.style.backgroundColor = "white";
      const label = new CSS2DObject(text);
      glbScene.name = "myHead";
      glbScene.position.set(10, 0, 0);
      glbScene.add(label);

      this._zoomFit(glbScene, this._camera);
      this._scene.add(glbScene);
    });
  }

  private _setupControls() {
    const controls = new OrbitControls(this._camera, this._divContainer); // camera,webgl_container
    controls.maxDistance = 100;
    controls.minDistance = 4;
  }

  private _zoomFit(obj: THREE.Object3D, camera: THREE.OrthographicCamera) {
    const box = new THREE.Box3().setFromObject(obj);
    const sizeBox = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const halfSizeModel = sizeBox * 0.5;
    const halfFov = THREE.MathUtils.degToRad(camera.right * 0.5);

    const dist = halfSizeModel / Math.tan(halfFov);
    const dir = new THREE.Vector3().subVectors(center, camera.position).normalize();

    const pos = dir.multiplyScalar(dist).add(center);
    camera.position.copy(pos);

    camera.near = sizeBox * 0.01;
    camera.far = sizeBox * 100;

    camera.updateProjectionMatrix();
    camera.lookAt(center.x, center.y, center.z);
  }

  handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this._camera);

    const intersectList = raycaster.intersectObjects(this._scene.children, true);

    if (intersectList.length > 0) {
      for (const intersect of intersectList) {
        if (intersect.object.parent?.name === "myHead") {
          this._labelRenderer.domElement.style.display = "block";
          return;
        }
      }
    }
    this._labelRenderer.domElement.style.display = "none";
  }

  handleLaycast(event: MouseEvent): void {
    event.preventDefault();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //https://stackoverflow.com/questions/18553209/orthographic-camera-and-selecting-objects-with-raycast
    // const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    // vector.unproject(this._camera);
    // const dir = vector.sub(this._camera.position).normalize();

    // raycaster.ray.set(vector, dir);
    // raycaster.ray.origin.z = 100;
    raycaster.setFromCamera(mouse, this._camera);

    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction;
    const length = 1000; // 화살표 길이; 적절한 값으로 조정
    const arrowHelper = new THREE.ArrowHelper(direction, origin, length, 0xff0000); // 빨간색 화살표
    this._scene.add(arrowHelper);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    // this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
    this._labelRenderer.setSize(width, height);
  }

  update(time: number) {
    time *= 0.001;
    const pivot = this._scene.getObjectByName("myHead");
    if (pivot) {
      pivot.rotation.y = THREE.MathUtils.degToRad(time * 10);
    }
  }

  render(time: number) {
    this.update(time);
    this._renderer.render(this._scene, this._camera);

    this._labelRenderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};
