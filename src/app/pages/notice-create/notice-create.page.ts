import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ProjectSearchPage } from '../project-search/project-search.page';
import { NoticeService } from '../../services/notice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notice-create',
  templateUrl: './notice-create.page.html',
  styleUrls: ['./notice-create.page.scss'],
})
export class NoticeCreatePage implements OnInit {

  notice: any = {
    discussionBelongsTo: 'Project',
    discussionType: 'Notice',
    raisedByEmployee: true,
  };

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    return await loading.present();
  }

  constructor(
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private noticeService: NoticeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  async closeModal() {
    alert('yo....');
    await this.modalController.dismiss();
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
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

    await this.presentLoading();
    this.noticeService.createNotice(this.notice)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        alert('Notice created');
        this.router.navigateByUrl('/notice-board');
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

}
