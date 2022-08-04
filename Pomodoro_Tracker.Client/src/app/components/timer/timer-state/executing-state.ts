import { TimerState } from "./timer-state";
import { PausedState } from "./paused-state";
import { ReadyState } from "./ready-state";

export class ExecutingState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.pauseTask();
    this.timerComponent.changeTimerState(new PausedState(this.timerComponent));
  }

  public override handleStopButtonClick() {
    this.timerComponent.stopTask();
    this.timerComponent.changeTimerState(new ReadyState(this.timerComponent));
  }
}
