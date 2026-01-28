import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.isCollapsedSubject.asObservable();

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