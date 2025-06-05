import { PerspectiveCamera, Vector3 } from "three"
import { Ship } from "./ship"

export class Cam extends PerspectiveCamera {
  ship: Ship = null;

  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);

    this.position.set(0, 0, 0);
    this.lookAt(0, 0, 0);
  }

  update(delta: number) {
    if (!this.ship || !this.ship.ship) return;

    let pos = this.ship.ship.position.clone();

    this.lookAt(pos.divide(new Vector3(80, 50, 1)));
  }
}
