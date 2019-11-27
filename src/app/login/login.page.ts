import { Component, OnInit } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController,
  AlertController,
  MenuController,
} from '@ionic/angular';
import { Storage } from "@ionic/storage";
import * as _ from 'lodash';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { CountrycodemodalComponent } from './countrycodemodal/countrycodemodal.component';
import { LoginService } from '../common-services/login.service';
import { AlertServiceService } from '../common-services/alert-service.service';
import { translateService } from '../common-services/translate /translate-service.service';
import { StorageService } from '../common-services/storage-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {



  public display: string = "login";
  public appSrc: string;
  public disp = {};
  public user: string;
  public otpSource: string;
  public otpData: any = {};
  public loginData: any = {
    countryCode: '+91'
  }
  public sendotp: any = {
    countryCode: '+91'
  };
  public passwordData: any = {};
  public allowedUsers = ['employee', 'admin', 'technician', 'housekeeper'];
  constructor
    (
      private _navCtrl: NavController,
      private _storage: Storage,
      private _loginservice: LoginService,
      private _modalCtr: ModalController,
      private _alertService: AlertServiceService,
      private _lodingCtrl: LoadingController,
      private alertCtrl: AlertController,
      private appSetting: MainAppSetting,
      private menuCtrl: MenuController,
      public transService: translateService,
      private storageService: StorageService
    ) {

  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false)

  }
  ionViewDidLeave() {
    this.menuCtrl.enable(true)
  }

  //display laoding on screen 

  async presentLoading() {
    await this._lodingCtrl.create({
      message: 'Please wait',
      spinner: "lines",
      showBackdrop: true,
    }).then(loading => {
      loading.present();

    });

  }


  // This function will check for user's platform based on his phone number

  checkPlatform() {
    window.localStorage.removeItem('platform');
    this._storage.remove('platform')
    if (!this.verifyPhone()) {
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        this.transService.getTranslatedData('login.valid-phone-number-error'));
    } else {

      localStorage.setItem('phoneNumber', this.loginData.phoneNumber);
      this._alertService.saveToLocalStorage("phoneNumber", this.loginData.phoneNumber)

      localStorage.setItem('countryCode', this.loginData.countryCode);
      this._alertService.saveToLocalStorage("countryCode", this.loginData.countryCode)

      this.presentLoading();

      if (this.appSetting.userExistence == "Both") {
        this._loginservice.checkPlatform(this.loginData)
          .subscribe((data: any) => {
            console.log(data);
            this._lodingCtrl.dismiss();
            if (data.type === 'multi') {
              this.showProductSelectionPopup(data);
            } else if (data.type === 'bm') {
              this.handleUser(data, 'bm');
            } else if (data.type === 'rm') {
              this.handleUser(data, 'rm');
            }

          }, err => {
            this._lodingCtrl.dismiss();
            this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error);
          });
      } else {
        this.verifyPhoneService()
      }

    }
  }


  // If user is found on multiple platforms this function will display a popup to select between platforms

  async showProductSelectionPopup(data) {
    const showalert = await this.alertCtrl.create({
      header: this.transService.getTranslatedData('login.multi-platform.title'),
      cssClass: 'platform-popup',
      buttons: [
        {
          cssClass: 'platform-button',
          text: this.transService.getTranslatedData('login.multi-platform.title'),
          handler: () => {
            const bmData = {
              type: 'bm',
              bm: data.bm
            }
            this.handleUser(bmData, 'bm');
          }
        }, {
          cssClass: 'platform-button',
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
          text: this.transService.getTranslatedData('login.multi-platform.cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }
      ]
    });

    await showalert.present();
  }


  // Check id user is allowed to use this app

  handleUser(data, type) {
    window.localStorage.setItem('platform', type);
    this._alertService.saveToLocalStorage('platform', type)
    this.appSetting.setPlatformAfterLogin(type)

    window.localStorage.setItem('types', data[type].types);
    this._alertService.saveToLocalStorage('types', data[type].types)
    if (type === 'bm') {
      window.localStorage.setItem('appSrc', 'building-management');
      this._alertService.saveToLocalStorage('appSrc', 'building-management');
    } else {
      window.localStorage.setItem('appSrc', 'rentals');
      this._alertService.saveToLocalStorage('appSrc', 'rentals')
    }
    if (this.isUserAllowed(data[type].types)) {
      if (data[type].action === 'login') {
        this.display = 'password';
      } else {
        this.display = 'otp';
      }
    } else {
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        this.transService.getTranslatedData('login.user-not-allowed-error'));
    }
  }

  // thios method will check if user is alloued to use this app or not 

  isUserAllowed(types) {
    // alert((_.intersection(this.allowedUsers, types).length > 0 ? true : false));
    return (_.intersection(this.allowedUsers, types).length > 0 ? true : false);
  }



  // open country code modal

  async countryCodeModal() {
    const modal = await this._modalCtr.create({
      component: CountrycodemodalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: { 'value': this.loginData.countryCode },
      backdropDismiss: false
    })
    modal.onDidDismiss().then((data) => {

      this.loginData.countryCode = data.data;
      this.sendotp.countryCode = data.data;
      console.log(data.data);

    })
    return await modal.present();
  }


  /**Verify Phone Function */

  verifyPhone() {
    let phoneno = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

    if (this.loginData.phoneNumber) {
      // this._alertService.saveToLocalStorage("phoneNumber", this.loginData.phoneNumber)
      // this._alertService.saveToLocalStorage("countryCode", this.loginData.countryCode)

      if (this.loginData.countryCode === "+91") {
        return this.loginData.phoneNumber.match(phoneno) ? true : false;
      }
      else {
        return this.loginData.phoneNumber.length > 4 ? true : false;
      }
    }
    else {
      return false
    }

  }


  /**Verifying Phone And Calling verifyPhone Service */

  verifyPhoneService() {

    if (this.verifyPhone()) {

      this._loginservice.varifyPhone(this.loginData).subscribe(
        async (data) => {
          console.log(data);
          if (this.isUserAllowed(data.types)) {
            await this._lodingCtrl.dismiss();
            if (data.action == 'login') {
              console.log("-------------------");
              console.log(data.types)
              this.display = "password"
            } else {
              this.display = "otp";
            }
          } else {
            await this._lodingCtrl.dismiss();
            this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
              this.transService.getTranslatedData('login.user-not-allowed-error'))
          }

        }, async (error) => {
          await this._lodingCtrl.dismiss();
          this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
            this.transService.getTranslatedData('login.user-not-allowed-error'));
          console.log(error);

          // this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), error.error.error);

        })
    }
  }


  // Login User on success route to root page 

  loginUser(loginType) {

    this.loginData.loginType = loginType;
    this.loginData.phoneNumber = this.loginData.phoneNumber;
    this.presentLoading();
    // alert(JSON.stringify(this.loginData))
    this._loginservice.login(this.loginData).subscribe(async (data) => {
      if (data.message == "Done") {


        window.localStorage.setItem('isLoggedin', "true");
        await this._alertService.saveToLocalStorage("isLoggedin", true);

        window.localStorage.setItem("user_id", data.uid);
        await this._alertService.saveToLocalStorage("user_id", data.uid);

        window.localStorage.setItem('token', data.token);
        await this._alertService.saveToLocalStorage("token", data.token);
        await this.appSetting.setTokenAferLogin(data.token);

        window.localStorage.setItem("currencyCode", data.currencyCode);
        await this._alertService.saveToLocalStorage("currencyCode", data.currencyCode);

        await this._lodingCtrl.dismiss()
        await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
          this.appSrc = val;
        })
        await this._navCtrl.navigateRoot(`/${this.appSrc}-home`);

      } else {
        this._lodingCtrl.dismiss();
        this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          data.error);
      }



    }, (error) => {

      this._lodingCtrl.dismiss();
      console.log(error);
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        error.error.error);

    })
  }


  /** OtresetPassword(p Number varification code */

  sendOtp() {

    let phoneno = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

    if (this.sendotp.phoneNumber) {
      this._alertService.saveToLocalStorage("phoneNumber", this.sendotp.phoneNumber)
      this._alertService.saveToLocalStorage("countryCode", this.sendotp.countryCode)
      if (this.sendotp.countryCode === "+91") {
        if (this.sendotp.phoneNumber.match(phoneno)) {
          this.presentLoading();
          return true;
        } else {
          this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), this.transService.getTranslatedData('login.valid-phone-number-error'));
        }
      } else {
        if (this.sendotp.phoneNumber.length > 4) {
          this.presentLoading();
          return true;
        } else {
          this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), this.transService.getTranslatedData('login.valid-phone-number-error'));
        }
      }
    } else {
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), this.transService.getTranslatedData('login.enter-phone-number'));
    }
  }


  // this method will send otp on users phoneNumber

  sendOtpService(type) {

    if (this.sendOtp()) {

      this.display = "otp";
      this._loginservice.sendOtp(this.sendotp).subscribe((data) => {
        this._lodingCtrl.dismiss();
        if (data.message == "OTP sent") {
          type == 'approve' ? this.display = "approvalotp" : this.display = "forgototp";
        } else {
          this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), data.error);
        }

      }, (error) => {

        this._lodingCtrl.dismiss();
        console.log(error);
        this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          this.transService.getTranslatedData('error-alert'))
        console.log(error.error.error);

      })
    }

  }


  // this method will verify the otp user enterd

  varifyOtp(source) {
    // console.log("surce ", source); 
    if (source) {
      if (source == 'forgot') {
        this.otpSource = "forgot";
      }
    }
    this.otpData.phoneNumber = this.loginData.phoneNumber;
    this.presentLoading();
    this._loginservice.verifyOtp(this.otpData).subscribe(async (data) => {
      console.log("data after service =>", data);
      this._lodingCtrl.dismiss()
      if (data.message == 'OTP found') {
        console.log("After otp found", source);
        if (source == 'forgot' || source == 'login') {
          this.display = "setPassword"
        } else if (source == 'approve') {
          await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
            this.appSrc = val;
          })
          this._navCtrl.navigateRoot(`/${this.appSrc}-home`)
        }
      } else {
        this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), data.error);
      }
    }, (error) => {

      this._lodingCtrl.dismiss();
      console.log(error);
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        this.transService.getTranslatedData('error-alert'));

    });
  }


  // reset user password

  resetPassword(loginType) {

    console.log(loginType, "in reset password(loginType)");

    console.log(this.loginData);

    this.loginData.loginType = loginType;//loginType
    this.loginData.action = "resetPassword";
    this.loginData.countryCode = '+91';
    this._storage.get('phoneNumber').then((data) => {
      this.loginData.phoneNumber = data

      this.presentLoading();
      this._loginservice.reserPassword(this.loginData).subscribe(async (data) => {
        console.log("Data on comfirm reset password");
        this._lodingCtrl.dismiss();
        if (data.message == "Done") {

          this._alertService.saveToLocalStorage("isLoggedin", true);
          window.localStorage.setItem('isLoggedin', 'true');

          this._alertService.saveToLocalStorage("user_id", data.uid)
          window.localStorage.setItem("user_id", data.uid);

          this._alertService.saveToLocalStorage("token", data.token);
          window.localStorage.setItem('token', data.token);

          this._alertService.saveToLocalStorage("currencyCode", data.currencyCode);
          window.localStorage.setItem("currencyCode", data.currencyCode);

          await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
            this.appSrc = val;
          })
          await this._navCtrl.navigateRoot(`/${this.appSrc}-home`);
        } else {

          this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'), data.data.error);
        }
      }, (error) => {

        this._lodingCtrl.dismiss();
        console.log(error);
        this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          this.transService.getTranslatedData('error-alert'))

      })
    })
  }


  // this method will call set password for user 

  passwordSet(source) {

    if (!this.passwordData.password || !this.passwordData.passwordCheck) {
      this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
        this.transService.getTranslatedData('login.password'));
    }
    else if (this.passwordData.password && this.passwordData.passwordCheck) {

      if (this.passwordData.password == this.passwordData.passwordCheck) {

        this.loginData.accessCode = this.otpData.accessCode;
        this.passwordData.loginType = 'login';
        this.loginData.password = this.passwordData.password;
        this.loginData.passwordCheck = this.passwordData.passwordCheck;
        this.passwordData.phoneNumber = this.loginData.phoneNumber;

        console.log(source, "from passworedSet(source)");

        source ? source == 'forgot' ? this.resetPassword('register')
          : this.loginUser('register') : this.loginUser('register');

      }
      else {
        this._alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          this.transService.getTranslatedData('login.password-mismatch'))
      }
    }


  }

}
