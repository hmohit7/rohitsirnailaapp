import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController, PopoverController } from '@ionic/angular';
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
import { Utils } from '../../services/utils.service';
import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';

@Component({
  selector: 'app-nailacart',
  templateUrl: './nailacart.html',
  styleUrls: ['./nailacart.scss'],
})


export class NailaCartPage {
  itemcounter: any;
  count
  service
  temp
  temp1;
  coupon;
  temp3
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

  constructor(private nailaservice: NailaService, private utils: Utils, private popOver: PopoverController,
  ) {
    this.items = [
      { title: "one" },
      { title: "two" },
      { title: "three" },
      { title: "four" },
      { title: "five" },
      { title: "six" }
    ];
    this.count = 0;
    this.itemcounter = 0
    this.temp3 = {
      data: ''
    }
  }
  apartmentList
  ngOnInit() {

    window.localStorage.getItem('apartment_id')
    this.nailaservice.apartmentList().subscribe(data => {
      this.apartmentList = data
      this.items = data
      // console.log(this.apartmentList)
      this.apartmentList.forEach(element => {
        if(window.localStorage.getItem('apartment_id')===element.id){
          this.selectedapartment=element.name
        }
      });
    })


    this.setFilteredItems();
    const user_id = window.localStorage.getItem('user_id');
    this.utils.cartitem = JSON.parse(window.localStorage.getItem('cartitem'));
    this.utils.cartdata = window.localStorage.getItem('cartitemcount')



    this.temp = (this.utils.cartitem.reduce((acc, val) => {

      if (!acc.find(el => el.service.name === val.service.name && val.servicecount == 0)) {
        acc.push(val);
      }
      return acc;
    }, []));

    // window.localStorage.setItem('cartitem', JSON.stringify(this.temp))


    // this.temp = (this.utils.cartitem.reduce((acc, val) => {
    //   
    //   if (!acc.find(el => el.service.name === val.service.name)) {
    //     acc.push(val);
    //   }
    //   return acc;
    // }, []));



    // this.temp1 = (this.utils.cartitem.reduce((acc, val) => {
    //   
    //   if (!acc.find(el => el.service.name !== val.service.name)) {
    //     acc.push(val);
    //   }
    //   return acc;
    // }, []));

    console.log("===================nailacart===================", this.temp);
    // console.log("===================nailacart===================",this.temp1);


    // this.temp1.forEach(element => {
    //   // element.servicecount += element.servicecount
    //   this.count = this.count + element.servicecount;
    //   this.service = element.service.name;
    // });




    // this.temp.push({
    //   service:this.service,
    //   servicecount:this.count
    // })

    // this.temp.forEach(element => {
    //   
    //   if (element.service.name == this.service) {
    //     element.servicecount = this.count
    //   }
    // // });
    // console.log("===================nailacart===================", this.temp);
    // console.log(this.count)
    // console.log("===================nailacart===================", this.temp1);
    this.calculatePrice();

    this.calculateMinute();
  }


  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  a = false;


  itemCounter(plusminus, data) {

    this.temp.forEach(function (element, i, object) {
      if (element.servicecount == 0)
        object.splice(i, 1);
    });



    if (plusminus == "plus" && data.servicecount >= 0) {

      this.temp.forEach(element => {

        if (element.service.name === data.service.name) {
          data.servicecount = data.servicecount + 1
          // element.servicecount = this.itemcounter;

          // this.calculatePrice()

        }
      });


    } else if (plusminus == "minus" && data.servicecount > 0) {
      this.temp.forEach(function (element, i, object) {
        if (element.service.name === data.service.name) {
          data.servicecount = data.servicecount - 1
          // element.servicecount = this.itemcounter;
          // if(data.servicecount==0){
          //   

          //   object.splice(i, 1);
          //   // this.temp3.pop(element[i])

          //           }

        }
      });
      // if(data.servicecount==0){
      //   // this.temp3.pop(element[i])
      //   this.temp.splice(this.temp3, 1);

      // }

    }

    // this.temp=this.temp3
    this.temp = (this.utils.cartitem.reduce((acc, val) => {

      if (!acc.find(el => el.service.name === val.service.name && val.servicecount == 0)) {
        acc.push(val);
      }
      return acc;
    }, []));
    window.localStorage.setItem('cartitem', JSON.stringify(this.temp))
    this.calculatePrice();
    this.calculateMinute();
  }

  totalprice
  calculatePrice() {
    this.totalprice = 0
    const totalitem = JSON.parse(window.localStorage.getItem('cartitem'))
    totalitem.forEach(element => {
      this.totalprice = Number(element.service.offer_price) * element.servicecount + Number(this.totalprice)
    });



    const cgst = this.totalprice * 0.09;
    const sgst = this.totalprice * 0.09;
    this.totalprice = cgst + sgst + this.totalprice;

  }
  coupondetail
  discount
  applyCoupon(data) {

    this.nailaservice.applyCoupon(data).subscribe(item => {
      this.coupondetail = item;
      window.localStorage.setItem('coupon_id', this.coupondetail.id)
      if (this.coupondetail.coupon_type == 'percent' && item) {

        debugger
        this.discount = this.totalprice * (this.coupondetail.value / 100)
        this.totalprice = this.totalprice - this.discount
      } else {
        this.totalprice = this.totalprice - this.coupondetail.value
      }


    })


  }
  removeCoupon() {
    this.totalprice = this.totalprice + this.discount;
    this.discount = ''
    this.coupon = ''
  }
  totalNumberofMinutes = 0;
  slotdata: any;
  beauticiandata: any;
  calculateMinute() {
    this.temp.forEach(element => {
      this.totalNumberofMinutes = (element.service.no_of_minuties * element.servicecount) + this.totalNumberofMinutes
    });
    console.log("=================", this.totalNumberofMinutes, "======================================");

    this.slotdata = {
      "apartment_id": 1,
      "no_of_minites": this.totalNumberofMinutes
    }

    this.nailaservice.getAvailbleSlots(this.slotdata).subscribe(data => {
      this.beauticiandata = data
    })
  }
  selecteddate;
  selectedtime;
  selectedBeauticiandata
  selectedbeautician(data) {
    console.log(data.target.value);
    this.selectedBeauticiandata = data.target.value

  }

  selectedaddress;


  createBooking() {

    // RazorpayCheckout.open

    // const data={
    //   "apartment_id": window.localStorage.getItem('apartment_id'), 
    //   "user_id": window.localStorage.getItem('user_id'), 
    //   "beautician_id": this.selectedBeauticiandata.beauticians[0],
    //   "total_amount": this.totalprice , 
    //   "c_gst": 9, 
    //   "s_gst": 9, 
    //   "address": this.selectedaddress, 
    //   "schedule_on": this.selectedBeauticiandata.start_datetime,
    //   "schedule_till": this.selectedBeauticiandata.end_datetime,
    //   "total_no_of_minutes": this.totalNumberofMinutes,
    //   "payment_status": "paid", 
    //   "payment_mode": this.selectedmodeofpayment, 
    //   "payment_id": "abcd1234", 
    //   "transaction_id": "213423877",
    //   "coupon_id": window.localStorage.getItem('coupon_id'),
    //   "services": this.temp
    // }


    // this.nailaservice.createBooking(data).subscribe(data=>{

    // })

  }

  selectedmodeofpayment


  async presentPopover() {
    let popOver = await this.popOver.create({
      component: ApprovalpopupComponent,
      backdropDismiss: false,
      componentProps: {
        val: ''
      }
    })
    popOver.onDidDismiss().then(data => {
      if (data.data) {
        if (data.data.val == 'approve') {
          // this.approvalUser(id)
        } else if (data.data.val == 'reject') {
          // this.rejectUser(id, data.data.notes)
        }
      }
    })
    return await popOver.present()
  }
  selectedflat;
  selectedapartment;


  selectedApartment(event){
    this.selectedapartment=event.target.value.name;
    window.localStorage.setItem('apartment_id',event.target.value.id)
  }
}
