import { TimerState } from "./timer-state";
import { ExecutingState } from "./executing-state";
import { ShortBreakState } from "./short-break-state";

export class PausedState extends  TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.resumeTask();
    this.timerComponent.changeTaskState(new ExecutingState(this.timerComponent));
  }

  public override handleStopButtonClick() {
    this.timerComponent.doneTask();
    this.timerComponent.startShortBreak();
    this.timerComponent.changeTaskState(new ShortBreakState(this.timerComponent));
  }
}
