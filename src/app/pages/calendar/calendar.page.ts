import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TicketService } from '../../services/ticket.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  dateList = [];
  tickets: any[] = [];
  public pet: any;
  disableInfiniteScroll = false;


  filterData = {
    skip: 0,
    ticketBelongsTo: 'all',
    type: 'all',
    priority: 'all',
    status: '&status=open&status=in-progress',
    startDate: ((new Date(new Date().setHours(0, 0, 0, 0))).toJSON()).substr(0, 10),
    endDate: ((new Date(new Date().setHours(23, 59, 59, 999))).toJSON()).substr(0, 10)
  };

  constructor(
    private ticketService: TicketService,
    private loading: LoadingController,
  ) {
    this.searchTicket('');
  }

  ngOnInit() {
    const date = new Date();
    const startDate = new Date(date.setDate(date.getDate() - 5));
    for (let i = 0; i <= 8; i++) {
      this.dateList.push(new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  }

  async presentLoading() {
    const loading = await this.loading.create({
    });
    await loading.present();
  }

  async searchTicket(event) {

    if (!event) {
      await this.presentLoading();
    }

    this.ticketService.getTickets(this.filterData.skip, this.filterData.status, this.filterData.ticketBelongsTo, this.filterData.type, '', '', this.filterData.startDate, this.filterData.endDate, '', '', '')
      .subscribe((data: any) => {

        this.tickets = this.tickets.concat(data.data.data);
        this.filterData.skip = data.data.query.skip + 10;

        event ? event.target.complete() : this.loading.dismiss();

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          // this.loading.dismiss();
          alert(err.error.error);
        }
      );
  }

  resetDate(date) {
    this.tickets = [];
    this.filterData.skip = 0;
    this.filterData.startDate = ((new Date(new Date(date).setHours(0, 0, 0, 0))).toJSON()).substr(0, 10);
    this.filterData.endDate = ((new Date(new Date(date).setHours(23, 59, 59, 999))).toJSON()).substr(0, 10);
    this.searchTicket('');
  }

}
