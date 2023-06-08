import { CircleGeometry } from "three";

/**
 * @param radius 원판크기,
 * @param segments 분할개수(8), 값이클수록 완전한 원이됨
 * @param thetastart 시작각도, 0
 * @param thetaLength 연장각도, Math.PI * 2
 */
export const circle = new CircleGeometry(0.9, 16, Math.PI / 2, Math.PI / 2);
