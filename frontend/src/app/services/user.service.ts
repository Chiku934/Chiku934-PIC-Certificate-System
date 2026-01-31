import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  Id: number;
  Email: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Address?: string;
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
   * Create new user
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.refreshNow())
    );
  }

  /**
   * Update user
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user, {
      headers: this.getAuthHeaders()
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
