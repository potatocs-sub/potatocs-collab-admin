import { Route } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesLeaveStatusComponent } from './employees-leave-status/employees-leave-status.component';
import { EmploymentContractComponent } from './employment-contract/employment-contract.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { RetiredEmployeesComponent } from './retired-employees/retired-employees.component';

export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/employees/list',
    pathMatch: 'full',
  },
  {
    path: 'list', // 직원들 목록
    loadComponent: () => EmployeeListComponent,
  },
  {
    path: 'edit/:id', // 직원들 목록
    loadComponent: () => EditEmployeeComponent,
  },
  {
    path: 'leave-status', // 직원들 휴가 목록
    loadComponent: () => EmployeesLeaveStatusComponent,
  },
  {
    path: 'contract', // 고용 계약 목록
    loadComponent: () => EmploymentContractComponent,
  },
  {
    path: 'retired', // 퇴사 직원들 목록
    loadComponent: () => RetiredEmployeesComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
