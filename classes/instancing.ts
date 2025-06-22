import { Group, Scene } from "three";

export let instance: Instancing = null;

/**
 * Initialized from main, in which we pass the game scene to. This class get's imported from other classes
 * @see enemies.ts
 * @see bullets.ts
 */
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
