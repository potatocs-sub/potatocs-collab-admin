import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'sign-in',
    canActivate: [isLoggedInGuard],
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/auth/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
  },
  {
    path: 'find-pw',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import(`./pages/auth/find-pw/find-pw.component`).then(
        (m) => m.FindPwComponent
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import(`./pages/profile/routes`).then((m) => m.PROFILE_ROUTES),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import(`./pages/dashboard/routes`).then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'employees',
        canActivate: [],
        loadChildren: () =>
          import('./pages/employees/routes').then((m) => m.EMPLOYEES_ROUTES),
      },
      {
        path: 'holidays',
        loadChildren: () =>
          import(`./pages/holidays/routes`).then((m) => m.HOLIDAYS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
