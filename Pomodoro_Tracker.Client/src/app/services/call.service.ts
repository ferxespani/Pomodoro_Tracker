import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private taskIsAdded: Subject<void> = new Subject<void>();
  private taskIsDeleted: Subject<void> = new Subject<void>();
  private taskListIsUpdated: Subject<void> = new Subject<void>();

  constructor() { }

  public sendTaskAddedCall(): void {
    this.taskIsAdded.next();
  }

  public getTaskAddedCall(): Observable<void> {
    return this.taskIsAdded.asObservable();
  }

  public sendTaskDeletedCall(): void {
    this.taskIsDeleted.next();
  }

  public getTaskDeletedCall(): Observable<void> {
    return this.taskIsDeleted.asObservable();
  }

  public sendTaskListIsUpdatedCall(): void {
    this.taskListIsUpdated.next();
  }

  public getTaskListIsUpdatedCall(): Observable<void> {
    return this.taskListIsUpdated.asObservable();
  }
}
