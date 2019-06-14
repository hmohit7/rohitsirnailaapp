import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-category-search',
  templateUrl: './ticket-category-search.page.html',
  styleUrls: ['./ticket-category-search.page.scss'],
})
export class TicketCategorySearchPage implements OnInit {

  categories: any[] = [];
  selectedCategory: any = {};
  loading = false;

  constructor(
    private modalController: ModalController,
    private ticketService: TicketService,
    private navParams: NavParams
  ) {
    const categoryFilter = {
      ticketBelongsTo: this.navParams.get('ticketBelongsTo'),
      ticketBelongsToRefId: this.navParams.get('ticketBelongsToRefId')
    };
    this.getCategories(categoryFilter);
  }

  ngOnInit() {
  }

  selectCategory(category) {
    this.selectedCategory.name = category.name;
    this.selectedCategory.ticketCategory = category._id;
    this.selectedCategory.subCategory = category.subCategory;
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedCategory);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

    getCategories(categoryFilter) {
      this.loading = true;
      this.ticketService.getTicketCategories(categoryFilter)
        .subscribe((data: any) => {
          this.loading = false;
          this.categories = data;
        },
          err => {
            this.loading = false;
            alert(err.error.error);
          }
        );
    }

  }
