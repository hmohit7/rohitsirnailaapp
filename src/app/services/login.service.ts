import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../conatants/appSettings';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl = AppSettings.BMAPI;

  constructor(private http: HttpClient) { }

  checkPlatform(data): Observable<any> {
    return this.http.post(`${localStorage.getItem('apiUrl')}/shared-resource/authentication/common-auth`, data, {});
  }

  login(data): Observable<any> {
    return this.http.post(`${localStorage.getItem('apiUrl')}/api/login`, data, {});
  }

  verifyOtp(data): Observable<any> {
    return this.http.post(`${localStorage.getItem('apiUrl')}/api/verify-otp`, data, {});
  }

  sendOtp(data): Observable<any> {
    return this.http.post(`${localStorage.getItem('apiUrl')}/api/send-otp`, data, {});
  }

  reserPassword(data): Observable<any> {
    return this.http.post(`${localStorage.getItem('apiUrl')}/api/reset-password`, data, {});
  }

}
