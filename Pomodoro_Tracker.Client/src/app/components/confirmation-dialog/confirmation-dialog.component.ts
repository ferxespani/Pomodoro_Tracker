import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PomodoroTaskService } from "../../services/pomodoro-task.service";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string },
              private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              private pomodoroTasksService: PomodoroTaskService) {
  }

  ngOnInit(): void { }

  public deleteTask(): void {
    this.pomodoroTasksService
      .delete(this.data.id)
      .subscribe({
        next: () => this.dialogRef.close,
        error: err => console.error(err)
      });
  }
}
