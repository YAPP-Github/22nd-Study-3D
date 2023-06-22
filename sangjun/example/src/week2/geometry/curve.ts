import {
  BufferGeometry,
  Curve,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  TubeGeometry,
  Vector3,
  WireframeGeometry,
} from "three";

export class CustomSinCurve extends Curve<Vector3> {
  scale: number;
  constructor(scale: number) {
    super();
    this.scale = scale;
  }
  getPoint(t: number) {
    //t 매개변수 방정식으로 정의된 곡선의 위치를 반환, t 갯수가 많을수록 커브의 중간지점이 많아짐
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;
    return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
  }
}

export class SinObject extends Object3D {
  constructor() {
    super();
    const path = new CustomSinCurve(4);

    const geometry = new BufferGeometry();
    const points = path.getPoints(30);
    geometry.setFromPoints(points);

    const material = new LineBasicMaterial({ color: 0xffff00 });
    const line = new Line(geometry, material);
    return line;
  }
}

export class TubeObject extends Object3D {
  constructor() {
    super();
    const path = new CustomSinCurve(4);

    /**
     * @param path  곡선
     * @param tubularSegments 곡선을 나누는 세그먼트의 수
     * @param radius 곡선의 반지름 길이
     * @param radialSegments 면을 나누는 세그먼트의 수
     * @param closed 곡선을 닫을지 여부, 양 끝이 연결됨
  
     */
    const geometry = new TubeGeometry(path);

    const fillMaterial = new MeshPhongMaterial({ color: 0x515151 });
    const lineMaterial = new LineBasicMaterial({ color: 0xffff00 });

    const line = new LineSegments(
      new WireframeGeometry(geometry), // 와이어프레임 형태로 Geometry 표현, 없으면 모든 외곽선이 나오지 않을수 있음

      lineMaterial
    );
    const obj = new Mesh(geometry, fillMaterial);
    const group = new Group();

    group.add(obj);
    group.add(line);

    return group;
  }
}
