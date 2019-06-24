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

  pustObject: PushObject;
  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private userService: UserService,
    private alertService: AlertServiceService,
    private push: Push
  ) {

  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
    });
    return await this.loading.present();
  }

  async ngOnInit() {
    this.getUserDetails();
    this.getTicketStats();
    console.log("done");
    // await this.pushNotifications();
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
        console.log(data);
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
    console.log('pushNotification');

    this.pushObject.on('registration')
      .subscribe((registration: any) => {
        alert(registration.registrationId);
        this.userDetails.businessAppDevice = {
          id: registration.registrationId,
          pushToken: localStorage.getItem('token'),
          fcmToken: true
        }
        console.log(this.userDetails);
        this.userService.updateUser(this.userDetails).subscribe((data) => {
          console.log(data);
          alert('success');
        }, err => {
          alert("Error")
          console.log(err);
        })
      },
        err => {
          this.alertService.presentAlert("Error from push", err);
        });
  }
}
