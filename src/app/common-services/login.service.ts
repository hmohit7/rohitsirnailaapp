import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from '../conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    public http: HttpClient,
    public appSettings: MainAppSetting
  ) {
  }
  varifyPhone(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/verify-phone`, data, this.appSettings.getHttpHeades())
  }

  checkPlatform(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/shared-resource/authentication/common-auth`, data, {});
  }

  login(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/login`, data, {});
  }

  verifyOtp(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/verify-otp`, data, {});
  }

  sendOtp(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/send-otp`, data, {});
  }

  reserPassword(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/reset-password`, data, {});
  }

}
