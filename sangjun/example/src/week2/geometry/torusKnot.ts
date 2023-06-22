import { TorusKnotGeometry } from "three";

/**
 * @description 토러스 매듭, 활용도는 낮음
 * @param radius 토러스 knot 반지름, (default = 1)
 * @param tube 토러스 knot 원통의 반지름, (default = 0.4)
 * @param tubularSegments 원통의 둘레 방향으로의 분할수, (default = 64)
 * @param radialSegments 원통의 방사 방향으로의 분할수, (default = 8)
 * @param p 토러스 knot의 반복 횟수, (default = 2) ??
 * @param q 토러스 knot의 반복 횟수, (default = 3) ?? 잘 모르겠다 어렵
 *
 */

export const torusKnot = new TorusKnotGeometry(0.5, 0.2, 100, 16, 3, 5);
