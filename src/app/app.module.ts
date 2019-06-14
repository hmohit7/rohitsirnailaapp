import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { TicketFilterPageModule } from './pages/ticket-filter/ticket-filter.module';
import { UnitSearchPageModule } from './pages/unit-search/unit-search.module';
import { ProjectSearchPageModule } from './pages/project-search/project-search.module';
import { UserSearchPageModule } from './pages/user-search/user-search.module';
import { TicketCategorySearchPageModule } from './pages/ticket-category-search/ticket-category-search.module';
import { TicketSubCategorySearchPageModule } from './pages/ticket-sub-category-search/ticket-sub-category-search.module';
import { MaterialSearchPageModule } from './pages/material-search/material-search.module';
import { NoticeCreatePageModule } from './pages/notice-create/notice-create.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TicketFilterPageModule,
    UnitSearchPageModule,
    ProjectSearchPageModule,
    UserSearchPageModule,
    TicketCategorySearchPageModule,
    TicketSubCategorySearchPageModule,
    MaterialSearchPageModule,
    NoticeCreatePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
