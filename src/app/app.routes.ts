import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'name/:slug',
    loadComponent: () => import('./pages/name-detail/name-detail').then((m) => m.NameDetail),
  },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: '**', redirectTo: '' },
];
