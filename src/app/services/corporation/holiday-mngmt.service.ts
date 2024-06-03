import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HolidayMngmtService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  constructor() {}

  // 회사 휴일 목록 불러오기
  getCompanyHoliday(
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/leave/getCompanyHolidayList', {
      params: { active, direction, pageIndex, pageSize },
    });
  }

  addCompanyHoliday(data: any) {
    return this.http.post(
      this.baseUrl + '/admin/leave/addCompanyHoliday',
      data
    );
  }

  deleteCompanyHoliday(companyHolidayId: any) {
    return this.http.post(
      this.baseUrl + '/admin/leave/deleteCompanyHoliday',
      companyHolidayId
    );
  }
}
