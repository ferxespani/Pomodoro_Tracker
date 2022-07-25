import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { PomodoroTask } from 'src/app/models/pomodoro-task';
import { PomodoroTaskService } from 'src/app/services/pomodoro-task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  @Input() task?: PomodoroTask;
  @Output() tasksUpdated: EventEmitter<PomodoroTask> = new EventEmitter<PomodoroTask>();

  public actionName: string = 'Save';
  public taskForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: PomodoroTask },
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private pomodoroTasksService: PomodoroTaskService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required],
      duration: ['', Validators.required]
    });

    if (this.data) {
      this.taskForm.controls['description'].setValue(this.data.task.description);
      this.taskForm.controls['duration'].setValue(this.data.task.duration);
      this.actionName = 'Update';
    }
  }

  public handleAction(): void {
    if (this.actionName === 'Save') {
      this.createTask();
      return;
    }

    this.updateTask();
  }

  private createTask(): void {
    if (this.taskForm.valid) {
      let createdTask = this.taskForm.value as PomodoroTask;
      this.pomodoroTasksService
        .create(createdTask)
        .subscribe({
          next: () => this.dialogRef.close(),
          error: err => console.error(err)
        });
    }
  }

  private updateTask(): void {
    if (this.taskForm.valid) {
      let task = this.data.task;
      task.description = this.taskForm.controls['description'].value;
      task.duration = this.taskForm.controls['duration'].value;

      this.pomodoroTasksService
        .update(task)
        .subscribe({
          next: () => this.dialogRef.close(),
          error: err => console.error(err)
        });
    }
  }
}
