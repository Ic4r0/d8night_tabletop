import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store.model';

import { tap, first, mergeMap, catchError } from 'rxjs/operators';
import { getCampaignCurrent } from '../store/store.reducer';
import { of } from 'rxjs';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { Campaign } from '../store/campaigns/campaigns.model';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { setCurrentCampaign } from '../store/campaigns/campaigns.actions';

@Injectable()
export default class EditCampaignResolver implements Resolve<Campaign> {
  constructor(private campaignsApi: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (route.data.type === 'create') {
      this.store.dispatch(setCurrentCampaign(null));
      return of(null);
    } else if (route.data.type === 'edit') {
      const splittedUrl = state.url.split('/');
      const campaignId = splittedUrl[splittedUrl.length - 2];
      return this.store.select(getCampaignCurrent).pipe(
        first(),
        mergeMap((campaign: Campaign) => {
          if ((!!campaign && campaign?.id !== campaignId) || !(!!campaign)) {
            return this.campaignsApi.getCampaign(campaignId).pipe(
              tap(currCampaign => {
                this.store.dispatch(setCurrentCampaign({ campaign: currCampaign }));
              })
            );
          }
          return of(campaign);
        }),
        catchError((err) => {
          this.toastr.error(err);
          return of(err);
        })
      );
    }
  }
}
