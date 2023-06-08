import { ConeGeometry } from "three";

/**
 * @param radius 기본 원의 반지름 크기, (default = 1)
 * @param height 원뿔의 높이, (default = 1)
 * @param radialSegments 원뿔의 둘레 분할수, (default = 8)
 * @param heightSegments 원뿔의 높이 분할수, (default = 1)
 * @param openEnded 원뿔의 밑면을 열거나 닫음, (default = false)
 * @param  thetaStart 원뿔의 시작 각도, (default = 0)
 * @param thetaEnd 원뿔의 끝 각도, (default = Math.PI * 2)
 */

export const cone = new ConeGeometry(0.5, 1, 16, 16, true, 0, Math.PI / 2);
