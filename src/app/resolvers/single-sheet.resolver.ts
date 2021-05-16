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
import { setCurrentCampaign, setCurrentSheet, updateSheet } from '../store/campaigns/campaigns.actions';
import { Sheet } from '../shared/models/sheets/sheets.model';

@Injectable()
export default class SingleSheetResolver implements Resolve<Sheet> {
  constructor(private campaignsApi: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const splittedUrl = state.url.split('/');
    const campaignId = splittedUrl[splittedUrl.length - 3];
    const sheetId = splittedUrl[splittedUrl.length - 1];
    return this.store.select(getCampaignCurrent).pipe(
      first(),
      mergeMap((campaign: Campaign) => {
        if ((!!campaign && campaign?.id !== campaignId) || !(!!campaign)) {
          return this.campaignsApi.getCampaign(campaignId).pipe(
            tap((currCampaign: Campaign) => {
              this.store.dispatch(setCurrentCampaign({ campaign: currCampaign }));
            })
          );
        }
        return of(campaign);
      }),
      mergeMap((campaign: Campaign) => {
        if (sheetId in campaign.sheets) {
          this.store.dispatch(setCurrentSheet({ id: sheetId, sheet: campaign.sheets[sheetId] }));
          return of(campaign.sheets[sheetId]);
        } else {
          return this.campaignsApi.getSheet(campaignId, sheetId).pipe(
            tap((currSheet: Sheet) => {
              this.store.dispatch(setCurrentSheet({ id: sheetId, sheet: currSheet }));
            })
          );
        }
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
