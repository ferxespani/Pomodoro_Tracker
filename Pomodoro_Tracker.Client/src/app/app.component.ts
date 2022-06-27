import { Component } from '@angular/core';
import { PomodoroTask } from './models/pomodoro-task';
import { PomodoroTaskService } from './services/pomodoro-task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pomodoro_Tracker.Client';
  tasks: PomodoroTask[] = [];
  taskToEdit?: PomodoroTask;

  constructor(private pomodoroTaskService: PomodoroTaskService) {}

  ngOnInit() : void {
    this.pomodoroTaskService
        .getAll()
        .subscribe((result: PomodoroTask[]) => this.tasks = result);
  }

  updateTaskList(tasks: PomodoroTask[]) {
    this.tasks = tasks;
  }

  initNewTask() {
    this.taskToEdit = new PomodoroTask();
  }

  editTask(task: PomodoroTask) {
    this.taskToEdit = task;
  }
}
