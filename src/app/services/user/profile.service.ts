import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpResMsg } from '../../interfaces/http-response.interfac';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  constructor() {}

  // 프로필 정보 가져오기
  getUserProfile() {
    return this.http.get(this.baseUrl + '/admin/profile');
  }

  // 프로필 이미지 변경하기
  changeProfileImg(imgae: File, id: string): Observable<HttpResMsg<any>> {
    console.log(imgae);
    console.log(id);
    const formData: FormData = new FormData();
    formData.append('file', imgae, imgae?.name);
    formData.append('id', id);
    return this.http.post<HttpResMsg<any>>(
      this.baseUrl + '/admin/profileImageChange',
      formData
    );
  }

  // 프로필 정보 업데이트하기
  updateProfile(formData: any): Observable<HttpResMsg<any>> {
    console.log("프로필 변경")
    return this.http.patch<HttpResMsg<any>>(
      this.baseUrl + '/admin/profileChange',
      formData
    );
  }
}
