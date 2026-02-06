import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isLoading = false;
  hasProfileImage = false;
  private destroy$ = new Subject<void>();

  // Fixed roles to display
  availableRoles = ['Administrator', 'Admin', 'User'];
  userRoles: string[] = [];
  roleChecked: { [key: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        // normalize roles into simple array and boolean map for template binding
        const normalized = (user?.roles || []).map((r: any) => r?.toString().toLowerCase().trim());
        this.userRoles = normalized;
        this.roleChecked = {};
        const roleSet = new Set(normalized);
        for (const av of this.availableRoles) {
          this.roleChecked[av] = roleSet.has(av.toLowerCase().trim());
        }
        // Only redirect to login if user is null/undefined and we're not already on login page
        if (!user && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      });
    
    // Force refresh user profile to ensure we have the latest data
    this.authService.refreshUserProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  formatRole(role: string): string {
    if (!role) return 'User';

    // Convert to title case and handle common role variations
    const roleStr = role.toString().toLowerCase().trim();

    // Common role mappings
    const roleMap: { [key: string]: string } = {
      'admin': 'Admin',
      'administrator': 'Administrator',
      'superadmin': 'Administrator',
      'super-admin': 'Administrator',
      'super_admin': 'Administrator',
      'user': 'User',
      'viewer': 'User',
      'editor': 'User',
      'manager': 'Manager',
      'supervisor': 'Manager'
    };

    return roleMap[roleStr] || role;
  }

  getFullName(): string {
    if (!this.currentUser) return 'User';
    const parts = [this.currentUser.FirstName, this.currentUser.MiddleName, this.currentUser.LastName].filter(p => p);
    return parts.length ? parts.join(' ') : this.currentUser.Email || 'User';
  }
}

