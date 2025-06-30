import { QuadraticBezierCurve3 } from "three";
import { BoxEnemy, Enemy } from "./enemies";

/**
 * A stage simply plays out the given phases
 * @param {Phase[]} phases Beware!, this get's reversed!
 * @example
 * ```typescript
 * const phases: Array<Phase> = [phase1, phase2, phase3]
 * const stage = new Stage(phases)
 * ```
 */

export class Stage {
  phases: Phase[] = new Array<Phase>();
  currPhase: Phase = null;

  constructor(phases: Phase[]) {
    this.phases = phases;
    this.phases.reverse();
    this.currPhase = this.phases[phases.length - 1];
  }

  /**
   * This initializes the first phase in the stage.
   * @returns nothing
   */
  start() {
    if (this.currPhase == null) {
      console.log("No phase assighned");
      return;
    }
    console.log("stage started");
    this.currPhase.phaseFinished = this.phaseFinished.bind(this);
  }

  /**
   * Call every frame. Calls the current phases's `update()`
   * @param delta change of time in seconds
   */
  update(delta: number) {
    if (this.currPhase) this.currPhase.update(delta);
  }

  /**
   * Called by the current phase at the end of its run
   * @param phase The phase announcing its end
   */
  phaseFinished() {
    this.phases.pop();
    console.log("stage notified about phase end");

    if (this.phases[this.phases.length - 1] == null) {
      this.currPhase = null;
      if (this.stageFinished) this.stageFinished();
    } else {
      this.currPhase = this.phases[this.phases.length - 1];
      this.currPhase.phaseFinished = this.phaseFinished.bind(this);
    }
  }

  /**
   * This is modified by the Game class in a gamestate.ts
   */
  stageFinished: () => void;
}

/**
 * A phase spawns enemies and provides them with what they need to move
 * along a path!
 *
 * @param {EnemySchema} enemySchema this is the blueprint that determine's what play's out in a phase
 * @example
 * ```typescript
 * const enemySchema: EnemySchema = {
      enemyType: "box",
      amount: 10,
      path: new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-8, -5, -5),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(1, 0, -5)
      ),
      notifs: [
        {
          time: 0.2,
        },
      ],
      time: 5,
    };

    const phase: Phase = new Phase(enemySchema, "Overworld 1")
 * ```
 */
export class Phase {
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

  /**
   * Called by owner stage every frame
   * @param delta change of time in seconds
   */
  update(delta: number) {
    this.time += delta;

    // This block handles spawning enemies
    if (this.time >= this.spawnNextAt) {
      this.amountSpawned++;
      this.spawnNextAt += this.spawnEvery;

      let enemy: Enemy;

      switch (this.enemiesToSpawn.enemyType) {
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

    // Notify owning stage we have finished spawning
    if (this.amountSpawned == this.enemiesToSpawn.amount) {
      if (this.phaseFinished) {
        console.log("phase ended");
        this.phaseFinished();
      }
    }
  }
  phaseFinished: () => void;
}

/**
 * This is the schematics behind a phase
 * @field {string} enemyType the type of enemy
 * @see {@link QuadraticBezierCurve3}
 * @example
 * ```typescript
 * const enemySchema: EnemySchema = {
      enemyType: "box",
      amount: 10,
      path: new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-8, -5, -5),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(1, 0, -5)
      ),
      notifs: [
        {
          time: 0.2,
          event: () => console.log("Notif!"),
        },
      ],
      time: 5,
    };
 */
export interface EnemySchema {
  enemyType: string;
  amount: number;
  path: QuadraticBezierCurve3;
  notifs: number[];
  // Enemies get spawned over time, so enemies
  // will be spawned evenly over this timeframe, in seconds
  time: number;
}


