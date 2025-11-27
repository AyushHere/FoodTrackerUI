import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoodEntry } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FoodEntryService {
  private readonly STORAGE_KEY = 'foodEntries';

  constructor(private authService: AuthService) {}

  saveFoodEntry(entry: FoodEntry): Observable<{ success: boolean; message: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, message: 'User not authenticated' });
    }

    entry.userId = currentUser.id!;
    entry.id = this.generateId();
    entry.createdAt = new Date();

    const entries = this.getFoodEntries();
    entries.push(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));

    return of({ success: true, message: 'Food entry saved successfully' });
  }

  getFoodEntriesByUser(): FoodEntry[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    const entries = this.getFoodEntries();
    return entries.filter(entry => entry.userId === currentUser.id);
  }

  getFoodEntriesByDate(date: Date): FoodEntry[] {
    const userEntries = this.getFoodEntriesByUser();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return userEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });
  }

  getDailyStats(date: Date): { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number } {
    const dayEntries = this.getFoodEntriesByDate(date);
    
    return dayEntries.reduce((stats, entry) => ({
      totalCalories: stats.totalCalories + entry.nutritionalValue.calories,
      totalProtein: stats.totalProtein + entry.nutritionalValue.protein,
      totalCarbs: stats.totalCarbs + entry.nutritionalValue.carbohydrates,
      totalFat: stats.totalFat + entry.nutritionalValue.fat
    }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
  }

  private getFoodEntries(): FoodEntry[] {
    const entries = localStorage.getItem(this.STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}