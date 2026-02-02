import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly STORAGE_KEY = 'sidebarCollapsed';

  // Initialize with stored preference if available, otherwise use default
  private isCollapsedSubject = new BehaviorSubject<boolean>(this.getInitialState());
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  constructor() {
    // Listen for window resize to adjust sidebar state on screen size changes
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        // If user has a saved preference, do not override it on resize
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved !== null) return;

        // Use 1200px breakpoint for responsiveness when no user preference
        if (window.innerWidth > 1200) {
          // For screens more than 1200px, use default expanded state
          this.isCollapsedSubject.next(false);
        } else {
          // For screens 1200px and below, ensure collapsed state
          this.isCollapsedSubject.next(true);
        }
      });
    }
    
    // Log initial state
    // Make sure body class reflects the initial sidebar state
    this.updateBodyClass(this.isCollapsedSubject.value);
  }

  private getInitialState(): boolean {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      return this.getDefaultState();
    }
    return true;
  }

  private getDefaultState(): boolean {
    // On screens more than 1200px, start with sidebar expanded (collapsed = false)
    // On screens 1200px and below, start with sidebar collapsed (collapsed = true)
    if (typeof window !== 'undefined') {
      const isSmallScreen = window.innerWidth <= 1200;
      return isSmallScreen;
    }
    return true; // Default to collapsed for SSR
  }

  /**
   * Initialize responsive sidebar state based on screen size
   * This should be called when the app starts or when switching to setup pages
   */
  initializeResponsiveState() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === null) {
        // No user preference saved, use responsive defaults
        const defaultState = this.getDefaultState();
        this.isCollapsedSubject.next(defaultState);
        this.updateBodyClass(defaultState);
        console.log('SidebarService.initializeResponsiveState() -> set to', defaultState, 'based on screen size');
      }
    }
  }

  toggle() {
    const current = this.isCollapsedSubject.value;
    const next = !current;
    this.isCollapsedSubject.next(next);
    this.updateBodyClass(next);
    // Persist user preference
    try { localStorage.setItem(this.STORAGE_KEY, String(next)); } catch {}
    console.log(`SidebarService.toggle() -> next=${next}`);
  }

  collapse() {
    this.isCollapsedSubject.next(true);
    this.updateBodyClass(true);
    try { localStorage.setItem(this.STORAGE_KEY, 'true'); } catch {}
    console.log('SidebarService.collapse()');
  }

  expand() {
    this.isCollapsedSubject.next(false);
    this.updateBodyClass(false);
    try { localStorage.setItem(this.STORAGE_KEY, 'false'); } catch {}
    console.log('SidebarService.expand()');
  }

  /**
   * Clear any stored user preference and reset to default responsive state
   */
  clearPreference() {
    try { localStorage.removeItem(this.STORAGE_KEY); } catch {}
    const defaultState = this.getDefaultState();
    this.isCollapsedSubject.next(defaultState);
    this.updateBodyClass(defaultState);
    console.log('SidebarService.clearPreference() -> reset to', defaultState);
  }

  /**
   * Synchronously return current collapsed state
   */
  getState(): boolean {
    return this.isCollapsedSubject.value;
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