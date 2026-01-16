import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000'; // Adjust based on backend port
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode token to get user info, or fetch from API
      this.loadUserProfile();
    }
  }

  register(userData: { username: string; email: string; password: string; firstName?: string; lastName?: string; phoneNumber?: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/users/register`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    console.log('AuthService login called with:', credentials);
    return this.http.post<LoginResponse>(`${this.API_URL}/users/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService login response:', response);
        this.handleAuthentication(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private handleAuthentication(response: LoginResponse): void {
    localStorage.setItem('access_token', response.access_token);
    this.currentUserSubject.next(response.user);
  }

  private loadUserProfile(): void {
    this.http.get<User>(`${this.API_URL}/users/profile`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.logout()
    });
  }
}
