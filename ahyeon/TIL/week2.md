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
