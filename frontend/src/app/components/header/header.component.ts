import { Component, OnInit, OnDestroy } from '@angular/core';
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
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;
  private sidebarSubscription!: Subscription;
  public sidebarService: SidebarService;

  constructor(
    private authService: AuthService,
    sidebarService: SidebarService,
    private router: Router
  ) {
    this.sidebarService = sidebarService;
  }

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.routerSubscription = this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
      this.isSetupPage = this.router.url.includes('/setup');
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
    const firstName = this.currentUser.firstName || this.currentUser.username || '';
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

  getGreeting(): string {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
}
