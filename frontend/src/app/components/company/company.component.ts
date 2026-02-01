import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CompanyService, CompanyDetails } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';

interface FileUpload {
  file: File | null;
  preview: string;
  name: string;
}

type CompanyMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {
  companyForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  currentCompany: CompanyDetails | null = null;
  mode: CompanyMode = 'create';
  companyId: number | null = null;
  
  fileUpload: FileUpload = {
    file: null,
    preview: '',
    name: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.companyForm = this.fb.group({
      CompanyName: ['', [Validators.required, Validators.maxLength(255)]],
      ABBR: ['', [Validators.required, Validators.maxLength(50)]],
      CompanyLogo: [''],
      TaxId: ['', [Validators.maxLength(50)]],
      Domain: ['', [Validators.maxLength(255)]],
      DateOfEstablishment: [''],
      DateOfIncorporation: [''],
      AddressLine1: ['', [Validators.maxLength(255)]],
      AddressLine2: ['', [Validators.maxLength(255)]],
      City: ['', [Validators.maxLength(100)]],
      State: ['', [Validators.maxLength(100)]],
      Country: ['', [Validators.maxLength(100)]],
      PostalCode: ['', [Validators.maxLength(20)]],
      EmailAddress: ['', [Validators.email, Validators.maxLength(255)]],
      PhoneNumber: ['', [Validators.maxLength(20)]],
      Fax: ['', [Validators.maxLength(20)]],
      Website: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const url = this.router.url;
      
      if (id === 'new') {
        this.mode = 'create';
        this.companyId = null;
        this.setupFormForCreateMode();
      } else if (id) {
        // Check if the URL contains '/view' to determine view mode
        if (url.includes('/view')) {
          this.mode = 'view';
        } else {
          this.mode = 'edit';
        }
        this.companyId = +id;
        this.loadCompanyData();
      } else {
        // Default to current company if no ID provided
        this.mode = 'edit';
        this.loadCompanyData();
      }
      
      // Set up form based on mode
      this.setupFormForMode();
      
      // Force refresh to ensure data is loaded for view/edit modes
      if (this.mode !== 'create') {
        this.companyService.refreshNow();
      }
    });
  }

  private setupFormForCreateMode(): void {
    // Clear form for create mode
    this.companyForm.reset();
    this.currentCompany = null;
    this.fileUpload = {
      file: null,
      preview: '',
      name: ''
    };
  }

  private setupFormForViewMode(): void {
    // Disable form for view mode
    this.companyForm.disable();
  }

  private setupFormForEditMode(): void {
    // Enable form for edit mode
    this.companyForm.enable();
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

  loadCompanyData(retryCount = 0): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    let sub: Subscription;

    if (this.mode === 'create') {
      // For create mode, we don't need to load existing data
      this.isLoading = false;
      return;
    } else if (this.companyId) {
      // Load specific company by ID
      sub = this.companyService.getCompanyById(this.companyId).subscribe({
        next: (company) => {
          console.log('Loaded company by ID:', company);
          this.currentCompany = company || null;
          if (company) {
            this.patchFormWithCompanyData(company);
            if (company.CompanyLogo) {
              this.fileUpload.preview = company.CompanyLogo;
            }
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading company by ID:', error);
          this.handleLoadError(error, retryCount);
        }
      });
    } else {
      // Load current company (default behavior) from cache-backed observable
      sub = this.companyService.getCurrentCompanyObservable().subscribe({
        next: (company) => {
          console.log('Loaded current company (observable):', company);
          this.currentCompany = company || null;
          // Only auto-patch the form when not editing to avoid overwriting user changes
          const isEditing = this.mode === 'edit' && this.companyForm && this.companyForm.dirty;
          if (!isEditing && company) {
            this.patchFormWithCompanyData(company);
            if (company.CompanyLogo) {
              this.fileUpload.preview = company.CompanyLogo;
            }
          } else if (isEditing) {
            console.log('Skipping auto-patch because form is dirty (user editing)');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading current company (observable):', error);
          this.handleLoadError(error, retryCount);
        }
      });
    }

    this.subscriptions.push(sub);
  }

  private handleLoadError(error: any, retryCount: number): void {
    console.error('Error loading company data:', error);
    
    // Check if this is a temporary network error or server not ready
    const isTemporaryError = this.isTemporaryError(error);
    
    if (isTemporaryError && retryCount < 3) {
      // For temporary errors, retry immediately once, then with short delay
      const delay = retryCount === 0 ? 0 : 1000; // Immediate retry first, then 1 second delay
      console.log(`Retrying company data load in ${delay}ms (attempt ${retryCount + 1}/3)`);
      
      setTimeout(() => {
        this.loadCompanyData(retryCount + 1);
      }, delay);
    } else {
      // For permanent errors or max retries reached, show error but keep loading state for manual retry
      this.errorMessage = this.getErrorMessage(error, retryCount);
      this.isLoading = false;
    }
  }

  private isTemporaryError(error: any): boolean {
    // Check for network errors, timeout, or server not ready
    if (!error) return false;
    
    // Check status codes that indicate temporary issues
    const status = error.status;
    if (status === 0 || status === 502 || status === 503 || status === 504) {
      return true;
    }
    
    // Check for timeout errors
    if (error.message && error.message.includes('timeout')) {
      return true;
    }
    
    // Check for network errors
    if (error.message && (error.message.includes('Network') || error.message.includes('fetch'))) {
      return true;
    }
    
    return false;
  }

  private getErrorMessage(error: any, retryCount: number): string {
    if (retryCount >= 3) {
      return 'Unable to load company data after multiple attempts. Please check your internet connection and try again.';
    }
    
    if (error.status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to access company data.';
    }
    
    if (error.status === 404) {
      return 'Company data not found. Please contact your administrator.';
    }
    
    return 'Failed to load company data. Please try again or contact support.';
  }

  // Manual refresh method for user-initiated retry
  refreshCompanyData(): void {
    this.errorMessage = '';
    this.loadCompanyData(0);
  }

  patchFormWithCompanyData(company: CompanyDetails): void {
    this.companyForm.patchValue({
      CompanyName: company.CompanyName,
      ABBR: company.ABBR,
      CompanyLogo: company.CompanyLogo,
      TaxId: company.TaxId,
      Domain: company.Domain,
      DateOfEstablishment: company.DateOfEstablishment ? this.formatDate(company.DateOfEstablishment) : '',
      DateOfIncorporation: company.DateOfIncorporation ? this.formatDate(company.DateOfIncorporation) : '',
      AddressLine1: company.AddressLine1,
      AddressLine2: company.AddressLine2,
      City: company.City,
      State: company.State,
      Country: company.Country,
      PostalCode: company.PostalCode,
      EmailAddress: company.EmailAddress,
      PhoneNumber: company.PhoneNumber,
      Fax: company.Fax,
      Website: company.Website
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Only JPEG, PNG, and GIF files are allowed';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errorMessage = 'File size too large. Maximum size is 5MB';
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

  removeFile(): void {
    this.fileUpload.file = null;
    this.fileUpload.preview = '';
    this.fileUpload.name = '';
    
    // Clear the file input safely
    try {
      const fileInput = document.getElementById('companyLogo') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.warn('Could not clear file input:', error);
    }
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.companyForm.value;
    
    // Convert date strings to Date objects
    if (formData.DateOfEstablishment) {
      formData.DateOfEstablishment = new Date(formData.DateOfEstablishment);
    }
    if (formData.DateOfIncorporation) {
      formData.DateOfIncorporation = new Date(formData.DateOfIncorporation);
    }

    const sub = this.companyService.createOrUpdateCompany(formData, this.fileUpload.file || undefined).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = this.currentCompany 
          ? 'Company updated successfully' 
          : 'Company created successfully';
        
        // Refresh the company data
        this.currentCompany = response;
        this.patchFormWithCompanyData(response);
        
        // Clear file upload after successful save
        this.removeFile();
        
        // Redirect to company list page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/setup/company']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to save company details';
        console.error('Error saving company:', error);
      }
    });

    this.subscriptions.push(sub);
  }

  onCancel(): void {
    this.router.navigate(['/setup/company']);
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get f() {
    return this.companyForm.controls;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.companyForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }
}