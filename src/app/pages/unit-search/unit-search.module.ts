import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnitSearchPage } from './unit-search.page';
import { FilterPipe } from 'src/app/pipes/Filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: UnitSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnitSearchPage]
})
export class UnitSearchPageModule { }
