import {
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  WireframeGeometry,
} from "three";

export class SquareShape extends Object3D {
  constructor() {
    super();
    const shape = new Shape(); //2차원
    shape.moveTo(1, 1);
    shape.lineTo(1, -1);
    shape.lineTo(-1, -1);
    shape.lineTo(-1, 1);
    shape.closePath();

    const geometry = new BufferGeometry();

    const points = shape.getPoints();
    geometry.setFromPoints(points);

    const metarial = new LineBasicMaterial({ color: 0xffff00 });

    return new Line(geometry, metarial);
  }
}

export class LoveShape extends Object3D {
  constructor() {
    super();

    const loveShape = LoveShape.shape();
    const geometry = new ShapeGeometry(loveShape);
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

  static shape() {
    const shape = new Shape();
    const x = -2.5;
    const y = -5;

    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    shape.closePath();
    return shape;
  }
}
