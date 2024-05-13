import { Route } from '@angular/router';
import { ContractsComponent } from './contracts.component';



export const CONTRACTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => ContractsComponent,
  },
];
