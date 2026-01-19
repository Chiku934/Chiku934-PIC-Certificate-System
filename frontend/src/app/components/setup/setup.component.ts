import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface SetupStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  systemUsers: number;
  companyConfigured: boolean;
  letterHeadConfigured: boolean;
  emailDomains: number;
  emailAccounts: number;
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  stats: SetupStats | null = null;
  currentUser: any = null;
  loading = true;
  error = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('SetupComponent ngOnInit');
    this.authService.currentUser$.subscribe(user => {
      console.log('SetupComponent currentUser subscription:', user);
      this.currentUser = user;
      if (user) {
        this.loadDashboard();
      }
    });
  }

  loadDashboard() {
    console.log('loadDashboard called');
    const token = this.authService.getToken();
    console.log('Token present:', !!token);
    if (token) {
      console.log('Making HTTP request to /api/setup/dashboard');
      this.http.get<{ stats: SetupStats; user: any }>('/api/setup/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          console.log('HTTP request successful, response:', response);
          this.stats = response.stats;
          this.loading = false;
          this.error = false;
          console.log('Stats set to:', this.stats);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading setup dashboard:', error);
          this.loading = false;
          this.error = true;
          this.stats = null;
        }
      });
    } else {
      console.log('No token, setting stats to null');
      this.stats = null;
    }
  }
}
