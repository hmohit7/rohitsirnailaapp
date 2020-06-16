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
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ViewChild } from '@angular/core';
import { Slides, Popover, PopoverController } from 'ionic-angular';
import { NailaService } from '../../services/naila.service';
// import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';

@Component({
  selector: 'app-nailaticket',
  templateUrl: './nailaticket.html',
  styleUrls: ['./nailaticket.scss'],
})


export class NailaticketPage {
  bookingList: any;

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

  constructor(private nailaservice: NailaService, public alertController: AlertController
  ) {
    this.bookingList = [];

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
    this.listAllTicket('upcoming');
  }


  a = false;
  upcomingbooking = [];
  pastbooking = [];
  listAllTicket(data) {
    this.listbooking = []
    const date = new Date
    const id = window.localStorage.getItem('user_id')
    this.nailaservice.listAllTickets(id).subscribe(data => {
      this.bookingList = data
    })

    this.bookingList.forEach(element => {
      if (element.schedule_on >= date) {
        this.upcomingbooking.push(element)
      } else {
        this.pastbooking.push(element)
      }
    });


    if (data == 'upcoming') {
      this.listbooking = []
      this.listbooking = this.upcomingbooking;
      this.bookingname = "upcoming"
    } else {
      this.listbooking = []
      this.listbooking = this.pastbooking
      this.bookingname = "past"

    }

    console.log(this.listbooking)
  }
  bookingname
  listbooking = []
  // upcomingdata(data){
  //   this.listbooking=[];
  //   this.
  // }

  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }


  async presentAlert(item) {
    const alert = await this.alertController.create({
      // message: 'Enter your issue.',
      inputs: [
        {
          name: 'description',
          placeholder: 'Description'
        },
      ],
      buttons: [
        {
          text: 'Submit',
          handler: data => {
            const ticketdata = {
              "title": item.service.name,
              "description": data.description,
              "booking_id": item.service_id
            }

            this.nailaservice.createTicket(ticketdata).subscribe(data => {

            })

            // let validateObj = (data);
            console.log("==================", data, "========================");
          }
        }
      ]
    });

    await alert.present();
  }






  // async presentPopover(val, id) {
  //   let popOver = await this.popOver.create({
  //     component: ApprovalpopupComponent,
  //     backdropDismiss: false,
  //     componentProps: {
  //       val: val
  //     }
  //   })
  //   popOver.onDidDismiss().then(data => {
  //     if (data.data) {
  //       if (data.data.val == 'approve') {
  //         // this.approvalUser(id)
  //       } else if (data.data.val == 'reject') {
  //         // this.rejectUser(id, data.data.notes)
  //       }
  //     }
  //   })
  //   return await popOver.present()
  // }

}
