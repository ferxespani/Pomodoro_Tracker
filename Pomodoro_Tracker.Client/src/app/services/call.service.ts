import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

import { PomodoroTask } from "../models/pomodoro-task";

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private buttonClickSubject: Subject<void> = new Subject<void>();
  private currentTaskSubject: Subject<PomodoroTask> = new Subject<PomodoroTask>();

  constructor() { }

  public sendClickCall(): void {
    this.buttonClickSubject.next();
  }

  public getClickCall(): Observable<void> {
    return this.buttonClickSubject.asObservable();
  }

  public sendCurrentTask(currentTask: PomodoroTask): void {
    this.currentTaskSubject.next(currentTask);
  }

  public getCurrentTask(): Observable<PomodoroTask>{
    return this.currentTaskSubject.asObservable();
  }
}
