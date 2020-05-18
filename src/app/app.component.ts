import { Component, OnInit } from '@angular/core';

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
import { Utils } from './Rentals Management/services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{
  public appPages = {
    name: '',
    phoneNumber: localStorage.getItem('phoneNumber'),
    pages: [
      {
        title: 'Home',
        url: `rentals-naila-search-page`,
        src: '/assets/imgs/home.svg'
      }, {
        title: 'Account',
        url: `rentals-naila-account-page`,
        src: 'assets/imgs/profile1.svg'
      }, {
        title: 'Bookings',
        url: `rentals-naila-booking-page`,
        src: '/assets/imgs/bookings.svg'
      }, {
        title: 'Offers',
        url: `rentals-naila-offers-page`,
        src: '/assets/imgs/discount.svg'
      },
      {
        title: 'My Cart',
        url: `rentals-naila-cart-page`,
        src: '/assets/imgs/cart.svg'
      },
      // {
      //   title: 'app-component.contact-us',
      //   url: `-contact-us`,
      //   src: '/assets/icon/phone.png'
      // },
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
      // {
      //   title: 'app-component.profile',
      //   url: `-profile`,
      //   src: '/assets/icon/profile.png'
      // }
    
    ],
    logout: {
      title: 'app-component.logout',
      src: '/assets/imgs/logout.svg',

    }

  }

ngOnInit(){
  this.initializeApp();
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
    private buildingUserService: BuildingUserService,
    private utils:Utils
    // private push: Push
  ) {
    
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
      this.router.navigateByUrl(`${url}`)
      // this.router.navigateByUrl(`${this.appSrc}${url}`)

    })
  }

  initializeApp() {
    let isLoggedIn: string;
    this.platform.ready().then(async () => {
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#ffffff');
      this._initTranslate()
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      this.redirectToHomeOrLogin(isLoggedIn)
      // await this.storageService.getDatafromIonicStorage('isLoggedIn').then(val => {
      //   isLoggedIn = val;
      //   console.log(typeof val);

      // })
      // await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
      //   this.appSrc = val;
      // })
      // await isLoggedIn == 'true' ? this.navCtrl.navigateRoot('/rentals-naila-search-page') : this.navCtrl.navigateRoot('/login');
      // await isLoggedIn == 'true' ? this.navCtrl.navigateRoot(`/${this.appSrc}-naila-search-page`) : this.navCtrl.navigateRoot('/login');
      // if(isLoggedIn){

      //   // this.redirectToHomeOrLogin(isLoggedIn);
      // }
    });
  }
  redirectToHomeOrLogin(isLoggedIn){
    window.localStorage.getItem('uid')
    const registereduser = window.localStorage.getItem('registereduser')
    registereduser == 'true' ? this.navCtrl.navigateRoot('/rentals-naila-search-page') : this.navCtrl.navigateRoot('/login');





    if(window.localStorage.getItem('cartitem') && window.localStorage.getItem('cartitemcount')){

      this.utils.cartitem=JSON.parse( window.localStorage.getItem('cartitem'));     
      this.utils.cartdata=window.localStorage.getItem('cartitemcount')
   }
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
