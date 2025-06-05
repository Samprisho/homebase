import { bullets, gameScene } from "../main";
import {
  Box2,
  Box3,
  Box3Helper,
  CylinderGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  Sphere,
  Vector3,
} from "three";

export class Bullet extends Object3D<Object3DEventMap> {
  /**
   * In seconds
   */
  timeToLive: number = 1;
  speed: number = 1;
  damage: number = 1;
  isBullet: boolean = true;
  box: Box3;
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

    if (this.box && this.mesh) {
      this.box
        .copy(this.mesh.geometry.boundingBox)
        .applyMatrix4(this.mesh.matrix);
    }
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

    this.box = new Box3();
    this.box.copy;

    const help = new Box3Helper(this.box);
    this.add(help);

    this.dispose = () => {
      geo.dispose();
      mat.dispose();
      this.removeFromParent();
    };
  }
}
