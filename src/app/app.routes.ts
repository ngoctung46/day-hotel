import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'customer/room/:roomId',
    loadComponent: () =>
      import('./customer/customer.component').then((m) => m.CustomerComponent),
  },
  {
    path: 'customer/:id',
    loadComponent: () =>
      import('./customer/customer.component').then((m) => m.CustomerComponent),
  },
];
