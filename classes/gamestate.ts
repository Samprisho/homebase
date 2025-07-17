import { EnemySchema, Phase, SpawnGroup, Stage } from "./stages";
import { QuadraticBezierCurve3, Vector3 } from "three";

// TODO Document this file

/**
 * This is the data strcuture of the JSON files in the stages directory
 */
interface PhaseData {
  enemyTypes: { enemy: string; numberOfSpawns: number; timeConsume: number }[];
  path: {
    start: number[];
    control: number[];
    end: number[];
  };
  notifs: number[];
  time: number;
}
/**
 * Manages the game state.
 * @function `load_stages(stagesDirectory)` call this during webapp initialization. Fetches and loads stages from the provided string path array
 * @function `start()` starts the game, must have stages loaded before calling
 * @function `update(delta)` called by the main loop. Calls `update()` on the curret stage, which calls `update()` on the current phase
 */
export class Game {
  urls: string[];
  stages: Stage[] = new Array<Stage>();

  currStage: Stage = null;

  async load_stages(stagesDirectory: string[]) {
    this.urls = stagesDirectory;
    for (const url of stagesDirectory) {
      let phases: Phase[] = new Array<Phase>();
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to load ${url}: ${response.statusText}`);

      const text = await response.text();

      const fdata = JSON.parse(text);

      // Check each elemen

      // Also check if something happens during the forEach
      fdata.phases.forEach((phase: PhaseData, phaseIndex) => {
        let schema: EnemySchema = {
          enemyTypes: phase.enemyTypes,
          path: new QuadraticBezierCurve3(
            new Vector3(...phase.path.start),
            new Vector3(...phase.path.control),
            new Vector3(...phase.path.end)
          ),
          notifs: phase.notifs,
          totalTime: phase.time,
        };

        phases.push(new Phase(schema));
      });

      const stage = new Stage(phases);
      stage.stageFinished = this.onStageFinish.bind(this);
      this.stages.push(stage);
    }
    this.stages.reverse();
    this.finished_loading();
  }

  finished_loading() {
    console.log(this.stages);
  }

  /**
   * Passed to all stages, bound to this class. Called by stages when they have finished
   */
  onStageFinish() {
    console.log("stage finished");
    this.stages.pop();

    if (this.stages[this.stages.length - 1]) {
      this.currStage = this.stages[this.stages.length - 1];
      this.currStage.stageFinished = this.onStageFinish.bind(this);
      this.currStage.start();
    } else {
      this.currStage = null;
      console.log("no more stages");

      // TODO: This code is temporary, delete when actually implementing
      this.load_stages(this.urls);
      setTimeout(() => this.start(), 5000);
    }
  }

  start() {
    if (this.stages.length == 0) {
      console.log("Nothing here!");
      return;
    }

    console.log("game started");
    this.currStage = this.stages[0];
    this.currStage.stageFinished = this.onStageFinish.bind(this);
    this.currStage.start();
  }

  update(delta: number) {
    if (this.currStage) {
      this.currStage.update(delta);
    }
  }
}
