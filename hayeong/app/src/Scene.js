import { Group } from 'three';
import Character from './objects/Character.js';
import Figure from './objects/Figure.js';
import BasicLights from './Lights.js';

export default class SeedScene extends Group {
  constructor() {
    super();

    const character = new Character('character1');
    const figure = new Figure('figure');
    const lights = new BasicLights();

    this.add(character, figure, lights);
  }

  update(timeStamp) {
    this.children.forEach((object) => {
      object.update && object.update(timeStamp)
    })
  }
}