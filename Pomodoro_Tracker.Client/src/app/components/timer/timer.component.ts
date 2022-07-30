import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, map, Subscription, takeWhile } from 'rxjs';

import { ButtonType } from 'src/app/enums/button-type';
import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';
import { CallService } from "../../services/call.service";
import { TimerState } from "./timer-state/timer-state";
import { ReadyState } from "./timer-state/ready-state";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentTask?: PomodoroTask;
  public leftTime!: number;
  public isBreak: boolean = false;
  public defaultTaskTime: number = 1800;

  private defaultBreakTime: number = 300;
  private startButton!: HTMLElement | null;
  private stopButton!: HTMLElement | null;
  private taskState!: TimerState;
  private currentTask$!: Subscription;
  private deleteTask$!: Subscription;
  private timer$!: Subscription;

  constructor(private pomodoroTasksService: PomodoroTaskService,
              private callService: CallService) {

    this.taskState = new ReadyState(this);
  }

  ngOnInit(): void {
    if (!this.leftTime) {
      this.leftTime = this.defaultTaskTime;
    }

    this.currentTask$ = this.callService.getCurrentTask()
      .subscribe((currentTask: PomodoroTask) => {
        this.currentTask = currentTask;
        this.leftTime = currentTask.duration;
      });
  }

  ngAfterViewInit(): void {
    this.startButton = document.querySelector(".start-button");
    this.stopButton = document.querySelector(".stop-button");
    (this.stopButton as HTMLButtonElement).disabled = true;
  }

  ngOnDestroy(): void {
    this.currentTask$.unsubscribe();
    this.deleteTask$.unsubscribe();
    this.timer$.unsubscribe();
  }

  public changeTaskState(taskState: TimerState) {
    this.taskState = taskState;
  }

  public handleStartButtonClick(): void {
    this.taskState.handleStartButtonClick();
  }

  public startTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.PAUSE;
      (this.stopButton as HTMLButtonElement).disabled = false;
    }

    this.timer$ = this.createTimerSubscription();
  }

  public pauseTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.RESUME;
    }

    this.timer$.unsubscribe();

    if (this.stopButton) {
      this.stopButton.innerText = ButtonType.DONE;
    }
  }

  public resumeTask(): void {
    this.startTask();

    if (this.stopButton) {
      this.stopButton.innerText = ButtonType.STOP;
    }
  }

  public handleStopButtonClick(): void {
    this.taskState.handleStopButtonClick();
  }

  public stopTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.START;
    }

    this.leftTime = this.currentTask ? this.currentTask.duration : this.defaultTaskTime;
    (this.stopButton as HTMLButtonElement).disabled = true;
    this.timer$.unsubscribe();
  }

  public doneTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.START;
    }

    if (this.stopButton) {
      this.stopButton.innerText = ButtonType.STOP;
    }

    this.handleTaskDeleting();
    this.currentTask = new PomodoroTask();
    this.leftTime = this.defaultTaskTime;

    this.timer$.unsubscribe();
  }

  public startShortBreak(): void {
    this.isBreak = true;
    this.leftTime = this.defaultBreakTime;

    this.timer$ = this.createTimerSubscription();

    if (this.startButton) {
      this.startButton.innerText = ButtonType.PAUSE;
    }

    if (this.stopButton) {
      this.stopButton.innerText = ButtonType.SKIP;
    }
  }

  public pauseShortBreak(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.RESUME;
    }

    this.timer$.unsubscribe();
  }

  public resumeShortBreak(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.PAUSE;
    }

    this.timer$ = this.createTimerSubscription();
  }

  public skipShortBreak(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.START;
    }

    if (this.stopButton) {
      this.stopButton.innerText = ButtonType.STOP;
    }

    (this.stopButton as HTMLButtonElement).disabled = true;
    this.isBreak = false;
    this.currentTask = new PomodoroTask();
    this.leftTime = this.defaultTaskTime;

    this.timer$.unsubscribe();
  }

  private createTimerSubscription() {
    return interval(1000)
      .pipe(
        map(_ => {
          this.leftTime = this.leftTime - 1;
          return this.leftTime;
        }),
        takeWhile(value => value >= 0)
      )
      .subscribe();
  }

  private handleTaskDeleting(): void {
    if (this.currentTask === undefined) return;
    if (!this.currentTask.id) return;

    this.deleteTask$ = this.pomodoroTasksService
        .delete(this.currentTask.id)
        .subscribe(() => this.callService.sendClickCall());
  }
}
