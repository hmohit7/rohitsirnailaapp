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
      // _id: window.localStorage.getItem('user_id'),
      // countryCode: window.localStorage.getItem('countryCode'),
      // phoneNumber: window.localStorage.getItem('phoneNumber'),
      // firstName: window.localStorage.getItem('firstName'),
      // lastName: window.localStorage.getItem('lastName'),
    },
    // 'roles' : JSON.parse(window.localStorage.getItem('roles')),
    createdAt: new Date(),
    source: 'Business App'
  };

  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: "lines"
    }).then(loading => {
      loading.present();
    });
  }

  constructor(
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private contactUsService: ContactUsService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {

  }

  async ngOnInit() {
    await this.alertService.getDataFromLoaclStorage('user_id').then(val => {
      this.contactUsData.user._id = val
    })

    await this.alertService.getDataFromLoaclStorage('countryCode').then(val => {
      this.contactUsData.user.countryCode = val

    })
    await this.alertService.getDataFromLoaclStorage('phoneNumber').then(val => {
      this.contactUsData.user.phoneNumber = val
    })
    await this.alertService.getDataFromLoaclStorage('firstName').then(val => {
      this.contactUsData.user.firstName = val

    })
    await this.alertService.getDataFromLoaclStorage('lastName').then(val => {
      this.contactUsData.user.lastName = val

    })
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
