import { Component, OnInit } from '@angular/core';
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
  stats: SetupStats | null = {
    totalUsers: 1,
    activeUsers: 1,
    inactiveUsers: 0,
    systemUsers: 0,
    companyConfigured: false,
    letterHeadConfigured: false,
    emailDomains: 0,
    emailAccounts: 0
  }; // Temporary test data
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadDashboard();
      }
    });
  }

  loadDashboard() {
    const token = this.authService.getToken();
    console.log('Setup loadDashboard - token exists:', !!token);
    if (token) {
      console.log('Making request to /setup/dashboard');
      this.http.get<{ stats: SetupStats; user: any }>('http://localhost:3000/setup/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          console.log('Setup dashboard response:', response);
          console.log('Stats received:', response.stats);
          console.log('Stats type:', typeof response.stats);
          console.log('Stats keys:', Object.keys(response.stats || {}));
          this.stats = response.stats;
          console.log('Component stats after assignment:', this.stats);
          console.log('Component stats === null?', this.stats === null);
          console.log('Component stats === undefined?', this.stats === undefined);
        },
        error: (error) => {
          console.error('Error loading setup dashboard:', error);
          this.stats = null; // Set to null to show error state
        }
      });
    } else {
      console.log('No token available for setup dashboard');
      this.stats = null;
    }
  }
}
