import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(private http: HttpClient) { }

  getUnits(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.apiUrl}/api/home?limit=10&searchText=${filterData.searchText}&skip=${filterData.skip}&status=active`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
