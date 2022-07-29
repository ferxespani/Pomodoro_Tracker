import { TaskState } from "./task-state";
import { PausedState } from "./paused-state";
import { ReadyState } from "./ready-state";

export class ExecutingState extends TaskState {

  public override handleStartButtonClick(): void {
    this.timerComponent.pauseTask();
    this.timerComponent.changeTaskState(new PausedState(this.timerComponent));
  }

  public override handleStopButtonClick() {
    this.timerComponent.stopTask();
    this.timerComponent.changeTaskState(new ReadyState(this.timerComponent));
  }
}
