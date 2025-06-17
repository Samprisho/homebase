import { PerspectiveCamera } from "three";

export class Cam extends PerspectiveCamera {

  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);

    this.position.set(0, 0, 0);
    this.lookAt(0, 0, 0);
  }

  update(delta: number) {
/*     if (!this.ship || !this.ship.shipMesh) return;

    let pos = this.ship.shipMesh.position.clone();

    this.lookAt(pos.divide(new Vector3(80, 50, 1))); */
  }
}
