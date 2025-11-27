import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private users: User[] = []; // In-memory storage for demo

  constructor() {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return of({ success: false, message: 'User already exists with this email' });
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      password
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    
    return of({ success: true, message: 'Registration successful', user: newUser });
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }

    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of({ success: true, message: 'Login successful', user });
    }

    return of({ success: false, message: 'Invalid email or password' });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}