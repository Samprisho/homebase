import { Clock } from "three";

class Input {
  held: boolean = false;
  key: string;
  clock: Clock = new Clock(true);
  timeDiff: number = 0.2;
  oldTime: number = 0;

  justPressed: boolean = false;
  justReleased: boolean = false;

  constructor(key: string) {
    this.key = key;
  }

  public get getKey(): string {
    return this.key;
  }

  public get isHeld(): boolean {
    return this.held;
  }

  /*
   Yes, the following functions are implemeneted
   in the worst way possible. No, I will not
   fix it...yet
  */

  public get wasJustPressed(): boolean {
    if (!this.justPressed) return false;

    this.justPressed = false;
    return true;
  }

  public get wasJustReleased(): boolean {
    if (!this.justReleased) return false;

    this.justReleased = false;
    return true;
  }
}
/**
 *
 * This class keeps track of a key and watches any changes occuring
 *
 * @constructor Keeps track of the key
 */
export class InputKey extends Input {
  onPressed: () => void;
  onReleased: () => void;
  onDoublePressed: () => void;

  constructor(key: string) {
    super(key);
    this.key = key;

    const canvas = document.getElementById("c");

    canvas!.addEventListener("keydown", this.#keyDown.bind(this));
    canvas!.addEventListener("keyup", this.#keyUp.bind(this));
  }

  #keyDown(e: KeyboardEvent) {
    const time = this.clock.getElapsedTime();
    const key = e.key;
    const old = this.held;

    if (key != this.getKey) return;

    this.held = true;
    this.justReleased = true;

    if (old != this.held) {
      this.justPressed = true;

      if (this.onDoublePressed && time - this.oldTime <= this.timeDiff)
        this.onDoublePressed();

      if (this.onPressed) this.onPressed();
      this.oldTime = this.clock.getElapsedTime();
    } else if (old == this.held) {
      this.justPressed = false;
    }
  }

  #keyUp(e: KeyboardEvent) {
    const key = e.key;
    const old = this.held;

    if (key != this.getKey) return;

    this.held = false;
    this.justPressed = false;

    if (old != this.held) {
      this.justReleased = true;

      if (this.onReleased) this.onReleased();
    } else if (old == this.held) {
      this.justReleased = false;
    }
  }
}

/**
 * TODO Implement input susbsytem
 */
class InputSubsystem {}
