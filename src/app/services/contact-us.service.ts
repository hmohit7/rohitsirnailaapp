import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(
    private http: HttpClient) { }

  createContactUs(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/support/help/send-troubleshoot-mail`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
}
