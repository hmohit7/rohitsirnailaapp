import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = {
    name: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'),
    phoneNumber: localStorage.getItem('phoneNumber'),
    pages: [
      {
        title: 'Home',
        url: '/home',
        src: '/assets/icon/my-home.png'
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
        src: '/assets/icon/phone.png'
      },
      {
        title: 'profile',
        url: '/profile',
        src: '/assets/icon/profile.png'
      }],
    logout: {
      title: 'logout',
      src: '/assets/icon/log-out.png',

    }

  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
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
  logOut() {
    localStorage.clear();
    this.router.navigate([''], { replaceUrl: true })
  }
}
