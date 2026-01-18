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
  stats: SetupStats | null = null;
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
    if (token) {
      this.http.get<{ stats: SetupStats; user: any }>('http://localhost:3000/setup/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          this.stats = response.stats;
        },
        error: (error) => {
          console.error('Error loading setup dashboard:', error);
          this.stats = null; // Set to null to show error state
        }
      });
    } else {
      this.stats = null;
    }
  }
}
