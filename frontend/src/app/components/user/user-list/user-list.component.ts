import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.filter(u => !u.IsDeleted);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  onCreateUser(): void {
    this.router.navigate(['/setup/users/new']);
  }

  onEditUser(userId: number): void {
    this.router.navigate(['/setup/users', userId, 'edit']);
  }

  onViewUser(userId: number): void {
    this.router.navigate(['/setup/users', userId, 'view']);
  }

  onDeleteUser(userId: number, userName: string): void {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      const sub = this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user. Please try again.';
        }
      });
      this.subscriptions.push(sub);
    }
  }

  onCancel(): void {
    this.router.navigate(['/setup']);
  }

  getFullName(user: User): string {
    const parts = [user.FirstName, user.MiddleName, user.LastName].filter(p => p);
    return parts.length ? parts.join(' ') : 'N/A';
  }
}
