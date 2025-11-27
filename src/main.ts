import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FoodRecognitionComponent } from './components/food-recognition/food-recognition.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, FoodRecognitionComponent, StatisticsComponent],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule)
  ]
});
