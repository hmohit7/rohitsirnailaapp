import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

import { TicketComponent } from '../../components/ticket/ticket.component';
import { CreateNoticeComponent } from 'src/app/modals/create-notice/create-notice.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  entryComponents: [CreateNoticeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage, TicketComponent]
})
export class HomePageModule { }
