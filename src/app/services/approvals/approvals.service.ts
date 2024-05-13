import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  constructor() { }
  getCompanyRequest(active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/admin/leaves/getPendingRequest', { params: { active, direction, pageIndex, pageSize } });
  }

  approveCompanyRequest(sendData: any) {
    return this.http.put(this.baseUrl + '/admin/leaves/approveRequest', sendData)
  }

  deleteCompanyRequest(pendingId: any) {
    return this.http.delete(this.baseUrl + '/admin/leaves/deleteRequest', { params: pendingId })
      .pipe(
        shareReplay(),
        tap(
          (res: any) => {
            console.log(res)

            // this.companyRequestStorageService.updatePendingRequest(res.pendingRequestData);
            return res.message;
          }
        )
      );
  }
}
