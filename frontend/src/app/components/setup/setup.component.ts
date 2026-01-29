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
  imports: [CommonModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
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
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
      this.cdr.detectChanges();
    });

    // Subscribe to user data changes first
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id) {
        // User is authenticated and has an ID, load dashboard
        this.loadDashboard();
      } else if (!user) {
        // No user authenticated
        this.loading = false;
        this.error = true;
        this.stats = null;
        this.cdr.detectChanges();
      }
    });

    // Also try to load dashboard immediately in case user data is already available
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.loadDashboard();
    }
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  loadDashboard() {
    const token = this.authService.getToken();
    
    if (token) {
      this.loading = true;
      this.error = false;
      
      // Use manual Authorization header to ensure token is sent
      this.http.get<{ stats: SetupStats; user: any }>('/api/setup/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          this.stats = response.stats;
          this.loading = false;
          this.error = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loading = false;
          this.error = true;
          this.stats = null;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loading = false;
      this.stats = null;
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
