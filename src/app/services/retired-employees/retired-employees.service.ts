import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RetiredEmployeesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() {}

  // 퇴사 직원 목록
  getRetiredEmployeeList(
    nameFormControl: string,
    emailFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/retired_employees', {
      params: {
        nameFormControl,
        emailFormControl,
        active,
        direction,
        pageIndex,
        pageSize,
      },
    });
  }

  // 직원 목록
  getEmployeeList(
    nameFormControl: string,
    emailFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(
      this.baseUrl + '/admin/retired_employees/getEmployeeList',
      {
        params: {
          nameFormControl,
          emailFormControl,
          active,
          direction,
          pageIndex,
          pageSize,
        },
      }
    );
  }

  // 직원 퇴사
  retiredEmployee(data: any) {
    return this.http.patch(this.baseUrl + '/admin/retired_employees', data);
  }

  // 직원 퇴사 취소
  cancelRetireEmployee(data: any) {
    return this.http.patch(
      this.baseUrl + '/admin/retired_employees/cancelRetireEmployee',
      { id: data }
    );
  }
}
