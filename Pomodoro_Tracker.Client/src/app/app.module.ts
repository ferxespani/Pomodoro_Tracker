import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router } from '@angular/router'

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { TimerComponent } from './components/timer/timer.component';
import { TramsformSecondsPipe } from './pipes/tramsform-seconds.pipe';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'edit', component: EditTaskComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    EditTaskComponent,
    TimerComponent,
    TramsformSecondsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
