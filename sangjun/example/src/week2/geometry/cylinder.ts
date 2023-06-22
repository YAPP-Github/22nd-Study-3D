import { CylinderGeometry } from "three";

/**
 * @param radiusTop 원통의 윗면 반지름, (default = 1)
 * @param radiusBottom 원통의 아랫면 반지름, (default = 1)
 * @param height 원통의 높이, (default = 1)
 * @param radialSegments 원통의 둘레 분할수, (default = 8)
 * @param heightSegments 원통의 높이 분할수, (default = 1)
 * @param openEnded 원통의 밑면을 열거나 닫음, (default = false)
 * @param thetaStart 원통의 시작 각도, (default = 0)
 * @param thetaEnd 원통의 끝 각도, (default = Math.PI * 2)
 */
export const cylinder = new CylinderGeometry(
  0.9, //radiusTop
  0.9, //radiusBottom
  1.6, //height
  16, //radialSegments
  16, //heightSegments
  true, //openEnded
  0, //thetaStart
  Math.PI / 2 //thetaEnd
);
