import { Route } from '@angular/router';
import { EmployeesComponent } from './employees.component';


export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: '',
    component: EmployeesComponent,
  },
  {
    path: 'managers',
    component: EmployeesComponent,
  },
];
