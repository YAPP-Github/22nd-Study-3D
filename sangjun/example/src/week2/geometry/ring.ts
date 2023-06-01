import { RingGeometry } from "three";

/**
 * @description 2차원 형태의 반지 모양
 * @param innerRadius 내부 반지름, (default = 0.5)
 * @param outerRadius 외부 반지름, (default = 1)
 * @param thetaSegments 링의 둘레 방향으로의 분할수, (default = 8)
 * @param phiSegments 링의 내부 방향 분할수 링의 면 분할수 (default = 1)
 * @param thetaStart 링의 시작 각도, (default = 0)
 * @param thetaLength 링의 연장값, 끝 각도, (default = Math.PI * 2)
 */
export const ring = new RingGeometry(0, 2, 1, 3, 0, Math.PI / 2);
