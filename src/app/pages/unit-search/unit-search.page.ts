import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-unit-search',
  templateUrl: './unit-search.page.html',
  styleUrls: ['./unit-search.page.scss'],
})
export class UnitSearchPage implements OnInit {

  units: any[] = [];
  loading = false;
  disableInfiniteScroll = false;
  selectedUnit: any = {};

  filterData = {
    skip: 0,
    searchText: ''
  };

  constructor(
    private unitService: UnitService,
    private modalController: ModalController
  ) {
    this.searchUnit('');
  }

  ngOnInit() {
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedUnit);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  selectUnit(unit) {
    if (unit.block) {
      this.selectedUnit.ticketBelongsToName = unit.block;
    }
    if (unit.door) {
      this.selectedUnit.ticketBelongsToName = this.selectedUnit.ticketBelongsToName + unit.door;
    }
    if (unit.name) {
      this.selectedUnit.ticketBelongsToName = this.selectedUnit.ticketBelongsToName + ', ' + unit.name;
    }

    this.selectedUnit.ticketBelongsToRefId = unit._id;
  }

  async searchUnit(event) {

    if (!event) {
      this.loading = true;
    }

    this.unitService.getUnits(this.filterData)
      .subscribe((data: any) => {

        this.units = this.units.concat(data.data.data);
        this.filterData.skip = data.data.query.skip + 10;

        console.log(this.units);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          alert(err.error.error);
        }
      );
  }

  resetFilterAndSearch(searchText) {
    this.units = [];
    this.filterData.skip = 0;
    this.disableInfiniteScroll = false;
    this.searchUnit('');
  }

}
