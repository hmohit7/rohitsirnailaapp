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
  selector: 'app-beauticianbooking',
  templateUrl: './beauticianbooking.html',
  styleUrls: ['./beauticianbooking.scss'],
})


export class NailaBeauticianBookingPage {
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
    // this.bookingname="Loading"
  }

  ngOnInit() {
    this.setFilteredItems();
    this.listAllBookings('past');
  }


  a = false;
  starttimeofday
  endtimeofday
  upcomingbooking = [];
  pastbooking = [];
  starttimeoftomorrow
  endtimeoftomorrow
  listAllBookings(data) {

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.starttimeoftomorrow = tomorrow;
    this.starttimeoftomorrow.setHours(0,0,0,0);
    this.endtimeoftomorrow = tomorrow;
    this.endtimeoftomorrow.setHours(23,59,59,999);

    this.starttimeofday = new Date();
    this.starttimeofday.setHours(0,0,0,0);
    this.endtimeofday = new Date();
    this.endtimeofday.setHours(23,59,59,999);






    // element.schedule_on).getTime()

    this.listbooking.splice(0,this.listbooking.length)
    const date = new Date()

   

    console.log(date)
    const id = window.localStorage.getItem('beautician_id')
    this.nailaservice.getBookingForBeautician(id).subscribe(bookingList => {
      this.bookingList = bookingList
      this.upcomingbooking=[];
      this.bookingList.forEach(element => {
        debugger
        if (new Date(element.schedule_on).getTime() >= this.starttimeofday.getTime() && new Date (element.schedule_on).getTime() < this.endtimeofday.getTime()  ) {
          this.pastbooking.push(element)
        } else if (new Date(element.schedule_on).getTime() >= this.endtimeofday.getTime() && new Date (element.schedule_on).getTime() < this.endtimeoftomorrow.getTime()){
          this.upcomingbooking.push(element)
        }
      });
  
  
      if (data == 'past') {
        // this.listbooking = []
        this.listbooking.splice(0,this.listbooking.length)
        this.listbooking = this.pastbooking; 
        if(this.listbooking)
        this.bookingname = "Todays"
      } else {
        this.listbooking.splice(0,this.listbooking.length)
        this.listbooking = this.upcomingbooking;
        if(this.listbooking)
        this.bookingname = "Tomorrow"
        
      }
  
      console.log(this.listbooking)


    })





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


  collectedCash(bookingdata){
    debugger
    const paymentdata={
      "apartment_id": bookingdata.apartment_id, 
      "user_id": bookingdata.user_id, 
      "beautician_id": bookingdata.beautician_id,
      "total_amount": bookingdata.total_amount , 
      "c_gst":9, 
      "s_gst": 9, 
      "service_status":bookingdata.service_status,
      "address": bookingdata.address, 
      "schedule_on": bookingdata.schedule_on,
      "schedule_till": bookingdata.schedule_till,
      "total_no_of_minutes": bookingdata.total_no_of_minutes,
      "payment_status": bookingdata.payment_status, 
      "payment_mode": bookingdata.payment_mode, 
      "payment_id": bookingdata.payment_id, 
      "transaction_id": "21342387732424",
      "coupon_id": 1
    }
    this.nailaservice.updatepaymentStatus(paymentdata,bookingdata).subscribe(data=>{
      bookingdata=data
      alert('Successfully status updated.')
      // if(bookingdata.payment_status='Paid'){

      //   bookingdata.payment_status='Paid'
      // }
      // if(bookingdata.service_status=='Service Done'){
      //   bookingdata.service_status='Service Done'

      // }
      
    })
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
