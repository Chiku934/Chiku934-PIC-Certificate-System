import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  isLoading = false;
  hasProfileImage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  getUserInitials(): string {
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    } else if (this.currentUser?.firstName) {
      return this.currentUser.firstName.charAt(0).toUpperCase();
    } else if (this.currentUser?.username) {
      return this.currentUser.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getProfileImageUrl(): string {
    // If user has a profile image, return it
    // For now, we'll use default icon
    return '/assets/images/default-profile-icon.png';
  }

  onImageError(event: any) {
    this.hasProfileImage = false;
    // Handle image load error
    console.log('Profile image failed to load');
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
