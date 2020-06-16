import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController, PopoverController, Platform } from '@ionic/angular';
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
import { Slides } from 'ionic-angular';
import { NailaService } from '../../services/naila.service';
import { Utils } from '../../services/utils.service';
import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';
import { element } from '@angular/core/src/render3';
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-nailacart',
  templateUrl: './nailacart.html',
  styleUrls: ['./nailacart.scss'],
})


export class NailaCartPage {

  paymentAmount: number = 0;
  currency: string = 'INR';
  currencyIcon: string = '₹';
  razor_key = 'rzp_live_4c3CzCuqiz6qHi';
  cardDetails: any = {};
  itemcounter: any;
  count;
  totalNumberofMinutes = 0;
  slotdata: any;
  beauticiandata: any;
  selectedflat;
  selectedapartment;
  service;
  coupondetail
  discount
  temp;
  a = false;
  flat;
  temp1;
  apartmentList
  coupon;
  temp3
  public searchTerm: string = "";
  public items: any;



  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: "lines"
    }).then(loading => {
      loading.present();
    });
  }



  constructor(public loadingCtrl: LoadingController, private nailaservice: NailaService, public utils: Utils, private popOver: PopoverController, private router: Router, private platform: Platform
  ) {
    this.beauticiandata = [];
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

    // this.apartmentList = {
    //   id: 0,
    //   name: "BILLPAYMENT",
    //   value: "Wallet_1002"
    // };
  }
  currentmindate
  currentplusthreedays
  ngOnInit() {

    var myDate = new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000));
    var date = new Date();

    this.currentmindate = this.formatDate(date);
    this.currentplusthreedays = this.formatDate(myDate)

    if (window.localStorage.getItem('apartment_name')) {

      this.flat = window.localStorage.getItem('apartment_name');
    } else {
      this.flat = 'Select apartment'
    }
    window.localStorage.getItem('apartment_id')
    this.nailaservice.apartmentList().subscribe(data => {
      this.apartmentList = data
      this.items = data
      this.apartmentList.forEach(element => {
        if (window.localStorage.getItem('apartment_id') === element.id) {
          this.selectedapartment = element.name
        }
      });
    })


    this.setFilteredItems();
    const user_id = window.localStorage.getItem('user_id');
    this.utils.cartitem = JSON.parse(window.localStorage.getItem('cartitem'));
    if (window.localStorage.getItem('cartitemcount')) {

      this.utils.cartdata = window.localStorage.getItem('cartitemcount')
    } else {
      this.utils.cartdata = []
    }
    if (this.utils.cartitem) {


      this.temp = (this.utils.cartitem.reduce((acc, val) => {

        if (!acc.find(el => el.service.name === val.service.name && val.servicecount == 0)) {
          acc.push(val);
        }
        return acc;
      }, []));
      this.calculatePrice('');
      this.calculateMinute();
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

        }
      });

    }

    // this.temp=this.temp3


    this.temp = (this.utils.cartitem.reduce((acc, val) => {

      if (!acc.find(el => el.service.name === val.service.name && val.servicecount == 0)) {
        acc.push(val);
      }
      return acc;
    }, []));

    window.localStorage.setItem('cartitem', JSON.stringify(this.temp))


    this.calculatePrice('');
    this.calculateMinute();
    this.calculateItemcount();
    if (this.coupon) {

      this.applyCoupon(this.coupon)
    }



  }
  cartitemcounter: any;
  calculateItemcount() {
    this.cartitemcounter = 0;
    this.temp.forEach(element => {
      this.cartitemcounter = element.servicecount + this.cartitemcounter
    });
    if (this.cartitemcounter <= 0) {
      window.localStorage.removeItem('cartitemcount')
      window.localStorage.removeItem('cartitem')
      this.utils.cartitem = false;

    } else {

      window.localStorage.setItem('cartitemcount', this.cartitemcounter)
    }
  }
  itemPrice;
  totalprice;
  itemDiscount;
  partialcoupon=false;
  coupontemp;
  foundcoupon = false;
  servicecount = 0;
  servicediscount = 0;
  calculatePrice(manualcoupon) {
  this.partialcoupon=true;

    this.servicecount = 0;
    this.servicediscount = 0;

    const swap = [this.totalprice]
    this.coupontemp = [...swap]
    this.totalprice = 0;
    const totalitem = JSON.parse(window.localStorage.getItem('cartitem'))
    totalitem.forEach(serviceElement => {

      // if (element.service.coupons.length && element.service.coupons[0].is_active && element.service.coupons[0].coupon_type == 'percent') {
      //   this.itemDiscount = element.service.offer_price * (element.service.coupons[0].value / 100);
      //   this.itemPrice = element.service.offer_price - this.itemDiscount
      //   this.totalprice = (Number(this.itemPrice) * element.servicecount + Number(this.totalprice))

      // } else if (element.service.coupons.length && element.service.coupons[0].is_active && element.service.coupons[0].coupon_type == 'fixed_value') {
      //   this.itemDiscount = element.service.coupons[0].value
      //   this.itemPrice = element.service.offer_price - this.itemDiscount
      //   this.totalprice = (Number(this.itemPrice) * element.servicecount + Number(this.totalprice))
      // }      else 

      // serviceElement.forEach(element => {
      //   if(element.id)
      // });

      this.foundcoupon = false
      // this.partialcoupon=false



      if (manualcoupon && manualcoupon.coupon_type == 'percent' && serviceElement.service.coupons.length) {
        debugger
        serviceElement.service.coupons.forEach(element => {
          if (element.id == manualcoupon.id && element.name.toLowerCase() == manualcoupon.name.toLowerCase()) {
            this.foundcoupon = true
            this.partialcoupon=true
            this.discount = serviceElement.service.offer_price * (manualcoupon.value / 100);
            this.servicediscount = this.discount * serviceElement.servicecount + this.servicediscount;
            this.servicecount = this.servicecount + serviceElement.servicecount
            this.itemPrice = serviceElement.service.offer_price - this.discount
            this.totalprice = (Number(this.itemPrice) * serviceElement.servicecount + Number(this.totalprice))

          }

        });
        if (!this.foundcoupon) {

          this.totalprice = Number(serviceElement.service.offer_price) * serviceElement.servicecount + Number(this.totalprice)
          this.partialcoupon=true

        }

      } else if (manualcoupon && manualcoupon.coupon_type == 'fixed_value' && serviceElement.service.coupons.length) {
        serviceElement.service.coupons.forEach(element => {
          if (element.id == manualcoupon.id && element.name.toLowerCase() == manualcoupon.name.toLowerCase()) {
            this.foundcoupon = true
            this.partialcoupon=true

            this.discount = manualcoupon.value
            this.servicediscount = this.discount * serviceElement.servicecount + this.servicediscount;
            // this.servicecount= this.servicecount + 
            this.itemPrice = serviceElement.service.offer_price - this.discount
            this.totalprice = (Number(this.itemPrice) * serviceElement.servicecount + Number(this.totalprice))

          }

        });
        if (!this.foundcoupon) {

          this.totalprice = Number(serviceElement.service.offer_price) * serviceElement.servicecount + Number(this.totalprice)
          // this.partialcoupon=true

        }

      } else {
        this.totalprice = Number(serviceElement.service.offer_price) * serviceElement.servicecount + Number(this.totalprice)

        this.totalprice.toFixed(2)
        if (manualcoupon && !this.partialcoupon && !this.foundcoupon) {

          alert('This coupon is not applicable on this service.')
          this.coupon = ''
        }

      }


      this.cgst = this.totalprice * 0.09;
      this.sgst = this.totalprice * 0.09;
    });



    // this.totalprice = cgst + sgst + this.totalprice;
    // if (manualcoupon && !this.foundcoupon) {
    //   this.totalprice = this.coupontemp[0];
    //   this.totalprice = Number(this.totalprice).toFixed(2)
    //   alert('This coupon is not applicable on this service.')
    //   this.coupon = ''

    // }

  }
  cgst
  sgst
  applyCoupon(data) {

    this.nailaservice.applyCoupon(data).subscribe(item => {
      this.coupondetail = item;
      window.localStorage.setItem('coupon_id', this.coupondetail.id)
      if (this.coupondetail.is_active) {

        this.calculatePrice(this.coupondetail)
      } else {
        // this.totalprice = this.coupontemp[0];
        // this.totalprice = Number(this.totalprice).toFixed(2)
        alert('This coupon is not applicable on this service.')
        this.coupon = ''


      }

      // if (this.coupondetail.coupon_type == 'percent' && item) {


      //   this.discount = this.totalprice * (this.coupondetail.value / 100)
      //   this.totalprice = this.totalprice - this.discount
      // } else {
      //   this.totalprice = this.totalprice - this.coupondetail.value
      // }


    }, err => {
      alert('This coupon is not applicable on this service.')
      this.coupon = ''
    })


  }
  removeCoupon() {
    this.totalprice = Number(this.totalprice) + Number(this.servicediscount);
    this.totalprice = this.totalprice.toFixed(2)
    this.discount = ''
    this.coupon = ''
  }

  calculateMinute() {
    this.totalNumberofMinutes = 0;
    this.temp.forEach(element => {
      this.totalNumberofMinutes = (element.service.no_of_minuties * element.servicecount) + this.totalNumberofMinutes
    });
    console.log("=================", this.totalNumberofMinutes, "======================================");

    this.slotdata = {
      "apartment_id": window.localStorage.getItem('apartment_id'),
      "no_of_minites": this.totalNumberofMinutes
    }
    const selectedapartment = this.slotdata
    // this.getAvailabaleSlot(selectedapartment);
  }

  slotdate: any;
  getAvailabaleSlot(event) {
    this.beauticiandata = []
    debugger
    if (event.selected_date) {

      this.slotdate = event.selected_date.toDateString().split("T");
    } else {
      this.slotdate = event.split("T")[0]
    }
    this.selectedapartment = window.localStorage.getItem('apartment_id')
    const data = {
      "apartment_id": this.selectedapartment,
      "no_of_minites": this.totalNumberofMinutes,
      "selected_date": this.slotdate
    }
    if (data.apartment_id && data.no_of_minites) {

      this.nailaservice.getAvailbleSlots(data).subscribe(data => {
        this.beauticiandata = data
      })
    }
  }



  selecteddate;
  scheduledend_datetime
  scheduledondate
  selectedtime;
  selectedBeauticiandata
  selectedbeautician(data) {
    debugger
    console.log(data.target.value);
    this.selectedBeauticiandata = data.target.value
    this.scheduledondate = data.target.value.start_datetime;
    this.scheduledend_datetime = data.target.value.start_datetime;


  }

  selectedaddress;

  cart = [];

  hidecartscreen = true;
  async createBooking(paymentid, status, selectedmodeofpayment) {
    this.presentLoading()

    var temp = this.temp.filter(element => {

      return (element.servicecount > 0)
    });


    temp.forEach(element => {
      this.cart.push({

        "service_id": element.service.id,
        "quantity": element.servicecount
      })
    });
    try {
      const data = {
        "apartment_id": Number(window.localStorage.getItem('apartment_id')),
        "user_id": Number(window.localStorage.getItem('user_id')),
        "beautician_id": this.selectedBeauticiandata.beauticians[0],
        "total_amount": this.totalprice,
        "c_gst": this.cgst,
        "s_gst": this.sgst,
        "address": this.selectedaddress,
        "flat_no": this.selectedflat,
        "schedule_on": this.scheduledondate,
        "schedule_till": this.scheduledend_datetime,
        "total_no_of_minutes": this.totalNumberofMinutes,
        "payment_status": status,
        "payment_mode": selectedmodeofpayment,
        "payment_id": paymentid,
        "transaction_id": '',
        "coupon_id": window.localStorage.getItem('coupon_id'),
        "services": this.cart
      }

      this.nailaservice.createBooking(data).subscribe(data => {
        this.loadingCtrl.dismiss();
        this.router.navigateByUrl('/rentals-naila-search-page')
        alert('Your booking has been done successfully.')
        window.localStorage.removeItem('cartitem')
        window.localStorage.removeItem('cartitemcount')

        // this.hidecartscreen=false;

      }, err => {
        // this.router.navigateByUrl('/rentals-naila-search-page')
        alert("something went wrong")

        // window.localStorage.removeItem('cartitem')	
        // window.localStorage.removeItem('cartitemcount')	
      })

    }
    catch (e) {
      console.log("error => ", e.response)
    }

    // this.payWithRazor()

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

  todaysdate = new Date()




  selectedApartment(event) {
    debugger
    this.selectedapartment = event.target.value.id;
    const slectedbuilding = window.localStorage.setItem('apartment_id', this.selectedapartment);

    // this.slotdata = {
    //   "apartment_id": window.localStorage.getItem('apartment_id'),
    //   "no_of_minites": this.totalNumberofMinutes,
    //   "selected_date": this.todaysdate
    // }
    const selectedapartment = this.slotdata
    this.date = '';
    this.selecteddate = '';
    this.beauticiandata = []


    // this.getAvailabaleSlot(selectedapartment);

  }

  date: any;
  payWithRazor() {
    const _this = this;
    var options = {
      description: 'Naila app product of Mayuri International group.',
      image: 'https://naila-proj.s3.ap-south-1.amazonaws.com/production/uploads/Assets/razorpaynailalogo.png',
      currency: this.currency,
      key: this.razor_key,
      amount: this.totalprice * 100,
      name: 'Naila Beauty Redefined',
      theme: {
        color: '#000000'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = function (payment_id) {
      _this.createBooking(payment_id, 'online_paid', 'online')
    };

    var cancelCallback = function (error) {
      // this.selectedmodeofpayment="by_cash"
      _this.createBooking('No payment id', 'Not paid', 'by_cash')

    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }


  locatemp
  ionViewWillLeave() {
    window.localStorage.removeItem('coupon_id');
    this.cartitemcounter = 0
    this.utils.cartitem = JSON.parse(window.localStorage.getItem('cartitem'));
    this.locatemp = this.utils.cartitem
    if (!this.utils.cartitem) {
      this.utils.cartitem = []
    }


    var filtercartitem = this.utils.cartitem.filter(element => {

      return (element.servicecount > 0)
    });
    if (filtercartitem.length) {

      filtercartitem.forEach(element => {
        this.cartitemcounter = element.servicecount + this.cartitemcounter
      });
      window.localStorage.setItem('cartitem', JSON.stringify(filtercartitem))
      window.localStorage.setItem('cartitemcount', this.cartitemcounter);
    }





  }





  formatDate(date) {
    let d = new Date(date),
      day = '' + d.getDate(),
      month = '' + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }




}
