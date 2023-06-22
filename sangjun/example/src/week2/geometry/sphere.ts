import { SphereGeometry } from "three";

/**
 * @param radius 구의 반지름, (default = 1)
 * @param widthSegments 구의 수평(가로) 분할수, (default = 32)
 * @param heightSegments 구의 수직(세로) 분할수, (default = 16)
 * @param phiStart 구의 수평 시작 각도, (default = 0)
 * @param phiLength 구의 수평 끝 각도, (default = Math.PI * 2)
 * @param thetaStart 구의 수직 시작 각도, (default = 0)
 * @param thetaLength 구의 수직 끝 각도, (default = Math.PI)
 *
 */
export const shpere = new SphereGeometry(
  0.9,
  32,
  12,
  0,
  Math.PI,
  0,
  Math.PI / 2
);
