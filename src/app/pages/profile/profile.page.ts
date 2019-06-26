import { AlertServiceService } from 'src/app/services/alert-service.service';
import { UserService } from './../../services/user.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user_id = window.localStorage.getItem("userId");
  public token = window.localStorage.getItem("token");
  public data: any = {};
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertServiceService
  ) {
    this.getProfile(window.localStorage.getItem("userId"));
  }

  ngOnInit() {
    console.log(this.user_id);

  }

  getProfile(id) {
    this.userService.getUserById(id).subscribe(data => {
      this.data = data;
      console.log(data);
    }, error => {
      this.alertService.presentAlert('Alert', error);
    });
  }

  async logOut() {
    this.data.businessAppDevice = {};
    this.userService.updateUser(this.data).subscribe(() => {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    });
  }

}
