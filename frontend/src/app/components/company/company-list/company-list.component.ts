import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CompanyService, CompanyDetails } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';

// AG Grid imports
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';


// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

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
    rowSelection: {
      mode: 'multiRow',
      enableClickSelection: false
    },
    domLayout: 'normal',
    autoSizeStrategy: {
      type: 'fitGridWidth'
    }
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
        headerName: 'Company Name',
        field: 'CompanyName',
        flex: 2.5,
        minWidth: 200,
        cellRenderer: this.companyNameCellRenderer,
        resizable: true
      },
      {
        headerName: 'Date of Incorporation',
        field: 'DateOfIncorporation',
        flex: 1.5,
        minWidth: 150,
        cellRenderer: this.dateCellRenderer,
        resizable: true
      },
      {
        headerName: 'City',
        field: 'City',
        flex: 1.2,
        minWidth: 100,
        resizable: true
      },
      {
        headerName: 'State',
        field: 'State',
        flex: 1.2,
        minWidth: 100,
        resizable: true
      },
      {
        headerName: 'Country',
        field: 'Country',
        flex: 1.2,
        minWidth: 100,
        resizable: true
      },
      {
        headerName: 'Postal Code',
        field: 'PostalCode',
        flex: 1,
        minWidth: 100,
        resizable: true
      },
      {
        headerName: 'Email',
        field: 'EmailAddress',
        flex: 2,
        minWidth: 200,
        cellRenderer: this.emailCellRenderer,
        resizable: true
      },
      {
        headerName: 'Phone',
        field: 'PhoneNumber',
        flex: 1.2,
        minWidth: 120,
        resizable: true
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 220,
        minWidth: 200,
        maxWidth: 250,
        sortable: false,
        filter: false,
        cellRenderer: this.actionCellRenderer,
        cellClass: 'action-buttons',
        resizable: true
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

  private dateCellRenderer(params: any): string {
    const date = params.value;
    if (!date) return '';

    // Handle different date formats
    let formattedDate = '';
    
    try {
      // Try to parse the date value
      if (typeof date === 'string') {
        // Handle ISO date strings
        formattedDate = this.formatDate(new Date(date));
      } else if (date instanceof Date) {
        // Handle Date objects
        formattedDate = this.formatDate(date);
      } else if (typeof date === 'number') {
        // Handle timestamp
        formattedDate = this.formatDate(new Date(date));
      } else {
        // Fallback to string representation
        formattedDate = date.toString();
      }
    } catch (error) {
      // If parsing fails, show the raw value
      formattedDate = date.toString();
    }

    return `
      <div class="date-cell">
        <i class="fas fa-calendar me-2"></i>
        <span>${formattedDate}</span>
      </div>
    `;
  }

  private statusCellRenderer(params: any): string {
    const isActive = params.value;
    const statusText = isActive ? 'Active' : 'Inactive';
    const statusClass = isActive ? 'badge bg-success' : 'badge bg-danger';
    
    return `
      <div class="status-cell">
        <span class="badge ${statusClass}">
          <i class="fas fa-circle me-1 ${isActive ? 'text-success' : 'text-danger'}"></i>
          ${statusText}
        </span>
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
    
    // Auto-size columns to fit content
    setTimeout(() => {
      this.gridApi.autoSizeAllColumns(false);
    }, 100);
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const sub = this.companyService.getCompanies().subscribe({
      next: (companies: CompanyDetails[]) => {
        console.log('Loaded companies:', companies);
        this.companies = companies || [];
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
    // Check if company already exists
    if (this.companies && this.companies.length > 0) {
      // Show attractive error message
      this.showCompanyLimitError();
      return;
    }
    
    this.router.navigate(['/setup/company/new']);
  }

  private showCompanyLimitError(): void {
    // Create a custom modal-like error message
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '50%';
    errorContainer.style.left = '50%';
    errorContainer.style.transform = 'translate(-50%, -50%)';
    errorContainer.style.backgroundColor = 'white';
    errorContainer.style.padding = '2rem';
    errorContainer.style.borderRadius = '1rem';
    errorContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    errorContainer.style.zIndex = '9999';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.maxWidth = '400px';
    errorContainer.style.width = '90%';
    
    errorContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <i class="fas fa-exclamation-triangle" style="color: white; font-size: 24px;"></i>
        </div>
        <h3 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.25rem;">Company Limit Reached</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.9375rem; line-height: 1.5;">
          You can only have one company in the system. A company already exists in your account.
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <button id="closeErrorBtn" style="padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; background: #ef4444; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s;">
          Close
        </button>
        <button id="viewCompanyBtn" style="padding: 0.75rem 1.5rem; border: 1px solid #ef4444; border-radius: 0.5rem; background: white; color: #ef4444; font-weight: 600; cursor: pointer; transition: all 0.2s;">
          View Company
        </button>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
    
    // Add event listeners
    const closeBtn = errorContainer.querySelector('#closeErrorBtn');
    const viewBtn = errorContainer.querySelector('#viewCompanyBtn');
    
    const closeModal = () => {
      document.body.removeChild(errorContainer);
    };
    
    const viewCompany = () => {
      if (this.companies && this.companies.length > 0) {
        this.router.navigate(['/setup/company', this.companies[0].Id, 'view']);
      }
      closeModal();
    };
    
    closeBtn?.addEventListener('click', closeModal);
    viewBtn?.addEventListener('click', viewCompany);
    
    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close when clicking outside
    errorContainer.addEventListener('click', (e) => {
      if (e.target === errorContainer) {
        closeModal();
      }
    });
  }

  viewCompany(id: number): void {
    this.router.navigate(['/setup/company', id, 'view']);
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

  // Search functionality
  onSearch(searchTerm: string): void {
    if (this.gridApi) {
      // Apply quick filter to all columns
      this.gridApi.setGridOption('quickFilterText', searchTerm);
    }
  }

  // Export functionality
  exportToCSV(): void {
    if (this.gridApi) {
      const params = {
        columnKeys: ['CompanyName', 'DateOfIncorporation', 'City', 'State', 'Country', 'PostalCode', 'EmailAddress', 'PhoneNumber'],
        fileName: `companies_${new Date().toISOString().slice(0, 10)}.csv`,
        skipHeader: false,
        skipFooters: false,
        skipGroups: false,
        allColumns: false,
        onlySelected: false,
        suppressQuotes: false,
        processCellCallback: (params: any) => {
          // Format date cells
          if (params.column.getColId() === 'DateOfIncorporation') {
            return this.formatDate(params.value);
          }
          return params.value;
        }
      };
      
      this.gridApi.exportDataAsCsv(params);
    }
  }

  exportToExcel(): void {
    if (this.gridApi) {
      const params = {
        fileName: `companies_${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: 'Companies',
        columnKeys: ['CompanyName', 'DateOfIncorporation', 'City', 'State', 'Country', 'PostalCode', 'EmailAddress', 'PhoneNumber'],
        processCellCallback: (params: any) => {
          // Format date cells
          if (params.column.getColId() === 'DateOfIncorporation') {
            return this.formatDate(params.value);
          }
          return params.value;
        }
      };
      
      this.gridApi.exportDataAsExcel(params);
    }
  }

  exportToPDF(): void {
    // For PDF export, we'll create a simple PDF using the data
    const element = document.createElement('div');
    element.innerHTML = `
      <h2>Company List</h2>
      <p>Exported on: ${new Date().toLocaleDateString()}</p>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Date of Incorporation</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Postal Code</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${this.companies.map(company => `
            <tr>
              <td>${company.CompanyName || ''}</td>
            <td>${this.formatDate(company.DateOfIncorporation || null)}</td>
              <td>${company.City || ''}</td>
              <td>${company.State || ''}</td>
              <td>${company.Country || ''}</td>
              <td>${company.PostalCode || ''}</td>
              <td>${company.EmailAddress || ''}</td>
              <td>${company.PhoneNumber || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Create a simple PDF using html2canvas and jsPDF
    // Note: This requires installing html2canvas and jspdf packages
    this.createPDF(element.innerHTML, `companies_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  private createPDF(htmlContent: string, filename: string): void {
    // Create a temporary iframe to render the content
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      doc.close();

      // Print the iframe content
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch (error) {
          console.error('PDF export failed:', error);
          alert('PDF export failed. Please try again.');
        } finally {
          document.body.removeChild(iframe);
        }
      }, 500);
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