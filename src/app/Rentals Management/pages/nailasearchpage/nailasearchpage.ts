import { Component, OnInit, HostListener } from '@angular/core';
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
import { Slides } from 'ionic-angular';
import { NailaService } from '../../services/naila.service';
import { Utils } from '../../services/utils.service';

@Component({
  selector: 'app-nailasearchpage',
  templateUrl: './nailasearchpage.html',
  styleUrls: ['./nailasearchpage.scss'],
})

export class NailasearchPage {
  categories: any;
  sliderConfig = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    // centeredSlides: true
  };

  sliderConfig2 = {
    slidesPerView: 3.2,
    spaceBetween: -50,
    // centeredSlides: true
  };
  public searchTerm: string = "";
  public items: any;

  constructor(private nailaService: NailaService, public utils: Utils, private router: Router) {


  }
  listofBanner;
  apartmentList: any;
  ngOnInit() {


    this.nailaService.apartmentList().subscribe(data => {
      this.apartmentList = data
      this.items = data
      // console.log(this.apartmentList)
    })
    this.browseBycategory()
    this.nailaService.listBanners().subscribe(data => {
      this.listofBanner = data
    })

  }

  ionViewWillEnter() {
    debugger
    if (window.localStorage.getItem('cartitemcount')) {

      this.utils.cartdata = window.localStorage.getItem('cartitemcount')
    } else {
      this.utils.cartdata = [];
    }

    if (this.utils.bookingdata) {
      alert(this.utils.bookingdata)
      this.nailaService.createBooking(this.utils.bookingdata).subscribe(data => {
      })
    }
  }
  browseBycategory() {
    debugger
    this.nailaService.browseBycategory().subscribe(data => {
      console.log(data)
      this.categories = data;
      this.selectedCategory(data[0])
    })
  }

  cardName
  categoryList: any;
  selectedCategory(data) {
    this.cardName = data.name
    const list = []
    this.nailaService.selectedCategory(data.id).subscribe(data => {
      console.log("selected", data);
      this.categoryList = data
      this.filterserviceData(data)

    })
  }

  serviceList = [];
  showSubheading = false;
  filterserviceData(data) {
    this.characters = [];
    this.serviceList = [];
    this.showSubheading = false;
    if (data.length && data[0].sub_category_id && data[0].sub_category) {

      data.forEach(element => {
        if (element.sub_category && element.category_id == element.sub_category.category_id) {

          this.serviceList.push({
            data: element,
            name: element.sub_category.name
          })



          this.showSubheading = true

        }
      });


      const result = this.serviceList.reduce((h, { data, name }) => {
        return Object.assign(h, { [name]: (h[name] || []).concat({ data, name }) })
      }, {})

      const results = Object.keys(result);

      // var characters = [ ];

      for (var prop in result) {
        if (result.hasOwnProperty(prop)) {
          this.characters.push({
            name: prop,
            data: result[prop]
          });
        }
      }


      this.serviceList = [];
      this.serviceList.push(this.characters);
    }
    else {
      this.characters = [];
      data.forEach(element => {
        this.characters.push({
          name: '',
          data: [element]
        })
      });


      // this.characters=data
      // console.log("elseeeeeepart",this.serviceList)
      console.log("=========================change", this.characters, "================================");
      this.showSubheading = false

    }

  }



  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }


  a = false;
  setFilteredItems() {
    this.items = this.apartmentList;
    this.items = this.filterItems(this.searchTerm);
  }


  selectedApartment(item) {
    this.searchTerm = item.name
    window.localStorage.setItem('apartment_name', item.name)
    window.localStorage.setItem('apartment_id', item.id)
  }


  onOuterClick(e) {

    if (e.target.classList.contains('ioncontent')) {
      console.log('ioncontent')
      this.a = false;
    }
    else if (e.target.classList.contains('searchbar-input')) {
      console.log('ionsearch')

      this.a = true;

    }
    else if (e.target.classList.contains('item') && e.target.classList.contains('in-list')) {
      console.log('list')
      this.a = false;
    }
  }
  // listofservices
  setDetailsofservice(data) {

    debugger
    if (data.data) {

      this.utils.storage = data.data
    } else {
      this.utils.storage = data

    }

    this.router.navigateByUrl('/rentals-naila-service-page')

  }
  characters = [];

  // ionViewWillUnload(){
  //   if (window.localStorage.getItem('cartitemcount')) {

  //     this.utils.cartdata = window.localStorage.getItem('cartitemcount')
  //   } else {
  //     this.utils.cartdata = [];
  //   }
  // }
}
