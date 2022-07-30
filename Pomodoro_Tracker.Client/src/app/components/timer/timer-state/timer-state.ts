import { TimerComponent } from "../timer.component";

export abstract class TimerState {
  protected timerComponent!: TimerComponent;

  constructor(timerComponent: TimerComponent) {
    this.timerComponent = timerComponent;
  }

  public abstract handleStartButtonClick(): void;

  public abstract handleStopButtonClick(): void;
}
