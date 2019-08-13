import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { IonicStorageModule } from '@ionic/storage';
import { CountrycodemodalComponent } from './countrycodemodal/countrycodemodal.component';
import { FilterPipe } from './countrycodemodal/Filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  entryComponents: [
    CountrycodemodalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage, CountrycodemodalComponent, FilterPipe]
})
export class LoginPageModule { }
