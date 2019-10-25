import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './common-services/storage-service.service';
import { Storage } from '@ionic/storage';

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
    private storage: Storage
    // private push: Push
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
  }
  routeForword(url) {
    this.router.navigateByUrl(`${this.appSrc}${url}`)
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      await this._initTranslate()
      this.splashScreen.hide();
      let isLoggedIn;
      this.statusBar.styleDefault();
      await this.storageService.getDatafromIonicStorage('isLoggedin').then(val => {
        isLoggedIn = val;
      })
      await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
        this.appSrc = val;
      })
      await isLoggedIn == true ? this.navCtrl.navigateRoot(`/${this.appSrc}-home`) : this.navCtrl.navigateRoot('/login');
    });
  }

  logout() {
    window.localStorage.clear()
    this.storage.clear()
    this.router.navigateByUrl('/login')
  }
  private _initTranslate() {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set your language here

  }
}
