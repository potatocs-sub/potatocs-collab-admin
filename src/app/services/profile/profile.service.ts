import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResMsg } from '../../interfaces/http-response.interfac';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    changeProfileImg(image: File, id: string): Observable<HttpResMsg<any>> {
        const formData: FormData = new FormData();
        formData.append('nsProfile_img', image, image?.name);
        formData.append('id', id);
        return this.http.post<HttpResMsg<any>>(
            this.baseUrl + '/admin/profiles',
            formData,
            {
                reportProgress: true,
            }
        );
    }

    updateProfile(formData: any): Observable<HttpResMsg<any>> {
        return this.http.patch<HttpResMsg<any>>(
            this.baseUrl + '/admin/profiles',
            formData
        );
    }
}
