import { Component, signal, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { SidebarService } from './services/sidebar.service';
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
    sidebarService: SidebarService
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

    // Debug sidebar state changes
    this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      console.log('Sidebar state changed:', isCollapsed);
      
      // Debug CSS class application
      setTimeout(() => {
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
          console.log('Sidebar nav element found');
          console.log('Has mobile-open class:', sidebarNav.classList.contains('mobile-open'));
          console.log('All classes:', sidebarNav.classList);
          
          // Debug computed styles
          const styles = window.getComputedStyle(sidebarNav);
          console.log('Computed transform:', styles.transform);
          console.log('Computed position:', styles.position);
          console.log('Computed left:', styles.left);
          console.log('Computed top:', styles.top);
          console.log('Computed z-index:', styles.zIndex);
          
          // Check screen size
          const isMobile = window.innerWidth <= 1024;
          console.log('Is mobile viewport (<=1024px):', isMobile);
          console.log('Current window width:', window.innerWidth);
        } else {
          console.log('Sidebar nav element NOT found');
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
}
