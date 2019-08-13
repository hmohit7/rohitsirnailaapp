import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from '../conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getNotices(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.appSettings.getApi()}/api/discussion?skip=${filterData.skip}&limit=5&populate=files`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
  likeNotice(id) {
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/like`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getNoticeById(id) {
    console.log(id);
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getAllComments(id) {
    console.log(id);
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/comments`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  createComment(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/comment`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  deleteComment(id) {
    console.log(id);
    return this.http.delete(`${this.appSettings.getApi()}/api/comment/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  createNotice(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/discussion`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
