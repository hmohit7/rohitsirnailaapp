import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-approvalpopup',
  templateUrl: './approvalpopup.component.html',
  styleUrls: ['./approvalpopup.component.scss'],
})
export class ApprovalpopupComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }
  @Input() val;
  public notes;
  public flag;
  ngOnInit() {
  }
  cancel() {
    this.popoverCtrl.dismiss()
  }
  dismiss() {
    let data = {
      val: this.val,
      notes: this.notes || {}
    }
    this.popoverCtrl.dismiss(data)
  }

}
