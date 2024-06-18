import { Route } from '@angular/router';
import { HolidaysComponent } from './holidays.component';

export const HOLIDAYS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => HolidaysComponent,
  },
];
