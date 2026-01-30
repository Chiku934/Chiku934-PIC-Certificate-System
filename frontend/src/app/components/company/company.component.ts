import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CompanyService, CompanyDetails } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';

interface FileUpload {
  file: File | null;
  preview: string;
  name: string;
}

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
    this.loadCompanyData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCompanyData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.companyService.getCompany().subscribe({
      next: (company) => {
        this.currentCompany = company;
        if (company) {
          this.patchFormWithCompanyData(company);
          if (company.CompanyLogo) {
            this.fileUpload.preview = company.CompanyLogo;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load company data';
        this.isLoading = false;
        console.error('Error loading company data:', error);
      }
    });

    this.subscriptions.push(sub);
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
    
    // Clear the file input
    const fileInput = document.getElementById('companyLogo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
        
        // Redirect to setup dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/setup']);
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
    this.router.navigate(['/setup']);
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