import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-ticket-sub-category-search',
  templateUrl: './ticket-sub-category-search.page.html',
  styleUrls: ['./ticket-sub-category-search.page.scss'],
})
export class TicketSubCategorySearchPage implements OnInit {

  subCategories: any[] = [];
  selectedSubCategory: any = {};

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.subCategories = this.navParams.get('subCategories')
  }

  ngOnInit() {
  }

  selectSubCategory(subCategory) {
    this.selectedSubCategory.name = subCategory.name;
    this.selectedSubCategory.ticketSubCategory = subCategory._id;
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedSubCategory);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }

  }

}
