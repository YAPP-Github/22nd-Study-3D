import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import createLabel from "./label";

class App {
  private _divContainer: HTMLElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera!: THREE.OrthographicCamera;
  private _labelRenderer: CSS2DRenderer;
  private _center: THREE.Vector3;
  private _isUserInteracting: boolean = false;
  private _modelInfo: { src: string; name: string; position: THREE.Vector3Tuple; spinSpeed: number }[];
  private _activeLabel: null | HTMLElement = null;

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
    const axesHelper = new THREE.AxesHelper(5); // 5는 헬퍼의 크기를 나타냅니다.
    scene.add(axesHelper);

    const center = new THREE.Vector3(0, 0, 0); // 원의 중심 좌표
    this._center = center;

    this._modelInfo = [
      {
        src: "./assets/test.glb",
        name: "myHead_0",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_1",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_2",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_3",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_4",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_5",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_6",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
      {
        src: "./assets/test.glb",
        name: "myHead_7",
        position: this.getSquaredRandomPosition([10, 10, 10]),
        spinSpeed: this.getRandomSpinSpeed(),
      },
    ];

    this._setupCamera();
    this._setupLight();
    this._setupMap();
    this._setupControls();
    this._setupLabelRenderer();

    this._modelInfo.forEach((info) => {
      this._setupGlbModel(info);
    });

    // window.onresize = this.resize.bind(this);
    this.resize();

    // this._divContainer.addEventListener("click", this.handleLaycast.bind(this));
    this._divContainer.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
    requestAnimationFrame(this.render.bind(this));
  }

  private _setupLabelRenderer() {
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
      0.1,
      1000, // zNear, zFar
    );
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;
    camera.zoom = 0.1;
    camera.lookAt(this._center);
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

  private _setupGlbModel({
    src,
    name,
    position = [0, 0, 0],
  }: {
    src: string;
    name: string;
    position?: THREE.Vector3Tuple;
  }) {
    // const pivot = new THREE.Object3D();
    // pivot.name = "pivot";

    const loader = new GLTFLoader();

    loader.load(src, (glb) => {
      glb.scene.traverse((obj) => {
        obj.children.forEach((child) => {
          if ((child as THREE.Mesh).isMesh) child.castShadow = child.receiveShadow = true;
        });
      });
      const glbScene = glb.scene;
      glbScene.name = name;
      glbScene.position.set(...position);

      const label = createLabel({ object: glbScene });
      glbScene.add(label);
      this._scene.add(glbScene);
    });
  }

  private _setupControls() {
    const controls = new OrbitControls(this._camera, this._divContainer); // camera,webgl_container
    controls.maxDistance = 100;
    controls.minDistance = 100;
    controls.minPolarAngle = THREE.MathUtils.degToRad(0); // radians
    controls.maxPolarAngle = THREE.MathUtils.degToRad(180); // radians
    controls.target.set(0, 0, 0);

    const handleInteracting = (state: boolean) => {
      this._isUserInteracting = state;
    };
    controls.addEventListener("start", () => handleInteracting.bind(this)(true));
    controls.addEventListener("end", () => handleInteracting.bind(this)(false));
  }

  // private _zoomFit(obj: THREE.Object3D, camera: THREE.OrthographicCamera) {
  //   const box = new THREE.Box3().setFromObject(obj);
  //   const sizeBox = box.getSize(new THREE.Vector3()).length();
  //   const center = box.getCenter(new THREE.Vector3());

  //   const halfSizeModel = sizeBox * 0.5;
  //   const halfFov = THREE.MathUtils.degToRad(camera.right * 0.5);

  //   const dist = halfSizeModel / Math.tan(halfFov);
  //   const dir = new THREE.Vector3().subVectors(center, camera.position).normalize();

  //   const pos = dir.multiplyScalar(dist).add(center);
  //   camera.position.copy(pos);

  //   camera.near = sizeBox * 0.01;
  //   camera.far = sizeBox * 100;

  //   camera.updateProjectionMatrix();
  //   camera.lookAt(center.x, center.y, center.z);
  // }

  getSquaredRandomPosition(range: THREE.Vector3Tuple): THREE.Vector3Tuple {
    const random = range.map((r) => {
      const randomNumb = THREE.MathUtils.randFloat(-1, 1);
      const sign = Math.sign(randomNumb);

      const result = randomNumb * randomNumb * sign * r;
      return result;
    }) as THREE.Vector3Tuple;

    return random;
  }

  getRandomSpinSpeed() {
    return THREE.MathUtils.randFloat(-3, 3);
  }

  handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this._camera);

    const deleteActiveLabel = () => {
      if (this._activeLabel) {
        this._activeLabel.classList.remove("on");
        this._activeLabel = null;
      }
    };
    const addActiveLabel = (label: HTMLElement | null) => {
      if (label) {
        this._activeLabel = label;
        this._activeLabel.classList.add("on");
      }
    };

    const intersectList = raycaster.intersectObjects(this._scene.children, true);

    if (intersectList.length > 0) {
      for (const intersect of intersectList) {
        const name = intersect.object.parent?.name!;
        if (/myHead/g.test(name)) {
          const id = `${intersect.object.parent?.name!}_label`;
          const label = document.getElementById(id);
          deleteActiveLabel();
          addActiveLabel(label);
        }
      }
    } else {
      deleteActiveLabel();
    }
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

  update() {
    this._scene.traverse((obj) => {
      if (/myHead/g.test(obj.name)) {
        const index = Number(obj.name.split("_")[1]);
        if (!index) return;
        const spinSpeed = this._modelInfo[index].spinSpeed;
        obj.rotation.y += THREE.MathUtils.degToRad(spinSpeed);
      }
    });

    // const pivot = this._scene.getObjectByName("myHead");
    // const pivot2 = this._scene.getObjectByName("myHead2");
    // if (!(pivot && pivot2)) return;
    // pivot.rotation.y = THREE.MathUtils.degToRad(time * 10);
    // pivot2.rotation.y = THREE.MathUtils.degToRad(time * 10);
  }

  updateCameraStatus() {
    const statusElement = document.getElementById("camera_status");

    const { x: px, y: py, z: pz } = this._camera.position;
    const { x: rx, y: ry, z: rz } = this._camera.rotation;

    const cameraDirection = new THREE.Vector3();
    this._camera.getWorldDirection(cameraDirection);
    const angleInRadians = cameraDirection.angleTo(new THREE.Vector3(0, 1, 0));
    const angleInDegrees = THREE.MathUtils.radToDeg(angleInRadians);

    const cameraStatus = document.createElement("div");
    cameraStatus.id = "camera_status";
    cameraStatus.style.position = "fixed";
    cameraStatus.style.top = "0";
    cameraStatus.style.left = "0";
    cameraStatus.style.backgroundColor = "white";
    if (!statusElement) document.body.appendChild(cameraStatus);

    if (statusElement) {
      statusElement.innerHTML = `
      Position: ${Number(px).toFixed(4)}, ${Number(py).toFixed(4)}, ${Number(pz).toFixed(4)}<br>
      Rotation: ${Number(rx).toFixed(4)}, ${Number(ry).toFixed(4)}, ${Number(rz).toFixed(4)}<br>
      Direction: ${Number(angleInDegrees).toFixed(4)}<br>
      Zoom: ${this._camera.zoom}
      `;
    }
  }

  /**
   * xy평면 회전
   */
  rotateScene() {
    if (this._isUserInteracting) return;
    this._scene.rotation.y += THREE.MathUtils.degToRad(0.1);
  }

  render() {
    this.update();
    this.rotateScene();
    this._renderer.render(this._scene, this._camera);
    this._labelRenderer.render(this._scene, this._camera);
    // this.updateCameraStatus();
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function () {
  new App();
};
