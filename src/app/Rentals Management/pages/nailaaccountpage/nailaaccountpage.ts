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
import { RefundModalComponent } from '../../modals/refundmodal/refundmodal.component';
import { PopoverController } from 'ionic-angular';
import { PrivacyPolicyModalComponent } from '../../modals/privacypolicy/privacypolicy.component';
import { TermsModalComponent } from '../../modals/termsandcondition/termsandcondition.component';
// import { Slides } from 'ionic-angular';

@Component({
  selector: 'app-nailaaccountpage',
  templateUrl: './nailaaccountpage.html',
  styleUrls: ['./nailaaccountpage.scss'],
})


export class NailaAccountPage  {

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

  constructor(private alertController:AlertController,public refundmodal: RefundModalComponent,public modalController:ModalController) {
    // this.items = [
    //   { title: "one" },
    //   { title: "two" },
    //   { title: "three" },
    //   { title: "four" },
    //   { title: "five" },
    //   { title: "six" }
    // ];
  }

  ngOnInit() {
    // this.setFilteredItems();
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


async presentAlert() {
  const alert = await this.alertController.create({
    
    subHeader: 'Whatsapp',
    message: 'You can contact Naila Support Team on 7624943335 number.',
    buttons: ['OK']
  });

  await alert.present();
}

// async presentRefudAlert() {
//   const alert = await this.alertController.create({
//     cssClass: 'custom-refund-alert',
//     message: 'You can contact Naila Support Team on 7624943335 number.',
//     buttons: ['OK']
//   });

//   await alert.present();
// }

async openCreateRefundModal() {

  let modal = await this.modalController.create({
    component: RefundModalComponent,
  })
  return await modal.present();
}




async openPrivacyPolicyModal() {

  let modal = await this.modalController.create({
    component: PrivacyPolicyModalComponent,
  })
  return await modal.present();
}

async TandCModal() {

  let modal = await this.modalController.create({
    component: TermsModalComponent,
  })
  return await modal.present();
}
  // popOver.onDidDismiss().then(data => {
  //   // if (data.data) {
  //   //   if (data.data.val == 'approve') {
  //   //     // this.approvalUser(id)
  //   //   } else if (data.data.val == 'reject') {
  //   //     // this.rejectUser(id, data.data.notes)
  //   //   }
  //   // }
  // })
  // return await popOver.present()


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
