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
import { Utils } from '../../services/utils.service';
// import { Slides } from 'ionic-angular';

@Component({
  selector: 'app-nailaservicepage',
  templateUrl: './nailaservicepage.html',
  styleUrls: ['./nailaservicepage.scss'],
})

export class NailaservicePage  {
itemcounter:any;
restrictproductadd
  // sliderConfig = {
  //   slidesPerView: 1.2,
  //   spaceBetween: 5,
  //   // centeredSlides: true
  // };

  // sliderConfig2 = {
  //   slidesPerView: 3.2,
  //   spaceBetween: 5,
  //   // centeredSlides: true
  // };
  // public searchTerm: string = "";
  // public items: any;

  constructor(public utils:Utils,public router:Router) {
    // this.items = [
    //   { title: "one" },
    //   { title: "two" },
    //   { title: "three" },
    //   { title: "four" },
    //   { title: "five" },
    //   { title: "six" }
    // ];
    this.restrictproductadd=[]

    this.itemcounter=0
  }
  percentagediscount:any;
  ngOnInit() {
    // this.setFilteredItems();
    console.log(this.utils.storage)
    // this.addTocart(this.utils.storage)
    if(window.localStorage.getItem('cartitem')){
      this.restrictproductadd = JSON.parse( window.localStorage.getItem('cartitem'))
      this.restrictproductadd.forEach(element => {
        if(this.utils.storage.name===element.service.name){
          this.disablebutton=true;
          // this.router.navigateByUrl('/rentals-naila-search-page')
          // alert("Product already added")
        }
      });
    }

    

   this.percentagediscount= Math.trunc(this.percentage(this.utils.storage.offer_price,this.utils.storage.price) )

  }
percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
} 
//   setFilteredItems() {
//     this.items = this.filterItems(this.searchTerm);
//   }

//   filterItems(searchTerm) {
//     return this.items.filter(item => {
//       return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
//     });
//   }
// a=false;


itemCounter(plusminus){
if(plusminus=="plus" && this.itemcounter >= 0){
  this.itemcounter=this.itemcounter + 1
  
}else if(plusminus=="minus" && this.itemcounter > 0){
  this.itemcounter=this.itemcounter - 1;
}
}
disablebutton=false;
addTocart(data){

  

   
  

  
  this.utils.cartitem.push({
    'service':data,
    'servicecount': 1
  })
// alert('')
  // console.log(this.utils.cartitem);
  // this.utils.cartdata=0
  // this.utils.cartitem.forEach(element => {

    
    // });

    
    
this.utils.cartdata=this.utils.cartitem.length
window.localStorage.setItem('cartitem',JSON.stringify(this.utils.cartitem))
window.localStorage.setItem('cartitemcount',JSON.stringify(this.utils.cartitem.length))

// this.utils.cartdata= this.utils.cartdata.reduce((a, b) => a + b, 0) 


  
}


disabledButton(){
            alert("Product already added")

}

}
