import {
  CylinderGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  Vector3,
} from "three";
import { instance } from "./instancing";
import { BulletHitbox, collisions, Hitbox } from "./collisions";

export class Bullet extends Object3D<Object3DEventMap> {
  /**
   * In seconds
   */
  timeToLive: number = 1;
  speed: number = 1;
  damage: number = 1;
  isBullet: boolean = true;
  mesh: Mesh;

  dispose: () => void;

  constructor(
    position: Vector3,
    shootAt: Vector3,
    speed: number,
    damage: number
  ) {
    super();

    this.position.set(position.x, position.y, position.z);
    this.lookAt(shootAt);
    this.speed = speed;
    this.damage = damage;

    this.name = "bullet";
    /* 
    let geo = new SphereGeometry(0.5);
    let mat = new MeshPhongMaterial({ color: 0x00000 });
    this.add(new Mesh(geo, mat)); */

    /*     gameScene.add(this); */

    setTimeout(() => {
      if (this.dispose) this.dispose();
    }, this.timeToLive * 1000);
  }

  update(delta: number) {
    const forward = new Vector3(0, 0, 1);
    forward.applyQuaternion(this.quaternion);
    forward.multiplyScalar(delta * this.speed);

    this.position.add(forward);
  }
}

export class PlayerBullet extends Bullet {
  isPlayerBullet: boolean = true;

  constructor(
    position: Vector3,
    shootAt: Vector3,
    speed: number,
    damage: number
  ) {
    super(position, shootAt, speed, damage);
    let geo = new CylinderGeometry(0.1, 0.1, 0.3, 6, 6, false);
    let mat = new MeshPhongMaterial({ color: 0x00000 });
    this.mesh = new Mesh(geo, mat);

    this.mesh.geometry.computeBoundingBox();

    this.mesh.rotateX(Math.PI / 2);
    this.timeToLive = 2;

    this.add(this.mesh);

    let box: BulletHitbox = new BulletHitbox(this, this.mesh);
    collisions.addHitbox(box);
    box.collidedNotif = (other: Hitbox) => {
      this.dispose();
    };

    instance.bullets.add(this);

    this.dispose = () => {
      geo.dispose();
      mat.dispose();
      box.dispose();
      box = null;
      this.removeFromParent();
    };
  }
}
