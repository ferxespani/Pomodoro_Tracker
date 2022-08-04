import { TimerState } from "./timer-state";
import { ExecutingState } from "./executing-state";

export class ReadyState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.startTask();
    this.timerComponent.changeTimerState(new ExecutingState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    return;
  }
}
