import { ReturnStatement } from '@angular/compiler';
import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { ButtonType } from 'src/app/button-type';
import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, AfterViewInit {
  @Input() currentTask?: PomodoroTask;
  @Input() leftTime?: number;
  @Output() tasksUpdated = new EventEmitter<PomodoroTask[]>();
  
  public taskIsStarted: boolean = false;
  public defaultTime: number = 1800;

  private intervalId: number = 0;
  private taskIsPaused: boolean = false;
  private startPauseButton!: HTMLElement | null;
  private stopButton!: HTMLElement | null;

  constructor(private pomodoroTasksService: PomodoroTaskService) {}

  ngOnInit(): void {
    if (!this.leftTime) {
      this.leftTime = this.defaultTime;
    }
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
        .subscribe((tasks: PomodoroTask[]) => this.tasksUpdated.emit(tasks));
  }
}
