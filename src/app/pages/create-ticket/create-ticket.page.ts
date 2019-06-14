import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UnitSearchPage } from '../../pages/unit-search/unit-search.page';
import { ProjectSearchPage } from '../../pages/project-search/project-search.page';
import { UserSearchPage } from '../../pages/user-search/user-search.page';
import { TicketCategorySearchPage } from '../../pages/ticket-category-search/ticket-category-search.page';
import { TicketSubCategorySearchPage } from '../../pages/ticket-sub-category-search/ticket-sub-category-search.page';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.page.html',
  styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {

  ticketData: any = {
    ticketBelongsTo: 'Home',
    priority: 'low'
  };

  loading: any = this.loadingCtrl.create({
  });

  subCategories: any[];
  ticketId: string;
  flow = 'createTicket';
  title = 'Raise ticket';

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      this.ticketId = params.params.ticketId;
      console.log(this.ticketId);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
    });
    return await this.loading.present();
  }

  ngOnInit() {
    if (this.ticketId) {
      this.flow = 'editTicket';
      this.title = 'Update ticket';
      this.getTicketDetails();
    }
  }

  async getTicketDetails() {
    await this.presentLoading();
    this.ticketService.getTicketById(this.ticketId)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();

        this.ticketData = data;

        if (data.ticketCategory) {
          this.ticketData.ticketCategoryName = data.ticketCategory;
        }

        if (data.ticketSubCategory) {
          this.ticketData.ticketSubCategoryName = data.ticketSubCategory;
        }

        if (data.contactPoint) {
          if (data.contactPoint.firstName) {
            this.ticketData.contactPointName = data.contactPoint.firstName;
          }
          if (data.contactPoint.lastName) {
            this.ticketData.contactPointName = this.ticketData.contactPointName + ' ' + data.contactPoint.lastName;
          }
        }

        if (data.agent) {
          if (data.agent.firstName) {
            this.ticketData.agentName = data.agent.firstName;
          }
          if (data.agent.lastName) {
            this.ticketData.agentName = this.ticketData.agentName + ' ' + data.agent.lastName;
          }
        }

        console.log(this.ticketData);
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

  selectTicketBelongsTo(value) {
    this.ticketData.ticketBelongsTo = value;
    delete this.ticketData.ticketBelongsToName;
    delete this.ticketData.ticketBelongsToRefId;
  }

  selectPriority(value) {
    this.ticketData.priority = value;
  }

  async openUnitSearchModal() {

    const modal = await this.modalController.create({
      component: UnitSearchPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((unit: any) => {
      if (unit !== null && unit.data) {

        console.log(unit);
        this.ticketData.ticketBelongsToName = unit.data.ticketBelongsToName;
        this.ticketData.ticketBelongsToRefId = unit.data.ticketBelongsToRefId;
        console.log(this.ticketData);

      }
    });

    return await modal.present();
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        this.ticketData.ticketBelongsToName = project.data.ticketBelongsToName;
        this.ticketData.ticketBelongsToRefId = project.data.ticketBelongsToRefId;
        console.log(this.ticketData);
      }
    });

    return await modal.present();
  }

  async openUserSearchModal(type) {

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        if (type === 'agent') {
          this.ticketData.agentName = user.data.name;
          this.ticketData.agent = user.data.id;

        } else if (type === 'poc') {
          this.ticketData.contactPointName = user.data.name;
          this.ticketData.contactPoint = user.data.id;
        }
        console.log(this.ticketData);
      }
    });

    return await modal.present();
  }

  async openTicketCategorySearchModal() {

    const modal = await this.modalController.create({
      component: TicketCategorySearchPage,
      componentProps: {
        ticketBelongsTo: this.ticketData.ticketBelongsTo,
        ticketBelongsToRefId: this.ticketData.ticketBelongsToRefId,
      }
    });

    modal.onDidDismiss().then((category) => {
      if (category !== null && category.data) {

        console.log(this.ticketData);

        this.ticketData.ticketCategoryName = category.data.name;
        this.ticketData.ticketCategory = category.data.ticketCategory;
        this.ticketData.ticketCategoryId = category.data.ticketCategory;
        delete this.ticketData.ticketSubCategory;
        this.subCategories = category.data.subCategory;

        console.log(this.ticketData);

      }
    });

    if (this.ticketData.ticketBelongsToRefId) {
      return await modal.present();
    } else {
      alert('Select a unit/project');
    }
  }

  async openTicketSubCategorySearchModal() {

    const modal = await this.modalController.create({
      component: TicketSubCategorySearchPage,
      componentProps: {
        subCategories: this.subCategories,
      }
    });

    modal.onDidDismiss().then((subCategory) => {
      if (subCategory !== null && subCategory.data) {
        console.log(subCategory);
        this.ticketData.ticketSubCategoryName = subCategory.data.name;
        this.ticketData.ticketSubCategory = subCategory.data.ticketSubCategory;
        this.ticketData.ticketSubCategoryId = subCategory.data.ticketSubCategory;

      }
    });

    if (this.ticketData.ticketCategory) {
      return await modal.present();
    } else {
      alert('Select a category first');
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  openModal(value) {
    if (value === 'Home') {
      this.openUnitSearchModal();
    } else if (value === 'Project') {
      this.openProjectSearchModal();
    } else if (value === 'agent') {
      this.openUserSearchModal('agent');
    } else if (value === 'poc') {
      this.openUserSearchModal('poc');
    } else if (value === 'ticketCategory') {
      this.openTicketCategorySearchModal();
    } else if (value === 'ticketSubCategory') {
      this.openTicketSubCategorySearchModal();
    }
  }

  async raiseTicket() {
    await this.presentLoading();
    this.ticketService.createTicket(this.ticketData)
      .subscribe((data: any) => {
        this.loading.dismiss();
        alert('Ticket created');
        this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  async updateTicket() {

    if (this.ticketData.ticketCategory) {
      this.ticketData.ticketCategory = this.ticketData.ticketCategoryId;
    }

    if (this.ticketData.ticketSubCategory) {
      this.ticketData.ticketSubCategory = this.ticketData.ticketSubCategoryId;
    }

    await this.presentLoading();
    this.ticketService.updateTicket(this.ticketData)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();

        alert('Ticket updated');
        this.router.navigateByUrl('/ticket-details');
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

}
