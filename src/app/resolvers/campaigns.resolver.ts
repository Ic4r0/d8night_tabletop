import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store.model';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { Campaign } from '../store/campaigns/campaigns.model';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { setTotalListCampaigns } from '../store/campaigns/campaigns.actions';

@Injectable()
export default class CampaignsResolver implements Resolve<Array<Campaign>> {
  constructor(private campaignsApi: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  resolve() {
    return this.campaignsApi.getCampaignsList().pipe(
      tap((list) => {
        this.store.dispatch(setTotalListCampaigns({ list }));
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
