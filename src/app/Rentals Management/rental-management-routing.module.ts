import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'rentals-home',
        pathMatch: 'full'
    },
    { path: 'rentals-home', loadChildren: '../Rentals Management/pages/home/home.module#HomePageModule' },
    { path: 'rentals-profile', loadChildren: '../Rentals Management/pages/profile/profile.module#ProfilePageModule' },
    { path: 'rentals-tickets', loadChildren: '../Rentals Management/pages/tickets/tickets.module#TicketsPageModule' },
    { path: 'rentals-calendar', loadChildren: '../Rentals Management/pages/calendar/calendar.module#CalendarPageModule' },
    { path: 'rentals-create-ticket', loadChildren: '../Rentals Management/pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
    { path: 'rentals-ticket-filter', loadChildren: '../Rentals Management/pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
    { path: 'rentals-user-search', loadChildren: '../Rentals Management/pages/user-search/user-search.module#UserSearchPageModule' },
    { path: 'rentals-project-search', loadChildren: '../Rentals Management/pages/project-search/project-search.module#ProjectSearchPageModule' },
    { path: 'rentals-unit-search', loadChildren: '../Rentals Management/pages/unit-search/unit-search.module#UnitSearchPageModule' },
    { path: 'rentals-ticket-category-search', loadChildren: '../Rentals Management/pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
    { path: 'rentals-ticket-sub-category-search', loadChildren: '../Rentals Management/pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
    { path: 'rentals-ticket-details', loadChildren: '../Rentals Management/pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
    { path: 'rentals-material-search', loadChildren: '../Rentals Management/pages/material-search/material-search.module#MaterialSearchPageModule' },
    { path: 'rentals-notice-board', loadChildren: '../Rentals Management/pages/notice-board/notice-board.module#NoticeBoardPageModule' },
    { path: 'rentals-notice-details', loadChildren: '../Rentals Management/pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
    { path: 'rentals-user-approval', loadChildren: '../Rentals Management/pages/user-approval/user-approval.module#UserApprovalPageModule' },
    { path: 'rentals-contact-us', loadChildren: '../Rentals Management/pages/contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'rentals-estimate', loadChildren: '../Rentals Management/pages/estimate/estimate.module#EstimatePageModule' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RentalsRoutingModule { }
