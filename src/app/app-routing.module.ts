import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'tickets', loadChildren: './pages/tickets/tickets.module#TicketsPageModule' },
  { path: 'calendar', loadChildren: './pages/calendar/calendar.module#CalendarPageModule' },
  { path: 'create-ticket', loadChildren: './pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
  { path: 'ticket-filter', loadChildren: './pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
  { path: 'user-search', loadChildren: './pages/user-search/user-search.module#UserSearchPageModule' },
  { path: 'project-search', loadChildren: './pages/project-search/project-search.module#ProjectSearchPageModule' },
  { path: 'unit-search', loadChildren: './pages/unit-search/unit-search.module#UnitSearchPageModule' },
  { path: 'ticket-category-search', loadChildren: './pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
  { path: 'ticket-sub-category-search', loadChildren: './pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
  { path: 'ticket-details', loadChildren: './pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
  { path: 'material-search', loadChildren: './pages/material-search/material-search.module#MaterialSearchPageModule' },
  { path: 'notice-board', loadChildren: './pages/notice-board/notice-board.module#NoticeBoardPageModule' },
  { path: 'notice-details', loadChildren: './pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
  // { path: 'notice-create', loadChildren: './pages/notice-create/notice-create.module#NoticeCreatePageModule' },
  { path: 'user-approval', loadChildren: './pages/user-approval/user-approval.module#UserApprovalPageModule' },
  { path: 'contact-us', loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'estimate', loadChildren: './pages/estimate/estimate.module#EstimatePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
