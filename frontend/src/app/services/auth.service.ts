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
  private readonly API_URL = ''; // Relative URLs since frontend is served by backend
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    console.log('AuthService constructor - token exists:', !!token);
    if (token) {
      // Decode token to get user info without API call
      this.decodeTokenAndSetUser(token);
    }
  }

  private decodeTokenAndSetUser(token: string) {
    try {
      // Simple JWT decode (without verification on client side)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token payload:', payload);
      const user = {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName || null,
        lastName: payload.lastName || null,
      };
      this.currentUserSubject.next(user);
      console.log('User set from token:', user);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
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
    console.log('Loading user profile...');
    this.http.get<User>(`${this.API_URL}/users/profile`).subscribe({
      next: (user) => {
        console.log('User profile loaded:', user);
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.log('Error loading user profile:', error);
        this.logout();
      }
    });
  }
}
