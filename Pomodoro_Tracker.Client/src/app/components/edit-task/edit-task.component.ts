import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  @Input() task?: PomodoroTask;
  @Output() tasksUpdated = new EventEmitter<PomodoroTask[]>();

  constructor(private pomodoroTasksService: PomodoroTaskService) { }

  ngOnInit(): void { }

  createTask(task: PomodoroTask) {
    this.pomodoroTasksService
        .create(task)
        .subscribe((tasks: PomodoroTask[]) => this.tasksUpdated.emit(tasks));
  }

  updateTask(task: PomodoroTask) {
    this.pomodoroTasksService
        .update(task)
        .subscribe((tasks: PomodoroTask[]) => this.tasksUpdated.emit(tasks));
  }

  deleteTask(task: PomodoroTask) {
    if (!task.id) return;
    
    this.pomodoroTasksService
        .delete(task.id)
        .subscribe((tasks: PomodoroTask[]) => this.tasksUpdated.emit(tasks));
  }
}
