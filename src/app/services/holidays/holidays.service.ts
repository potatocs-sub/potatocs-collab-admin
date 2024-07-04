import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  constructor() {}

  // 휴일 목록
  getHolidayList(
    nameFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/holidays', {
      params: { nameFormControl, active, direction, pageIndex, pageSize },
    });
  }

  addHoliday(data: any) {
    return this.http.post(this.baseUrl + '/admin/holidays', data);
  }

  deleteHoliday(data: any) {
    return this.http.post(
      this.baseUrl + '/admin/holidays/deleteholidays',
      data
    );
  }
}
