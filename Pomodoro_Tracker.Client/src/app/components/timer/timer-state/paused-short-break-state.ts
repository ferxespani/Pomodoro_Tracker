import { TimerState } from "./timer-state";
import { ResumedShortBreakState } from "./resumed-short-break-state";
import { ReadyState } from "./ready-state";

export class PausedShortBreakState extends TimerState {

  public override handleStartButtonClick(): void {
    this.timerComponent.resumeShortBreak();
    this.timerComponent.changeTaskState(new ResumedShortBreakState(this.timerComponent));
  }

  public override handleStopButtonClick(): void {
    this.timerComponent.skipShortBreak();
    this.timerComponent.changeTaskState(new ReadyState(this.timerComponent));
  }
}
