import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Push } from '@ionic-native/push/ngx';
import { MainAppSetting } from './conatants/MainAppSetting';
import { BuildingManagementModule } from './Building-Management/building-management.module';
import { RentalsManagementModule } from './Rentals Management/rental-management.module';
import { UserSearchPipe } from './Rentals Management/pipes/user-search-pipe';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { StorageService } from './common-services/storage-service.service';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { OrgModalComponent } from './common-components/org-modal/org-modal.component';
import { CountrycodemodalComponent } from './login/countrycodemodal/countrycodemodal.component';
import { FilterPipe } from './login/countrycodemodal/Filter.pipe';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { Device } from '@ionic-native/device/ngx'
import { OrderModule } from 'ngx-order-pipe'
import { PictureComponent } from './common-components/picture/picture.component';


@NgModule({
  declarations: [
    AppComponent,
    OrgModalComponent,
    CountrycodemodalComponent,
    PictureComponent,
    FilterPipe
  ],
  entryComponents: [OrgModalComponent, CountrycodemodalComponent, PictureComponent],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AvatarModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md'
    }),
    OrderModule,
    AppRoutingModule,
    BuildingManagementModule,
    RentalsManagementModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MainAppSetting,
    Camera,
    FileTransfer,
    FileTransferObject,
    HTTP,
    StorageService,
    Push,
    Device,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
