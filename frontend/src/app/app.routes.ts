import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'setup',
    loadComponent: () => import('./components/setup/setup.component').then(m => m.SetupComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'certification',
    loadComponent: () => import('./components/certification/certification.component').then(m => m.CertificationComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'audit',
    loadComponent: () => import('./components/audit/audit.component').then(m => m.AuditComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
