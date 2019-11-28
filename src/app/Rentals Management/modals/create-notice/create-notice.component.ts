import { Router, ActivatedRoute } from '@angular/router';
import { NoticeService } from './../../services/notice.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { ProjectSearchPage } from '../../pages/project-search/project-search.page';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { translateService } from 'src/app/common-services/translate /translate-service.service';

@Component({
  selector: 'app-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrls: ['./create-notice.component.scss'],
})
export class CreateNoticeComponent implements OnInit {

  notice: any = {
    discussionBelongsTo: 'Project',
    discussionType: 'Notice',
    raisedByEmployee: true,
  };
  flag: boolean = false;
  public images: any[] = [];

  constructor(
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private noticeService: NoticeService,
    private router: Router,
    private alertService: AlertServiceService,
    private route: ActivatedRoute,
    public webView: WebView,
    public transService: translateService
  ) { }

  ngOnInit() { }

  async presentLoading() {
    this.loadingCtrl.create({
      spinner: "lines"

    }).then(loading => {
      loading.present();
    });
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        id: this.notice.discussionBelongsToRefId,
        name: this.notice.noticeBelongsToName
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        console.log(project);
        this.notice.noticeBelongsToName = project.data.ticketBelongsToName;
        this.notice.discussionBelongsToRefId = project.data.ticketBelongsToRefId;
        console.log(this.notice);
      }
    });

    return await modal.present();
  }

  async createNotice() {
    this.presentLoading();
    if (this.images.length > 0) {
      this.alertService.upload(this.images[0], this.notice, 'CREATENOTICE').then(() => {
        this.loadingCtrl.dismiss();
        this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
          this.transService.getTranslatedData('create-notice-modal.notice-created'));
        this.flag = true;
        this.modalController.dismiss(this.flag);
        this.router.navigateByUrl('/rentals-notice-board');
      }, err => {
        this.loadingCtrl.dismiss();
        if (err.error.message == "You don't have permission for this operation!") {
          this.alertService.presentAlert('', "You don't have permission for this operation!")
          this.modalController.dismiss()
        } else {
          this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
            err)
        }
      });
    } else {
      this.noticeService.createNotice(this.notice)
        .subscribe((data: any) => {
          this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
            this.transService.getTranslatedData('create-notice-modal.notice-created'));
          this.flag = true;
          this.loadingCtrl.dismiss();
          this.modalController.dismiss(this.flag);
          this.router.navigateByUrl('/rentals-notice-board');
        },
          err => {
            this.loadingCtrl.dismiss();
            if (err.error.message == "You don't have permission for this operation!") {
              this.alertService.presentAlert('', "You don't have permission for this operation!")
              this.modalController.dismiss()
            } else {
              this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), err.error.error);
            }
          }
        );
    }

  }

  async fileSourceOption() {
    if (this.images.length < 1) {
      const caller = await this.alertService.capturePhoto();
      console.log("in add-visitor Page\n\n");
      if (caller != undefined) {
        console.log(caller);
        this.images.push(caller);
        console.log(this.images);
      }
    } else {
      this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'), this.transService.getTranslatedData('create-notice-modal.picture-limit'))
    }
  }

  removeImage() {
    this.images = [];
  }
  dismiss() {
    this.modalController.dismiss(this.flag);
  }

}
