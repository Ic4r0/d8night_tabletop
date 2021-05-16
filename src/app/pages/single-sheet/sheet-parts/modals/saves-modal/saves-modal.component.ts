import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash-es/cloneDeep';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { SavingThrow } from 'src/app/shared/models/saving-throw/saving-throw.model';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';
import { AppState } from 'src/app/store/store.model';
import { getCampaignCurrent, getSheetCurrent } from 'src/app/store/store.reducer';

@Component({
  selector: 'app-saves-modal',
  templateUrl: './saves-modal.component.html',
  styleUrls: ['./saves-modal.component.scss']
})
export class SavesModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  saves: {[save: string]: SavingThrow} = null;
  initialModValue: {[ability: string]: any} = null;

  tempModifiers = this.form.group({
    fortitude: this.form.control(''),
    reflex: this.form.control(''),
    will: this.form.control(''),
  });

  currentSheet: Sheet = null;
  sheetId: string;
  campaignId: string;

  get fortitude() {
    return this.tempModifiers.get('fortitude').value;
  }
  get reflex() {
    return this.tempModifiers.get('reflex').value;
  }
  get will() {
    return this.tempModifiers.get('will').value;
  }

  loadingModal = false;
  subscriptions: Subscription[] = [];

  constructor(private form: FormBuilder,
              private store: Store<AppState>,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(getSheetCurrent).subscribe(({id, sheet}) => {
        if (!!sheet) {
          this.sheetId = id;
          this.currentSheet = sheet;
          this.saves = cloneDeep(sheet.savingThrows);
          this.saves.fortitude.modAbility = sheet.abilities.Constitution.tempScore !== null ?
            UtilsService.computeModifier(sheet.abilities.Constitution.tempScore) :
            UtilsService.computeModifier(sheet.abilities.Constitution.score);
          this.saves.reflex.modAbility = sheet.abilities.Dexterity.tempScore !== null ?
            UtilsService.computeModifier(sheet.abilities.Dexterity.tempScore) :
            UtilsService.computeModifier(sheet.abilities.Dexterity.score);
          this.saves.will.modAbility = sheet.abilities.Wisdom.tempScore !== null ?
            UtilsService.computeModifier(sheet.abilities.Wisdom.tempScore) :
            UtilsService.computeModifier(sheet.abilities.Wisdom.score);
          this.initialModValue = this.savesToForm();
          this.tempModifiers.patchValue(this.initialModValue);
        }
      }),
      this.store.select(getCampaignCurrent).subscribe(({id}) => {
        if (!!id) {
          this.campaignId = id;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  formToSaves(): {[save: string]: any} {
    const tempFormToSave = cloneDeep(this.saves);
    for (const save in tempFormToSave) {
      if (this.tempModifiers?.value.hasOwnProperty(save)) {
        const modFromForm = this.tempModifiers.value[save];
        tempFormToSave[save].modTemp = isNaN(parseInt(modFromForm, 10)) ? null : parseInt(modFromForm, 10);
        tempFormToSave[save].modAbility = this.currentSheet.savingThrows[save].modAbility;
      }
    }
    return tempFormToSave;
  }

  savesToForm(): {[save: string]: any} {
    const tempModToForm = {};
    for (const save in this.saves) {
      if (!!this.saves[save]) {
        tempModToForm[save] =
          this.saves[save].modTemp === null ?
            '' :
            this.saves[save].modTemp;
      }
    }
    return tempModToForm;
  }

  checkDifferences() {
    for (const save in this.saves) {
      if (this.tempModifiers?.value.hasOwnProperty(save)) {
        const valueFromForm = this.tempModifiers?.value[save];
        const valueFromObj = this.initialModValue[save];
        const isFormNaN = isNaN(parseInt(valueFromForm, 10));
        const isObjNaN = isNaN(parseInt(valueFromObj, 10));
        if ((isFormNaN && !isObjNaN) || (!isFormNaN && isObjNaN) ||
          (!isFormNaN && !isObjNaN && parseInt(valueFromObj, 10) !== parseInt(valueFromForm, 10))) {
          return true;
        }
      }
    }
    return false;
  }

  resetTable() {
    this.tempModifiers.patchValue(this.initialModValue);
  }

  editSaves() {
    this.tempModifiers.markAllAsTouched();
    if (this.tempModifiers.valid) {
      this.loadingModal = true;
      const updatedSaves = this.formToSaves();
      this.sheetService.updateSheetProperty(
        this.campaignId,
        this.sheetId,
        {savingThrows: updatedSaves},
        ['savingThrows'],
        [updatedSaves]
      ).pipe(
        first(),
        tap(() => {
          this.modal.hide();
          this.loadingModal = false;
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    }
  }

  public show() {
    this.modal.show();
  }

}
