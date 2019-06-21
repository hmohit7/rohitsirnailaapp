import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NoticeCreatePage } from '../notice-create/notice-create.page'
import { CreateNoticeComponent } from 'src/app/modals/create-notice/create-notice.component';

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.page.html',
  styleUrls: ['./notice-board.page.scss'],
})
export class NoticeBoardPage implements OnInit {

  notices: any[] = [];
  disableInfiniteScroll = false;

  filterData: any = {
    skip: 0
  };

  constructor(
    private noticeService: NoticeService,
    private loading: LoadingController,
    private modalController: ModalController
  ) {
    this.getNoices('');
  }

  ngOnInit() {
  }

  async presentLoading() {
    const loading = await this.loading.create({
    });
    await loading.present();
  }

  async getNoices(event) {

    if (!event) {
      await this.presentLoading();
    }
    this.noticeService.getNotices(this.filterData)
      .subscribe((data: any) => {

        this.notices = this.notices.concat(data.data.data);
        this.filterData.skip = data.data.query.skip + 5;

        console.log(this.notices);

        event ? event.target.complete() : this.loading.dismiss();

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  changeLikeIcon(id) {
    this.notices.map((item) => {
      if (item._id === id) {

        item.hasLiked = !item.hasLiked;

        if (item.hasLiked === false) {
          item.likesCount = item.likesCount - 1;
        } else if (item.hasLiked === true) {
          item.likesCount = item.likesCount + 1;
        }

      }
    });
  }

  async openCreateNoticeModal() {
    let modal = await this.modalController.create({
      component: CreateNoticeComponent
    })
    return await modal.present();
  }

  async likeDiscussion(id) {

    await this.presentLoading();

    this.noticeService.likeNotice(id)
      .subscribe((data: any) => {
        this.changeLikeIcon(id);
        this.loading.dismiss();
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  async openNoticeCreateModal() {
    const modal = await this.modalController.create({
      component: NoticeCreatePage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
