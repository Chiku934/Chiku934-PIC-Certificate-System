import { Component, signal, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService } from './services/sidebar.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('frontend');
  private sidebarSubscription!: Subscription;

  constructor(
    private router: Router, 
    private titleService: Title,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.getCurrentRoute();
      const pageTitle = route?.snapshot?.data?.['title'] || '';
      const fullTitle = pageTitle ? `ERP - ${pageTitle}` : 'ERP - My Applications';
      this.titleService.setTitle(fullTitle);
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
}
