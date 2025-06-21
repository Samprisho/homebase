import { QuadraticBezierCurve3 } from "three";
import { BoxEnemy, Enemy } from "./enemies";

/**
 * A stage simply plays out the given phases
 * @constructor
 * @param {Phase[]} phases Beware!, this get's reversed!
 */
export class Stage {
  phases: Phase[] = new Array<Phase>();
  currPhase: Phase = null;

  constructor(phases: Phase[]) {
    this.phases = phases;
    this.phases.reverse();
    this.currPhase = this.phases[phases.length - 1];

    console.log(this.phases);
  }

  start() {
    if (this.currPhase == null) return;
    this.currPhase.stage = this;
  }

  update(delta: number) {
    if (this.currPhase) this.currPhase.update(delta);
  }

  phaseFinished(phase: Phase) {
    this.phases.pop();

    if (this.phases[this.phases.length - 1] == null) {
      console.log("This stage is finished");
      this.currPhase = null;
    } else {
      this.currPhase = this.phases[this.phases.length - 1];
      this.currPhase.stage = this;
    }
  }
}

/**
 * A phase spawns enemies and provides them with what they need to move
 * along a path!
 *
 * @constructor
 * @param {EnemySchema} enemySchema this is the blueprint that determine's what play's out in a phase
 */
export class Phase {
  stage: Stage;

  enemiesToSpawn: EnemySchema;
  name: string;

  enemies: Enemy[] = new Array<Enemy>();
  time: number = 0;
  spawnEvery: number = 0;
  spawnNextAt: number = 0;
  amountSpawned: number = 0;

  constructor(enemySchema: EnemySchema, name?: string) {
    this.enemiesToSpawn = enemySchema;
    this.spawnEvery = enemySchema.time / enemySchema.amount;
    this.spawnNextAt = this.spawnEvery;

    if (name) this.name = name;
  }

  start() {}

  update(delta: number) {
    this.time += delta;

    if (this.time >= this.spawnNextAt) {
      console.log("spawn!");

      this.amountSpawned++;
      this.spawnNextAt += this.spawnEvery;

      let enemy: Enemy;

      switch (this.enemiesToSpawn.name) {
        case "box":
          enemy = new BoxEnemy();
          break;

        default:
          break;
      }

      enemy.path = this.enemiesToSpawn.path;
      enemy.creationTime = this.time;
      enemy.endTime = this.enemiesToSpawn.time;

      this.enemies.push(enemy);
    }

    if (this.amountSpawned == this.enemiesToSpawn.amount) {
      console.log(`Phase ${this.name} finished`);
      this.stage.phaseFinished(this);
    }
  }
}

export type EnemySchema = {
  name: string;
  amount: number;
  path: QuadraticBezierCurve3;
  notifs: CurveNotif[];
  // Enemies get spawned over time, so enemies
  // will be spawned evenly over this timeframe, in seconds
  time: number;
};

export type CurveNotif = {
  time: number;
  event: () => void;
};
