import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { CountryCodeModalComponent } from 'src/app/modals/country-code-modal/country-code-modal.component';
import { FilterPipe } from 'src/app/pipes/Filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  entryComponents: [CountryCodeModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage, CountryCodeModalComponent, FilterPipe]
})
export class LoginPageModule { }
