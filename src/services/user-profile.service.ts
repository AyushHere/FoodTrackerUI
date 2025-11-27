import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserProfile, User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private authService: AuthService) {}

  saveProfile(profile: UserProfile): Observable<{ success: boolean; message: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, message: 'User not authenticated' });
    }

    // Calculate BMI
    const heightInMeters = profile.height / 100;
    profile.bmi = profile.weight / (heightInMeters * heightInMeters);
    profile.createdAt = new Date();
    profile.updatedAt = new Date();

    // Update user with profile
    const updatedUser: User = {
      ...currentUser,
      profile
    };

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    return of({ success: true, message: 'Profile saved successfully' });
  }

  getProfile(): UserProfile | null {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.profile || null;
  }
}