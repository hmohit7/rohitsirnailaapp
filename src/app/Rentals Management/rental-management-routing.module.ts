import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    { path: 'home', loadChildren: '../Rentals Management/pages/home/home.module#HomePageModule' },
    { path: 'profile', loadChildren: '../Rentals Management/pages/profile/profile.module#ProfilePageModule' },
    { path: 'tickets', loadChildren: '../Rentals Management/pages/tickets/tickets.module#TicketsPageModule' },
    { path: 'calendar', loadChildren: '../Rentals Management/pages/calendar/calendar.module#CalendarPageModule' },
    { path: 'create-ticket', loadChildren: '../Rentals Management/pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
    { path: 'ticket-filter', loadChildren: '../Rentals Management/pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
    { path: 'user-search', loadChildren: '../Rentals Management/pages/user-search/user-search.module#UserSearchPageModule' },
    { path: 'project-search', loadChildren: '../Rentals Management/pages/project-search/project-search.module#ProjectSearchPageModule' },
    { path: 'unit-search', loadChildren: '../Rentals Management/pages/unit-search/unit-search.module#UnitSearchPageModule' },
    { path: 'ticket-category-search', loadChildren: '../Rentals Management/pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
    { path: 'ticket-sub-category-search', loadChildren: '../Rentals Management/pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
    { path: 'ticket-details', loadChildren: '../Rentals Management/pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
    { path: 'material-search', loadChildren: '../Rentals Management/pages/material-search/material-search.module#MaterialSearchPageModule' },
    { path: 'notice-board', loadChildren: '../Rentals Management/pages/notice-board/notice-board.module#NoticeBoardPageModule' },
    { path: 'notice-details', loadChildren: '../Rentals Management/pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
    { path: 'user-approval', loadChildren: '../Rentals Management/pages/user-approval/user-approval.module#UserApprovalPageModule' },
    { path: 'contact-us', loadChildren: '../Rentals Management/pages/contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'estimate', loadChildren: '../Rentals Management/pages/estimate/estimate.module#EstimatePageModule' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RentalsRoutingModule { }
