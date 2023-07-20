# Week9. 배경 설정과 map의 종류

## WIL

### fog

![image](https://github.com/YAPP-Github/22nd-Study-3D/assets/51940808/4f99a6f7-99a5-49b6-bdec-773af60d3998)

> 💡 **constructor Fog(color: THREE.ColorRepresentation, near?: number | undefined, far?: number | undefined): THREE.Fog**
> The color parameter is passed to the Color constructor to set the color property
> *@remarks* — Color can be a hexadecimal integer or a CSS-style string.
> *@param* `color` > *@param* `near` — Expects a `Float` > *@param* `far` — Expects a `Float`

- near : 안개가 시작하는 값
- far : 안개가 끝나는 값. 해당 값에 도달하면 물체가 안개에 온전히 가려지게 된다

![image](https://github.com/YAPP-Github/22nd-Study-3D/assets/51940808/85d69eb3-96af-48db-9b61-dcccda407210)

> 💡 **constructor FogExp2(color: THREE.ColorRepresentation, density?: number | undefined): THREE.FogExp2**
> The color parameter is passed to the Color constructor to set the color property
> *@remarks* — Color can be a hexadecimal integer or a CSS-style string.
> *@param* `color` > *@param* `density` — Expects a `Float`

Fog와 같은 역할을 하지만, density parameter하나로만 공간을 조정하기 때문에 시각적 효과는 덜하다

### Setup Background image

1. 이미지 로더 객체를 생성한다
2. 이미지 로더에 이미지를 불러와서 `texture` 객체를 생성하고 백그라운드에 할당한다.

![image](https://github.com/YAPP-Github/22nd-Study-3D/assets/51940808/8c0da918-6ca9-499b-97cf-9131b85c3ebd)

```tsx
_setupBackground() {
    const loader = new THREE.TextureLoader();
    loader.load("./assets/data/image.jpg", (texture) => {
      this._scene.background = texture;
      this.resize();

      this._setupModel();
    });
  }
```

```tsx
setupModel() {
    const pmremG = new THREE.PMREMGenerator(this._renderer);
    const renderTarget: THREE.WebGLRenderTarget = pmremG.fromEquirectangular(this._scene.background as Texture);

    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x44a88,
      roughness: 0,
      metalness: 0.9,
      envMap: renderTarget.texture,
    });
...
}
```

1. `setupModel` method에 `PMREMGenerator` 객체를 생성한다.
2. renderTarget에 PMREMGenerator 객체의 `fromEquirectangular` 메소드로 백그라운드 이미지로부터 envMap을 만들어준다.
3. 만들어진 renderTarget의 texture를 material의 envMap에 할당한다.

### HDR loader vs PMREMGenerator

HDR 로더로 환경맵을 불러오면 PBR material들에 대해 환경 맵을 자동으로 설정해주기 때문에 `RGBE Loader`나 `EXRLoader` 로 불러오면 간편하다

[RGBELoader low quality of texture - 256 x 256](https://stackoverflow.com/questions/69534964/rgbeloader-low-quality-of-texture-256-x-256)

### CubeMap으로 환경 구성하기

**무료 CubeMap Source site**

[Humus - Textures](http://www.humus.name/index.php?page=Textures)

위 링크에서 적절한 이미지를 찾아, 다운로드한다.

![image](https://github.com/YAPP-Github/22nd-Study-3D/assets/51940808/d85b02ae-28b8-4f27-a3f2-48f79827fc56)

```tsx
_setupModel() {
    const pmremG = new THREE.PMREMGenerator(this._renderer);
    const renderTarget: THREE.WebGLRenderTarget
			= pmremG.fromCubemap(this._scene.background as CubeTexture);
....
}
```

```tsx
_setupBackground() {
    const loader = new THREE.CubeTextureLoader();
    loader.load(
      [
        "./assets/data/skybox/posx.jpg",
        "./assets/data/skybox/negx.jpg",
        "./assets/data/skybox/posy.jpg",
        "./assets/data/skybox/negy.jpg",
        "./assets/data/skybox/posz.jpg",
        "./assets/data/skybox/negz.jpg",
      ],
      (text) => {
        this._scene.background = text;
        this._setupModel();
      },
    );
  }
```

다운로드한 이미지를 로더 객체에 로드해주고 콜백 함수에서 scene의 백그라운드에 할당한다.

주의할 점은, texture 세팅시 이미지의 순서를 잘 지켜야한다는 점! cubeTexture로 만든 background의 envMap을 만들 땐, PMREMGenerator의 `fromCubemap` 메소드를 사용한다.

→ `pmremG.fromCubemap(this._scene.background as CubeTexture);`

### HDR로 환경 구성하기

**무료 HDRI Source site**

[HDRIs • Poly Haven](https://polyhaven.com/hdris)

![image](https://github.com/YAPP-Github/22nd-Study-3D/assets/51940808/cefbc434-5283-432a-90ff-bb06dcc93f23)

```tsx
_setupModel() {
    const pmremG = new THREE.PMREMGenerator(this._renderer);
    const renderTarget: THREE.WebGLRenderTarget
			= pmremG.fromEquirectangular(this._scene.background as Texture);
....
}
```

```tsx
_setupBackground() {
    const loader = new THREE.TextureLoader();
    loader.load("./assets/data/cannon.jpeg", (texture) => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
      renderTarget.fromEquirectangularTexture(this._renderer, texture);
      this._scene.background = renderTarget.texture;
      this._setupModel();
    });
  }
```

무료 HDR 사이트에 들어가서 이미지를 다운로드 한다. 4K는 화질 해상도로, 높아질 수록 이미지가 선명해지는 동시에 그 크기가 증가한다.

실제 웹에선 이미지를 이정도로 고화질로 쓰진 않고 재질 표면에 rough가 들어가고, 환경은 따로 처리해 fog가 깔리므로 고화질일 수록 좋은 것은 아니다.
