import { TaskState } from "./task-state";
import { ReadyState } from "./ready-state";
import { ExecutingState } from "./executing-state";

export class PausedState extends  TaskState {

  public override handleStartButtonClick(): void {
    this.timerComponent.resumeTask();
    this.timerComponent.changeTaskState(new ExecutingState(this.timerComponent));
  }

  public override handleStopButtonClick() {
    this.timerComponent.doneTask();
    this.timerComponent.changeTaskState(new ReadyState(this.timerComponent));
  }
}
