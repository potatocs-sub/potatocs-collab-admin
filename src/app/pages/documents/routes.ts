import { Route } from '@angular/router';
import { DocumentsComponent } from './documents.component';




export const DOCUMENTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => DocumentsComponent,
  },
];
