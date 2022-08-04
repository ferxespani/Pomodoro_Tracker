import { TimerState } from "./timer-state";
import { ExecutingState } from "./executing-state";
import { BreakState } from "./break-state";

export class PausedState extends  TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.resumeTask();
    this.timerComponent.changeTimerState(new ExecutingState(this.timerComponent));
  }

  public override handleStopButtonClick() {
    this.timerComponent.doneTask();
    this.timerComponent.startBreak();
    this.timerComponent.changeTimerState(new BreakState(this.timerComponent));
  }
}
