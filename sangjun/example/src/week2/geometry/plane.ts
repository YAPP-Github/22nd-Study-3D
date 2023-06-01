import { PlaneGeometry } from "three";

/**
 * @description 3차원 지형 표현할때 유용하게 사용
 * @param width 폭, (default = 1)
 * @param height 높이, (default = 1)
 * @param widthSegments 폭 분할수, (default = 1)
 * @param heightSegments 높이 분할수, (default = 1)
 */
export const plane = new PlaneGeometry();
