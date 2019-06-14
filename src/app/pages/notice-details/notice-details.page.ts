import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '../../conatants/appSettings';

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.page.html',
  styleUrls: ['./notice-details.page.scss'],
})
export class NoticeDetailsPage implements OnInit {

  notice: any = {};
  noticeId = '';
  comments: any[];
  userId = '';

  constructor(
    private noticeService: NoticeService,
    private loading: LoadingController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      this.noticeId = params.params.noticeId;
      console.log(this.noticeId);
    });
    this.userId = AppSettings.USER;
  }

  ngOnInit() {
    this.getNotice();
    this.getAllComments();
  }

  async presentLoading() {
    const loading = await this.loading.create({
    });
    await loading.present();
  }

  async getNotice() {

    this.presentLoading();

    this.noticeService.getNoticeById(this.noticeId)
      .subscribe((data: any) => {

        this.notice = data;
        console.log(this.notice);
        this.loading.dismiss();

      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  getAllComments() {
    this.noticeService.getAllComments(this.noticeId)
      .subscribe((data: any) => {

        this.comments = data;
        console.log(this.comments);

      },
        err => {
          alert(err.error.error);
        }
      );
  }

  changeLikeIcon(id) {

    this.notice.hasLiked = !this.notice.hasLiked;

    if (this.notice.hasLiked === false) {
      this.notice.likesCount = this.notice.likesCount - 1;
    } else if (this.notice.hasLiked === true) {
      this.notice.likesCount = this.notice.likesCount + 1;
    }

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

  async createComment() {

    const data = {
      text: this.notice.commentText,
      discussion: this.noticeId,
    };

    await this.presentLoading();
    this.noticeService.createComment(data)
      .subscribe((data: any) => {
        this.notice.commentText = '';
        this.loading.dismiss();
        this.getAllComments();
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  async deleteComment(id) {
    await this.presentLoading();
    this.noticeService.deleteComment(id)
      .subscribe((data: any) => {
        this.loading.dismiss();
        this.getAllComments();
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

}
