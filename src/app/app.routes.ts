import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'read/:chapter', loadComponent: () => import('./pages/reader/reader').then((m) => m.Reader) },
  { path: 'name/:name', loadComponent: () => import('./pages/reader/reader').then((m) => m.Reader) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: '**', redirectTo: '' },
];
