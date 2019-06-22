import { AlertServiceService } from './../../services/alert-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NoticeService } from './../../services/notice.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ProjectSearchPage } from 'src/app/pages/project-search/project-search.page';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() { }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    return await loading.present();
  }
  async closeModal() {
    alert('yo....');
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
        alert('Notice created');
        this.flag = true;
        this.modalController.dismiss(this.flag);
        this.router.navigateByUrl('/notice-board');
      }, err => {
        this.loadingCtrl.dismiss();
        alert(err);
      });
    } else {
      this.noticeService.createNotice(this.notice)
        .subscribe((data: any) => {
          alert('Notice created');
          this.flag = true;
          this.loadingCtrl.dismiss();
          this.modalController.dismiss(this.flag);
          this.router.navigateByUrl('/notice-board');
        },
          err => {
            this.loadingCtrl.dismiss();
            alert(err.error.error);
          }
        );
    }

  }

  async fileSourceOption() {

    if (this.images.length < 1) {
      let image_url;
      let caller = await this.alertService.capturePhoto();
      image_url = caller;
      console.log("in add-visitor Page\n\n");
      if (image_url != undefined) {
        console.log(image_url);
        this.images.push(image_url);
        console.log(this.images);
      }
    } else {
      this.alertService.presentAlert("Alert", "Only one pitcure is allowed!!")
    }
  }

  removeImage() {
    this.images = [];
  }
  dismiss() {
    this.modalController.dismiss(this.flag);
  }

}
