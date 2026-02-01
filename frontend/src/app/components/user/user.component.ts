import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

interface FileUpload {
  file: File | null;
  preview: string;
  name: string;
}

type UserMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  currentUser: User | null = null;
  mode: UserMode = 'create';
  userId: number | null = null;
  
  fileUpload: FileUpload = {
    file: null,
    preview: '',
    name: ''
  };

  roles = ['Admin', 'User', 'Manager', 'Operator'];
  selectedRoles: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      FirstName: ['', [Validators.maxLength(100)]],
      MiddleName: ['', [Validators.maxLength(100)]],
      LastName: ['', [Validators.maxLength(100)]],
      PhoneNumber: ['', [Validators.maxLength(20)]],
      Address: ['', [Validators.maxLength(255)]],
      UserImage: [''],
      Password: [''],
      ConfirmPassword: [''],
      IsActive: [true]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const url = this.router.url;
      
      if (id === 'new') {
        this.mode = 'create';
        this.userId = null;
        this.setupFormForCreateMode();
      } else if (id) {
        // Check if the URL contains '/view' to determine view mode
        if (url.includes('/view')) {
          this.mode = 'view';
        } else if (url.includes('/edit')) {
          this.mode = 'edit';
        }
        this.userId = +id;
        this.loadUserData();
      }
      
      // Set up form based on mode
      this.setupFormForMode();
    });
  }

  private setupFormForCreateMode(): void {
    // Clear form for create mode
    this.userForm.reset({ IsActive: true });
    this.currentUser = null;
    this.fileUpload = {
      file: null,
      preview: '',
      name: ''
    };
    this.selectedRoles = [];
    // Password is required in create mode
    this.userForm.get('Password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('Email')?.setValidators([Validators.required, Validators.email]);
  }

  private setupFormForViewMode(): void {
    // Disable form for view mode
    this.userForm.disable();
  }

  private setupFormForEditMode(): void {
    // Enable form for edit mode
    this.userForm.enable();
    // Password is optional in edit mode
    this.userForm.get('Password')?.setValidators([Validators.minLength(6)]);
  }

  private setupFormForMode(): void {
    switch (this.mode) {
      case 'create':
        this.setupFormForCreateMode();
        break;
      case 'view':
        this.setupFormForViewMode();
        break;
      case 'edit':
        this.setupFormForEditMode();
        break;
    }
    this.userForm.updateValueAndValidity();
  }

  // Mode change handlers
  onViewMode(): void {
    this.mode = 'view';
    this.setupFormForViewMode();
  }

  onEditMode(): void {
    this.mode = 'edit';
    this.setupFormForEditMode();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserData(retryCount = 0): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.userId) {
      this.isLoading = false;
      return;
    }

    const sub = this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Loaded user:', user);
        this.currentUser = user;
        this.patchFormWithUserData(user);
        if (user.UserImage) {
          this.fileUpload.preview = user.UserImage;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        this.handleLoadError(error, retryCount);
      }
    });

    this.subscriptions.push(sub);
  }

  private patchFormWithUserData(user: User): void {
    this.userForm.patchValue({
      Email: user.Email,
      FirstName: user.FirstName,
      MiddleName: user.MiddleName,
      LastName: user.LastName,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
      UserImage: user.UserImage,
      IsActive: user.IsActive
    });
  }

  private handleLoadError(error: any, retryCount: number): void {
    const maxRetries = 3;
    if (retryCount < maxRetries) {
      this.errorMessage = `Loading failed. Retrying... (${retryCount + 1}/${maxRetries})`;
      setTimeout(() => this.loadUserData(retryCount + 1), 2000);
    } else {
      this.errorMessage = 'Failed to load user data. Please try again later.';
      this.isLoading = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid image file (JPEG, PNG, or GIF)';
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      this.fileUpload.file = file;
      this.fileUpload.name = file.name;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileUpload.preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      this.errorMessage = '';
    }
  }

  onRemoveImage(): void {
    this.fileUpload = {
      file: null,
      preview: '',
      name: ''
    };
    this.userForm.patchValue({ UserImage: '' });
  }

  onRoleChange(role: string): void {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  onSubmit(): void {
    if (!this.userForm.valid || (this.mode === 'create' && this.selectedRoles.length === 0)) {
      this.errorMessage = 'Please fill all required fields and select at least one role';
      return;
    }

    // Check password confirmation if password is being set
    const password = this.userForm.get('Password')?.value;
    const confirmPassword = this.userForm.get('ConfirmPassword')?.value;
    if (password && password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // Add form fields
    formData.append('Email', this.userForm.get('Email')?.value);
    formData.append('FirstName', this.userForm.get('FirstName')?.value || '');
    formData.append('MiddleName', this.userForm.get('MiddleName')?.value || '');
    formData.append('LastName', this.userForm.get('LastName')?.value || '');
    formData.append('PhoneNumber', this.userForm.get('PhoneNumber')?.value || '');
    formData.append('Address', this.userForm.get('Address')?.value || '');
    formData.append('IsActive', this.userForm.get('IsActive')?.value);

    // Add roles
    this.selectedRoles.forEach(role => {
      formData.append('Roles', role);
    });

    // Add file if exists
    if (this.fileUpload.file) {
      formData.append('UserImage', this.fileUpload.file);
    }

    // Add password if in create mode or if changed in edit mode
    if (this.mode === 'create') {
      formData.append('Password', this.userForm.get('Password')?.value);
    } else if (password) {
      formData.append('Password', password);
    }

    const sub = (this.mode === 'create' 
      ? this.userService.createUser(this.userForm.value, this.fileUpload.file, this.selectedRoles)
      : this.userService.updateUser(this.userId!, this.userForm.value, this.fileUpload.file, this.selectedRoles)
    ).subscribe({
      next: (response: any) => {
        this.successMessage = `User ${this.mode === 'create' ? 'created' : 'updated'} successfully`;
        this.isSubmitting = false;
        
        setTimeout(() => {
          this.router.navigate(['/setup/users']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error submitting user form:', error);
        this.errorMessage = error.error?.message || `Failed to ${this.mode === 'create' ? 'create' : 'update'} user. Please try again.`;
        this.isSubmitting = false;
      }
    });

    this.subscriptions.push(sub);
  }

  onCancel(): void {
    this.router.navigate(['/setup/users']);
  }

  refreshUserData(): void {
    if (this.userId) {
      this.loadUserData();
    }
  }

  getFullName(user: User | null): string {
    if (!user) return 'New User';
    const parts = [user.FirstName, user.MiddleName, user.LastName].filter(p => p);
    return parts.length ? parts.join(' ') : user.Email;
  }

  getRoleIcon(role: string): string {
    const iconMap: { [key: string]: string } = {
      'Admin': 'fas fa-crown',
      'Manager': 'fas fa-user-tie',
      'User': 'fas fa-user',
      'Operator': 'fas fa-cogs'
    };
    return iconMap[role] || 'fas fa-user';
  }

  isViewMode(): boolean {
    return this.mode === 'view';
  }
}
