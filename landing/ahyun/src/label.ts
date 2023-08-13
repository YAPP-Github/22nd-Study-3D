import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import style from "./style";

const labelStyleTag: { [key in string]: null | HTMLStyleElement } = {
  label: null,
  fadeInAnimation: null,
};

export default function createLabel({ object }: { object: THREE.Object3D }) {
  if (!object.name) throw new Error("name이 있는 object를 사용해주세요");

  const wrapper = document.createElement("div");

  wrapper.className += "label";
  wrapper.id = `${object.name}_label`;
  wrapper.innerHTML = "뭔가 라벨을 붙일수있어요";

  const fadeInAnimation = `
    @keyframes fadeIn {
        0%   { opacity: 0; }
        100% { opacity: 1; }
    }
  `;
  const labelCss = `
    .label {
      display:none;
      background-color: white;
      animation: fadeIn 0.3s; 
    }
    .label.on {
      display:block;
    }
  `;

  if (!labelStyleTag.fadeInAnimation) {
    labelStyleTag.fadeInAnimation = style(fadeInAnimation);
  }
  if (!labelStyleTag.label) {
    labelStyleTag.label = style(labelCss);
  }

  const label = new CSS2DObject(wrapper);
  return label;
}
