export interface User {
  id?: string;
  email: string;
  password?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  bmi?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FoodEntry {
  id?: string;
  userId: string;
  foodName: string;
  additionalIngredients?: string[];
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  nutritionalValue: NutritionalValue;
  imageUrl?: string;
  date: Date;
  createdAt?: Date;
}

export interface NutritionalValue {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar: number; // in grams
  sodium: number; // in mg
  cholesterol: number; // in mg
}

export interface Alternative {
  name: string;
  nutritionalValue: NutritionalValue;
  reason: string;
}