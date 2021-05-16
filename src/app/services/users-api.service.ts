import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, from, Observable, of } from 'rxjs';
import { User } from '../store/users/users.model';
import { catchError, first, map, take } from 'rxjs/operators';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { Campaign } from '../store/campaigns/campaigns.model';
import { CampaignsApiService } from './campaigns-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private afs: AngularFirestore,
              private toastr: CustomToastrService,
              private campaignApi: CampaignsApiService) {}

  public getUsersList(): Observable<Array<User>> {
    return this.afs.collection('users').valueChanges().pipe(
      take(2), // because this call receive the current user before the full player list
      map((data) => User.arrayFromREST(data)),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public deleteUsers(usersToRemove: Array<User>, campaignList: Array<Campaign>) {
    const usersIdx: string[] = usersToRemove.map(({uid}) => uid);
    const usersObservables = [];
    usersIdx.forEach((idx) => {
      usersObservables.push(from(this.afs.doc<User>(`users/${idx}`).delete()));
    });
    const masteredCampaigns = this.getMasteredCampaigns(usersToRemove, campaignList);
    const campaignsToDeleteObservables = masteredCampaigns.map((campaign) => this.campaignApi.removeCampaign(campaign));
    const campaignsToUpdate = this.getCampaignsToUpdate(usersToRemove, campaignList.filter((campaign) =>
      masteredCampaigns.every(({id}) => id !== campaign.id)));
    const sheetsToRemoveObservables = [];
    Object.keys(campaignsToUpdate.sheets).forEach((campaignId) => {
      const sheetsIdx = [...campaignsToUpdate.sheets[campaignId]];
      sheetsToRemoveObservables.push(this.campaignApi.removePlayersSheets(campaignId, sheetsIdx));
    });
    const campaignsToUpdateObservables = [];
    campaignsToUpdate.updated.forEach((campaign) => {
      campaignsToUpdateObservables.push(this.campaignApi.updateCampaign(campaign));
    });

    const observables = [
      ...usersObservables,
      ...campaignsToDeleteObservables,
      ...sheetsToRemoveObservables,
      ...campaignsToUpdateObservables
    ];

    return forkJoin(observables).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  private getMasteredCampaigns(usersList: Array<User>, campaignsList: Array<Campaign>): Array<Campaign> {
    const outputCampaignList = [];
    campaignsList.forEach((campaign) => {
      if (usersList.some(({uid}) => uid === campaign.master.uid)) {
        outputCampaignList.push(campaign);
      }
    });
    return outputCampaignList;
  }

  private getCampaignsToUpdate(usersList: Array<User>, campaignsList: Array<Campaign>) {
    const outputCampaigns = {
      updated: [],
      sheets: {}
    };
    campaignsList.forEach((campaign) => {
      if (usersList.some(({uid}) => campaign.players.some((player) => uid === player.uid))) {
        const sheetsIdx: string[] = [];
        const newSheetSharing = {};
        const diffPlayers = usersList.filter(({uid}) => campaign.players.some((user) => user.uid !== uid));
        Object.keys(campaign.sheetSharing).forEach((key) => {
          const player = campaign.sheetSharing[key].player;
          const sharedWith = campaign.sheetSharing[key].sharedWith;
          if (diffPlayers.some((user) => user.uid ===  player.uid)) {
            sheetsIdx.push(key);
          } else {
            newSheetSharing[key] = {
              ...campaign.sheetSharing[key],
              sharedWith: sharedWith.filter(({uid}) => diffPlayers.every((user) => user.uid !== uid))
            };
          }
        });
        outputCampaigns.updated.push({
          ...campaign,
          players: campaign.players.filter(({uid}) => diffPlayers.every((user) => user.uid !== uid)),
          sheetSharing: { ...newSheetSharing }
        });
        if (sheetsIdx.length > 0) {
          outputCampaigns[campaign.id] = [...sheetsIdx];
        }
      }
    });
    return outputCampaigns;
  }

  public updateUsers(usersToUpdate: Array<User>) {
    const observables = [];
    User.arrayToREST(usersToUpdate).forEach((user) => {
      observables.push(from(this.afs.doc<User>(`users/${user.uid}`).set(user, { merge: true })));
    });
    return forkJoin(observables).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public privacyConsent(userUID: string) {
    return from(this.afs.doc(`users/${userUID}`).set(
      { privacyConsent: true },
      { merge: true }
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public privacyRejection(userUID: string) {
    return from(this.afs.doc<User>(`users/${userUID}`).delete()).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
