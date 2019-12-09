import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx'
import * as moment from 'moment';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate /translate-service.service';
import { Storage } from '@ionic/storage';
import { BuildingUserService } from '../../services/building-user.service';
import { Device } from '@ionic-native/device/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: any;
  ticketStats: any;

  loading: any = this.loadingCtrl.create({
  });

  options: PushOptions = {
    android: {},
    ios: {
    },
  }

  pushObject: PushObject = this.push.init(this.options);

  registrationId: string;

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private userService: BuildingUserService,
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
        // alert(registration.registrationId);
        this.registrationId = registration.registrationId;
      },
        err => {
          // this.alertService.presentAlert('Error from push', err);
        });
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return await this.loading.present();
  }

  async ngOnInit() {
    this.getUserDetails();
    this.getTicketStats();
    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log(JSON.stringify(notification));
      // alert(JSON.stringify(notification.additionalData.id));
      if (notification.additionalData.type == 'discussion') {
        this.presentAlert(`${notification.title} ${notification.message}`)
        console.log('discussion');
        if (notification.additionalData.id) {
          console.log('discussion with id');
          // this._navCtrl.navigateForward(`/building-management-notice-details`, {
          //   queryParams: {
          //     did: notification.additionalData.id
          //   }
          // });
        } else {
          console.log('discussion without id');
          // this._navCtrl.navigateForward(`/building-management-notice-board`);
        }
      } else if (notification.additionalData.type == 'ticket') {
        this.presentAlert(notification.title)
        if (notification.additionalData.id) {
          // this._navCtrl.navigateForward(`/building-management-ticket-details`, {
          //   queryParams: {
          //     ticketId: notification.additionalData.id
          //   }
          // });
        } else {
          // this._navCtrl.navigateForward('/building-management-tickets');
        }
      }
      // else if (notification.additionalData.type == 'approval') {
      //   this.router.navigateByUrl(`/building-management-user-approval`);

      // } else if (notification.additionalData.type == 'estimate') {
      //   this.router.navigateByUrl(`/building-management-ticket-details?eid=${notification.additionalData.id}`);
      // }


    },
      err => {
        // alert(JSON.stringify(err))
      });
  }

  async openCreateNoticeModal() {

    let modal = await this.modalController.create({
      component: CreateNoticeComponent,
    })
    return await modal.present();
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
          this.storage.set('firstName', this.userDetails.firstName)

        }

        if (this.userDetails.lastName) {
          window.localStorage.setItem('lastName', this.userDetails.lastName)
          this.storage.set('lastName', this.userDetails.lastName)
        }
      },
        err => {
          console.log('error getting user details');
        }
      );


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


  navigate(path) {
    this.router.navigateByUrl(`/${window.localStorage.getItem('appSrc')}-${path}`);
  }

  async getTicketStats() {
    await this.presentLoading();
    this.ticketService.getTicketStats()
      .subscribe((data: any) => {
        this.loading.dismiss();
        this.ticketStats = data;
        console.log(this.ticketStats);
      },
        err => {
          this.loading.dismiss();
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

  async openScanner() {
    // Scann QR Code.'
    this.barcodeScanner.scan().then(async (barcodeData) => {
      const { text } = barcodeData;
      if (!text) {
        this.loadingCtrl.dismiss();
        this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), 'Invalid barcode');
      }
      await this.presentLoading();
      this.ticketService.searchAssert(text)
        .subscribe(async (data: any) => {
          this.loadingCtrl.dismiss();
          await this.alertCtrl.create({
            header: data.name,
            message: `
            <b>AssertId:-</b>${data.assetId || 'N/A'}<br/>

            <b>Category:-</b> ${data.category || 'N/A'}<br/>
            
            <b>Location:-</b> ${data.location || 'N/A'}<br/>
            
            <b>Floor:-</b> ${data.floor || 'N/A'}<br/>
            
            <b>Description:-</b> ${data.description || 'N/A'}`,
            buttons: [
              {
                text: 'Scan Again',
                role: 'cancel',
                handler: () => {
                  this.openScanner()
                }
              },
              {
                text: 'Confirm',
                role: 'ok',
                handler: () => {
                  this.router.navigate([`${window.localStorage.getItem('appSrc')}-tickets`],{
                    queryParams: {
                      id: data._id,
                      name: data.assetId
                    }
                  })
                }
              }]
          }).then(alert => {
            alert.present()
          })
          
          console.log(data);
        },
          err => {
            this.loadingCtrl.dismiss();
            this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error.error);
          }
        );
    })
  }

}
