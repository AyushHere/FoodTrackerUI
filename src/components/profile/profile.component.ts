import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>Complete Your Profile</h2>
        <p class="subtitle">Help us personalize your nutrition tracking experience</p>
        
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input 
                type="number" 
                id="age" 
                formControlName="age"
                min="1" 
                max="120"
                [class.error]="profileForm.get('age')?.invalid && profileForm.get('age')?.touched"
              >
              <div class="error-message" *ngIf="profileForm.get('age')?.invalid && profileForm.get('age')?.touched">
                Please enter a valid age
              </div>
            </div>

            <div class="form-group">
              <label for="gender">Gender</label>
              <select 
                id="gender" 
                formControlName="gender"
                [class.error]="profileForm.get('gender')?.invalid && profileForm.get('gender')?.touched"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div class="error-message" *ngIf="profileForm.get('gender')?.invalid && profileForm.get('gender')?.touched">
                Please select your gender
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="height">Height (cm)</label>
              <input 
                type="number" 
                id="height" 
                formControlName="height"
                min="50" 
                max="300"
                [class.error]="profileForm.get('height')?.invalid && profileForm.get('height')?.touched"
              >
              <div class="error-message" *ngIf="profileForm.get('height')?.invalid && profileForm.get('height')?.touched">
                Please enter a valid height
              </div>
            </div>

            <div class="form-group">
              <label for="weight">Weight (kg)</label>
              <input 
                type="number" 
                id="weight" 
                formControlName="weight"
                min="20" 
                max="500"
                step="0.1"
                [class.error]="profileForm.get('weight')?.invalid && profileForm.get('weight')?.touched"
              >
              <div class="error-message" *ngIf="profileForm.get('weight')?.invalid && profileForm.get('weight')?.touched">
                Please enter a valid weight
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="activityLevel">Activity Level</label>
            <select 
              id="activityLevel" 
              formControlName="activityLevel"
              [class.error]="profileForm.get('activityLevel')?.invalid && profileForm.get('activityLevel')?.touched"
            >
              <option value="">Select Activity Level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very-active">Very Active (very hard exercise, physical job)</option>
            </select>
            <div class="error-message" *ngIf="profileForm.get('activityLevel')?.invalid && profileForm.get('activityLevel')?.touched">
              Please select your activity level
            </div>
          </div>

          <div class="bmi-display" *ngIf="calculatedBMI">
            <h3>Your BMI: {{ calculatedBMI | number:'1.1-1' }}</h3>
            <p class="bmi-category">{{ getBMICategory(calculatedBMI) }}</p>
          </div>

          <button type="submit" [disabled]="profileForm.invalid || loading" class="submit-btn">
            {{ loading ? 'Saving...' : 'Save Profile' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .profile-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;
    }

    h2 {
      text-align: center;
      margin-bottom: 10px;
      color: #333;
      font-size: 28px;
      font-weight: 600;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      flex: 1;
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }

    input.error, select.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .bmi-display {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }

    .bmi-display h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .bmi-category {
      margin: 0;
      font-weight: 500;
      color: #667eea;
    }

    .submit-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  errorMessage = '';
  calculatedBMI: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      gender: ['', [Validators.required]],
      activityLevel: ['', [Validators.required]]
    });

    // Calculate BMI when height or weight changes
    this.profileForm.get('height')?.valueChanges.subscribe(() => this.calculateBMI());
    this.profileForm.get('weight')?.valueChanges.subscribe(() => this.calculateBMI());
  }

  ngOnInit() {
    // Load existing profile if available
    const existingProfile = this.userProfileService.getProfile();
    if (existingProfile) {
      this.profileForm.patchValue(existingProfile);
      this.calculateBMI();
    }
  }

  calculateBMI() {
    const height = this.profileForm.get('height')?.value;
    const weight = this.profileForm.get('weight')?.value;
    
    if (height && weight) {
      const heightInMeters = height / 100;
      this.calculatedBMI = weight / (heightInMeters * heightInMeters);
    } else {
      this.calculatedBMI = null;
    }
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const profileData: UserProfile = this.profileForm.value;
      
      this.userProfileService.saveProfile(profileData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to save profile. Please try again.';
        }
      });
    }
  }
}