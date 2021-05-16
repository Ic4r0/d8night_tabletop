import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { QuotesManagementComponent } from './pages/quotes-management/quotes-management.component';
import { CampaignsListComponent } from './pages/campaigns-list/campaigns-list.component';
import { SingleCampaignComponent } from './pages/single-campaign/single-campaign.component';
import { EditCampaignComponent } from './pages/edit-campaign/edit-campaign.component';

import UsersManagementResolver from './resolvers/users-management.resolver';
import QuotesResolver from './resolvers/quotes.resolver';
import PlayedCampaignsResolver from './resolvers/played-campaigns.resolver';
import UsersResolver from './resolvers/users.resolver';
import CampaignsResolver from './resolvers/campaigns.resolver';
import EditCampaignResolver from './resolvers/edit-campaign.resolver';
import SingleCampaignResolver from './resolvers/single-campaign.resolver';
import SingleSheetResolver from './resolvers/single-sheet.resolver';

import { AdminGuard } from './auth/admin.guard';
import { PlayerGuard } from './auth/player.guard';
import { CampaignGuard } from './auth/campaign.guard';
import { EditCampaignGuard } from './auth/edit-campaign.guard';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { SingleSheetComponent } from './pages/single-sheet/single-sheet.component';
import { SheetGuard } from './auth/sheet.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LandingComponent,
    resolve: [QuotesResolver]
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    resolve: [QuotesResolver]
  },
  {
    path: 'credits',
    component: CreditsComponent,
    resolve: [QuotesResolver]
  },
  {
    path: 'admin',
    component: UsersManagementComponent,
    canActivate: [AdminGuard],
    resolve: [UsersManagementResolver, QuotesResolver, CampaignsResolver]
  },
  {
    path: 'quotes',
    component: QuotesManagementComponent,
    canActivate: [AdminGuard],
    resolve: [QuotesResolver]
  },
  {
    path: 'campaigns',
    resolve: [QuotesResolver, PlayedCampaignsResolver],
    canActivate: [PlayerGuard],
    children: [
      {
        path: '',
        component: CampaignsListComponent,
      },
      {
        path: 'new',
        component: EditCampaignComponent,
        resolve: [UsersResolver, EditCampaignResolver],
        data: {
          type: 'create'
        }
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: SingleCampaignComponent,
            canActivate: [CampaignGuard],
            resolve: [SingleCampaignResolver]
          },
          {
            path: 'edit',
            component: EditCampaignComponent,
            canActivate: [EditCampaignGuard],
            resolve: [UsersResolver, EditCampaignResolver],
            data: {
              type: 'edit'
            }
          },
          {
            path: 'sheets/:id',
            component: SingleSheetComponent,
            canActivate: [SheetGuard],
            resolve: [SingleSheetResolver],
            data: {
              type: 'edit'
            }
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
