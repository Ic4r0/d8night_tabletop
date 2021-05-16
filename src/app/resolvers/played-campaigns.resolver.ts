import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store.model';

import { tap, first, mergeMap, catchError } from 'rxjs/operators';
import { getCampaignsList, getUserCurrent } from '../store/store.reducer';
import { of } from 'rxjs';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { Campaign } from '../store/campaigns/campaigns.model';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { setListCampaigns } from '../store/campaigns/campaigns.actions';
import { User } from '../store/users/users.model';

@Injectable()
export default class PlayedCampaignsResolver implements Resolve<Array<Campaign>> {
  constructor(private campaignsApi: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  loggedUser: User;

  checkUserCampaign(campaign: Campaign, user: User) {
    return campaign.master.uid === user.uid || campaign.players.some(({uid}) => uid === user.uid);
  }

  resolve() {
    return this.store.select(getUserCurrent).pipe(
      first(),
      mergeMap((user) => {
        this.loggedUser = user;
        return this.store.select(getCampaignsList).pipe(first());
      }),
      mergeMap((campaigns) => {
        if (campaigns.length === 0) {
          return this.campaignsApi.getCampaignsList().pipe(
            tap((list) => {
              const userCampaigns = list.filter((campaign) => this.checkUserCampaign(campaign, this.loggedUser));
              this.store.dispatch(setListCampaigns({ list: userCampaigns }));
            })
          );
        }
        return of(campaigns);
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
