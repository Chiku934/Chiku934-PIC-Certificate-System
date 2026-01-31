import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  Id: number;
  Email: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Address?: string;
  UserImage?: string;
  IsActive?: boolean;
  CreatedBy?: number;
  UpdatedBy?: number;
  DeletedBy?: number;
  IsDeleted?: boolean;
  CreatedDate?: string;
  UpdatedDate?: string;
  DeletedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private refreshInterval = 5000; // Refresh every 5 seconds
  
  // BehaviorSubjects to hold the latest data
  private allUsers$ = new BehaviorSubject<User[]>([]);
  private activeUsers$ = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    this.startAutoRefresh();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getAuthHeadersMultipart(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get all users with auto-refresh
   */
  getAllUsers(): Observable<User[]> {
    return this.allUsers$.asObservable();
  }

  /**
   * Get active users with auto-refresh
   */
  getActiveUsers(): Observable<User[]> {
    return this.activeUsers$.asObservable();
  }

  /**
   * Fetch single user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Create new user with optional file upload
   */
  createUser(userData: any, file?: File | null, roles?: string[]): Observable<any> {
    const formData = new FormData();
    
    // Add user data
    formData.append('Email', userData.Email);
    formData.append('FirstName', userData.FirstName || '');
    formData.append('MiddleName', userData.MiddleName || '');
    formData.append('LastName', userData.LastName || '');
    formData.append('PhoneNumber', userData.PhoneNumber || '');
    formData.append('Address', userData.Address || '');
    formData.append('Password', userData.Password);
    formData.append('IsActive', userData.IsActive || true);
    
    // Add roles
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        formData.append('Roles', role);
      });
    }
    
    // Add file if provided
    if (file) {
      formData.append('UserImage', file);
    }

    return this.http.post<any>(`${this.apiUrl}/register`, formData, {
      headers: this.getAuthHeadersMultipart()
    }).pipe(
      tap(() => this.refreshNow())
    );
  }

  /**
   * Update user with optional file upload
   */
  updateUser(id: number, userData: any, file?: File | null, roles?: string[]): Observable<any> {
    const formData = new FormData();
    
    // Add user data
    formData.append('Email', userData.Email);
    formData.append('FirstName', userData.FirstName || '');
    formData.append('MiddleName', userData.MiddleName || '');
    formData.append('LastName', userData.LastName || '');
    formData.append('PhoneNumber', userData.PhoneNumber || '');
    formData.append('Address', userData.Address || '');
    formData.append('IsActive', userData.IsActive || true);
    
    // Add password if provided
    if (userData.Password) {
      formData.append('Password', userData.Password);
    }
    
    // Add roles
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        formData.append('Roles', role);
      });
    }
    
    // Add file if provided
    if (file) {
      formData.append('UserImage', file);
    }

    return this.http.patch<any>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeadersMultipart()
    }).pipe(
      tap(() => this.refreshNow())
    );
  }

  /**
   * Delete (soft delete) user
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        console.log('User deleted:', id);
        this.refreshNow();
      })
    );
  }

  /**
   * Manually refresh all data immediately
   */
  refreshNow(): void {
    this.fetchAllUsers();
  }

  /**
   * Start auto-refresh interval
   */
  private startAutoRefresh(): void {
    interval(this.refreshInterval).subscribe(() => {
      this.fetchAllUsers();
    });
  }

  /**
   * Fetch all users from API
   */
  private fetchAllUsers(): void {
    this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (data) => this.allUsers$.next(data),
      error: (error) => console.error('Error fetching users:', error)
    });
  }
}
