import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  constructor() {}

  // 대쉬보드
  getDashboard() {
    return this.http.get(this.baseUrl + '/admin/dashboard');
  }
}
