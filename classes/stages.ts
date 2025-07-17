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

// TODO: IMPROVE PHASES BY USING NEW ENEMY SCHEMA, MAKE SURE TO FIX OTHER CLASSES
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
  enemySchema: EnemySchema;
  name: string;

  currSpawnGroup: SpawnGroup;
  currEndTime: number = 999999;
  enemies: Enemy[] = new Array<Enemy>();
  time: number = 0;
  spawnEvery: number = 0;
  spawnNextAt: number = 0;
  amountSpawned: number = 0;
  nextNotif: number = 999999;

  constructor(enemySchema: EnemySchema, name?: string) {
    this.enemySchema = enemySchema;

    this.enemySchema.enemyTypes.reverse();
    this.currSpawnGroup = this.enemySchema.enemyTypes.pop();

    this.currEndTime =
      this.currSpawnGroup.timeConsume * this.enemySchema.totalTime;

    this.spawnEvery = this.currEndTime / this.currSpawnGroup.numberOfSpawns;
    this.spawnNextAt = this.spawnEvery;

    // TODO: Implement notifs
    if (this.enemySchema.notifs.length != 0) {
    }

    if (name) this.name = name;
  }

  start() {}

  /**
   * Called by owner stage every frame
   * @param delta change of time in seconds
   */
  update(delta: number) {
    this.time += delta;

    if (this.currSpawnGroup == null) return;

    // This block handles spawning enemies
    if (this.time >= this.spawnNextAt) {
      this.amountSpawned++;
      this.spawnNextAt += this.spawnEvery;

      let enemy: Enemy;

      switch (this.currSpawnGroup.enemy) {
        case "box":
          enemy = new BoxEnemy();
          break;

        default:
          break;
      }

      enemy.path = this.enemySchema.path;
      enemy.creationTime = this.time;
      enemy.endTime = this.enemySchema.totalTime;

      this.enemies.push(enemy);
    }

    if (this.amountSpawned == this.currSpawnGroup.numberOfSpawns) {
      console.log("Spawn group finished", this.currSpawnGroup);
      this.currSpawnGroup = this.enemySchema.enemyTypes.pop();

      // End the phase here, we got no more things to spawn
      if (this.currSpawnGroup == null) {
        this.phaseFinished();
        return;
      }

      // We proceed to the next spawn group
      this.currEndTime =
        this.currSpawnGroup.timeConsume * this.enemySchema.totalTime +
        this.time;

      this.amountSpawned = 0;

      this.spawnEvery =
        (this.currEndTime - this.time) / this.currSpawnGroup.numberOfSpawns;
      this.spawnNextAt += this.spawnEvery;
    }
  }
  phaseFinished: () => void;
}

export interface SpawnGroup {
  enemy: string;
  numberOfSpawns: number;
  /**
   * This is in percent
   * @example ```0.2, 0.8, 1```
   */
  timeConsume: number;
}

/**
 * Schematics for spawning enemies
 * 
 * @example
 * ```
 * const schema: EnemySchema = {
  enemyTypes: [
    { enemy: "box", numberOfSpawns: 5, timeConsume: 0.4 },
    { enemy: "box", numberOfSpawns: 15, timeConsume: 0.6 },
  ],
  path: new QuadraticBezierCurve3(),
  notifs: [1, 7, 10],
  totalTime: 10,
};
 * ```
 */
export interface EnemySchema {
  enemyTypes: SpawnGroup[];
  path: QuadraticBezierCurve3;
  notifs: number[];
  /** Enemies get spawned over time, so enemies in the current spawn group
   * will be spawned evenly over this timeframe, in seconds
   */
  totalTime: number;
}

const sch: EnemySchema = {
  enemyTypes: [
    { enemy: "box", numberOfSpawns: 5, timeConsume: 0.4 },
    { enemy: "box", numberOfSpawns: 15, timeConsume: 0.6 },
  ],
  path: new QuadraticBezierCurve3(),
  notifs: [1, 7, 10],
  totalTime: 10,
};
