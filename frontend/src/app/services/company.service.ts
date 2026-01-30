import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CompanyDetails {
  Id?: number;
  CompanyName: string;
  ABBR: string;
  CompanyLogo?: string;
  TaxId?: string;
  Domain?: string;
  DateOfEstablishment?: Date;
  DateOfIncorporation?: Date;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  EmailAddress?: string;
  PhoneNumber?: string;
  Fax?: string;
  Website?: string;
  CreatedBy?: number;
  CreatedDate?: Date;
  UpdatedBy?: number;
  UpdatedDate?: Date;
  DeletedDate?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = '/api/setup';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Note: Don't set Content-Type for FormData, let browser set it with boundary
    });
  }

  // Get current company details
  getCompany(): Observable<CompanyDetails | null> {
    return this.http.get<ApiResponse<CompanyDetails>>(`${this.apiUrl}/company`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data || null),
      catchError(this.handleError)
    );
  }

  // Create or update company details
  createOrUpdateCompany(companyData: CompanyDetails, file?: File): Observable<CompanyDetails> {
    const formData = new FormData();
    
    // Add company data fields
    Object.keys(companyData).forEach(key => {
      const value = (companyData as any)[key];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add file if provided
    if (file) {
      formData.append('companyLogo', file, file.name);
    }

    return this.http.post<ApiResponse<CompanyDetails>>(`${this.apiUrl}/company`, formData, { headers: this.getFormDataHeaders() }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to save company details');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Create company details (legacy method)
  createCompany(companyData: CompanyDetails, file?: File): Observable<CompanyDetails> {
    const formData = new FormData();
    
    Object.keys(companyData).forEach(key => {
      const value = (companyData as any)[key];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (file) {
      formData.append('companyLogo', file, file.name);
    }

    return this.http.post<ApiResponse<CompanyDetails>>(`${this.apiUrl}/company-details`, formData, { headers: this.getFormDataHeaders() }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to create company');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Update company details
  updateCompany(id: number, companyData: CompanyDetails, file?: File): Observable<CompanyDetails> {
    const formData = new FormData();
    
    Object.keys(companyData).forEach(key => {
      const value = (companyData as any)[key];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (file) {
      formData.append('companyLogo', file, file.name);
    }

    return this.http.patch<ApiResponse<CompanyDetails>>(`${this.apiUrl}/company-details/${id}`, formData, { headers: this.getFormDataHeaders() }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to update company');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Delete company
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/company-details/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete company');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get all company details
  getAllCompanies(): Observable<CompanyDetails[]> {
    return this.http.get<CompanyDetails[]>(`${this.apiUrl}/company-details`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get current company details (legacy method)
  getCurrentCompany(): Observable<CompanyDetails | null> {
    return this.http.get<CompanyDetails | null>(`${this.apiUrl}/company-details/current`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}