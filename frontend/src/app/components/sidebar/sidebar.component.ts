import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isCollapsed = false;
  isMobileOpen = false;
  private sidebarSubscription!: Subscription;
  private mobileSubscription!: Subscription;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard'
    },
    {
      label: 'Certification',
      icon: 'fas fa-certificate',
      route: '/certification'
    },
    {
      label: 'Audit',
      icon: 'fas fa-clipboard-check',
      route: '/audit'
    },
    {
      label: 'Profile',
      icon: 'fas fa-user',
      route: '/profile'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.detectChanges();
    });

    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  toggleSubmenu(item: MenuItem) {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
