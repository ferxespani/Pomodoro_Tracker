import { TimerState } from "./timer-state";
import { PausedBreakState } from "./paused-break-state";
import { ReadyState } from "./ready-state";

export class BreakState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.pauseBreak();
    this.timerComponent.changeTimerState(new PausedBreakState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    this.timerComponent.skipBreak();
    this.timerComponent.changeTimerState(new ReadyState(this.timerComponent));
  }
}
