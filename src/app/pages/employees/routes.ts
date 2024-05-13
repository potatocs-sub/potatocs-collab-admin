import { Route } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeesRetiredComponent } from './employees-retired/employees-retired.component';
import { EmployeesCompanyRequestsComponent } from './employees-company-requests/employees-company-requests.component';


export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/employees/list',
    pathMatch: 'full'
  },
  {
    path: 'list', // 직원들 목록
    loadComponent: () => EmployeeListComponent,
  },
  {
    path: 'leaves', // 직원들 휴가 목록
    loadComponent: () => EmployeeListComponent,
  },
  {
    path: 'requests', // 직원들 회원가입 요청
    loadComponent: () => EmployeesCompanyRequestsComponent,
  },
  {
    path: 'retired', // 퇴사자 명단
    loadComponent: () => EmployeesRetiredComponent,
  },
  {
    path: '**',
    // redirectTo: 'welcome',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
