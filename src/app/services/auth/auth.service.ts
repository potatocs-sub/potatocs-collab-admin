import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, shareReplay, tap } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);

  userInfo: WritableSignal<any | null> = signal<any | null>(null);

  constructor() {
    // 서비스 초기화(새로고침 이나 컴포넌트 로드) 시 로컬 스토리지에서 토큰을 로드
    this.loadToken();
  }

  signUp(signUpForm: any) {
    return this.http.post(this.baseUrl + '/adAuth/signUp', signUpForm);
  }

  signIn(userData: any) {
    return this.http
      .post<Token>(this.baseUrl + '/adAuth/signIn', userData)
      .pipe(
        tap((res: any) => this.setToken(res.token)),
        shareReplay(1) // 데이터 캐싱
      );
  }

  // get verification code + email
  getEcode(emailData: any) {
    return this.http.post(this.baseUrl + '/adAuth/getEcode', emailData);
  }

  // set temp password + email
  getTempPw(emailData: any) {
    return this.http.put(this.baseUrl + '/adAuth/getTempPw', emailData);
  }

  logOut(): void {
    this.removeToken();
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenName);
  }

  /**
   *  주어진 토큰으로 사용자 정보를 설정하고 로컬 스토리지에 저장하는 메서드
   * */
  private handleToken(token: string | null): void {
    if (token) {
      // 토큰이 있으면 사용자 정보 및 로컬스토리지에 저장
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userInfo.set(decodedToken);
      localStorage.setItem(environment.tokenName, token);
    } else {
      this.userInfo.set(null);
    }
  }

  // 로그인 시 토큰 저장 함수
  setToken(token: string): void {
    this.handleToken(token);
  }

  // 첫 로드나 새로고침 시 토큰이 있는지 확인 후 있으면 사용자정보 가져오는 함수
  loadToken(): void {
    const token = this.getToken();
    this.handleToken(token);
  }

  removeToken(): void {
    localStorage.removeItem(environment.tokenName);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    try {
      const token = this.getToken();
      return !!token && !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
  getTokenInfo(): any | null {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  refreshToken(userData: any) {
    return this.http
      .post<Token>(this.baseUrl + '/adAuth/refreshToken', userData)
      .pipe(
        tap((res: any) => {
          this.setToken(res.token);
        }),
        shareReplay(1) // 데이터 캐싱
      );
  }
}
