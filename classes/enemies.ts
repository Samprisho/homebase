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
import { instance } from "./instancing";
import { collisions, EntityHitbox, Hitbox } from "./collisions";

export class Enemy extends Object3D<Object3DEventMap> {
  attackSpeed: number = 1;
  moveSpeed: number = 1;

  health: number = 1;
  damage: number = 1;

  dispose: () => void;

  constructor() {
    super();
    instance.enemies.add(this);
  }

  update(delta: number) {
    console.log("hi");
  }

  attack() {}
}

export class BoxEnemy extends Enemy {
  mesh: Mesh;

  boxHelp: Box3Helper;

  constructor(position?: Vector3) {
    super();

    this.moveSpeed = 1;

    const geo = new BoxGeometry();
    const mat = new MeshPhongMaterial();

    this.mesh = new Mesh(geo, mat);
    this.mesh.geometry.computeBoundingBox();

    this.add(this.mesh);

    let box = new EntityHitbox(this, this.mesh);
    collisions.addHitbox(box);
    box.collidedNotif = (other: Hitbox) => {
      this.dispose();
    };

    this.dispose = () => {
      geo.dispose();
      mat.dispose();
      box.dispose();
      box = null;
      this.removeFromParent();
    };

    if (position) this.position.set(...position.toArray());
  }

  override update(delta: number) {
    this.position.z += delta * this.moveSpeed;
  }
}
