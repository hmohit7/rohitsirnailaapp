import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    { path: 'home', loadChildren: '../Building-Management/pages/home/home.module#HomePageModule' },
    { path: 'profile', loadChildren: '../Building-Management/pages/profile/profile.module#ProfilePageModule' },
    { path: 'tickets', loadChildren: '../Building-Management/pages/tickets/tickets.module#TicketsPageModule' },
    { path: 'calendar', loadChildren: '../Building-Management/pages/calendar/calendar.module#CalendarPageModule' },
    { path: 'create-ticket', loadChildren: '../Building-Management/pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
    { path: 'ticket-filter', loadChildren: '../Building-Management/pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
    { path: 'user-search', loadChildren: '../Building-Management/pages/user-search/user-search.module#UserSearchPageModule' },
    { path: 'project-search', loadChildren: '../Building-Management/pages/project-search/project-search.module#ProjectSearchPageModule' },
    { path: 'unit-search', loadChildren: '../Building-Management/pages/unit-search/unit-search.module#UnitSearchPageModule' },
    { path: 'ticket-category-search', loadChildren: '../Building-Management/pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
    { path: 'ticket-sub-category-search', loadChildren: '../Building-Management/pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
    { path: 'ticket-details', loadChildren: '../Building-Management/pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
    { path: 'material-search', loadChildren: '../Building-Management/pages/material-search/material-search.module#MaterialSearchPageModule' },
    { path: 'notice-board', loadChildren: '../Building-Management/pages/notice-board/notice-board.module#NoticeBoardPageModule' },
    { path: 'notice-details', loadChildren: '../Building-Management/pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
    { path: 'user-approval', loadChildren: '../Building-Management/pages/user-approval/user-approval.module#UserApprovalPageModule' },
    { path: 'contact-us', loadChildren: '../Building-Management/pages/contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'estimate', loadChildren: '../Building-Management/pages/estimate/estimate.module#EstimatePageModule' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class BuildingManagementRoutingModule { }
