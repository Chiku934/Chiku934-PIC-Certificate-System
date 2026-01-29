import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isDropdownOpen = false;
  isMobileOpen = false;
  isLoginPage = false;
  isSetupPage = false;
  isDashboardPage = false;
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;
  private sidebarSubscription!: Subscription;
  public sidebarService: SidebarService;

  constructor(
    private authService: AuthService,
    sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.sidebarService = sidebarService;
  }

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Trigger change detection when user data changes
      this.cdr.detectChanges();
    });

    this.routerSubscription = this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
      this.isSetupPage = this.router.url.includes('/setup');
      this.isDashboardPage = this.router.url === '/dashboard' || this.router.url === '/';
    });

    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      // We don't directly use this in header, but we could if needed
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    console.log('Hamburger button clicked - toggling sidebar');
    // Toggle the service state (this will handle both mobile and desktop)
    this.sidebarService.toggle();
    
    // Debug hamburger button state
    setTimeout(() => {
      const hamburgerBtn = document.querySelector('.hamburger-btn');
      if (hamburgerBtn) {
        console.log('Hamburger button found');
        console.log('Has active class:', hamburgerBtn.classList.contains('active'));
        console.log('All classes:', hamburgerBtn.classList);
      } else {
        console.log('Hamburger button NOT found');
      }
    }, 100);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  getProfileImageUrl(): string {
    if (this.currentUser?.profileImage) {
      return this.currentUser.profileImage;
    }
    return '/assets/images/default-profile-icon.png';
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/default-profile-icon.png';
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    // Handle both property naming conventions
    const firstName = this.currentUser.firstName || 
                     this.currentUser.FirstName || 
                     this.currentUser.username || 
                     this.currentUser.UserName || '';
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return 'U'; // Default initial if no name available
  }

  hasProfileImage(): boolean {
    return !!this.currentUser?.profileImage;
  }

  navigateToProfile() {
    this.closeDropdown();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getGreeting(): string {
    const currentHour = new Date().getHours();
    let greeting = '';
    
    if (currentHour < 12) {
      greeting = 'Good Morning';
    } else if (currentHour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    // Add user role if available
    if (this.currentUser) {
      // Try to get role from different possible properties
      const role = this.currentUser.role || 
                   this.currentUser.userRole || 
                   this.currentUser.roleName || 
                   this.currentUser.userType || 
                   'User';
      
      // Format role with proper capitalization
      const formattedRole = this.formatRole(role);
      return `${greeting}, ${formattedRole}`;
    }
    
    return greeting;
  }

  private formatRole(role: string): string {
    if (!role) return 'User';
    
    // Convert to title case and handle common role variations
    const roleStr = role.toString().toLowerCase();
    
    // Common role mappings
    const roleMap: { [key: string]: string } = {
      'admin': 'Admin',
      'administrator': 'Administrator',
      'superadmin': 'Super Admin',
      'super-admin': 'Super Admin',
      'super_admin': 'Super Admin',
      'user': 'User',
      'viewer': 'Viewer',
      'editor': 'Editor',
      'manager': 'Manager',
      'supervisor': 'Supervisor'
    };

    // Check if we have a mapped role
    if (roleMap[roleStr]) {
      return roleMap[roleStr];
    }

    // Default title case formatting
    return roleStr
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
