import {
  Box3,
  Box3Helper,
  BoxGeometry,
  BoxHelper,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import { instance } from "./instancing";
import { collisions, EntityHitbox, Hitbox } from "./collisions";

const geo = new BoxGeometry();
const mat = new MeshPhongMaterial();

export class Enemy extends Object3D<Object3DEventMap> {
  attackSpeed: number = 1;
  moveSpeed: number = 1;

  creationTime: number;
  time: number = 0;
  endTime: number;

  health: number = 1;
  damage: number = 1;

  path: QuadraticBezierCurve3;

  dispose: () => void;

  constructor(creationTime?: number) {
    super();
    instance.enemies.add(this);

    if (creationTime) {
      this.creationTime = creationTime;
    }
  }

  update(delta: number) {
    this.time += delta;
    if (this.path) {
      this.position.set(
        ...this.path.getPoint(this.time / this.endTime).toArray()
      );
    }
  }

  attack() {}
}

export class BoxEnemy extends Enemy {
  mesh: Mesh;
  boxHelp: Box3Helper;

  constructor(position?: Vector3) {
    super();

    this.moveSpeed = 1;

    this.mesh = new Mesh(geo, mat);
    this.mesh.geometry.computeBoundingBox();

    this.add(this.mesh);

    let box = new EntityHitbox(this, this.mesh);
    collisions.addHitbox(box);
    box.collidedNotif = (other: Hitbox) => {
      this.dispose();
    };

    this.dispose = () => {
      box.dispose();
      box = null;
      this.removeFromParent();
    };

    if (position) this.position.set(...position.toArray());
  }
}
