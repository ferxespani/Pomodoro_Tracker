import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';

import { ButtonType } from 'src/app/enums/button-type';
import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';
import { CallService } from "../../services/call.service";
import { TaskState } from "./task-state/task-state";
import { ReadyState } from "./task-state/ready-state";
import { interval, map, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentTask?: PomodoroTask;
  public leftTime!: number;

  public taskIsStarted: boolean = false;
  public defaultTime: number = 1800;

  private startButton!: HTMLElement | null;
  private stopButton!: HTMLElement | null;

  private taskState!: TaskState;

  private currentTask$!: Subscription;
  private deleteTask$!: Subscription;
  private timer$!: Subscription;

  constructor(private pomodoroTasksService: PomodoroTaskService,
              private callService: CallService) {

    this.taskState = new ReadyState(this);
  }

  ngOnInit(): void {
    if (!this.leftTime) {
      this.leftTime = this.defaultTime;
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
  }

  ngOnDestroy(): void {
    this.currentTask$.unsubscribe();
    this.deleteTask$.unsubscribe();
    this.timer$.unsubscribe();
  }

  public changeTaskState(taskState: TaskState) {
    this.taskState = taskState;
  }

  public handleStartButtonClick(): void {
    this.taskState.handleStartButtonClick();
  }

  public startTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.PAUSE;
      this.taskIsStarted = true;
    }

    this.timer$ = interval(1000)
      .pipe(
        map(_ => {
          this.leftTime = this.leftTime - 1;
          return this.leftTime;
        }),
        takeWhile(value => value >= 0)
      )
      .subscribe();
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

    this.leftTime = this.currentTask ? this.currentTask.duration : this.defaultTime;
    this.taskIsStarted = false;
    this.timer$.unsubscribe();
  }

  public doneTask(): void {
    if (this.startButton) {
      this.startButton.innerText = ButtonType.START;
    }

    this.handleTaskDeleting();
    this.currentTask = new PomodoroTask();
    this.leftTime = this.defaultTime;

    this.taskIsStarted = false;
    this.timer$.unsubscribe();
  }

  private handleTaskDeleting(): void {
    if (this.currentTask === undefined) return;
    if (!this.currentTask.id) return;

    this.deleteTask$ = this.pomodoroTasksService
        .delete(this.currentTask.id)
        .subscribe(() => this.callService.sendClickCall());
  }
}
