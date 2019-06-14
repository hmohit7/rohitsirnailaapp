import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(private http: HttpClient) { }

  getProjects(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.apiUrl}/api/project?limit=10&searchText=${filterData.searchText}&skip=${filterData.skip}&status=all`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
