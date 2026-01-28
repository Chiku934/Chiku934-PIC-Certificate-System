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
          const newState = this.getDefaultState();
          console.log(`Window resized to ${window.innerWidth}px, setting sidebar state to: ${newState ? 'collapsed' : 'expanded'}`);
          this.isCollapsedSubject.next(newState);
        }
      });
    }
    
    // Log initial state
    const initialState = this.getDefaultState();
    console.log(`Initial sidebar state: ${initialState ? 'collapsed' : 'expanded'} (screen width: ${typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px)`);
  }

  private getDefaultState(): boolean {
    // On larger screens (1200px and above), start with sidebar expanded (collapsed = false)
    // On smaller screens, start with sidebar collapsed (collapsed = true)
    if (typeof window !== 'undefined') {
      const isSmallScreen = window.innerWidth < 1200;
      console.log(`Screen width: ${window.innerWidth}px, isSmallScreen: ${isSmallScreen}, returning: ${isSmallScreen}`);
      return isSmallScreen;
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