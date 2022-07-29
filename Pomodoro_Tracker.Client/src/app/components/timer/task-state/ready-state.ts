import { TaskState } from "./task-state";
import { ExecutingState } from "./executing-state";

export class ReadyState extends TaskState {

  public override handleStartButtonClick(): void {
    this.timerComponent.startTask();
    this.timerComponent.changeTaskState(new ExecutingState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    return;
  }
}
