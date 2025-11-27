import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FoodRecognitionService } from '../../services/food-recognition.service';
import { FoodEntryService } from '../../services/food-entry.service';
import { NutritionalValue, Alternative, FoodEntry } from '../../models/user.model';

@Component({
  selector: 'app-food-recognition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="food-recognition-container">
      <h2>Food Recognition & Analysis</h2>
      
      <form [formGroup]="foodForm" (ngSubmit)="analyzeFood()">
        <div class="upload-section">
          <div class="image-upload">
            <input 
              type="file" 
              id="foodImage" 
              accept="image/*"
              (change)="onImageSelected($event)"
              #fileInput
              style="display: none;"
            >
            <div class="upload-area" (click)="fileInput.click()">
              <div *ngIf="!selectedImage" class="upload-placeholder">
                <div class="upload-icon">📷</div>
                <p>Click to upload food image</p>
                <small>or take a photo with camera</small>
              </div>
              <div *ngIf="selectedImage" class="image-preview">
                <img [src]="selectedImage" alt="Selected food">
                <button type="button" (click)="removeImage($event)" class="remove-image">×</button>
              </div>
            </div>
          </div>

          <div class="camera-section">
            <button type="button" (click)="openCamera()" class="camera-btn">
              📸 Use Camera
            </button>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="foodName">Food Name *</label>
            <input 
              type="text" 
              id="foodName" 
              formControlName="foodName"
              placeholder="e.g., Chicken Caesar Salad"
              [class.error]="foodForm.get('foodName')?.invalid && foodForm.get('foodName')?.touched"
            >
            <div class="error-message" *ngIf="foodForm.get('foodName')?.invalid && foodForm.get('foodName')?.touched">
              Food name is required
            </div>
          </div>

          <div class="form-group">
            <label for="additionalIngredients">Additional Ingredients</label>
            <textarea 
              id="additionalIngredients" 
              formControlName="additionalIngredients"
              placeholder="e.g., extra cheese, dressing on side"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="quantity">Quantity *</label>
              <input 
                type="number" 
                id="quantity" 
                formControlName="quantity"
                min="1"
                placeholder="100"
                [class.error]="foodForm.get('quantity')?.invalid && foodForm.get('quantity')?.touched"
              >
              <div class="error-message" *ngIf="foodForm.get('quantity')?.invalid && foodForm.get('quantity')?.touched">
                Quantity is required
              </div>
            </div>

            <div class="form-group">
              <label for="unit">Unit</label>
              <select id="unit" formControlName="unit">
                <option value="grams">Grams</option>
                <option value="ml">Milliliters</option>
                <option value="pieces">Pieces</option>
                <option value="cups">Cups</option>
                <option value="tablespoons">Tablespoons</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="mealType">Meal Type *</label>
            <select 
              id="mealType" 
              formControlName="mealType"
              [class.error]="foodForm.get('mealType')?.invalid && foodForm.get('mealType')?.touched"
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <div class="error-message" *ngIf="foodForm.get('mealType')?.invalid && foodForm.get('mealType')?.touched">
              Meal type is required
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="foodForm.invalid || analyzing" 
            class="analyze-btn"
          >
            {{ analyzing ? 'Analyzing...' : 'Analyze Food' }}
          </button>
        </div>
      </form>

      <div *ngIf="analyzing" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Analyzing your food with AI...</p>
      </div>

      <div *ngIf="nutritionalResult" class="results-section">
        <h3>Nutritional Analysis</h3>
        
        <div class="nutrition-card">
          <h4>{{ foodForm.get('foodName')?.value }}</h4>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="label">Calories</span>
              <span class="value">{{ nutritionalResult.calories }}</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Protein</span>
              <span class="value">{{ nutritionalResult.protein }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Carbs</span>
              <span class="value">{{ nutritionalResult.carbohydrates }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Fat</span>
              <span class="value">{{ nutritionalResult.fat }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Fiber</span>
              <span class="value">{{ nutritionalResult.fiber }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Sugar</span>
              <span class="value">{{ nutritionalResult.sugar }}g</span>
            </div>
          </div>
          
          <button (click)="saveFoodEntry()" class="save-btn" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save to My Foods' }}
          </button>
        </div>

        <div *ngIf="alternatives && alternatives.length > 0" class="alternatives-section">
          <h4>Healthier Alternatives</h4>
          <div class="alternatives-grid">
            <div *ngFor="let alt of alternatives" class="alternative-card">
              <h5>{{ alt.name }}</h5>
              <p class="reason">{{ alt.reason }}</p>
              <div class="alt-nutrition">
                <span>{{ alt.nutritionalValue.calories }} cal</span>
                <span>{{ alt.nutritionalValue.protein }}g protein</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .food-recognition-container {
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: 600;
    }

    .upload-section {
      margin-bottom: 30px;
    }

    .image-upload {
      margin-bottom: 20px;
    }

    .upload-area {
      border: 2px dashed #ddd;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.3s ease;
      position: relative;
    }

    .upload-area:hover {
      border-color: #667eea;
    }

    .upload-placeholder {
      color: #666;
    }

    .upload-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .image-preview {
      position: relative;
      display: inline-block;
    }

    .image-preview img {
      max-width: 300px;
      max-height: 200px;
      border-radius: 8px;
    }

    .remove-image {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
    }

    .camera-section {
      text-align: center;
    }

    .camera-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .camera-btn:hover {
      background: #218838;
    }

    .form-section {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row .form-group {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input:focus, select:focus, textarea:focus {
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

    .analyze-btn {
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

    .analyze-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .analyze-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-section {
      text-align: center;
      padding: 40px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .results-section {
      margin-top: 30px;
    }

    .nutrition-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .nutrition-card h4 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .nutrition-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .nutrition-item .label {
      display: block;
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .nutrition-item .value {
      display: block;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .save-btn {
      width: 100%;
      padding: 12px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .save-btn:hover:not(:disabled) {
      background: #218838;
    }

    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alternatives-section {
      margin-top: 30px;
    }

    .alternatives-section h4 {
      color: #333;
      margin-bottom: 20px;
    }

    .alternatives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .alternative-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #28a745;
    }

    .alternative-card h5 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .reason {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .alt-nutrition {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #555;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .nutrition-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .alternatives-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FoodRecognitionComponent {
  foodForm: FormGroup;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  analyzing = false;
  saving = false;
  nutritionalResult: NutritionalValue | null = null;
  alternatives: Alternative[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private foodRecognitionService: FoodRecognitionService,
    private foodEntryService: FoodEntryService
  ) {
    this.foodForm = this.fb.group({
      foodName: ['', [Validators.required]],
      additionalIngredients: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: ['grams'],
      mealType: ['', [Validators.required]]
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedImage = null;
    this.selectedFile = null;
  }

  openCamera() {
    // In a real app, this would open the device camera
    alert('Camera functionality would be implemented here using navigator.mediaDevices.getUserMedia()');
  }

  analyzeFood() {
    if (this.foodForm.valid) {
      this.analyzing = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.foodForm.value;
      const additionalIngredients = formData.additionalIngredients 
        ? formData.additionalIngredients.split(',').map((item: string) => item.trim())
        : [];

      this.foodRecognitionService.recognizeFood(
        this.selectedFile,
        formData.foodName,
        additionalIngredients,
        formData.quantity,
        formData.unit
      ).subscribe({
        next: (result) => {
          this.analyzing = false;
          this.nutritionalResult = result.nutritionalValue;
          this.alternatives = result.alternatives;
        },
        error: (error) => {
          this.analyzing = false;
          this.errorMessage = 'Failed to analyze food. Please try again.';
        }
      });
    }
  }

  saveFoodEntry() {
    if (this.nutritionalResult && this.foodForm.valid) {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.foodForm.value;
      const additionalIngredients = formData.additionalIngredients 
        ? formData.additionalIngredients.split(',').map((item: string) => item.trim())
        : [];

      const foodEntry: FoodEntry = {
        userId: '', // Will be set by service
        foodName: formData.foodName,
        additionalIngredients,
        quantity: formData.quantity,
        unit: formData.unit,
        mealType: formData.mealType,
        nutritionalValue: this.nutritionalResult,
        imageUrl: this.selectedImage || undefined,
        date: new Date()
      };

      this.foodEntryService.saveFoodEntry(foodEntry).subscribe({
        next: (response) => {
          this.saving = false;
          if (response.success) {
            this.successMessage = 'Food entry saved successfully!';
            // Reset form
            this.foodForm.reset();
            this.selectedImage = null;
            this.selectedFile = null;
            this.nutritionalResult = null;
            this.alternatives = [];
            this.foodForm.patchValue({ unit: 'grams' });
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.saving = false;
          this.errorMessage = 'Failed to save food entry. Please try again.';
        }
      });
    }
  }
}