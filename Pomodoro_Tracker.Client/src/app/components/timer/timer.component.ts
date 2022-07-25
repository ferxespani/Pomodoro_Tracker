import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ButtonType } from 'src/app/enums/button-type';
import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';
import {CallService} from "../../services/call.service";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, AfterViewInit {
  public currentTask?: PomodoroTask;
  public leftTime?: number;

  public taskIsStarted: boolean = false;
  public defaultTime: number = 1800;

  private intervalId: number = 0;
  private taskIsPaused: boolean = false;
  private startPauseButton!: HTMLElement | null;
  private stopButton!: HTMLElement | null;

  private currentTask$: Observable<PomodoroTask> = this.callService.getCurrentTask();

  constructor(private pomodoroTasksService: PomodoroTaskService,
              private callService: CallService) {}

  ngOnInit(): void {
    if (!this.leftTime) {
      this.leftTime = this.defaultTime;
    }

    this.currentTask$
      .subscribe((currentTask: PomodoroTask) => {
        this.currentTask = currentTask;
        this.leftTime = currentTask.duration;
      });
  }

  ngAfterViewInit(): void {
    this.startPauseButton = document.querySelector(".start-button");
    this.stopButton = document.querySelector(".stop-button");
  }

  public startPauseResumePomodoroTask(): void {
    switch (this.startPauseButton?.innerText) {
      case ButtonType.START:
        this.startPauseButton.innerText = ButtonType.PAUSE;
        this.taskIsPaused = false;
        break;
      case ButtonType.PAUSE:
        this.startPauseButton.innerText = ButtonType.RESUME;
        this.taskIsPaused = true;
        clearInterval(this.intervalId);

        if (this.stopButton) {
          this.stopButton.innerText = ButtonType.DONE;
        }
        break;
      case ButtonType.RESUME:
        this.startPauseButton.innerText = ButtonType.PAUSE;
        this.taskIsPaused = false;
        break;
    }

    this.taskIsStarted = true;

    if (!this.taskIsPaused) {
      this.intervalId = window.setInterval(() => {
        if (this.leftTime !== undefined) {
          this.leftTime--;
        }
      }, 1000);
    }
  }

  public stopDonePomodoroTask(): void {
    if (this.startPauseButton) {
      this.startPauseButton.innerText = ButtonType.START;
    }

    if (this.stopButton?.innerText === ButtonType.DONE) {
      this.handleTaskDeleting();
      this.currentTask = new PomodoroTask();
      this.leftTime = this.defaultTime;
    }
    else {
      this.leftTime = this.currentTask ? this.currentTask.duration : this.defaultTime;
    }

    this.taskIsStarted = false;
    clearInterval(this.intervalId);
  }

  private handleTaskDeleting(): void {
    if (this.currentTask === undefined) return;
    if (!this.currentTask.id) return;

    this.pomodoroTasksService
        .delete(this.currentTask.id)
        .subscribe(() => this.callService.sendClickCall());
  }
}
