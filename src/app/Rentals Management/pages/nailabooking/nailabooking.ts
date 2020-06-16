import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../services/ticket.service";
import {
  LoadingController,
  ModalController,
  AlertController,
  NavController
} from "@ionic/angular";
import { Router } from "@angular/router";
import { Push, PushObject, PushOptions } from "@ionic-native/push/ngx";
import * as moment from "moment";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { CreateNoticeComponent } from "../../modals/create-notice/create-notice.component";
import { translateService } from "src/app/common-services/translate /translate-service.service";
import { Storage } from "@ionic/storage";
import { RentalsUserService } from "../../services/rentals-user.service";
import { Device } from "@ionic-native/device/ngx";
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ViewChild } from "@angular/core";
import { Slides, Popover, PopoverController } from "ionic-angular";
import { NailaService } from "../../services/naila.service";
// import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';

@Component({
  selector: "app-nailabooking",
  templateUrl: "./nailabooking.html",
  styleUrls: ["./nailabooking.scss"]
})
export class NailabookingPage {
  bookingList: any;

  sliderConfig = {
    slidesPerView: 1.2,
    spaceBetween: 5
    // centeredSlides: true
  };

  sliderConfig2 = {
    slidesPerView: 3.2,
    spaceBetween: 5
    // centeredSlides: true
  };
  public searchTerm: string = "";
  public items: any;

  constructor(
    private nailaservice: NailaService,
    public alertController: AlertController
  ) {
    this.bookingList = [];
    this.bookingname = "upcoming";

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
    this.listAllBookings("upcoming");
  }

  a = false;
  upcomingbooking = [];
  pastbooking = [];
  listAllBookings(data) {
    this.bookingList=[]
    this.listbooking.splice(0, this.listbooking.length);

    const id = window.localStorage.getItem("user_id");
    this.nailaservice.listAllBookings(id).subscribe(bookinglistdata => {
      
      this.bookingList = bookinglistdata;
      this.filterpastandupcomingBooking(data)
    });





 
  }
  bookingname;
  listbooking = [];
  // upcomingdata(data){
  //   this.listbooking=[];
  //   this.
  // }



  filterpastandupcomingBooking(data){
    debugger
    const date = new Date();

    this.upcomingbooking = [];
    this.pastbooking=[];
    this.bookingList.forEach(element => {
      if (new Date(element.schedule_on).getTime() >= date.getTime() && element.service_status === null) {
        this.upcomingbooking.push(element);
      } else {
        this.pastbooking.push(element);
      }

      
    });
    console.log("===================upcoming================",this.upcomingbooking,"==================================")
    console.log("-----------------past---------------",this.pastbooking,"---------------------------------------------")

    if (data == "upcoming") {
      debugger
      // this.listbooking.splice(0,this.listbooking.length)

      this.listbooking = this.upcomingbooking;
      this.bookingname = "upcoming";
    } else {
      debugger
      // this.listbooking.splice(0,this.listbooking.length)
      this.bookingname = "past";
      this.listbooking = this.pastbooking;
    }

  }

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
          name: "description",
          placeholder: "Description"
        }
      ],
      buttons: [
        {
          text: "Submit",
          handler: data => {
            const ticketdata = {
              title: item.service.name,
              description: data.description,
              booking_id: item.service_id
            };

            this.nailaservice.createTicket(ticketdata).subscribe(data => {});

            // let validateObj = (data);
            console.log("==================", data, "========================");
          }
        }
      ]
    });

    await alert.present();
  }



  async presentInvoiceAlert(item) {
    debugger
    const alert = await this.alertController.create({
      cssClass: 'my-custom-invoice-class',
      header: "Tracking Id: "+item.unique_id,
      subHeader:"Total Amount: Rs."+ item.total_amount,
      message:"Payment Mode: "+ (item.payment_status),
      buttons: ['OK']
    });

    await alert.present();
  }



}
