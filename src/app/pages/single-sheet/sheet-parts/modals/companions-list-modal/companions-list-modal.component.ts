import { User } from './../../../../../store/users/users.model';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, tap } from 'rxjs/operators';
import { CampaignsApiService } from 'src/app/services/campaigns-api.service';
import cloneDeep from 'lodash-es/cloneDeep';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { AppState } from 'src/app/store/store.model';
import { getUserCurrent } from 'src/app/store/store.reducer';
import { of } from 'rxjs';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { updateCampaign } from 'src/app/store/campaigns/campaigns.actions';

@Component({
  selector: 'app-companions-list-modal',
  templateUrl: './companions-list-modal.component.html',
  styleUrls: ['./companions-list-modal.component.scss']
})
export class CompanionsListModalComponent implements OnInit, OnChanges {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  @Input() set campaign(value: Campaign) {
    if (!!value) {
      this.campaignValue = {...value};
    }
  }
  @Input() sheet: string;

  campaignValue: Campaign;
  currentUser: User;

  companionsValue: {[idCompanion: string]: {name: string, level: number, hp: number}} = null;
  companionsIdxList: string[] = null;
  selectedCompanions: string[] = null;

  loadingModal = false;

  constructor(private campaignApiService: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  ngOnInit(): void {
    this.store.select(getUserCurrent).pipe(
      first(),
      tap((user: User) => {
        this.currentUser = {...user};
        this.setCompanionsList();
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  ngOnChanges(): void {
    this.setCompanionsList();
  }

  setCompanionsList() {
    if (!!this.campaignValue && !!this.sheet && this.currentUser) {
      this.companionsValue = {};
      this.companionsIdxList = [];
      this.selectedCompanions = [];
      const sheetsIds = Object.keys(this.campaignValue.sheetSharing);
      for (const idx of sheetsIds) {
        const isSameUser = this.campaignValue.sheetSharing[idx].player.uid === this.currentUser.uid;
        const noOwner = !this.campaignValue.sheetSharing[idx].isCompanion;
        const sameSheet = idx === this.sheet;
        if (isSameUser && noOwner && !sameSheet) {
          const name = this.campaignValue.sheetSharing[idx].info.name;
          const level = this.campaignValue.sheetSharing[idx].info.classes
            .map((singleClass) => singleClass.level)
            .reduce((a, b) => a + b, 0);
          const hp = this.campaignValue.sheetSharing[idx].info.maxHp;
          this.companionsValue[idx] = {
            name,
            level,
            hp
          };
          this.companionsIdxList.push(idx);
        }
      }
    }
  }

  toggleCompanion(companionId: string) {
    const companionIdx = this.selectedCompanions.findIndex((elem) => elem === companionId);
    if (companionIdx > -1) {
      this.selectedCompanions.splice(companionIdx, 1);
    } else {
      this.selectedCompanions.push(companionId);
    }
  }

  submitCompanions() {
    this.loadingModal = true;
    const updatedCampaign = cloneDeep(this.campaignValue);
    if (!!updatedCampaign.sheetSharing[this.sheet].isOwner) {
      updatedCampaign.sheetSharing[this.sheet].isOwner.push(...this.selectedCompanions);
    } else {
      updatedCampaign.sheetSharing[this.sheet].isOwner = [...this.selectedCompanions];
    }
    for (const companionId of this.selectedCompanions) {
      updatedCampaign.sheetSharing[companionId].isCompanion = this.sheet;
    }
    this.campaignApiService.updateCampaign(updatedCampaign).pipe(
      first(),
      tap(() => {
        this.store.dispatch(updateCampaign({campaign: updatedCampaign}));
        this.loadingModal = false;
        this.modal.hide();
      }),
      catchError((err) => {
        this.loadingModal = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  reset() {
    this.selectedCompanions = [];
  }

  public show() {
    this.modal.show();
  }
}
