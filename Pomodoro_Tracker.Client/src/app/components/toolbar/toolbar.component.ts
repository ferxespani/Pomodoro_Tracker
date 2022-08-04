import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditTaskComponent } from "../edit-task/edit-task.component";
import { CallService } from "../../services/call.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private callService: CallService) { }

  ngOnInit(): void { }

  openDialog(): void {
    this.dialog
      .open(EditTaskComponent)
      .afterClosed()
      .subscribe(() => {
        this.callService.sendTaskAddedCall()
      });
  }
}
