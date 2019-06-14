import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ContactUsService } from '../../services/contact-us.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  contactUsData: any = {
    user: {
      _id: window.localStorage.getItem('user_id'),
      countryCode: window.localStorage.getItem('countryCode'),
      phoneNumber: window.localStorage.getItem('phoneNumber'),
      firstName: window.localStorage.getItem('firstName'),
      lastName: window.localStorage.getItem('lastName'),
    },
    // 'roles' : JSON.parse(window.localStorage.getItem('roles')),
    createdAt: new Date(),
    source: 'Business App'
  };

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    return await loading.present();
  }

  constructor(
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private contactUsService: ContactUsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  async sendContactUsRequest() {

    await this.presentLoading();
    this.contactUsService.createContactUs(this.contactUsData)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        alert('Ticket created');
        this.router.navigateByUrl('/home');
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );


  }

}
