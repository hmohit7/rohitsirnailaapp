import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  constructor(
    private _modalCtrl: ModalController
  ) { }
  @Input() image: any;

  ngOnInit() {
    console.log(this.image);
  }

  dismiss() {
    this._modalCtrl.dismiss();
  }
}
