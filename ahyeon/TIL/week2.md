# Week2

## #3. 지오메트리(Geometry)- part.2

<aside>
✅ 챕터목표
- BufferGeomtry 내에 제공되는 기본 지오메트리의 종류를 이해한다
</aside>

### 지오메트리 종류

`new THREE.CircleGeometry(radius, segments, thetaStart, theataLength)`

---

> constructor CircleGeometry(radius?: number | undefined, segments?: number | undefined, thetaStart?: number | undefined, thetaLength?: number | undefined): THREE.CircleGeometry

*@param* `radius` — Radius of the circle. Expects a `Float`. Default `1`

*@param* `segments` — Number of segments (triangles). Expects a `Integer`. Minimum `3`. Default `32`

*@param* `thetaStart` — Start angle for first segment. Expects a `Float`. Default `0`, *(three o'clock position)*.

*@param* `thetaLength` — The central angle, often called theta, of the circular sector. Expects a `Float`. Default `Math.PI * 2`, *which makes for a complete circle*.

- 원판을 그리는 지오메트리.
- 2번째 인자인 segment 수가 많을 수록 지오메트리가 원에 가까워진다. 대신 수가 늘어날수록 연산 커짐
- 3번째와 4번째는 각각 Circle의 시작각과 연장각을 가리킨다.  
  </br>
  </br>

`new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLenght);`

---

> constructor ConeGeometry(radius?: number | undefined, height?: number | undefined, radialSegments?: number | undefined, heightSegments?: number | undefined, openEnded?: boolean | undefined, thetaStart?: number | undefined, thetaLength?: number | undefined): THREE.ConeGeometry

*@param* `radius` — Radius of the cone base. Expects a `Float`. Default `1`

*@param* `height` — Height of the cone. Expects a `Float`. Default `1`

*@param* `radialSegments` — Number of segmented faces around the circumference of the cone. Expects a `Integer`. Default `32`

*@param* `heightSegments` — Number of rows of faces along the height of the cone. Expects a `Integer`. Default `1`

*@param* `openEnded` — A Boolean indicating whether the base of the cone is open or capped. Default `false`, *meaning capped*.

*@param* `thetaStart` — Start angle for first segment. Expects a `Float`. Default `0`, *(three o'clock position)*.

*@param* `thetaLength` — The central angle, often called theta, of the circular sector. Expects a `Float`. Default `Math.PI * 2`, *which makes for a complete cone*.

- 7개의 인자를 받는다. 순서대로 반지름, 높이, 둘레 분할 세그먼트 수. 강의와 다르게 기본값이 32로 나온다. 그 다음 heightSegments는 높이 방향으로의 세그먼트인데, 쪼갤 수록 매끄러운 텍스쳐. 5번째 인자인 openEnded는 밑변의 닫힘열림을 boolean으로 사용함
  </br>

이외에 `THREE.CylinderGeometry()` ,`THREE.SphereGeometry()`, `THREE.RingGeometry()`,`THREE.PlaneGeometry()`, `THREE.TorusGeometry()`, `THREE.TorusKnotGeometry()` 등 Three.js에서 기본으로 제공하는 다양한 지오메트리값이 있는데, 직접 지오메트리를 만드는 경우는 적다.

  </br>
  </br>
## #3. 지오메트리(Geometry)- part.3

THREE.ShapeGeometry

2차원의 도형을 정의하기 위한 클래스, ‘Shape’

아래와 같이 작성하여, setupModel()로 shape정의와 shape이 정의된 scene을 초기화할 수 있다.

```tsx
private _setupModel() {
    const shape = new THREE.Shape();

    const geometry = new THREE.BufferGeometry();
    const points = shape.getPoints();
    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);

    this._scene.add(line);
  }
```

이제 이 상태에서, shape의 모양을 정의하는 코드를 작성해야 한다. 이때 x,y좌표를 사용해 shape을 정의할 수 있다.

```tsx
private _setupModel() {
    const shape = new THREE.Shape();
    shape.moveTo(1, 1);
    shape.lineTo(1, -1);
    shape.lineTo(-1, -1);
    shape.lineTo(-1, 1);
    shape.closePath();

    const geometry = new THREE.BufferGeometry();
    const points = shape.getPoints();
    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);
		...
}
```

bezierCurveTo 메소드를 활용하면 베지어 곡선 형태의 도형(ex/ 하트)을 그릴 수 있다.

### Custom Curve 그리기

```tsx
private _setupModel() {
    class CustomSinCurve extends THREE.Curve<Vector3> {
      scale: number;
      constructor(scale: number) {
        super();
        this.scale = scale;
      }
      getPoint(t: number) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);

    const geometry = new THREE.BufferGeometry();
    const points = path.getPoints(30);
    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);

    this._scene.add(line);
  }
```

커브는 포인트의 집합으로 이루어져있다. CustomSinCurve는 사인파 곡선을 생성하며 인자로 넘겨받은 number를 포인트의 개수로 사용해 사인 곡선을 그린다. getPoitns는 CustomSinCurve 클래스로 생성한 사인 곡선을 이루는 포인트의 개수를 반환하는 메소드이며, 인자에 따라 현재 사인 곡선에 포인트를 더욱 더 추가해 매끄러운 곡선을 보인다.

BufferGeometry의 setFromPoints는 포인트 개수를 인자로 넘겨서 지오메트리의 포인트 값을 설정한다.

```tsx
private _setupModel() {
    class CustomSinCurve extends THREE.Curve<Vector3> {
      scale: number;
      constructor(scale: number) {
        super();
        this.scale = scale;
      }
      getPoint(t: number) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const geometry = new THREE.TubeGeometry(path); // path를 따라 지오메트리 생성

    const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const tube = new THREE.Mesh(geometry, fillMaterial);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    const group = new THREE.Group();
    group.add(tube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
  }
```

tube의 뼈대가 되어줄 그래프인 path 객체를 생성해 `new THREE.TubeGeometry()`의 첫번째 인자로 넘긴다.

### LatheGeometry(points, segments, phiStart)

```tsx
private _setupModel() {

    const points = [];
    for (let i = 0; i < 10; ++i) {
      points.push(new THREE.Vector2(Math.random() * 0.2 * 3 + 3, (i - 5) * .8));
    }

    const geometry = new THREE.LatheGeometry(points);

    const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const tube = new THREE.Mesh(geometry, fillMaterial);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    const group = new THREE.Group();
    group.add(tube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
  }
```

point를 랜덤, 사인 등으로 뽑으면 다양한 형태를 뽑아낼 수 있다. 함수를 활용해 인조적 물체를 그릴 수 있다.

### Extrude Mesh

```tsx
private _setupModel() {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;

    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const settings = {
      stepS: 1,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 12,
    }

    const geometry = new THREE.ExtrudeGeometry(shape, settings);

    const material = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const cube = new THREE.Mesh(geometry, material);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    const group = new THREE.Group()
    group.add(cube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
  }
```

bevel options는 블렌더 / 시포디 / 라이노 설정과 같다

세그먼트가 늘어날 수록 cpu가 힘들어한다

### 폰트 로더와 텍스트 지오메트리

폰트가 가진 패스와 포인트 값들을 처리하기 위한 폰트 로더를 불러온다.

```tsx
private _setupModel() {
    const fontLoader = new FontLoader();
    async function loadFonts(that: any) {
      const url = "../examples/fonts/Pretendard-Regular";
      const font = await new Promise<any>((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      })

      const geometry = new TextGeometry("test", {
        font: font,
        size: 5,
        height: 1,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: .5,
        bevelOffset: 0,
        bevelSegments: 2
      })

      const material = new THREE.MeshPhongMaterial({ color: 0x515151 });
      const cube = new THREE.Mesh(geometry, material);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

      const group = new THREE.Group()
      group.add(cube);
      group.add(line);

      that._scene.add(group);
      that._cube = group;
    }

    loadFonts(this);
  }
```
