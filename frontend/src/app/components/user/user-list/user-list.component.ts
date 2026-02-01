import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { UserService, User } from '../../../services/user.service';

// AG Grid imports
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private subscriptions: Subscription[] = [];
  users: User[] = [];
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
    private userService: UserService,
    private router: Router
  ) {
    this.setupColumnDefs();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'Full Name',
        field: 'FullName',
        flex: 2.5,
        minWidth: 200,
        cellRenderer: this.fullNameCellRenderer,
        resizable: true
      },
      {
        headerName: 'Email',
        field: 'Email',
        flex: 2.5,
        minWidth: 250,
        cellRenderer: this.emailCellRenderer,
        resizable: true
      },
      {
        headerName: 'Status',
        field: 'IsActive',
        flex: 1,
        minWidth: 120,
        cellRenderer: this.statusCellRenderer,
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

  private fullNameCellRenderer(params: any): string {
    const user = params.data as User;
    if (!user) return params.value || '';

    // Inline the getFullName logic since 'this' is not available in cell renderer
    const parts = [user.FirstName, user.MiddleName, user.LastName].filter(p => p);
    const fullName = parts.length ? parts.join(' ') : 'N/A';
    
    return `
      <div class="user-info">
        <div class="user-name">${fullName}</div>
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

    let formattedDate = '';
    
    try {
      if (typeof date === 'string') {
        formattedDate = this.formatDate(new Date(date));
      } else if (date instanceof Date) {
        formattedDate = this.formatDate(date);
      } else if (typeof date === 'number') {
        formattedDate = this.formatDate(new Date(date));
      } else {
        formattedDate = date.toString();
      }
    } catch (error) {
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
    const user = params.data as User;
    if (!user) return '';

    return `
      <div class="action-buttons">
        <button class="btn btn-sm btn-outline-info me-1" onclick="window.viewUser(${user.Id})" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.editUser(${user.Id})" title="Edit User">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteUser(${user.Id})" title="Delete User">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    
    (window as any).viewUser = (id: number) => this.onViewUser(id);
    (window as any).editUser = (id: number) => this.onEditUser(id);
    (window as any).deleteUser = (id: number) => this.onDeleteUser(id);
    
    setTimeout(() => {
      this.gridApi.autoSizeAllColumns(false);
    }, 100);
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filter out deleted users
        const filteredUsers = users.filter(u => !u.IsDeleted);
        this.users = filteredUsers;
        this.isLoading = false;
        
        if (this.gridApi) {
          try {
            (this.gridApi as any).setRowData(this.users);
          } catch (e) {
            this.gridApi.setGridOption('rowData', this.users);
          }
        }
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

  onDeleteUser(userId: number): void {
    const user = this.users.find(u => u.Id === userId);
    const userName = user ? this.getFullName(user) : 'Unknown User';
    
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

  // Search functionality
  onSearch(searchTerm: string): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', searchTerm);
    }
  }

  // Export functionality
  exportToCSV(): void {
    if (this.gridApi) {
      const params = {
        columnKeys: ['FullName', 'Email', 'IsActive'],
        fileName: `users_${new Date().toISOString().slice(0, 10)}.csv`,
        skipHeader: false,
        skipFooters: false,
        skipGroups: false,
        allColumns: false,
        onlySelected: false,
        suppressQuotes: false,
        processCellCallback: (params: any) => {
          if (params.column.getColId() === 'IsActive') {
            return params.value ? 'Active' : 'Inactive';
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
        fileName: `users_${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: 'Users',
        columnKeys: ['FullName', 'Email', 'IsActive'],
        processCellCallback: (params: any) => {
          if (params.column.getColId() === 'IsActive') {
            return params.value ? 'Active' : 'Inactive';
          }
          return params.value;
        }
      };
      
      this.gridApi.exportDataAsExcel(params);
    }
  }

  exportToPDF(): void {
    const element = document.createElement('div');
    element.innerHTML = `
      <h2>User List</h2>
      <p>Exported on: ${new Date().toLocaleDateString()}</p>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${this.users.map(user => `
            <tr>
              <td>${this.getFullName(user)}</td>
              <td>${user.Email || ''}</td>
              <td>${user.IsActive ? 'Active' : 'Inactive'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    this.createPDF(element.innerHTML, `users_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  private createPDF(htmlContent: string, filename: string): void {
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

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}