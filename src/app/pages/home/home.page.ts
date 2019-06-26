import { AlertServiceService } from './../../services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CreateNoticeComponent } from 'src/app/modals/create-notice/create-notice.component';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx'

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
        alert(registration.registrationId);
        console.log(registration.registrationId);
        this.registrationId = registration.registrationId;
      },
        err => {
          this.alertService.presentAlert("Error from push", err);
        });
    this.getUserDetails();
    this.getTicketStats();

  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
    });
    return await this.loading.present();
  }

  async ngOnInit() {
    // this.pushObject.on('notification').subscribe((notification: any) => {
    //   console.log(JSON.stringify(notification));
    //   // alert(JSON.stringify(notification.additionalData.id));
    //   if (notification.additionalData.type == 'discussion') {
    //     console.log('discussion');
    //     if (notification.additionalData.id) {
    //       console.log('discussion with id');
    //       this.router.navigateByUrl(`/notice-details?did=${notification.additionalData.id}`);
    //     }
    //     else {
    //       console.log('discussion without id');
    //       this.router.navigateByUrl(`/notice-board`);
    //     }
    //   }

    //   else if (notification.additionalData.type == 'ticket') {
    //     if (notification.additionalData.id) {
    //       this.router.navigateByUrl(`/ticket-details?tid=${notification.additionalData.id}`);
    //     }
    //     else {
    //       this.router.navigateByUrl('tickets');
    //     }
    //   }


    //   else if (notification.additionalData.type == 'approval') {
    //     // $state.go('app.approval')
    //     this.router.navigateByUrl(`/user-approval`);

    //   }

    //   else if (notification.additionalData.type == 'estimate') {
    //     this.router.navigateByUrl(`/ticket-details?eid=${notification.additionalData.id}`);
    //   }


    // },
    //   err => {
    //     alert(JSON.stringify(err))
    //   });
  }

  async openCreateNoticeModal() {

    let modal = await this.modalController.create({
      component: CreateNoticeComponent,
    })
    return await modal.present();
  }

  getUserDetails() {
    this.userService.getUserById(window.localStorage.getItem('userId'))
      .subscribe((data: any) => {
        this.userDetails = data;
        console.log(this.userDetails);
        this.userDetails.businessAppDevice = {
          id: '',
          pushToken: this.registrationId,
          fcmToken: true
        }
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
    this.router.navigateByUrl(path);
  }

  async getTicketStats() {
    await this.presentLoading();
    this.ticketService.getTicketStats()
      .subscribe((data: any) => {
        // console.log(this.loading);
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
        alert('success');
      }, err => {
        alert("Error")
        console.log(err);
      })
    }
  }
}
