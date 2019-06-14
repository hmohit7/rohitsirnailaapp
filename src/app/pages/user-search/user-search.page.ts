import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.page.html',
  styleUrls: ['./user-search.page.scss'],
})
export class UserSearchPage implements OnInit {

  users: any[] = [];
  loading = false;

  selectedUser: any = {};
  disableInfiniteScroll = false;

  constructor(
    // private loading: LoadingController,
    private userService: UserService,
    private modalController: ModalController
  ) {
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
          alert(err.error.error);
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
