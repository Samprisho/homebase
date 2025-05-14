import { PerspectiveCamera, Vector2, Vector3, Clock, Euler } from "three";
import { InputKey } from "./input";
import { Debug } from "./debug";

export class Cam extends PerspectiveCamera {
  w = new InputKey("w");
  s = new InputKey("s");
  a = new InputKey("a");
  d = new InputKey("d");

  forwardDebug = Debug.createDebugText("direction");
  inputDebug = Debug.createDebugText("input");
  rightDebug = Debug.createDebugText("right");

  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.position.set(2, 2, 2);
    this.lookAt(0, 0, 0);
  }

  update(delta: number) {
    const factor = 2;
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

    let forward: Vector3 = new Vector3(0, 0, -1);
    forward.applyQuaternion(this.quaternion);

    let right: Vector3 = new Vector3(1, 0, 0);
    right.applyQuaternion(this.quaternion);

    this.forwardDebug.textContent = `Direction ${forward.toArray()}`;
    this.rightDebug.textContent = `Right ${right.toArray()}`;

    let rightVel = right.multiplyScalar(moveDir.x * factor * delta);
    let forwardVel = forward.multiplyScalar(moveDir.y * factor * delta);

    this.position.add(rightVel);
    this.position.add(forwardVel);
  }
}
