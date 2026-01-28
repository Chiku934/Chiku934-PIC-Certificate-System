import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(this.getDefaultState());
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  constructor() {
    // Listen for window resize to adjust sidebar state on screen size changes
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        // Only auto-adjust on larger screens, not mobile
        if (window.innerWidth >= 1025) {
          this.isCollapsedSubject.next(this.getDefaultState());
        }
      });
    }
  }

  private getDefaultState(): boolean {
    // On larger screens (laptop and desktop), start with sidebar expanded (collapsed = false)
    // On mobile, start with sidebar collapsed (collapsed = true)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1025;
    }
    return true; // Default to collapsed for SSR
  }

  toggle() {
    const current = this.isCollapsedSubject.value;
    this.isCollapsedSubject.next(!current);
    this.updateBodyClass(!current);
  }

  collapse() {
    this.isCollapsedSubject.next(true);
    this.updateBodyClass(true);
  }

  expand() {
    this.isCollapsedSubject.next(false);
    this.updateBodyClass(false);
  }

  private updateBodyClass(isCollapsed: boolean) {
    const body = document.body;
    if (isCollapsed) {
      body.classList.add('sidebar-collapsed');
    } else {
      body.classList.remove('sidebar-collapsed');
    }
  }
}