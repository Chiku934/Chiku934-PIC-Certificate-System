import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

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
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  currentUser: any = null;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard'
    },
    {
      label: 'Setup',
      icon: 'fas fa-cogs',
      children: [
        {
          label: 'Company Details',
          icon: 'fas fa-building',
          route: '/setup/company'
        },
        {
          label: 'Letter Head',
          icon: 'fas fa-file-alt',
          route: '/setup/letterhead'
        },
        {
          label: 'Email Domain',
          icon: 'fas fa-globe',
          route: '/setup/emaildomain'
        },
        {
          label: 'Email Account',
          icon: 'fas fa-envelope',
          route: '/setup/emailaccount'
        },
        {
          label: 'Users',
          icon: 'fas fa-users',
          route: '/setup/users'
        }
      ],
      isExpanded: false
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
    public sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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
}
