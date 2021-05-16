import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash-es/cloneDeep';
import { of, Subscription } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Abilities } from 'src/app/shared/models/abilities/abilities.model';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { AppState } from 'src/app/store/store.model';
import { getCampaignCurrent, getSheetCurrent } from 'src/app/store/store.reducer';

@Component({
  selector: 'app-ability-scores-modal',
  templateUrl: './ability-scores-modal.component.html',
  styleUrls: ['./ability-scores-modal.component.scss']
})
export class AbilityScoresModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  abilityScores: {[abilityName: string]: Abilities} = null;
  initialModValue: {[ability: string]: any} = null;

  currentSheetId: string;

  loadingModal = false;

  tempModifiers = this.form.group({
    str: this.form.control('', [this.positiveValidator]),
    dex: this.form.control('', [this.positiveValidator]),
    con: this.form.control('', [this.positiveValidator]),
    int: this.form.control('', [this.positiveValidator]),
    wis: this.form.control('', [this.positiveValidator]),
    cha: this.form.control('', [this.positiveValidator]),
  });

  get str() {
    return this.tempModifiers.get('str').value;
  }
  get dex() {
    return this.tempModifiers.get('dex').value;
  }
  get con() {
    return this.tempModifiers.get('con').value;
  }
  get int() {
    return this.tempModifiers.get('int').value;
  }
  get wis() {
    return this.tempModifiers.get('wis').value;
  }
  get cha() {
    return this.tempModifiers.get('cha').value;
  }

  subscription: Subscription;

  constructor(private form: FormBuilder,
              private store: Store<AppState>,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  ngOnInit(): void {
    this.subscription = this.store.select(getSheetCurrent).subscribe(({id, sheet}) => {
      if (!!sheet) {
        this.currentSheetId = id;
        this.abilityScores = cloneDeep(sheet.abilities);
        this.initialModValue = this.abilitiesToForm();
        this.tempModifiers.patchValue(this.initialModValue);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  positiveValidator(control: FormControl): { [error: string]: any } {
    return Number(control.value) < 0 ? ({ invalidNumber: true }) : null;
  }

  formToAbilities(): {[ability: string]: any} {
    const tempFormToAbilityScore = cloneDeep(this.abilityScores);
    for (const ability in tempFormToAbilityScore) {
      if (this.tempModifiers?.value.hasOwnProperty(tempFormToAbilityScore[ability].short.toLowerCase())) {
        const modFromForm = this.tempModifiers.value[
          tempFormToAbilityScore[ability].short.toLowerCase()
        ];
        tempFormToAbilityScore[ability].tempScore = isNaN(parseInt(modFromForm, 10)) ? null : parseInt(modFromForm, 10);
      }
    }
    return tempFormToAbilityScore;
  }

  abilitiesToForm(): {[ability: string]: any} {
    const tempModToForm = {};
    for (const ability in this.abilityScores) {
      if (!!this.abilityScores[ability]) {
        tempModToForm[this.abilityScores[ability].short.toLowerCase()] =
          this.abilityScores[ability].tempScore === null ?
            '' :
            this.abilityScores[ability].tempScore;
      }
    }
    return tempModToForm;
  }

  checkDifferences() {
    for (const ability in this.abilityScores) {
      if (this.tempModifiers?.value.hasOwnProperty(this.abilityScores[ability].short.toLowerCase())) {
        const valueFromForm = this.tempModifiers?.value[this.abilityScores[ability].short.toLowerCase()];
        const valueFromObj = this.initialModValue[this.abilityScores[ability].short.toLowerCase()];
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

  mod(value: any) {
    return UtilsService.getNumberSign(UtilsService.computeModifier(value));
  }

  resetTable() {
    this.tempModifiers.patchValue(this.initialModValue);
  }

  editAbilitiesScores() {
    this.tempModifiers.markAllAsTouched();
    if (this.tempModifiers.valid) {
      this.loadingModal = true;
      const abilities = this.formToAbilities();
      this.store.select(getCampaignCurrent).pipe(
        first(),
        switchMap((campaign: Campaign) => this.sheetService.updateSheetProperty(
            campaign.id,
            this.currentSheetId,
            {abilities},
            ['abilities'],
            [abilities],
          ).pipe(first())
        ),
        tap(() => {
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
  }

  show() {
    this.modal.show();
  }
}
