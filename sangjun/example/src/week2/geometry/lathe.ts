import {
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Vector2,
  WireframeGeometry,
} from "three";

export class LatheObject extends Object3D {
  constructor() {
    super();

    const points = [];
    for (let i = 0; i < 10; i++) {
      const nextPoint = new Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8);
      points.push(nextPoint);
    }

    /**
     * @description 2차벡터 값을 받아서 회전시켜서 3차원 형태로 만듬
     * @param points 2차원 벡터 배열
     * @param segments 분할수, (default = 12)
     * @param phiStart 시작 각도, (default = 0)
     * @param phiEnd 끝 각도, (default = 2 * Math.PI)
     */
    const geometry = new LatheGeometry(points);

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
