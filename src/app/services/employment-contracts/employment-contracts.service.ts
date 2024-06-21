import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmploymentContractService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getEmploymentContract(
    nameFormControl: string,
    emailFormControl: string,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(
      this.baseUrl + '/admin/employment_contracts/getEmploymentContract',
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

  acceptEmploymentContract(sendData: any) {
    return this.http.put(
      this.baseUrl + '/admin/employment_contracts/acceptEmploymentContract',
      sendData
    );
  }

  rejectEmploymentContract(id: any) {
    return this.http.delete(
      this.baseUrl + '/admin/employment_contracts/rejectEmploymentContract',
      {
        params: id,
      }
    );
  }
}
