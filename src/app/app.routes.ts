import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'read/:chapter', loadComponent: () => import('./pages/reader/reader').then((m) => m.Reader) },
  { path: 'name/:name', loadComponent: () => import('./pages/reader/reader').then((m) => m.Reader) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin) },
  { path: '**', redirectTo: '' },
];
