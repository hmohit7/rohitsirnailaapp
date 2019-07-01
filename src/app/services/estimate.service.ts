import { Observable } from 'rxjs';
import { AppSettings } from './../conatants/appSettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
  ) { }
  
  getEstimateById(id): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/estimate/${id}?populate=statusChangedBy`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
  updateEstimate(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/estimate/${data._id}`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
}
