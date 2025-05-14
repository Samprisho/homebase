export class Debug {
  static createDebugText(id: string): HTMLElement {
    const p = document.createElement("p");

    p.id = id;
    document.getElementById("ui").append(p);

    return p;
  }
}
