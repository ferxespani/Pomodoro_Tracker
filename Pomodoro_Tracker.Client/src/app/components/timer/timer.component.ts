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
  public seriesNumber: number = 0;

  private tasksToDo: PomodoroTask[] = [];
  private defaultShortBreakTime: number = 300;
  private defaultLongBreakTime: number = 900;
  private startButton!: HTMLElement | null;
  private stopButton!: HTMLElement | null;
  private taskState!: TimerState;
  private deleteTask$!: Subscription;
  private timer$!: Subscription;
  private taskListIsUpdatedCall$!: Subscription;

  constructor(private pomodoroTasksService: PomodoroTaskService,
              private callService: CallService) {

    this.taskState = new ReadyState(this);
  }

  ngOnInit(): void {
    if (!this.leftTime)
      this.leftTime = this.defaultTaskTime;
    if (!window.localStorage.getItem('series'))
      window.localStorage.setItem('series', '0');
    else
      this.seriesNumber = Number(window.localStorage.getItem('series'));

    this.updateTasksToDo();
    this.taskListIsUpdatedCall$ = this.callService
      .getTaskListIsUpdatedCall()
      .subscribe(() => {
        this.updateTasksToDo()
    });
  }

  ngAfterViewInit(): void {
    this.startButton = document.querySelector(".start-button");
    this.stopButton = document.querySelector(".stop-button");
    (this.stopButton as HTMLButtonElement).disabled = true;
  }

  ngOnDestroy(): void {
    this.deleteTask$.unsubscribe();
    this.timer$.unsubscribe();
    this.taskListIsUpdatedCall$.unsubscribe();
  }

  public changeTimerState(taskState: TimerState) {
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
    if (this.startButton)
      this.startButton.innerText = ButtonType.RESUME;
    if (this.stopButton)
      this.stopButton.innerText = ButtonType.DONE;

    this.timer$.unsubscribe();
  }

  public resumeTask(): void {
    if (this.stopButton)
      this.stopButton.innerText = ButtonType.STOP;

    this.startTask();
  }

  public handleStopButtonClick(): void {
    this.taskState.handleStopButtonClick();
  }

  public stopTask(): void {
    if (this.startButton)
      this.startButton.innerText = ButtonType.START;

    this.leftTime = this.currentTask ? this.currentTask.duration : this.defaultTaskTime;
    (this.stopButton as HTMLButtonElement).disabled = true;
    this.timer$.unsubscribe();
  }

  public doneTask(): void {
    if (this.startButton)
      this.startButton.innerText = ButtonType.START;
    if (this.stopButton)
      this.stopButton.innerText = ButtonType.STOP;

    window.localStorage.setItem('series', `${++this.seriesNumber}`);

    this.handleTaskDeleting();
    this.timer$.unsubscribe();
  }

  public startBreak(): void {
    this.isBreak = true;
    this.leftTime = this.shouldBeLongBreak() ? this.defaultLongBreakTime : this.defaultShortBreakTime;
    this.timer$ = this.createTimerSubscription();

    if (this.startButton)
      this.startButton.innerText = ButtonType.PAUSE;
    if (this.stopButton)
      this.stopButton.innerText = ButtonType.SKIP;
  }

  public pauseBreak(): void {
    if (this.startButton)
      this.startButton.innerText = ButtonType.RESUME;

    this.timer$.unsubscribe();
  }

  public resumeBreak(): void {
    if (this.startButton)
      this.startButton.innerText = ButtonType.PAUSE;

    this.timer$ = this.createTimerSubscription();
  }

  public skipBreak(): void {
    if (this.startButton)
      this.startButton.innerText = ButtonType.START;
    if (this.stopButton)
      this.stopButton.innerText = ButtonType.STOP;

    (this.stopButton as HTMLButtonElement).disabled = true;
    this.isBreak = false;
    this.updateTasksToDo();
    this.timer$.unsubscribe();
  }

  private updateTasksToDo(): void {
    this.tasksToDo = JSON.parse(window.localStorage.getItem('todos')!);
    if (this.tasksToDo.length > 0) {
      this.currentTask = this.tasksToDo[0];
      if (!this.isBreak)
        this.leftTime = this.tasksToDo[0] ? this.tasksToDo[0].duration : this.defaultTaskTime;
    }
    else {
      TimerComponent.resetSeriesCounter();
      this.leftTime = this.defaultTaskTime;
    }
  }

  private static resetSeriesCounter(): void {
    window.localStorage.setItem('series', '0');
  }

  private shouldBeLongBreak(): boolean {
    return this.seriesNumber % 4 === 0;
  }

  private createTimerSubscription(): Subscription {
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
        .subscribe(() => this.callService.sendTaskDeletedCall());
  }
}
