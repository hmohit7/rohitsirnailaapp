import { ApplicationPageModule } from '../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NailaBeauticianBookingPage } from './beauticianbooking';
// import { NailaBeauticianBookingPage } from './nailabooking';
// import { NailaBeauticianBookingPage } from './nailaofferslisting';


const routes: Routes = [
  {
    path: '',
    component: NailaBeauticianBookingPage
  }
];

@NgModule({
  entryComponents: [CreateNoticeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // BarcodeScanner
  ],
  declarations: [NailaBeauticianBookingPage]
})
export class NailaBeauticianBookingPageModule { }
