import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/conatants/appSettings';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
    ) { }

  getProjects(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.appSettings.getApi()}/api/project?limit=10&searchText=${filterData.searchText}&skip=${filterData.skip}&status=all`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
