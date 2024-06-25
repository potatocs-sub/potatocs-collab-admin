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
  // admin Employee List 나오는 부분
  getEmployees(
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

  // edit 눌렀을때 정보 가져오기
  getEmployeeInfo(id: any) {
    return this.http.get(this.baseUrl + '/admin/leave/getEmployeeInfo/' + id);
  }

  // edit-info 에서 Edit Profile 에 있는 edit을 누르면
  putEmployeeProfileInfo(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/leave/editEmployeeProfileInfo',
      sendData
    );
  }

  putEmployeeLeaveInfo(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/leave/editEmployeeLeaveInfo',
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

  // admin Employee List excel import 하는 부분
  importEmployeeList(data: any) {
    return this.http.post(
      this.baseUrl + '/admin/employees/importEmployeeList',
      data
    );
  }
}
