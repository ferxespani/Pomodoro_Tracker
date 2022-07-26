import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/internal/Observable";

import { PomodoroTask } from "../../models/pomodoro-task";
import { PomodoroTaskService } from "../../services/pomodoro-task.service";
import { EditTaskComponent } from "../edit-task/edit-task.component";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { CallService } from "../../services/call.service";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  public displayedColumns: string[] = ['description', 'duration', 'creationDateUtc', 'actions'];
  public tasks: PomodoroTask[] = [];

  private clickCall$: Observable<void> = this.callService.getClickCall();

  constructor(public dialog: MatDialog,
              private pomodoroTaskService: PomodoroTaskService,
              private callService: CallService) { }

  ngOnInit(): void {
    this.getTasks();
    this.clickCall$.subscribe(() => this.getTasks());
  }

  public updateTaskList(): void {
    this.getTasks();
  }

  public updateTask(task: PomodoroTask): void {
    this.dialog.open(EditTaskComponent, {
      data: { task: task }
    });
  }

  public deleteTask(id: string): void {
    let dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: { id: id }
      });

    dialogRef.componentInstance.title = 'Delete task';
    dialogRef.componentInstance.content = 'Are you sure you want to delete the task?';
    dialogRef.componentInstance.firstButtonTitle = 'No';
    dialogRef.componentInstance.secondButtonTitle = 'Yes';

    dialogRef
      .afterClosed()
      .subscribe((data: any) => {
        if (data.id && data.id === id) {
          this.pomodoroTaskService
            .delete(id)
            .subscribe(() => this.getTasks());
        }
    })
  }

  private getTasks(): void {
    this.pomodoroTaskService
      .getAll()
      .subscribe((result: PomodoroTask[]) => {
        this.tasks = result
        if (this.tasks.length > 0) {
          this.callService.sendCurrentTask(this.tasks[0]);
        }
      });
  }
}
