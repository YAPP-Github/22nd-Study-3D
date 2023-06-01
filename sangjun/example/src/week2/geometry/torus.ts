import { TorusGeometry } from "three";

/**
 * @description
 *  3차원 형태의 반지 모양, 도넛 모양
 *  긴 원통을 한바퀴 감은 모양이라고 생각
 *
 * @param radius 토러스의 반지름, (default = 1)
 * @param tube 토러스의 원통의 반지름, 관의 반지름 (default = 0.4)
 * @param radialSegments 토러스의 방사 방향으로의 분할수, 면의 분할수, 클수록 통통한 도넛(default = 8)
 * @param tubularSegments 토러스의 둘레 방향으로의 분할수, 클수록 동그란 도넛 (default = 6)
 * @param arc 토러스의 연장각, 시작각이 따로 없음 (default = Math.PI * 2)
 */
export const torus = new TorusGeometry(0.9, 0.3, 16, 100, Math.PI / 2);
