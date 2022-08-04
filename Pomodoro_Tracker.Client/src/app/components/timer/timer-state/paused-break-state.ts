import { TimerState } from "./timer-state";
import { ResumedBreakState } from "./resumed-break-state";
import { ReadyState } from "./ready-state";

export class PausedBreakState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.resumeBreak();
    this.timerComponent.changeTimerState(new ResumedBreakState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    this.timerComponent.skipBreak();
    this.timerComponent.changeTimerState(new ReadyState(this.timerComponent));
  }
}
