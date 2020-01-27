import { Component } from '@angular/core';

import { Platform, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './common-services/storage-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from './Rentals Management/services/rentals-user.service';
import { AlertServiceService } from './common-services/alert-service.service';
import { BuildingUserService } from './Building-Management/services/building-user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = {
    name: '',
    phoneNumber: localStorage.getItem('phoneNumber'),
    pages: [
      {
        title: 'app-component.home',
        url: `-home`,
        src: '/assets/icon/my-home.png'
      }, {
        title: 'app-component.calendar',
        url: `-calendar`,
        src: '/assets/icon/calendar.png'
      }, {
        title: 'app-component.ticket',
        url: `-tickets`,
        src: '/assets/icon/ticket-history.png'
      }, {
        title: 'app-component.discussion',
        url: `-notice-board`,
        src: '/assets/icon/communications.png'
      },
      {
        title: 'app-component.approval',
        url: `-user-approval`,
        src: '/assets/icon/approval.png'
      },
      {
        title: 'app-component.contact-us',
        url: `-contact-us`,
        src: '/assets/icon/phone.png'
      },
      // {
      //   title: 'Project ',
      //   url: `-my-data-project`,
      //   src: '/assets/icon/phone.png'
      // },
      // {
      //   title: 'Unit',
      //   url: `-my-data-unit-search`,
      //   src: '/assets/icon/phone.png'
      // },
      {
        title: 'app-component.profile',
        url: `-profile`,
        src: '/assets/icon/profile.png'
      }],
    logout: {
      title: 'app-component.logout',
      src: '/assets/icon/log-out.png',

    }

  }
  public appSrc
  // options: PushOptions = {
  //   android: {},
  //   ios: {
  //   },
  // }
  // pushObject: PushObject = this.push.init(this.options);

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    public translate: TranslateService,
    private storageService: StorageService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private rentalsUserService: RentalsUserService,
    private alertService: AlertServiceService,
    private buildingUserService: BuildingUserService
    // private push: Push
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
  }

  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: 'lines'
    }).then(loading => {
      loading.present();
    });
  }

  async routeForword(url) {
    await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
      this.appSrc = val;
      console.log("-----------------", val)
      this.router.navigateByUrl(`${this.appSrc}${url}`)
    })
  }

  initializeApp() {
    let isLoggedIn: string;
    this.platform.ready().then(async () => {
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#ffffff');
      await this._initTranslate()
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      await this.storageService.getDatafromIonicStorage('isLoggedIn').then(val => {
        isLoggedIn = val;
        console.log(typeof val);

      })
      await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
        this.appSrc = val;
      })
      await isLoggedIn == 'true' ? this.navCtrl.navigateRoot(`/${this.appSrc}-home`) : this.navCtrl.navigateRoot('/login');
    });
  }

  // logout() {
  //   window.localStorage.clear()
  //   this.storage.clear()
  //   this.router.navigateByUrl('/login')
  // }



  async logOut() {
    await this.presentLoading();
    let userId;
    await this.storageService.getDatafromIonicStorage('user_id').then(val => {
      userId = val;
    })
    this.storageService.getDatafromIonicStorage('appSrc').then(val => {
      if (val == 'rentals') {
        this.rentalsUserService.getUserById(userId).subscribe(async data => {
          if (data.businessAppDevice.pushToken) {
            delete data.businessAppDevice
            console.log(data);
            this.updateUser(val, data)
          } else {
            await this.loadingCtrl.dismiss()
            window.localStorage.clear();
            await this.storageService.emptyStorage()
            this.navCtrl.navigateRoot('/login');
          }

        })
      } else if (val == 'building-management') {
        this.buildingUserService.getUserById(userId).subscribe(async data => {
          if (data.businessAppDevice.pushToken) {
            delete data.businessAppDevice
            console.log(data);
            this.updateUser(val, data)
          } else {
            await this.loadingCtrl.dismiss()
            window.localStorage.clear();
            await this.storageService.emptyStorage()
            this.navCtrl.navigateRoot('/login');
          }
        })
      }

    })
    // window.localStorage.clear();
    // await this.storage.clear()
    // this.navCtrl.navigateRoot('/login');
  }

  async updateUser(val, data) {
    if (val == 'rentals') {
      this.rentalsUserService.updateUser(data).subscribe(
        async (data: any) => {
          await this.loadingCtrl.dismiss()
          window.localStorage.clear();
          await this.storage.clear()
          this.navCtrl.navigateRoot('/login');
        }, async err => {
          await this.loadingCtrl.dismiss()
          this.alertService.presentAlert('', 'Error while logging out')
        })
    } else if (val == 'building-management') {
      this.buildingUserService.updateUser(data).subscribe(
        async (data: any) => {
          await this.loadingCtrl.dismiss()
          window.localStorage.clear();
          await this.storage.clear()
          this.navCtrl.navigateRoot('/login');
        }, async err => {
          await this.loadingCtrl.dismiss()
          this.alertService.presentAlert('', 'Error while logging out')
        }
      )

    }
  }


  private _initTranslate() {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set your language here

  }
}
