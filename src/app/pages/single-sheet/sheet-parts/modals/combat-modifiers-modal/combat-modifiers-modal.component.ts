import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-es';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { CombatModifiers } from 'src/app/shared/models/combat-modifiers/combat-modifiers.model';
import { AppState } from 'src/app/store/store.model';
import { getCampaignCurrent, getSheetCurrent } from 'src/app/store/store.reducer';

@Component({
  selector: 'app-combat-modifiers-modal',
  templateUrl: './combat-modifiers-modal.component.html',
  styleUrls: ['./combat-modifiers-modal.component.scss']
})
export class CombatModifiersModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  subscriptions: Subscription[] = [];
  abilitiesEdited = false;
  strDiff = '0';
  dexDiff = '0';
  bab = '0';
  combatModifiers: CombatModifiers = null;

  sheet: string;
  campaign: string;

  initialModValue: {[tempMod: string]: any} = null;

  tempModifiers = this.form.group({
    melee: this.form.control(''),
    ranged: this.form.control(''),
    cmb: this.form.control(''),
    cmd: this.form.control(''),
  });

  loadingModal = false;

  get melee() {
    return this.tempModifiers.get('melee').value;
  }
  get ranged() {
    return this.tempModifiers.get('ranged').value;
  }
  get cmb() {
    return this.tempModifiers.get('cmb').value;
  }
  get cmd() {
    return this.tempModifiers.get('cmd').value;
  }

  constructor(private form: FormBuilder,
              private store: Store<AppState>,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(getSheetCurrent).subscribe(({id, sheet}) => {
        if (!!sheet) {
          this.sheet = id;
          this.abilitiesEdited = sheet.abilities.Strength.tempScore !== null ||
            sheet.abilities.Dexterity.tempScore !== null;
          if (this.abilitiesEdited) {
            if (sheet.abilities.Strength.tempScore !== null) {
              this.strDiff = UtilsService.getNumberSign(
                UtilsService.computeModifier(sheet.abilities.Strength.tempScore) -
                UtilsService.computeModifier(sheet.abilities.Strength.score)
              );
            }
            if (sheet.abilities.Dexterity.tempScore !== null) {
              this.dexDiff = UtilsService.getNumberSign(
                UtilsService.computeModifier(sheet.abilities.Dexterity.tempScore) -
                UtilsService.computeModifier(sheet.abilities.Dexterity.score)
              );
            }
          }
          this.bab = UtilsService.getNumberSign(sheet.combat.bab);
          this.combatModifiers = cloneDeep(sheet.combat.attacks);
          this.initialModValue = this.combatModToForm();
          this.tempModifiers.patchValue(this.initialModValue);
        }
      }),
      this.store.select(getCampaignCurrent).subscribe(({id}) => {
        if (!!id) {
          this.campaign = id;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  formToCombatMod() {
    const combatMods = ['melee', 'ranged', 'cmb', 'cmd'];
    const tempFormToCombatMod = cloneDeep(this.combatModifiers);
    for (const mod of combatMods) {
      if (this.tempModifiers?.value.hasOwnProperty(mod)) {
        const modFromForm = this.tempModifiers.value[mod];
        tempFormToCombatMod[mod].modTemp = isNaN(parseInt(modFromForm, 10)) ? 0 : parseInt(modFromForm, 10);
      }
    }
    return tempFormToCombatMod;
  }

  combatModToForm() {
    return {
      melee: this.combatModifiers.melee.modTemp,
      ranged: this.combatModifiers.ranged.modTemp,
      cmb: this.combatModifiers.cmb.modTemp,
      cmd: this.combatModifiers.cmd.modTemp
    };
  }

  checkDifferences() {
    const combatMods = ['melee', 'ranged', 'cmb', 'cmd'];
    for (const mod of combatMods) {
      if (this.tempModifiers?.value.hasOwnProperty(mod)) {
        const valueFromForm = this.tempModifiers?.value[mod];
        const valueFromObj = this.initialModValue[mod];
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

  editMods() {
    this.tempModifiers.markAllAsTouched();
    if (this.tempModifiers.valid) {
      this.loadingModal = true;
      const updatedCombatMod = this.formToCombatMod();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {combat: {attacks: updatedCombatMod}},
        ['combat.attacks'],
        [updatedCombatMod],
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
