import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoadingController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.page.html',
  styleUrls: ['./user-approval.page.scss'],
})
export class UserApprovalPage implements OnInit {

  approvals: any[];

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private modalController: ModalController
  ) {
    this.getUserApprovals();
  }

  ngOnInit() {
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    await loading.present();
  }

  async getUserApprovals() {

    await this.presentLoading();

    this.userService.getUserApprovals()
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.approvals = data;
        console.log(this.approvals);
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

}
