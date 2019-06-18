import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/conatants/appSettings';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
  ) { }

  createContactUs(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/support/help/send-troubleshoot-mail`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
}
