import {
  ExtrudeGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  WireframeGeometry,
} from "three";
import { LoveShape } from "./shape";

export class ExtrudeObject extends Object3D {
  constructor() {
    super();

    const settings = {
      steps: 2,
      depth: 4,
      bevelEnabled: false, //베벨링 처리 , 부드러운 윤곽 처리?
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 1,
    };
    const love = LoveShape.shape();

    const geometry = new ExtrudeGeometry(love, settings);

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
