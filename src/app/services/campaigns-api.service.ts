import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, first, map, mergeMap, tap } from 'rxjs/operators';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { Campaign } from '../store/campaigns/campaigns.model';
import { Sheet } from '../shared/models/sheets/sheets.model';
import { User } from '../store/users/users.model';
import { cloneDeep } from 'lodash';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CampaignsApiService {

  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private toastr: CustomToastrService) { }

  public getCampaignsList(): Observable<Array<Campaign>> {
    return this.afs.collection('campaigns').valueChanges().pipe(
      first(),
      map((data) => Campaign.arrayFromREST(data)),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public updateCampaign(campaignToUpdate: Campaign) {
    return from(this.afs.doc(`campaigns/${campaignToUpdate.id}`).set(
      Campaign.objectToREST(campaignToUpdate)
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public getCampaign(campaignId: string): Observable<Campaign> {
    return this.afs.doc('campaigns/' + campaignId).valueChanges().pipe(
      first(),
      map((data) => Campaign.objectFromREST(data)),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public removeCampaign(campaign: Campaign): Observable<Campaign> {
    if (!!campaign.sheetSharing) {
      const sheetIdx: string[] = Object.keys(campaign.sheetSharing).map((idx) => idx);
      const observables = [];
      sheetIdx.forEach((idx) => {
        observables.push(from(this.afs.doc(`campaigns/${idx}/sheets/${idx}`).delete()));
      });
      return forkJoin(observables).pipe(
        mergeMap(() => from(this.afs.doc(`campaigns/${campaign.id}`).delete()).pipe(first())),
        tap(() => {
          this.storage.ref(campaign.pic).delete();
        }),
        catchError((err) => {
          this.toastr.error(err);
          return of(err);
        })
      );
    } else {
      return from(this.afs.doc(`campaigns/${campaign.id}`).delete()).pipe(
        first(),
        tap(() => {
          this.storage.ref(campaign.pic).delete();
        }),
        catchError((err) => {
          this.toastr.error(err);
          return of(err);
        })
      );
    }
  }

  public removePlayersSheets(id: string, sheetsIdx: string[]): Observable<any> {
    const observables = [];
    sheetsIdx.forEach((idx) => {
      observables.push(from(this.afs.doc(`campaigns/${id}/sheets/${idx}`).delete()));
    });
    return forkJoin(observables).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public getSheet(campaignId: string, sheetId: string): Observable<Sheet> {
    return this.afs.doc<Sheet>(`campaigns/${campaignId}/sheets/${sheetId}`).valueChanges().pipe(
      first(),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public addSheet(campaign: Campaign,
                  sheetSharingInfo: {
                    player: User,
                    sharedWith: Array<User>,
                    info: {
                      name: string,
                      classes: Array<{
                        name: string,
                        level: number
                      }>
                      maxHp: number
                    }
                  },
                  sheetId: string,
                  sheet: Sheet): Observable<any> {
    const updatedCampaign: Campaign = {
      ...campaign,
      sheetSharing: {
        ...campaign.sheetSharing,
        [sheetId]: { ...sheetSharingInfo }
      }
    };
    return from(this.afs.doc(`campaigns/${campaign.id}/sheets/${sheetId}`).set(
      sheet
    )).pipe(
      mergeMap(() => from(this.afs.doc(`campaigns/${campaign.id}`).set(
        Campaign.objectToREST(updatedCampaign)
      ))),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public updateSheet(campaignId: string,
                     sheetId: string,
                     sheet: Sheet): Observable<any> {
    return from(this.afs.doc(`campaigns/${campaignId}/sheets/${sheetId}`).set(
      sheet,
      { merge: true }
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public deleteSheet(campaign: Campaign,
                     sheetId: string): Observable<any> {
    const { [sheetId]: _, ...updatedSheetSharing } = campaign.sheetSharing;
    const updatedCampaign: Campaign = cloneDeep({
      ...campaign,
      sheetSharing: {
        ...updatedSheetSharing
      }
    });

    const campaignSheets = Object.keys(updatedCampaign.sheetSharing);
    for (const singleSheet of campaignSheets) {
      const isCompanion = !!updatedCampaign.sheetSharing[singleSheet].isCompanion &&
        updatedCampaign.sheetSharing[singleSheet]?.isCompanion === sheetId;
      const isOwner = !!updatedCampaign.sheetSharing[singleSheet].isOwner &&
        updatedCampaign.sheetSharing[singleSheet]?.isOwner.includes(sheetId);
      if (isCompanion) {
        delete updatedCampaign.sheetSharing[singleSheet].isCompanion;
      }
      if (isOwner) {
        const idx = updatedCampaign.sheetSharing[singleSheet]?.isOwner.findIndex((elem) => elem === sheetId);
        const newCompanions = [...updatedCampaign.sheetSharing[singleSheet]?.isOwner];
        newCompanions.splice(idx, 1);
        if (newCompanions.length > 0) {
          updatedCampaign.sheetSharing[singleSheet].isOwner = [...newCompanions];
        } else {
          delete updatedCampaign.sheetSharing[singleSheet].isOwner;
        }
      }
    }

    return from(this.afs.doc(`campaigns/${campaign.id}/sheets/${sheetId}`).delete())
      .pipe(
        first(),
        mergeMap(() => from(this.afs.doc(`campaigns/${campaign.id}`).set(
          Campaign.objectToREST(updatedCampaign)
        ))),
        catchError((err) => {
          this.toastr.error(err);
          return of(err);
        })
      );
  }

  public updateSheetAuth(campaign: Campaign,
                         sheetSharingInfo: {
                           player: User,
                           sharedWith: Array<User>,
                           info: {
                             name: string,
                             classes: Array<{
                               name: string,
                               level: number
                             }>,
                             maxHp: number
                           }
                         },
                         sheetId: string): Observable<any> {
    const updatedCampaign: Campaign = {
      ...campaign,
      sheetSharing: {
        ...campaign.sheetSharing,
        [sheetId]: { ...sheetSharingInfo }
      }
    };
    return from(this.afs.doc(`campaigns/${campaign.id}`).set(
        Campaign.objectToREST(updatedCampaign)
      )).pipe(
        catchError((err) => {
          this.toastr.error(err);
          return of(err);
        })
      );
  }

  public updateSheetProperty(campaignId: string,
                             sheetId: string,
                             propertyToChange: any): Observable<any> {
    return from(this.afs.doc(`campaigns/${campaignId}/sheets/${sheetId}`).set(
      propertyToChange,
      { merge: true }
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
