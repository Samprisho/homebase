import { PerspectiveCamera, Vector2, Vector3 } from "three";
import { InputKey } from "./input";
import { Debug } from "./debug";

export class Cam extends PerspectiveCamera {
/*   w = new InputKey("w");
  s = new InputKey("s");
  a = new InputKey("a");
  d = new InputKey("d"); */

/*   directionDebug = Debug.createDebugText("direction");
  inputDebug = Debug.createDebugText("input");
  sizeDebug = Debug.createDebugText("size"); */

  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);

    this.position.set(0, 0, 0);
    this.lookAt(0, 0, 0);
  }

  update(delta: number) {
/*     const factor = 2;
    let moveDir: Vector2 = new Vector2(0, 0);

    if (this.w.isHeld) {
      moveDir.setY(1);
    }

    if (this.s.isHeld) {
      moveDir.setY(-1);
    }

    if (this.a.isHeld) {
      moveDir.x = -1;
    }

    if (this.d.isHeld) {
      moveDir.x = 1;
    }

    this.inputDebug.textContent = `X: ${moveDir.x}, Y: ${moveDir.y}`;

    let forward: Vector3 = new Vector3(0, 1, 0).multiplyScalar(moveDir.y);
    forward.applyQuaternion(this.quaternion);

    let right: Vector3 = new Vector3(1, 0, 0).multiplyScalar(moveDir.x);
    right.applyQuaternion(this.quaternion);

    let actualDirection: Vector3 = new Vector3()
      .addVectors(forward, right)
      .normalize();

    this.directionDebug.textContent = `Direction ${actualDirection.toArray()}`;

    let velocity: Vector3 = new Vector3(0, 0, 0);
    velocity.copy(actualDirection).multiplyScalar(factor * delta);

    this.sizeDebug.textContent = `${velocity.length()}`;

    this.position.add(velocity); */
  }
}
