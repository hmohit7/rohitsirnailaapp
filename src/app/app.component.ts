import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }, {
      title: 'Calendar',
      url: '/calendar',
      src: '/assets/icon/calendar.png'
    }, {
      title: 'Tickets',
      url: '/tickets',
      src: '/assets/icon/ticket-history.png'
    }, {
      title: 'Notices',
      url: '/notice-board',
      src: '/assets/icon/communications.png'
    },
    {
      title: 'Apporvals',
      url: '/user-approval',
      src: '/assets/icon/approval.png'
    },
    {
      title: 'Contact us',
      url: '/contact-us',
      icon: 'phone'
    },
    {
      title: 'profile',
      url: '/profile',
      icon: 'person'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (localStorage.getItem('isLoggedIn') === 'true') {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }

    });
  }
}
