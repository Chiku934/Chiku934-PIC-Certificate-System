import { Component, signal, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { SidebarService } from './services/sidebar.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('frontend');
  private sidebarSubscription!: Subscription;
  public sidebarService: SidebarService;
  currentUser: any = null;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/setup'
    },
    {
      label: 'Company Details',
      icon: 'fas fa-building',
      route: '/setup/company-details'
    },
    {
      label: 'Equipment',
      icon: 'fas fa-cogs',
      isExpanded: false,
      children: [
        { label: 'Equipment List', icon: 'fas fa-list', route: '/setup/equipment' },
        { label: 'Maintenance Schedule', icon: 'fas fa-calendar-alt', route: '/setup/maintenance' }
      ]
    },
    {
      label: 'Location',
      icon: 'fas fa-map-marker-alt',
      route: '/setup/location'
    },
    {
      label: 'Certificate',
      icon: 'fas fa-certificate',
      route: '/setup/certificate'
    },
    {
      label: 'Audit',
      icon: 'fas fa-clipboard-check',
      route: '/setup/audit'
    }
  ];

  constructor(
    private router: Router,
    private titleService: Title,
    sidebarService: SidebarService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.sidebarService = sidebarService;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.getCurrentRoute();
      const pageTitle = route?.snapshot?.data?.['title'] || '';
      const fullTitle = pageTitle ? `ERP - ${pageTitle}` : 'ERP - My Applications';
      this.titleService.setTitle(fullTitle);
    });

    // Subscribe to user data changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Trigger change detection when user data changes
      this.cdr.detectChanges();
    });

    // Force refresh user profile to ensure correct username is displayed
    // Delay the refresh to allow initial setup
    setTimeout(() => {
      this.authService.refreshUserProfile();
    }, 100);

    // Sidebar state changes
    this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      // Update layout classes based on sidebar state
      setTimeout(() => {
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
          // Check if we're in the correct media query
          const isLargeScreen = window.innerWidth >= 1025;
          const shouldBeVisible = window.innerWidth >= 1366;
          
          // Apply appropriate classes based on screen size and state
          if (isLargeScreen && shouldBeVisible) {
            sidebarNav.classList.remove('mobile-open');
          }
        }
      }, 100);
    });
  }

  ngAfterViewInit() {
    // Subscribe to sidebar state changes to update layout classes
    this.sidebarSubscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      const layoutContainer = document.querySelector('.layout-container') as HTMLElement;
      if (layoutContainer) {
        if (isCollapsed) {
          layoutContainer.classList.remove('sidebar-expanded');
        } else {
          layoutContainer.classList.add('sidebar-expanded');
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  private getCurrentRoute() {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  showSidebar(): boolean {
    const currentRoute = this.getCurrentRoute();
    const routePath = currentRoute?.routeConfig?.path || '';

    // Show sidebar only on setup pages
    return routePath.startsWith('setup');
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleSubmenu(item: any): void {
    item.isExpanded = !item.isExpanded;
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
    // Handle both property naming conventions and ensure it's a string
    let firstName = this.currentUser.firstName || 
                   this.currentUser.FirstName || 
                   this.currentUser.username || 
                   this.currentUser.UserName || '';
    
    // Ensure firstName is a string and not an object
    if (firstName && typeof firstName === 'string') {
      return firstName.charAt(0).toUpperCase();
    }
    return 'U'; // Default initial if no name available
  }

  getDisplayName(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.firstName || this.currentUser.FirstName || '';
    const lastName = this.currentUser.lastName || this.currentUser.LastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    return 'User';
  }

  formatRole(role: string): string {
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
