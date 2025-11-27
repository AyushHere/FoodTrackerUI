import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FoodEntryService } from '../../services/food-entry.service';
import { FoodEntry } from '../../models/user.model';
import { FoodRecognitionComponent } from '../food-recognition/food-recognition.component';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FoodRecognitionComponent,StatisticsComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Food Nutrition Tracker</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.email }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="tabs-container">
          <div class="tabs">
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'recognize'"
              (click)="setActiveTab('recognize')"
            >
              Food Recognition
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'stats'"
              (click)="setActiveTab('stats')"
            >
              Statistics
            </button>
          </div>

          <div class="tab-content">
            <div *ngIf="activeTab === 'recognize'" class="recognize-tab">
              <app-food-recognition></app-food-recognition>
            </div>

            <div *ngIf="activeTab === 'stats'" class="stats-tab">
              <app-statistics></app-statistics>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .dashboard-content {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tabs-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .tabs {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .tab-btn {
      flex: 1;
      padding: 20px;
      background: none;
      border: none;
      font-size: 16px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .tab-btn:hover {
      background: #e9ecef;
      color: #333;
    }

    .tab-btn.active {
      color: #667eea;
      background: white;
    }

    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #667eea;
    }

    .tab-content {
      padding: 40px;
      min-height: 600px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 15px 20px;
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .dashboard-content {
        padding: 20px;
      }

      .tab-content {
        padding: 20px;
      }

      .tabs {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeTab: 'recognize' | 'stats' = 'recognize';
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  setActiveTab(tab: 'recognize' | 'stats') {
    this.activeTab = tab;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}