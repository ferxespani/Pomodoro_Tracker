import { TimerState } from "./timer-state";
import { PausedShortBreakState } from "./paused-short-break-state";
import { ReadyState } from "./ready-state";

export class ResumedShortBreakState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.pauseShortBreak();
    this.timerComponent.changeTaskState(new PausedShortBreakState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    this.timerComponent.skipShortBreak();
    this.timerComponent.changeTaskState(new ReadyState(this.timerComponent));
  }
}
