import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate /translate-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from '../../services/rentals-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user_id = window.localStorage.getItem('user_id');
  public token = window.localStorage.getItem('token');
  public data: any = {};
  constructor(
    private router: Router,
    private userService: RentalsUserService,
    private alertService: AlertServiceService,
    private loadingCtrl: LoadingController,
    public transService: translateService,
    private storage: Storage
  ) {
    this.getProfile(window.localStorage.getItem('user_id'));
  }

  ngOnInit() {
    console.log(this.user_id);
  }

  getProfile(id) {
    this.userService.getUserById(id).subscribe(data => {
      this.data = data;
      console.log(data);
    }, error => {
      this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        error.message.message);
    });
  }

  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: 'lines'
    }).then(loading => {
      loading.present();
    });
  }


  async logOut() {
    this.presentLoading();
    this.data.businessAppDevice = {};
    this.userService.updateUser(this.data).subscribe(() => {
      localStorage.clear();
      this.storage.clear()
      this.loadingCtrl.dismiss();
      this.router.navigateByUrl('/login');
    });
  }

}
