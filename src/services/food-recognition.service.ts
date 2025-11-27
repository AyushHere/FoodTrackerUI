import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { NutritionalValue, Alternative } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FoodRecognitionService {

  recognizeFood(
    image: File | null, 
    foodName: string, 
    additionalIngredients: string[], 
    quantity: number, 
    unit: string
  ): Observable<{ nutritionalValue: NutritionalValue; alternatives: Alternative[] }> {
    // Simulate AI API call with mock data
    const mockNutritionalValue: NutritionalValue = {
      calories: Math.floor(Math.random() * 500) + 100,
      protein: Math.floor(Math.random() * 30) + 5,
      carbohydrates: Math.floor(Math.random() * 50) + 10,
      fat: Math.floor(Math.random() * 20) + 2,
      fiber: Math.floor(Math.random() * 10) + 1,
      sugar: Math.floor(Math.random() * 15) + 2,
      sodium: Math.floor(Math.random() * 500) + 50,
      cholesterol: Math.floor(Math.random() * 50) + 5
    };

    const mockAlternatives: Alternative[] = [
      {
        name: `Healthier ${foodName}`,
        nutritionalValue: {
          ...mockNutritionalValue,
          calories: mockNutritionalValue.calories - 50,
          fat: mockNutritionalValue.fat - 2
        },
        reason: 'Lower in calories and fat'
      },
      {
        name: `Protein-rich ${foodName}`,
        nutritionalValue: {
          ...mockNutritionalValue,
          protein: mockNutritionalValue.protein + 10
        },
        reason: 'Higher protein content for muscle building'
      }
    ];

    // Adjust values based on quantity
    const adjustedNutritionalValue = this.adjustForQuantity(mockNutritionalValue, quantity);
    const adjustedAlternatives = mockAlternatives.map(alt => ({
      ...alt,
      nutritionalValue: this.adjustForQuantity(alt.nutritionalValue, quantity)
    }));

    return of({
      nutritionalValue: adjustedNutritionalValue,
      alternatives: adjustedAlternatives
    }).pipe(delay(2000)); // Simulate API delay
  }

  private adjustForQuantity(nutritionalValue: NutritionalValue, quantity: number): NutritionalValue {
    const multiplier = quantity / 100; // Assuming base values are per 100g
    return {
      calories: Math.round(nutritionalValue.calories * multiplier),
      protein: Math.round(nutritionalValue.protein * multiplier * 10) / 10,
      carbohydrates: Math.round(nutritionalValue.carbohydrates * multiplier * 10) / 10,
      fat: Math.round(nutritionalValue.fat * multiplier * 10) / 10,
      fiber: Math.round(nutritionalValue.fiber * multiplier * 10) / 10,
      sugar: Math.round(nutritionalValue.sugar * multiplier * 10) / 10,
      sodium: Math.round(nutritionalValue.sodium * multiplier),
      cholesterol: Math.round(nutritionalValue.cholesterol * multiplier)
    };
  }
}