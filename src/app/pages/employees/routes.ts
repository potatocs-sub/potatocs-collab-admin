import { Route } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesRetiredComponent } from './employees-retired/employees-retired.component';
import { EmployeesLeaveStatusComponent } from './employees-leave-status/employees-leave-status.component';
import { EmployeesRequestComponent } from './employees-request/employees-request.component';

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
    path: 'leave-status', // 직원들 휴가 목록
    loadComponent: () => EmployeesLeaveStatusComponent,
  },
  {
    path: 'request', // 직원들 회원가입 요청
    loadComponent: () => EmployeesRequestComponent,
  },
  {
    path: 'retired', // 퇴사자 명단
    loadComponent: () => EmployeesRetiredComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
