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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: any;
  ticketStats: any;
  public loading: boolean = true;


  options: PushOptions = {
    android: {},
    ios: {
    },
  }

  pushObject: PushObject = this.push.init(this.options);

  registrationId: string;

  constructor(
    private ticketService: TicketService,
    // private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private userService: RentalsUserService,
    private alertService: AlertServiceService,
    private push: Push,
    public transService: translateService,
    private storage: Storage,
    private device: Device,
    private alertCtrl: AlertController,
    private _navCtrl: NavController
  ) {
    this.pushObject.on('registration')
      .subscribe((registration: any) => {

        this.registrationId = registration.registrationId;
      },
        err => {
          // this.alertService.presentAlert('Error from push', err);
        });

    this.pushObject.on('notification').subscribe((notification: any) => {
      this.loading = false;
      console.log(JSON.stringify(notification));
      // alert(JSON.stringify(notification.additionalData.id));
      if (notification.additionalData.type == 'discussion') {
        this.presentAlert(`${notification.title} ${notification.message}`)
        console.log('discussion');
        if (notification.additionalData.id) {
          console.log('discussion with id');
          this._navCtrl.navigateForward(`/rentals-notice-details`, {
            queryParams: {
              did: notification.additionalData.id
            }
          });
        } else {
          console.log('discussion without id');
          this._navCtrl.navigateForward(`/rentals-notice-board`);
        }
      } else if (notification.additionalData.type == 'ticket') {
        this.presentAlert(notification.title)
        if (notification.additionalData.id) {
          this._navCtrl.navigateForward(`/rentals-ticket-details`, {
            queryParams: {
              ticketId: notification.additionalData.id
            }
          });
        } else {
          this._navCtrl.navigateForward('/rentals-tickets');
        }
      }
      // else if (notification.additionalData.type == 'approval') {
      //   this.router.navigateByUrl(`/rentals-user-approval`);

      // } else if (notification.additionalData.type == 'estimate') {
      //   this.router.navigateByUrl(`/rentals-ticket-details?eid=${notification.additionalData.id}`);
      // }

    },
      err => {
        // alert(JSON.stringify(err))
      });

  }


  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: 'crescent'
    }).then(loading => {
      loading.present();

    });
  }

  ionViewDidEnter() {
      this.loading == true ?  this.presentLoading() : '';
      this.getTicketStats();
  }

  async ngOnInit() {



    this.getUserDetails();
  }

  async openCreateNoticeModal() {

    let modal = await this.modalController.create({
      component: CreateNoticeComponent,
    })
    return await modal.present();
  }

  async presentAlert(header: string) {
    await this.alertCtrl.create({
      header: header,
      // message: message,
      cssClass: 'notifivation-alert',
      buttons: [{
        text: 'OK',
        cssClass: 'width-100-percent alert-button-inner.sc-ion-alert-md',
      }]
    }).then(alert => {
      alert.present()
    })
  }

  getRoundedTime() {
    const d = new Date();
    // alert(d)
    const ratio = d.getMinutes() / 60;
    // alert(ratio)
    // Past 30 min mark, return epoch at +1 hours and 0 minutes
    if (ratio > 0.5) {
      // alert((d.getHours() + 1) * 3600)
      return (d.getHours() + 1) * 3600;
    }
    // Return epoch at 30 minutes past current hour
    // alert((d.getHours() * 3600) + 1800)
    return (d.getHours() * 3600) + 1800;
  }

  getUserDetails() {
    this.userService.getUserById(window.localStorage.getItem('user_id'))
      .subscribe((data: any) => {
        this.userDetails = data;
        console.log(this.userDetails);

        this.userDetails.businessAppDevice = {
          id: '',
          pushToken: this.registrationId,
          fcmToken: true,
          deviceId: this.device.uuid,
          platform: this.device.platform ? this.device.platform.toLowerCase() : '',
          newApp: true
        };
        console.log('After', this.userDetails);

        this.pushNotifications();

        if (this.userDetails.firstName) {
          window.localStorage.setItem('firstName', this.userDetails.firstName)
          this.storage.set('firstName', this.userDetails.firstName);

        }

        if (this.userDetails.lastName) {
          window.localStorage.setItem('lastName', this.userDetails.lastName)
          this.storage.set('lastName', this.userDetails.lastName);
        }
      },
        err => {
          console.log('error getting user details');
        }
      );


  }

  navigate(path) {
    this.router.navigateByUrl(`/${window.localStorage.getItem('appSrc')}-${path}`);
  }

  async getTicketStats() {

    this.ticketService.getTicketStats()
      .subscribe((data: any) => {
        this.loading == true ? this.loadingCtrl.dismiss() : '';
        this.loading = false
        this.ticketStats = data;
        console.log(this.ticketStats);
      },
        err => {
          this.loading == true ? this.loadingCtrl.dismiss() : '';
          this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error.error);
        }
      );
  }

  pushNotifications() {
    if (this.registrationId) {
      this.userService.updateUser(this.userDetails).subscribe((data) => {
        // console.log(data);
        // alert('success');
      }, err => {
        // alert('Error')
        console.log(err);
      });
    }
  }

  // async openScanner() {
  //   // Scann QR Code.'
  //   this.barcodeScanner.scan().then(async (barcodeData) => {
  //     const { text } = barcodeData;
  //     if (!text) {
  //       this.loading == true ? this.loadingCtrl.dismiss() : '';
  //       this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), 'Invalid barcode');
  //     }
  //     this.loading == true ? await this.presentLoading() : '';
  //     this.ticketService.searchAssert(text)
  //       .subscribe(async (data: any) => {
  //         this.loading == true ? this.loadingCtrl.dismiss() : '';
  //         await this.alertCtrl.create({
  //           header: data.name,
  //           message: `
  //           <b>AssertId:-</b>${data.assetId}<br/>

  //           <b>Category:-</b> ${data.category}<br/>
            
  //           <b>Location:-</b> ${data.location}<br/>
            
  //           <b>Floor:-</b> ${data.floor}<br/>
            
  //           <b>Description:-</b> ${data.description}`,
  //           buttons: [
  //             {
  //               text: 'Scan Again',
  //               role: 'cancel',
  //               handler: () => {
  //                 this.openScanner()
  //               }
  //             },
  //             {
  //               text: 'Confirm',
  //               role: 'ok',
  //               handler: () => {
  //                 this.router.navigate([`${window.localStorage.getItem('appSrc')}-tickets`], {
  //                   queryParams: {
  //                     id: text,
  //                     name: data.assetId
  //                   }
  //                 })
  //               }
  //             }]
  //         }).then(alert => {
  //           alert.present()
  //         })

  //       },
  //         err => {
  //           this.loading == true ? this.loadingCtrl.dismiss() : '';
  //           this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error.error);
  //         }
  //       );
  //   })
  // }
}
