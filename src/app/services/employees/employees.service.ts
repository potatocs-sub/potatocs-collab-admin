import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() {}

  // 직원 목록
  getEmployeeList(
    nameFormControl: string,
    managerID: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/employees', {
      params: {
        nameFormControl,
        managerID,
        active,
        direction,
        pageIndex,
        pageSize,
      },
    });
  }

  // 직원 상세 조회
  getEmployeeInfo(id: any) {
    return this.http.get(this.baseUrl + '/admin/employees/' + id);
  }

  // 직원 디테일 수정
  editEmployeeDetail(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/employees/editEmployeeDetail',
      sendData
    );
  }

  // 직원 휴가 수정
  editEmployeeLeave(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/employees/editEmployeeLeave',
      sendData
    );
  }

  // 직원 목록 excel 추가
  addExcelEmployeeList(data: any) {
    return this.http.post(
      this.baseUrl + '/admin/employees/addExcelEmployeeList',
      data
    );
  }

  // 직원 목록
  getEmployeeLeaveStatus(
    emailFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(
      this.baseUrl + '/admin/employees/getEmployeeLeaveStatus',
      {
        params: {
          emailFormControl,
          active,
          direction,
          pageIndex,
          pageSize,
        },
      }
    );
  }
}
