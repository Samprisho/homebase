class Input {
  held: boolean = false;
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  public get getKey(): string {
    return this.key;
  }

  public get isHeld(): boolean {
    return this.held;
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

  constructor(key: string) {
    super(key);
    this.key = key;

    const canvas = document.getElementById("c");

    canvas!.addEventListener("keydown", this.#keyDown.bind(this));
    canvas!.addEventListener("keyup", this.#keyUp.bind(this));
  }

  #keyDown(e: KeyboardEvent) {
    const key = e.key;
    const old = this.held;

    if (key == this.getKey) this.held = true;
    if (old != this.held && this.onPressed) this.onPressed();
  }

  #keyUp(e: KeyboardEvent) {
    const key = e.key;
    const old = this.held;

    if (key == this.getKey) this.held = false;
    if (old != this.held && this.onReleased) this.onReleased();
  }
}
