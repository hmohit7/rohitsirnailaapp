import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx'
import * as moment from 'moment';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate /translate-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from '../../services/rentals-user.service';
import { Device } from '@ionic-native/device/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NailaService } from '../../services/naila.service';

@Component({
  selector: 'app-nailabooking',
  templateUrl: './nailabooking.html',
  styleUrls: ['./nailabooking.scss'],
})


export class NailabookingPage  {

  sliderConfig = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    // centeredSlides: true
  };

  sliderConfig2 = {
    slidesPerView: 3.2,
    spaceBetween: 5,
    // centeredSlides: true
  };
  public searchTerm: string = "";
  public items: any;

  constructor(private nailaservice:NailaService) {
    this.items = [
      { title: "one" },
      { title: "two" },
      { title: "three" },
      { title: "four" },
      { title: "five" },
      { title: "six" }
    ];
  }

  ngOnInit() {
    this.setFilteredItems();
    this.listAllBookings();
  }

  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
a=false;
bookingList:any;

listAllBookings(){
  
  const id = window.localStorage.getItem('user_id')
  console.log(id);
  this.nailaservice.listAllBookings(id).subscribe(data=>{
    this.bookingList=data
    console.log(this.bookingList)

    this.bookingList.booking_services.forEach(element => {
        //  element.schedule_on=
    });

    
  })
}

}
