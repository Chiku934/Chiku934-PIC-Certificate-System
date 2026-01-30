import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CompanyService, CompanyDetails } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';

// AG Grid imports
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private subscriptions: Subscription[] = [];
  companies: CompanyDetails[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // AG Grid configuration
  gridApi!: GridApi;
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100
  };

  // AG Grid options
  gridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    domLayout: 'autoHeight'
  };

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private authService: AuthService
  ) {
    this.setupColumnDefs();
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'Company Logo',
        field: 'CompanyLogo',
        width: 100,
        cellRenderer: this.logoCellRenderer,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Company Name',
        field: 'CompanyName',
        flex: 2,
        cellRenderer: this.companyNameCellRenderer
      },
      {
        headerName: 'ABBR',
        field: 'ABBR',
        flex: 1,
        cellClass: 'text-uppercase'
      },
      {
        headerName: 'City',
        field: 'City',
        flex: 1
      },
      {
        headerName: 'State',
        field: 'State',
        flex: 1
      },
      {
        headerName: 'Country',
        field: 'Country',
        flex: 1
      },
      {
        headerName: 'Email',
        field: 'EmailAddress',
        flex: 1.5,
        cellRenderer: this.emailCellRenderer
      },
      {
        headerName: 'Phone',
        field: 'PhoneNumber',
        flex: 1
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 200,
        sortable: false,
        filter: false,
        cellRenderer: this.actionCellRenderer,
        cellClass: 'action-buttons'
      }
    ];
  }

  private logoCellRenderer(params: any): string {
    const logoUrl = params.value;
    if (!logoUrl) {
      return `
        <div class="logo-placeholder">
          <i class="fas fa-building"></i>
        </div>
      `;
    }

    return `
      <div class="logo-cell">
        <img src="${logoUrl}" alt="Company Logo" onerror="this.src='/assets/images/default-app-icon.png'" />
      </div>
    `;
  }

  private companyNameCellRenderer(params: any): string {
    const company = params.data as CompanyDetails;
    if (!company) return params.value || '';

    return `
      <div class="company-info">
        <div class="company-name">${company.CompanyName || params.value || ''}</div>
        <div class="company-domain text-muted">${company.Domain ? '@' + company.Domain : ''}</div>
      </div>
    `;
  }

  private emailCellRenderer(params: any): string {
    const email = params.value;
    if (!email) return '';

    return `
      <div class="email-cell">
        <i class="fas fa-envelope me-2"></i>
        <a href="mailto:${email}" class="text-decoration-none">${email}</a>
      </div>
    `;
  }

  private actionCellRenderer(params: any): string {
    const company = params.data as CompanyDetails;
    if (!company) return '';

    return `
      <div class="action-buttons">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.viewCompany(${company.Id})" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="window.editCompany(${company.Id})" title="Edit Company">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteCompany(${company.Id})" title="Delete Company">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    
    // Set up global event handlers for action buttons
    (window as any).viewCompany = (id: number) => this.viewCompany(id);
    (window as any).editCompany = (id: number) => this.editCompany(id);
    (window as any).deleteCompany = (id: number) => this.deleteCompany(id);
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.companyService.getCompanies().subscribe({
      next: (companies: CompanyDetails[]) => {
        this.companies = companies;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading companies:', error);
        this.errorMessage = 'Failed to load companies. Please try again.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  addCompany(): void {
    this.router.navigate(['/setup/company']);
  }

  viewCompany(id: number): void {
    this.router.navigate(['/setup/company', id]);
  }

  editCompany(id: number): void {
    this.router.navigate(['/setup/company', id]);
  }

  deleteCompany(id: number): void {
    if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      this.isLoading = true;
      
      const sub = this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.successMessage = 'Company deleted successfully';
          this.loadCompanies(); // Refresh the list
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error deleting company:', error);
          this.errorMessage = error.message || 'Failed to delete company';
          this.isLoading = false;
        }
      });

      this.subscriptions.push(sub);
    }
  }

  // Utility methods
  formatDate(date: Date | string | null): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getCompanyStatus(company: CompanyDetails): string {
    // You can add logic here to determine company status
    // For now, we'll just return a default status
    return 'Active';
  }

  getCompanyStatusClass(company: CompanyDetails): string {
    // You can add logic here to determine status color classes
    return 'badge bg-success';
  }
}