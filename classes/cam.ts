import { PerspectiveCamera } from "three";
import { InputKey } from "./input";

export class Cam extends PerspectiveCamera {
  w = new InputKey("w");
  s = new InputKey("s");
  a = new InputKey("a");
  d = new InputKey("d");

  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.w.onReleased = () => {
      console.log(`Released ${this.w.getKey}`);
    };

    this.w.onPressed = () => {
      console.log(`Pressed ${this.w.getKey}`);
    };
  }

  update() {
    if (this.w.isHeld) console.log("WWWW");
  }
}
