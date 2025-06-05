import { bullets, gameScene } from "../main";
import {
  CylinderGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  Vector3,
} from "three";

export class Bullet extends Object3D<Object3DEventMap> {
  /**
   * In seconds
   */
  timeToLive: number = 3;
  speed: number = 1;
  damage: number = 1;
  isBullet: boolean = true;

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

    gameScene.add(this);
    bullets.add(this);

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
    let mesh = new Mesh(geo, mat);

    mesh.rotateX(Math.PI / 2);
    this.timeToLive = 2;

    this.add(mesh);

    this.dispose = () => {
      geo.dispose();
      mat.dispose();
      mesh.removeFromParent();
    };
  }
}
