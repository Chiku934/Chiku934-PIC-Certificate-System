import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';

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
  imports: [CommonModule, SidebarComponent],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, OnDestroy {
  stats: SetupStats | null = null;
  currentUser: any = null;
  currentYear: number = new Date().getFullYear();
  loading = true;
  error = false;
  isSidebarCollapsed = false;
  
  private sidebarSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('SetupComponent ngOnInit');
    
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
      this.cdr.detectChanges();
    });

    this.authService.currentUser$.subscribe(user => {
      console.log('SetupComponent currentUser subscription:', user);
      this.currentUser = user;
      if (user) {
        this.loadDashboard();
      }
    });
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  loadDashboard() {
    console.log('loadDashboard called');
    const token = this.authService.getToken();
    console.log('Token present:', !!token);
    
    if (token) {
      console.log('Making HTTP request to /api/setup/dashboard');
      this.loading = true;
      this.error = false;
      
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
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('No token, setting stats to null');
      this.loading = false;
      this.stats = null;
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
