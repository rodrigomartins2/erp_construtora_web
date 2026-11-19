import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    { path: 'app', loadChildren: () => import('src/app/presentation/pages/pages.routes').then(m => m.PAGES_ROUTES)},
    { path: 'login', loadChildren: () => import('src/app/presentation/pages/login-page/login.routes').then(m => m.AUTH_ROUTES) },
    { path: 'auth', loadChildren: () => import('src/app/presentation/pages/login-page/login.routes').then(m => m.AUTH_ROUTES) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
  ];