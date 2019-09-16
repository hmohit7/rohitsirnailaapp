import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate /translate-service.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.page.html',
  styleUrls: ['./user-search.page.scss'],
})
export class UserSearchPage implements OnInit {

  users: any[] = [];
  loading = false;
  searchTerm: string;
  selectedUser: any = {};
  disableInfiniteScroll = false;

  constructor(
    // private loading: LoadingController,
    private userService: UserService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    if (this.navParams.get('id')) {
      this.selectedUser.id = this.navParams.get('id');
      this.selectedUser.name = this.navParams.get('name');
    }
    this.searchUsers();
  }

  ngOnInit() {
  }

  // async presentLoading() {
  //   const loading = await this.loading.create({
  //   });
  //   await loading.present();
  // }

  selectUser(user) {
    this.selectedUser.name = user.firstName + ' ' + user.lastName;
    this.selectedUser.id = user._id;
    this.closeModal(true);
  }

  async searchUsers() {

    this.loading = true;

    this.userService.getUsers()
      .subscribe((data: any) => {
        this.loading = false;
        this.users = data;
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert(this.transService.getTranslatedData('alert-title'),
            err.error.error);
        }
      );
  }

  async closeModal(sendData) {
    if (sendData) {
      await this.modalController.dismiss(this.selectedUser);
    } else {
      await this.modalController.dismiss();
    }

  }



}
