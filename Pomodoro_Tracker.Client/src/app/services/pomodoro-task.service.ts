import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PomodoroTask } from '../models/pomodoro-task';

@Injectable({
  providedIn: 'root'
})
export class PomodoroTaskService {
  url = "PomodoroTasks";

  constructor(private httpClient: HttpClient) { }

  public getAll() : Observable<PomodoroTask[]> {
    return this.httpClient.get<PomodoroTask[]>(`${environment.apiUrl}/${this.url}`);
  }

  public create(task: PomodoroTask) : Observable<PomodoroTask[]> {
    return this.httpClient.post<PomodoroTask[]>(`${environment.apiUrl}/${this.url}`, task);
  }

  public update(task: PomodoroTask) : Observable<PomodoroTask[]> {
    return this.httpClient.put<PomodoroTask[]>(`${environment.apiUrl}/${this.url}/${task.id}`, task);
  }

  public delete(id: string) : Observable<PomodoroTask[]> {
    return this.httpClient.delete<PomodoroTask[]>(`${environment.apiUrl}/${this.url}/${id}`);
  }
}
