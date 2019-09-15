import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ContactUsService } from '../../services/contact-us.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate /translate-service.service';

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
    private alertService: AlertServiceService,
    public transService: translateService
  ) { }

  ngOnInit() {
  }

  async sendContactUsRequest() {

    await this.presentLoading();
    this.contactUsService.createContactUs(this.contactUsData)
      .subscribe(async (data: any) => {
        this.loadingCtrl.dismiss();
        await this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          this.transService.getTranslatedData('contact-us.message'))
        this.router.navigateByUrl('/building-management-home');
      },
        err => {
          this.loadingCtrl.dismiss();
          this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error.error);
        }
      );


  }

}
