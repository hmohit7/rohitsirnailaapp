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
import { NailaService } from '../../services/naila.service';
// import { Slides } from 'ionic-angular';

@Component({
  selector: 'app-nailaofferspage',
  templateUrl: './nailaofferspage.html',
  styleUrls: ['./nailaofferspage.scss'],
})


export class NailaOffersPage {



  constructor(private nailaservice: NailaService) {

  }
  searchTerm

  listbanner:any;
  ngOnInit() {
    this.nailaservice.listBanners().subscribe(data => {
    this.listbanner=data;
      this.listbanner.forEach(element => {
        element.name= element.title.split('on')[1]
      });



    console.log(this.listbanner)
    })
  }


}
