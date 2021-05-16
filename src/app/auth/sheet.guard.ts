import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { setCurrentCampaign } from '../store/campaigns/campaigns.actions';
import { Campaign } from '../store/campaigns/campaigns.model';
import { AppState } from '../store/store.model';
import { getCampaignCurrent } from '../store/store.reducer';
import { User } from '../store/users/users.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SheetGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router,
              private store: Store<AppState>,
              private campaignsApi: CampaignsApiService,
              private toastr: CustomToastrService) {}

  loggedUser: User;

  checkUserAuthorization(campaign: Campaign, user: User, sheetId: string) {
    return campaign.master.uid === user.uid ||
           campaign?.sheetSharing[sheetId].player.uid === user.uid ||
           campaign?.sheetSharing[sheetId].sharedWith.some(({uid}) => uid === user.uid);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const splittedUrl = state.url.split('/');
    const campaignId = splittedUrl[splittedUrl.length - 3];
    const sheetId = splittedUrl[splittedUrl.length - 1];

    return this.auth.user$.pipe(
      first(),
      mergeMap((user) => {
        this.loggedUser = user;
        return this.store.select(getCampaignCurrent).pipe(first());
      }),
      mergeMap((campaign) => {
        if ((!!campaign && campaign?.id !== campaignId) || !(!!campaign)) {
          return this.campaignsApi.getCampaign(campaignId).pipe(
            tap(currCampaign => {
              this.store.dispatch(setCurrentCampaign({ campaign: currCampaign }));
            })
          );
        }
        return of(campaign);
      }),
      map((fetchedCampaign) => !!fetchedCampaign &&
                               !!this.loggedUser &&
                               this.checkUserAuthorization(fetchedCampaign, this.loggedUser, sheetId)),
      tap((isAuthorized) => {
        if (!isAuthorized) {
          this.toastr.warning(
            'Non sei autorizzato a visualizzare questa scheda',
            'Attenzione'
          );
          this.router.navigate(['/campaigns']);
        }
      })
    );
  }
}
