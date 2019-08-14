import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Push } from '@ionic-native/push/ngx';
import { MainAppSetting } from './conatants/MainAppSetting';
import { BuildingManagementModule } from './Building-Management/building-management.module';
import { RentalsManagementModule } from './Rentals Management/rental-management.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BuildingManagementModule,
    RentalsManagementModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FileTransfer,
    Push,
    FileTransferObject,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MainAppSetting
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
