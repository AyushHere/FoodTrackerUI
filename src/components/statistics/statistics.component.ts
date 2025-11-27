import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FoodEntryService } from '../../services/food-entry.service';
import { FoodEntry } from '../../models/user.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="statistics-container">
      <h2>Nutrition Statistics</h2>
      
      <div class="date-selector">
        <form [formGroup]="dateForm">
          <div class="form-group">
            <label for="selectedDate">Select Date:</label>
            <input 
              type="date" 
              id="selectedDate" 
              formControlName="selectedDate"
              (change)="onDateChange()"
            >
          </div>
        </form>
      </div>

      <div class="stats-overview">
        <div class="stat-card calories">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <h3>{{ dailyStats.totalCalories }}</h3>
            <p>Calories</p>
          </div>
        </div>

        <div class="stat-card protein">
          <div class="stat-icon">💪</div>
          <div class="stat-info">
            <h3>{{ dailyStats.totalProtein | number:'1.1-1' }}g</h3>
            <p>Protein</p>
          </div>
        </div>

        <div class="stat-card carbs">
          <div class="stat-icon">🌾</div>
          <div class="stat-info">
            <h3>{{ dailyStats.totalCarbs | number:'1.1-1' }}g</h3>
            <p>Carbohydrates</p>
          </div>
        </div>

        <div class="stat-card fat">
          <div class="stat-icon">🥑</div>
          <div class="stat-info">
            <h3>{{ dailyStats.totalFat | number:'1.1-1' }}g</h3>
            <p>Fat</p>
          </div>
        </div>
      </div>

      <div class="meals-section">
        <h3>Meals for {{ selectedDate | date:'mediumDate' }}</h3>
        
        <div *ngIf="dailyEntries.length === 0" class="no-entries">
          <p>No food entries found for this date.</p>
        </div>

        <div *ngIf="dailyEntries.length > 0" class="meals-grid">
          <div *ngFor="let mealType of mealTypes" class="meal-group">
            <h4>{{ getMealTypeLabel(mealType) }}</h4>
            <div class="meal-entries">
              <div 
                *ngFor="let entry of getEntriesByMealType(mealType)" 
                class="meal-entry"
              >
                <div class="entry-header">
                  <h5>{{ entry.foodName }}</h5>
                  <span class="quantity">{{ entry.quantity }} {{ entry.unit }}</span>
                </div>
                
                <div *ngIf="entry.additionalIngredients && entry.additionalIngredients.length > 0" class="ingredients">
                  <small>Additional: {{ entry.additionalIngredients.join(', ') }}</small>
                </div>
                
                <div class="entry-nutrition">
                  <div class="nutrition-item">
                    <span class="label">Calories:</span>
                    <span class="value">{{ entry.nutritionalValue.calories }}</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">Protein:</span>
                    <span class="value">{{ entry.nutritionalValue.protein }}g</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">Carbs:</span>
                    <span class="value">{{ entry.nutritionalValue.carbohydrates }}g</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">Fat:</span>
                    <span class="value">{{ entry.nutritionalValue.fat }}g</span>
                  </div>
                </div>

                <div *ngIf="entry.imageUrl" class="entry-image">
                  <img [src]="entry.imageUrl" alt="{{ entry.foodName }}">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="weekly-overview">
        <h3>Weekly Overview</h3>
        <div class="week-stats">
          <div *ngFor="let day of weeklyData" class="day-stat">
            <div class="day-label">{{ day.date | date:'EEE' }}</div>
            <div class="day-calories">{{ day.calories }}</div>
            <div class="day-bar">
              <div 
                class="bar-fill" 
                [style.height.%]="getBarHeight(day.calories)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: 600;
    }

    .date-selector {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .form-group {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    label {
      color: #555;
      font-weight: 500;
      min-width: 100px;
    }

    input[type="date"] {
      padding: 10px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.calories {
      border-left: 4px solid #e74c3c;
    }

    .stat-card.protein {
      border-left: 4px solid #3498db;
    }

    .stat-card.carbs {
      border-left: 4px solid #f39c12;
    }

    .stat-card.fat {
      border-left: 4px solid #27ae60;
    }

    .stat-icon {
      font-size: 32px;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .meals-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 40px;
    }

    .meals-section h3 {
      margin: 0 0 25px 0;
      color: #333;
      font-size: 20px;
    }

    .no-entries {
      text-align: center;
      color: #666;
      padding: 40px;
    }

    .meals-grid {
      display: grid;
      gap: 30px;
    }

    .meal-group h4 {
      margin: 0 0 15px 0;
      color: #667eea;
      font-size: 18px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .meal-entries {
      display: grid;
      gap: 15px;
    }

    .meal-entry {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .entry-header h5 {
      margin: 0;
      color: #333;
      font-size: 16px;
    }

    .quantity {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .ingredients {
      margin-bottom: 15px;
      color: #666;
    }

    .entry-nutrition {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
      margin-bottom: 15px;
    }

    .nutrition-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .nutrition-item .label {
      color: #666;
    }

    .nutrition-item .value {
      font-weight: 600;
      color: #333;
    }

    .entry-image {
      text-align: center;
    }

    .entry-image img {
      max-width: 150px;
      max-height: 100px;
      border-radius: 8px;
      object-fit: cover;
    }

    .weekly-overview {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .weekly-overview h3 {
      margin: 0 0 25px 0;
      color: #333;
      font-size: 20px;
    }

    .week-stats {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 10px;
      height: 200px;
    }

    .day-stat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .day-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .day-calories {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .day-bar {
      flex: 1;
      width: 30px;
      background: #f0f0f0;
      border-radius: 4px;
      position: relative;
      display: flex;
      align-items: end;
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      min-height: 4px;
      transition: height 0.3s ease;
    }

    @media (max-width: 768px) {
      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-group {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .entry-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .entry-nutrition {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  dateForm: FormGroup;
  selectedDate: Date = new Date();
  dailyEntries: FoodEntry[] = [];
  dailyStats = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
  mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  weeklyData: { date: Date; calories: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private foodEntryService: FoodEntryService
  ) {
    this.dateForm = this.fb.group({
      selectedDate: [this.formatDate(this.selectedDate)]
    });
  }

  ngOnInit() {
    this.loadDailyData();
    this.loadWeeklyData();
  }

  onDateChange() {
    const dateValue = this.dateForm.get('selectedDate')?.value;
    if (dateValue) {
      this.selectedDate = new Date(dateValue);
      this.loadDailyData();
    }
  }

  loadDailyData() {
    this.dailyEntries = this.foodEntryService.getFoodEntriesByDate(this.selectedDate);
    this.dailyStats = this.foodEntryService.getDailyStats(this.selectedDate);
  }

  loadWeeklyData() {
    const today = new Date();
    this.weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const stats = this.foodEntryService.getDailyStats(date);
      this.weeklyData.push({
        date,
        calories: stats.totalCalories
      });
    }
  }

  getEntriesByMealType(mealType: string): FoodEntry[] {
    return this.dailyEntries.filter(entry => entry.mealType === mealType);
  }

  getMealTypeLabel(mealType: string): string {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  }

  getBarHeight(calories: number): number {
    const maxCalories = Math.max(...this.weeklyData.map(d => d.calories), 1);
    return (calories / maxCalories) * 100;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}