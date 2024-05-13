import { Route } from '@angular/router';
import { CompanyHolidaysComponent } from './company-holidays.component';


export const HOLIDAYS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => CompanyHolidaysComponent,
  },
];
