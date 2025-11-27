import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FoodRecognitionComponent } from './components/food-recognition/food-recognition.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'food-recognition', component: FoodRecognitionComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '/login' }
];