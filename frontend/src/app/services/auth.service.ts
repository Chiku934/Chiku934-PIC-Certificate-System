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
    displayName?: string;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  address?: string;
  phoneNumber?: string;
  role?: string;
  userRole?: string;
  roles?: string[];
  roleName?: string;
  userType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = '/api'; // Backend API server (proxied)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode token to get initial user data
      const decoded = this.decodeTokenAndSetUser(token);
      // Do not load profile here to avoid circular dependency with Http Interceptor.
      // Full profile will be loaded on-demand via `refreshUserProfile()` or after login.
    }
  }

  private decodeTokenAndSetUser(token: string): boolean {
    try {
      // Simple JWT decode (without verification on client side)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Try different possible field names for username
      const username = payload.username || payload.name || payload.sub || payload.email;
      const email = payload.email || payload.sub;
      
      const user = {
        id: payload.sub || Date.now(),
        username: username || 'User',
        email: email || '',
        firstName: payload.firstName || payload.given_name || payload.first_name || null,
        lastName: payload.lastName || payload.family_name || payload.last_name || null,
        displayName: payload.displayName || null,
      };
      
      this.currentUserSubject.next(user);
      return true;
    } catch (error) {
      return false;
    }
  }

  register(userData: { username: string; email: string; password: string; firstName?: string; lastName?: string; phoneNumber?: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/users/register`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  login(credentials: { email: string; password: string; rememberMe?: boolean }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/users/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
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

  // Force reload user profile from server
  refreshUserProfile(): void {
    this.loadUserProfile();
  }

  getUserInitials(): string {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return '';
    // Handle both property naming conventions and ensure it's a string
    let firstName = currentUser.firstName ||
                   currentUser.username || '';
    
    // Ensure firstName is a string and not an object
    if (firstName && typeof firstName === 'string') {
      return firstName.charAt(0).toUpperCase();
    }
    return 'U'; // Default initial if no name available
  }

  getDisplayName(): string {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return 'User';

    // Priority 1: Use pre-formatted displayName if available
    if (currentUser.displayName) {
      return currentUser.displayName;
    }

    // Priority 2: Construct from first/last name
    const firstName = currentUser.firstName || '';
    const lastName = currentUser.lastName || '';
    
    const combinedName = `${firstName} ${lastName}`.trim();
    if (combinedName) {
      return combinedName;
    }

    // Fallback to username or a default
    return currentUser.username || 'User';
  }

  private handleAuthentication(response: LoginResponse): void {
    localStorage.setItem('access_token', response.access_token);
    // Set user from response first
    this.currentUserSubject.next(response.user);
    // Defer profile loading to avoid circular dependency
    setTimeout(() => {
      this.loadUserProfile();
    }, 100);
  }

  private loadUserProfile(): void {
    const token = this.getToken();

    this.http.get<any>(`${this.API_URL}/users/profile`).subscribe({
      next: (user) => {
        // raw API response received
        
        const mappedUser = {
          Id: user.Id,
          id: user.Id,
          username: user.UserName || user.username,
          Email: user.Email,
          email: user.Email,
          FirstName: user.FirstName,
          firstName: user.FirstName,
          MiddleName: user.MiddleName,
          middleName: user.MiddleName,
          LastName: user.LastName,
          lastName: user.LastName,
          displayName: user.displayName,
          Address: user.Address,
          address: user.Address,
          PhoneNumber: user.PhoneNumber,
          phoneNumber: user.PhoneNumber,
          UserImage: user.UserImage,
          userImage: user.UserImage,
          profileImage: user.UserImage,
          role: user.role,
          userRole: user.userRole,
          roles: user.roles || [],
          roleName: user.roleName,
          userType: user.userType,
        };
        
        // mapped user object prepared
        
        this.currentUserSubject.next(mappedUser);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        const currentUserData = this.currentUserSubject.value;
        if (token && (!currentUserData || !currentUserData.username || currentUserData.username === 'User')) {
          this.decodeTokenAndSetUser(token);
        }
      }
    });
  }
}
