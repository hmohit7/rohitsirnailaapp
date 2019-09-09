import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  apiUrl = 'https://alpha.thehousemonk.com';

  constructor(
    private http: HttpClient,
    public appSettings: MainAppSetting
  ) {
  }

  getTicketStats(): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/stats/business-app`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getTickets(
    skip,
    status,
    ticketBelongsTo,
    type,
    projects,
    priority,
    startDate,
    endDate,
    contactPoint,
    agent,
    asset): Observable<any> {
    console.log(asset);
    return this.http.get(`${this.appSettings.getApi()}/api/ticket?${status}&limit=10&sortBy=-createdAt&skip=${skip}&ticketBelongsTo=${ticketBelongsTo}&type=${type}&projects=${projects}&priority=${priority}&startDate=${startDate}&endDate=${endDate}&contactPoint=${contactPoint}&agent=${agent}&asset=${asset}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getTicketCategories(filterData): Observable<any> {

    let url: any;;

    if (window.localStorage.getItem('platform')) {
      if (window.localStorage.getItem('platform') === 'bm') {
        url = `/api/category?belongsTo=${filterData.ticketBelongsTo}&${filterData.ticketBelongsTo.toLowerCase()}=${filterData.ticketBelongsToRefId}&status=active&status=inactive`;
      } else {
        url = `/api/category?home=${filterData.ticketBelongsToRefId}&status=active`;
      };
    } else {
      url = `/api/category?belongsTo=${filterData.ticketBelongsTo}&${filterData.ticketBelongsTo.toLowerCase()}=${filterData.ticketBelongsToRefId}&status=active&status=inactive`;
    }

    return this.http.get(`${this.appSettings.getApi()}${url}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  createTicket(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/ticket`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  updateTicket(data): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/ticket/${data._id}`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getTicketById(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}?populate=estimates&&populate=assets&populate=contactPoint&populate=raisedBy&populate=agent&populate=itemDetails.product`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

  getTicketComments(ticketId): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/ticket/${ticketId}/comments`,
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

  searchMaterials(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/product-and-service?type=inventory&searchText=${filterData.searchText}&skip=${filterData.skip}&limit=10&status=active`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        })
      });
  }

}
