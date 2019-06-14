import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {

    return this.http.get(`${this.apiUrl}/api/user/type?fields=firstName&fields=lastName&fields=types&fields=_id&status=active&types=vendor&types=employee&types=contract-employee&types=technician&types=admin&types=housekeeper`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getUserApprovals(): Observable<any> {

    return this.http.get(`${this.apiUrl}/api/approval`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
}
