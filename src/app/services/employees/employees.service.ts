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
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/employees', {
      params: { nameFormControl, active, direction, pageIndex, pageSize },
    });
  }

  // admin Employee List 에서 employee 누르면 되는 부분
  getManagerEmployee(managerID: any) {
    return this.http.get(this.baseUrl + '/admin/leave/getManagerEmployee', {
      params: managerID,
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

  // admin employee leave status 부분
  getEmployeeLeaveListSearch(data: any) {
    return this.http.get(
      this.baseUrl + '/admin/leave/employeeLeaveListSearch',
      { params: data }
    );
  }

  // 직원 목록 excel 추가
  addExcelEmployeeList(data: any) {
    return this.http.post(
      this.baseUrl + '/admin/employees/addExcelEmployeeList',
      data
    );
  }
}
