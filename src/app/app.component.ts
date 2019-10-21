import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
        url: '/rentals-home',
        src: '/assets/icon/my-home.png'
      }, {
        title: 'app-component.calendar',
        url: '/rentals-calendar',
        src: '/assets/icon/calendar.png'
      }, {
        title: 'app-component.ticket',
        url: '/rentals-tickets',
        src: '/assets/icon/ticket-history.png'
      }, {
        title: 'app-component.discussion',
        url: '/rentals-notice-board',
        src: '/assets/icon/communications.png'
      },
      {
        title: 'app-component.approval',
        url: '/rentals-user-approval',
        src: '/assets/icon/approval.png'
      },
      {
        title: 'app-component.contact-us',
        url: '/rentals-contact-us',
        src: '/assets/icon/phone.png'
      },
      {
        title: 'app-component.profile',
        url: '/rentals-profile',
        src: '/assets/icon/profile.png'
      }],
    logout: {
      title: 'app-component.logout',
      src: '/assets/icon/log-out.png',

    }

  }
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
    public translate: TranslateService
    // private push: Push
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      window.localStorage.setItem('appFor', 'production');
      this.statusBar.styleDefault();
      await this._initTranslate()
      this.splashScreen.hide();
      if (window.localStorage.getItem('isloggedin') === 'true') {
        this.router.navigateByUrl(`/${window.localStorage.getItem('appSrc')}-home`);
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  logout() {
    window.localStorage.clear()
    this.router.navigateByUrl('/login')
  }
  private _initTranslate() {
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set your language here

  }
}
