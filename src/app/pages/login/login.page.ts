import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CountryCodeModalComponent } from 'src/app/modals/country-code-modal/country-code-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // To store the form data
  loginData: any = {
    countryCode: '+91',
    loginType: 'login'
  };

  // To display error message when both the password is not correct while setting password
  passwordMismatch = false;

  /* This variable will decide which input block is visible on screen
  values are ['phoneInput', 'passwordInput', 'otpInput', 'passwordSetInput', 'sendOtpInput']
  */
  visibleBlock = 'phoneInput';

  // Only these user types are allowd to use this app
  allowedUsers = ['employee', 'admin', 'technician', 'housekeeper'];

  constructor(
    private loginService: LoginService,
    private loading: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  async countryCodeModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeModalComponent,
      componentProps: { 'value': this.loginData.countryCode }
    });
    modal.onDidDismiss().then((data) => {
      this.loginData.countryCode = data.data
    })
    return await modal.present();
  }

  setVisibleBlock(type) {
    this.visibleBlock = type;

    if (type === 'sendOtpInput') {
      this.loginData.action = 'resetPassword';
    }

    console.log(this.visibleBlock);
  }

  // If user is found on multiple platforms this function will display a popup to select between platforms

  async showProdutSelectionPopup(data) {

    const alert = await this.alertController.create({
      header: 'Select a platform',
      cssClass: '',
      buttons: [
        {
          cssClass: 'buidlingmanagement',
          text: 'Building Management',
          handler: () => {
            const bmData = {
              type: 'bm',
              bm: data.bm
            }
            this.handleUser(bmData, 'bm');
          }
        }, {
          text: 'Rental Management',
          handler: () => {
            const bmData = {
              type: 'rm',
              rm: data.rm
            }
            this.handleUser(bmData, 'rm');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }
      ]
    });

    await alert.present();

  }

  // This function will display loading screen

  async presentLoading() {
    const loading = await this.loading.create({
    });
    await loading.present();
  }

  // Common function to set values to localstorage

  saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  // Check id user is allowed to use this app

  isUserAllowed(types) {

    return (_.intersection(this.allowedUsers, types).length > 0 ? true : false);

  }

  validatePassword() {
    if ((this.loginData.password && this.loginData.passwordCheck) && this.loginData.password !== this.loginData.passwordCheck) {
      this.passwordMismatch = true;
    } else {
      this.passwordMismatch = false;
    }
  }

  validetPhoneNumber() {

    const phoneno = /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;

    if (this.loginData.phoneNumber) {

      // localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      // localStorage.setItem('countryCode', this.loginData.countryCode);

      if (this.loginData.countryCode === '+91') {

        return this.loginData.phoneNumber.match(phoneno) ? true : false;

      } else {

        return this.loginData.phoneNumber.length > 4 ? true : false;

      }
    } else {
      return false;
    }
  }

  handleUser(data, type) {

    localStorage.setItem('platform', type);
    localStorage.setItem('types', data[type].types);

    if (this.isUserAllowed(data[type].types)) {
      if (data[type].action === 'login') {
        this.visibleBlock = 'passwordInput';
      } else {
        this.visibleBlock = 'otpInput';
      }
    } else {
      alert('You are not allowed to use this app');
    }
  }

  // This function will check for user's platform based on his phone number

  checkPlatfrom() {

    window.localStorage.removeItem('platform');

    if (!this.validetPhoneNumber()) {
      alert('Please enter a valid phone number');
    } else {

      localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      localStorage.setItem('countryCode', this.loginData.countryCode);

      this.presentLoading();

      this.loginService.checkPlatform(this.loginData)
        .subscribe((data: any) => {

          this.loading.dismiss();

          if (data.type === 'multi') {
            this.showProdutSelectionPopup(data);
          } else if (data.type === 'bm') {
            this.handleUser(data, 'bm');
          } else if (data.type === 'rm') {
            this.handleUser(data, 'rm');
          }

        }, err => {
          this.loading.dismiss();
          alert(err.error);
        });
    }

  }

  login() {
    this.presentLoading();
    this.loginService.login(this.loginData)
      .subscribe((data: any) => {

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.uid);
        localStorage.setItem('currencyCode', data.currencyCode);
        localStorage.setItem('token', data.token);
        this.loading.dismiss();

        this.router.navigateByUrl('/home');
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  verifyOtp() {
    this.presentLoading();
    this.loginService.verifyOtp(this.loginData)
      .subscribe((data: any) => {
        this.loading.dismiss();
        this.loginData.loginType = 'register';
        this.visibleBlock = 'passwordSetInput';
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  sendOtp() {
    if (!this.validetPhoneNumber()) {
      alert('Please enter a valid phone number');
    } else {
      localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      localStorage.setItem('countryCode', this.loginData.countryCode);
      this.presentLoading();
      this.loginService.sendOtp(this.loginData)
        .subscribe((data: any) => {
          this.loading.dismiss();
          // this.loginData.loginType = 'register';
          this.visibleBlock = 'otpInput';
        },
          err => {
            this.loading.dismiss();
            alert(err.error.error);
          }
        );
    }
  }

  resetPassword() {
    this.presentLoading();
    this.loginService.reserPassword(this.loginData)
      .subscribe((data: any) => {

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.uid);
        localStorage.setItem('currencyCode', data.currencyCode);
        localStorage.setItem('token', data.token);

        this.loading.dismiss();

        this.router.navigateByUrl('/home');
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

}
