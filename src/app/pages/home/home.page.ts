import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private userService: UserService
  ) {
    this.getUserDetails();
    this.getTicketStats();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
    });
    return await this.loading.present();
  }

  ngOnInit() {

  }

  getUserDetails() {
    this.userService.getUserById(window.localStorage.getItem('userId'))
      .subscribe((data: any) => {
        this.userDetails = data;

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
        console.log(this.loading);
        this.loading.dismiss();
        this.ticketStats = data;
        console.log(this.ticketStats);
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

}
