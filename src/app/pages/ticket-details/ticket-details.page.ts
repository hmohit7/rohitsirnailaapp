import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';
import { UserSearchPage } from '../../pages/user-search/user-search.page';
import { MaterialSearchPage } from '../../pages/material-search/material-search.page';
import { AlertServiceService } from 'src/app/services/alert-service.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {

  selectedTab = 'SUMMARY';
  ticketId: string;
  ticket: any = {};
  ticketToBeUpdated: any;
  comments = [];
  activeMaterialSection = 'description';
  materialData: any = {};
  images: any[] = [];

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    await loading.present();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private ticketService: TicketService,
    private modalController: ModalController,
    private alertService: AlertServiceService
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      this.ticketId = params.params.ticketId;
      console.log(this.ticketId)
    });
    this.getTicketDetails();
  }

  ngOnInit() {

  }

  showMaterialForm() {
    this.activeMaterialSection = 'materialForm';
  }

  hideMaterialForm() {
    this.activeMaterialSection = 'description';
  }

  async getTicketDetails() {
    await this.presentLoading();
    this.ticketService.getTicketById(this.ticketId)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.ticket = data;
        console.log(this.ticket);
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

  async getTicketComments() {
    await this.presentLoading();
    this.ticketService.getTicketComments(this.ticketId)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.comments = data.data;
        console.log(this.comments);
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

  async updateTicket() {

    if (this.ticketToBeUpdated.ticketCategory) {
      this.ticketToBeUpdated.ticketCategory = this.ticketToBeUpdated.ticketCategoryId;
    }

    if (this.ticketToBeUpdated.ticketSubCategory) {
      this.ticketToBeUpdated.ticketSubCategory = this.ticketToBeUpdated.ticketSubCategoryId;
    }
    await this.presentLoading();
    if (this.images.length > 0) {
      console.log("With Image");
      console.log(this.ticketToBeUpdated);
      this.alertService.upload(this.images[0], this.ticketToBeUpdated, 'ADDTOTICKETDETAIL').then(() => {
        this.loadingCtrl.dismiss();
        this.images = this.images.shift();
        this.activeMaterialSection = 'description';
        this.materialData = {};
        this.getTicketDetails();
        alert('Ticket updated');
      }, error => {
        console.log(error);
      });
    } else {
      console.log("Without Image");
      this.ticketService.updateTicket(this.ticketToBeUpdated)
        .subscribe(() => {
          this.loadingCtrl.dismiss();
          this.activeMaterialSection = 'description';
          this.materialData = {};
          this.getTicketDetails();
          alert('Ticket updated');
        },
          err => {
            this.loadingCtrl.dismiss();
            alert(err.error.error);
          }
        );
    }

  }

  async openUserSearchModal(type) {

    this.ticketToBeUpdated = Object.assign({}, this.ticket);

    let id;

    if (type === 'agent' && this.ticketToBeUpdated.agent) {
      id = this.ticketToBeUpdated.agent._id;
    } else if (type === 'poc' && this.ticketToBeUpdated.contactPoint) {
      id = this.ticketToBeUpdated.contactPoint._id;
    }

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        id
      }
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        if (type === 'agent') {
          console.log('selecting technician');
          console.log(user);
          this.ticketToBeUpdated.agent = user.data.id;
          this.updateTicket();
        } else if (type === 'poc') {
          console.log('selecting point of contact');
          console.log(user);
          this.ticketToBeUpdated.contactPoint = user.data.id;
          this.updateTicket();
        }
      }
    });

    return await modal.present();
  }

  async createComment() {

    const data = {
      text: this.ticket.commentText,
      ticket: this.ticketId,
      type: 'ticket',
    };

    await this.presentLoading();
    this.ticketService.createComment(data)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.getTicketComments();
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loadingCtrl.dismiss();
          alert(err.error.error);
        }
      );
  }

  updateCheckList(status, index) {

    this.ticketToBeUpdated = Object.assign({}, this.ticket);

    this.ticketToBeUpdated.checklist[index].completed = status;

    this.updateTicket(); this.loadingCtrl.dismiss();
    this.activeMaterialSection = 'description';
    this.materialData = {};
    this.getTicketDetails();

  }

  async openMaterialSearchModal() {

    const modal = await this.modalController.create({
      component: MaterialSearchPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((materialData: any) => {
      console.log(materialData);

      this.materialData.name = materialData.data.name;
      this.materialData.product = materialData.data;

    });

    return await modal.present();
  }

  async tagMaterial() {
    this.ticketToBeUpdated = Object.assign({}, this.ticket);
    this.ticketToBeUpdated.itemDetails.push(this.materialData);
    this.updateTicket();
  }

  async fileSourceOption() {
    console.log(this.images);
    // if (this.images.length < 1) {
    let image = await this.alertService.capturePhoto();
    console.log("in add-visitor Page\n\n");
    console.log(image);

    if (image !== undefined) {
      this.images.push(image);
      this.images
      this.ticketToBeUpdated = Object.assign({}, this.ticket);
      this.updateTicket();
    }
    // } else {
    // this.alertService.presentAlert("Alert", "Only one pitcure is allowed!!")
    // }
  }

}
