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
// import { RefundModalComponent } from '../../modals/refundmodal/refundmodal.component';
import { PopoverController } from 'ionic-angular';
import { PrivacyPolicyModalComponent } from '../../modals/privacypolicy/privacypolicy.component';
import { TermsModalComponent } from '../../modals/termsandcondition/termsandcondition.component';
import { NailaService } from '../../services/naila.service';
// import { Slides } from 'ionic-angular';

@Component({
  selector: 'app-nailabeauticianattendance',
  templateUrl: './nailabeauticianattendance.html',
  styleUrls: ['./nailabeauticianattendance.scss'],
})


export class NailabeauticianAttendance  {

  constructor(private nailaservice:NailaService,private alertController:AlertController,public modalController:ModalController) {

  }
  beauticianid
  ngOnInit() {
    this.beauticianid = window.localStorage.getItem('beautician_id');
  }




async presentAlert() {
  const alert = await this.alertController.create({
    
    subHeader: 'Whatsapp',
    message: 'You can contact Naila Support Team on 7624943335 number.',
    buttons: ['OK']
  });

  await alert.present();
}

// async openCreateRefundModal() {

//   let modal = await this.modalController.create({
//     component: RefundModalComponent,
//   })
//   return await modal.present();
// }




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

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  punchindata
  punchinid
  markAttendance(){
   const data={
    "beautician_id":this.beauticianid

  }
   
   
    this.nailaservice.markAttendance(data).subscribe(data=>{
      this.punchindata=data
      window.localStorage.setItem('punchin_id',this.punchindata.id)
      alert('Punch In successfully')
      
    })
  }
  updateAttendance(){
    const data={
      "beautician_id":this.beauticianid
  
    }
    this.punchinid=window.localStorage.getItem('punchin_id')
    this.nailaservice.updateAttendance(data,this.punchinid).subscribe(data=>{
      alert('Punch Out successfully')

    })
  }
}
