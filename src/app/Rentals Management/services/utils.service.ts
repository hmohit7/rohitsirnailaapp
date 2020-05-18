import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,EventEmitter } from '@angular/core';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class Utils {
    storage:any;
    cartdata:any
    cartitem:any;
    LoadPage:EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { 
    this.cartitem=[];
    this.cartdata=0;
  }

  

  LoadPageOnrouteChange(){
    this.LoadPage.next(true)
  }


}
