import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BoxHelper,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  Vector3,
} from "three";

export class Enemy extends Object3D<Object3DEventMap> {
  attackSpeed: number = 1;
  moveSpeed: number = 1;

  health: number = 1;
  damage: number = 1;

  constructor() {
    super();
  }

  update(delta: number) {
    console.log("hi");
  }

  attack() {}
}

export class BoxEnemy extends Enemy {
  mesh: Mesh;
  box: Box3;
  boxHelp: Box3Helper;

  constructor(position?: Vector3) {
    super();

    this.moveSpeed = 1;

    const geo = new BoxGeometry();
    geo.computeBoundingBox();
    const mat = new MeshPhongMaterial();

    this.mesh = new Mesh(geo, mat);
    this.mesh.geometry.computeBoundingBox();

    this.box = new Box3();

    this.box.copy(this.mesh.geometry.boundingBox);

    this.boxHelp = new Box3Helper(this.box, 0xff0000);

    this.add(this.boxHelp);
    this.add(this.mesh);

    if (position) this.position.set(...position.toArray());
  }

  override update(delta: number) {
    this.position.z += delta * this.moveSpeed;

    this.box
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrix);
  }
}
