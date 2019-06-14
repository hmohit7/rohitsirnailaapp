import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  ticketStats: any;
  loading: any = this.loadingCtrl.create({
  });

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController
  ) {
    this.getTicketStats();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
    });
    return await this.loading.present();
  }

  ngOnInit() {

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
