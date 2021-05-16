import { User } from 'src/app/store/users/users.model';
import { CampaignsApiService } from './../../../../../services/campaigns-api.service';
import { ModalComponent } from './../../../../../shared/modal/modal.component';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { Component, Input, ViewChild } from '@angular/core';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { catchError, first, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store.model';
import { updateCampaign } from 'src/app/store/campaigns/campaigns.actions';
import { CompanionsListModalComponent } from '../../modals/companions-list-modal/companions-list-modal.component';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})
export class ExtrasComponent {
  @ViewChild('companionListModal', {static: true}) companionListModal: CompanionsListModalComponent;
  @ViewChild('removeCompanionModal', {static: true}) removeCompanionModal: ModalComponent;

  @Input() mobile = false;
  @Input() tablet = false;
  @Input() set notes(value: string) {
    this.notesValue = value;
    this.originalNotes = value;
  }
  @Input() set sheet(value: string) {
    if (!!value) {
      this.sheetId = value;
      this.initCompanions();
    }
  }
  @Input() set campaign(value: Campaign) {
    if (!!value) {
      this.campaignValue = {...value};
      this.initCompanions();
    }
  }
  @Input() user: User;

  sheetId: string;
  campaignValue: Campaign;

  notesValue: string;
  originalNotes: string;

  companionsValue: {[idCompanion: string]: {name: string, level: number}} = null;
  companionsIdxList: string[] = null;

  selectedCompanion: {id: string, name: string};

  loading = false;
  loadingModal = false;

  constructor(private sheetService: SheetService,
              private campaignApiService: CampaignsApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  initCompanions() {
    if (!!this.sheetId && !!this.campaignValue) {
      this.companionsValue = {};
      this.companionsIdxList = [];
      const sheetsIds = Object.keys(this.campaignValue.sheetSharing);
      for (const idx of sheetsIds) {
        if (this.campaignValue.sheetSharing[idx].isCompanion === this.sheetId) {
          const name = this.campaignValue.sheetSharing[idx].info.name;
          const level = this.campaignValue.sheetSharing[idx].info.classes
            .map((singleClass) => singleClass.level)
            .reduce((a, b) => a + b, 0);
          this.companionsValue[idx] = {
            name,
            level
          };
          this.companionsIdxList.push(idx);
        }
      }
    }
  }

  submitNotes() {
    this.loading = true;
    this.sheetService.updateSheetProperty(
      this.campaignValue.id,
      this.sheetId,
      {notes: this.notesValue},
      ['notes'],
      [this.notesValue]
    ).pipe(
      first(),
      tap(() => {
        this.loading = false;
      }),
      catchError((err) => {
        this.loading = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  openCompanionTab(companionId: string) {
    window.open(
      `${window.location.origin}/campaigns/${this.campaignValue.id}/sheets/${companionId}`,
      '_blank'
    );
  }

  removeCompanion(companionId: string) {
    this.selectedCompanion = {
      id: companionId,
      name: this.companionsValue[companionId].name
    };
    this.removeCompanionModal.show();
  }

  confirmRemoval() {
    this.loadingModal = true;
    const updatedCampaign = cloneDeep(this.campaignValue);
    delete updatedCampaign.sheetSharing[this.selectedCompanion.id].isCompanion;
    const filteredCompanions = updatedCampaign.sheetSharing[this.sheetId].isOwner
      .filter((elem) => elem !== this.selectedCompanion.id);
    if (filteredCompanions.length > 0) {
      updatedCampaign.sheetSharing[this.sheetId].isOwner = [...filteredCompanions];
    } else {
      delete updatedCampaign.sheetSharing[this.sheetId].isOwner;
    }
    this.campaignApiService.updateCampaign(updatedCampaign).pipe(
      first(),
      tap(() => {
        this.store.dispatch(updateCampaign({campaign: updatedCampaign}));
        this.loadingModal = false;
        this.removeCompanionModal.hide();
      }),
      catchError((err) => {
        this.loadingModal = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }
}
