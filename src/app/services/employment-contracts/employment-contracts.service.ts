import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmploymentContractService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // 고용 계약 목록
  getEmploymentContract(
    nameFormControl: string,
    emailFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/admin/employment_contracts', {
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

  // 고용 계약 수락
  acceptEmploymentContract(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/employment_contracts',
      sendData
    );
  }

  // 고용 계약 거절
  rejectEmploymentContract(id: any) {
    return this.http.delete(this.baseUrl + '/admin/employment_contracts', {
      params: id,
    });
  }
}
