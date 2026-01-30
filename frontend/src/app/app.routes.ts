import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), data: { title: 'Login' } },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), data: { title: 'Register' } },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' }
  },
  {
    path: 'setup',
    loadComponent: () => import('./components/setup/setup.component').then(m => m.SetupComponent),
    canActivate: [AuthGuard],
    data: { title: 'Setup' }
  },
  {
    path: 'setup/company',
    loadComponent: () => import('./components/company/company-list/company-list.component').then(m => m.CompanyListComponent),
    canActivate: [AuthGuard],
    data: { title: 'Company Management' }
  },
  {
    path: 'setup/company/new',
    loadComponent: () => import('./components/company/company.component').then(m => m.CompanyComponent),
    canActivate: [AuthGuard],
    data: { title: 'Add Company' }
  },
  {
    path: 'setup/company/:id',
    loadComponent: () => import('./components/company/company.component').then(m => m.CompanyComponent),
    canActivate: [AuthGuard],
    data: { title: 'Company Details' }
  },
  {
    path: 'setup/company/:id/view',
    loadComponent: () => import('./components/company/company.component').then(m => m.CompanyComponent),
    canActivate: [AuthGuard],
    data: { title: 'View Company' }
  },
  {
    path: 'certification',
    loadComponent: () => import('./components/certification/certification.component').then(m => m.CertificationComponent),
    canActivate: [AuthGuard],
    data: { title: 'Certification' }
  },
  {
    path: 'audit',
    loadComponent: () => import('./components/audit/audit.component').then(m => m.AuditComponent),
    canActivate: [AuthGuard],
    data: { title: 'Audit' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { title: 'Profile' }
  },
  { path: '**', redirectTo: '/dashboard' }
];
