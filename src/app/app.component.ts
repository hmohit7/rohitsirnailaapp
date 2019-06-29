import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

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
        title: 'Profile',
        url: '/profile',
        src: '/assets/icon/profile.png'
      }],
    logout: {
      title: 'Logout',
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
    private route: ActivatedRoute,
    // private push: Push
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
  }
  initializeApp() {
    let notification
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.pushObject.on('notification').subscribe((data) => {
      //   notification = data;
      // }, err => {
      //   alert(JSON.stringify(err));
      // });
      if (localStorage.getItem('isLoggedIn') === 'true') {
        // console.log('notiification', notification);

        // if (notification) {
        //   if (notification.additionalData.type == 'discussion') {
        //     console.log('discussion');
        //     if (notification.additionalData.id) {
        //       console.log('discussion with id');
        //       this.router.navigateByUrl(`/notice-details?did=${notification.additionalData.id}`);
        //     }
        //     else {
        //       console.log('discussion without id');
        //       this.router.navigateByUrl(`/notice-board`);
        //     }
        //   } else if (notification.additionalData.type == 'ticket') {
        //     if (notification.additionalData.id) {
        //       this.router.navigateByUrl(`/ticket-details?tid=${notification.additionalData.id}`);
        //     }
        //     else {
        //       this.router.navigateByUrl('tickets');
        //     }
        //   } else if (notification.additionalData.type == 'approval') {
        //     // $state.go('app.approval')
        //     this.router.navigateByUrl(`/user-approval`);

        //   } else if (notification.additionalData.type == 'estimate') {
        //     this.router.navigateByUrl(`/ticket-details?eid=${notification.additionalData.id}`);
        //     // $state.go('app.estimatedetails', { eid: notification.additionalData.id }).then(function () {
        //     //   $ionicLoading.show({
        //     //     template: '<ion-spinner icon="ios"></ion-spinner>'
        //     //   })
        //     // })
        //   }
        // }
        // else {
        this.router.navigateByUrl('/home');
        // }

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
