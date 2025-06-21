import { Group, Scene } from "three";

export let instance: Instancing = null;

export class Instancing {
  bullets: BulletInstancing = new BulletInstancing();
  enemies: EnemyInstancing = new EnemyInstancing();
  scene: Scene = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.add(this.bullets);
    this.scene.add(this.enemies);

    this.bullets.name = "bullets";
    this.enemies.name = "enemies";

    instance = this;
  }
}

export class BulletInstancing extends Group {}

export class EnemyInstancing extends Group {}
