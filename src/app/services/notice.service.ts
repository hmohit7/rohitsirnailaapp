import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(private http: HttpClient) { }

  getNotices(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.apiUrl}/api/discussion?skip=${filterData.skip}&limit=5&populate=files`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }
  likeNotice(id) {
    return this.http.get(`${this.apiUrl}/api/discussion/${id}/like`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getNoticeById(id) {
    console.log(id);
    return this.http.get(`${this.apiUrl}/api/discussion/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getAllComments(id) {
    console.log(id);
    return this.http.get(`${this.apiUrl}/api/discussion/${id}/comments`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  createComment(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/comment`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  deleteComment(id) {
    console.log(id);
    return this.http.delete(`${this.apiUrl}/api/comment/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  createNotice(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/discussion`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
