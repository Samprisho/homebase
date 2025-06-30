import { EnemySchema, Phase, Stage } from "./stages";
import { QuadraticBezierCurve3, Vector3 } from "three";

interface NotifData {
  time: number;
}

interface PhaseData {
  enemyType: string;
  amount: number;
  path: {
    start: number[];
    control: number[];
    end: number[];
  };
  notifs: number[];
  time: number;
}

interface StageData {
  phases: PhaseData[];
}

export class Game {
  urls: string[];
  stages: Stage[] = new Array<Stage>();

  currStage: Stage = null;

  async load_stages(stagesDirectory: string[]) {
    this.urls = stagesDirectory;
    for (const url of stagesDirectory) {
      let phases: Phase[] = new Array<Phase>();
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
      }

      const data = (await response.json()) as StageData;
      data.phases.forEach((phase) => {
        let schema: EnemySchema = {
          enemyType: phase.enemyType as string,
          amount: phase.amount as number,
          path: new QuadraticBezierCurve3(
            new Vector3(...phase.path.start),
            new Vector3(...phase.path.control),
            new Vector3(...phase.path.end)
          ),
          notifs: phase.notifs as number[],
          time: phase.time as number,
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
      console.log(this.stages);
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
