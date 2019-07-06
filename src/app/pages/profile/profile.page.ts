import { AlertServiceService } from 'src/app/services/alert-service.service';
import { UserService } from './../../services/user.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userId = window.localStorage.getItem('userId');
  public token = window.localStorage.getItem('token');
  public data: any = {};
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertServiceService,
    private loadingCtrl: LoadingController
  ) {
    this.getProfile(window.localStorage.getItem('userId'));
  }

  ngOnInit() {
    console.log(this.userId);
  }

  getProfile(id) {
    this.userService.getUserById(id).subscribe(data => {
      this.data = data;
      console.log(data);
    }, error => {
      this.alertService.presentAlert('Alert', error);
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return await loading.present();
  }


  async logOut() {
    this.presentLoading();
    this.data.businessAppDevice = {};
    this.userService.updateUser(this.data).subscribe(() => {
      localStorage.clear();
      this.loadingCtrl.dismiss();
      this.router.navigateByUrl('/login');
    });
  }

}
