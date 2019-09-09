import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx'
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';

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
    private userService: UserService,
    private alertService: AlertServiceService,
    private push: Push
  ) {
    this.pushObject.on('registration')
      .subscribe((registration: any) => {
        // alert(registration.registrationId);
        this.registrationId = registration.registrationId;
      },
        err => {
          this.alertService.presentAlert('Error from push', err);
        });
    this.getUserDetails();
    this.getTicketStats();
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return await this.loading.present();
  }

  async ngOnInit() {
    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log(JSON.stringify(notification));
      // alert(JSON.stringify(notification.additionalData.id));
      if (notification.additionalData.type == 'discussion') {
        console.log('discussion');
        if (notification.additionalData.id) {
          console.log('discussion with id');
          this.router.navigateByUrl(`/building-management-notice-details?did=${notification.additionalData.id}`);
        } else {
          console.log('discussion without id');
          this.router.navigateByUrl(`/building-management-notice-board`);
        }
      } else if (notification.additionalData.type == 'ticket') {
        if (notification.additionalData.id) {
          this.router.navigateByUrl(`/building-management-ticket-details?tid=${notification.additionalData.id}`);
        } else {
          this.router.navigateByUrl('/building-management-tickets');
        }
      } else if (notification.additionalData.type == 'approval') {
        this.router.navigateByUrl(`/building-management-user-approval`);

      } else if (notification.additionalData.type == 'estimate') {
        this.router.navigateByUrl(`/building-management-ticket-details?eid=${notification.additionalData.id}`);
      }


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
          fcmToken: true
        };
        console.log('After', this.userDetails);

        this.pushNotifications();

        if (this.userDetails.firstName) {
          window.localStorage.setItem('firstName', this.userDetails.firstName)
        }

        if (this.userDetails.lastName) {
          window.localStorage.setItem('lastName', this.userDetails.lastName)
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
    await this.presentLoading();
    this.ticketService.getTicketStats()
      .subscribe((data: any) => {
        this.loading.dismiss();
        this.ticketStats = data;
        console.log(this.ticketStats);
      },
        err => {
          this.loading.dismiss();
          this.alertService.presentAlert('Alert', err.error.error);
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
}
