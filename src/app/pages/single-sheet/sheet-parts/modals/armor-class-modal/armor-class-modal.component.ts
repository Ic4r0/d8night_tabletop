import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ArmorClass } from 'src/app/shared/models/armor-class/armor-class.model';

@Component({
  selector: 'app-armor-class-modal',
  templateUrl: './armor-class-modal.component.html',
  styleUrls: ['./armor-class-modal.component.scss']
})
export class ArmorClassModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  acValue: ArmorClass = null;
  initialModValue: {
    armorBonusTemp: number,
    shieldBonusTemp: number,
    statModTemp: number,
    sizeModTemp: number,
    naturalArmorTemp: number,
    deflectionTemp: number,
    dodgeBonusTemp: number,
    classBonusTemp: number,
    miscTemp: number,
    insightTemp: number,
    moraleTemp: number,
    sacredTemp: number,
    profaneTemp: number,
  } = null;

  tempModifiers = this.form.group({
    armorBonusTemp: this.form.control(''),
    shieldBonusTemp: this.form.control(''),
    statModTemp: this.form.control(''),
    sizeModTemp: this.form.control(''),
    naturalArmorTemp: this.form.control(''),
    deflectionTemp: this.form.control(''),
    dodgeBonusTemp: this.form.control(''),
    classBonusTemp: this.form.control(''),
    miscTemp: this.form.control(''),
    insightTemp: this.form.control(''),
    moraleTemp: this.form.control(''),
    sacredTemp: this.form.control(''),
    profaneTemp: this.form.control(''),
  });

  totalAC = 0;
  touchAC = 0;
  flatAC = 0;

  loadingModal = false;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() set armorClass(value: ArmorClass) {
    if (!!value) {
      this.acValue = {...value};
      this.computeAC();
      this.initialModValue = this.acToForm();
      this.tempModifiers.patchValue(this.initialModValue);
    }
  }

  get armorBonusTemp() {
    return this.tempModifiers.get('armorBonusTemp').value;
  }
  get shieldBonusTemp() {
    return this.tempModifiers.get('shieldBonusTemp').value;
  }
  get statModTemp() {
    return this.tempModifiers.get('statModTemp').value;
  }
  get sizeModTemp() {
    return this.tempModifiers.get('sizeModTemp').value;
  }
  get naturalArmorTemp() {
    return this.tempModifiers.get('naturalArmorTemp').value;
  }
  get deflectionTemp() {
    return this.tempModifiers.get('deflectionTemp').value;
  }
  get dodgeBonusTemp() {
    return this.tempModifiers.get('dodgeBonusTemp').value;
  }
  get classBonusTemp() {
    return this.tempModifiers.get('classBonusTemp').value;
  }
  get miscTemp() {
    return this.tempModifiers.get('miscTemp').value;
  }
  get insightTemp() {
    return this.tempModifiers.get('insightTemp').value;
  }
  get moraleTemp() {
    return this.tempModifiers.get('moraleTemp').value;
  }
  get sacredTemp() {
    return this.tempModifiers.get('sacredTemp').value;
  }
  get profaneTemp() {
    return this.tempModifiers.get('profaneTemp').value;
  }

  constructor(private form: FormBuilder,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  checkDifferences() {
    for (const tempMod in this.tempModifiers.value) {
      if (this.tempModifiers?.value.hasOwnProperty(tempMod)) {
        const tempValue = isNaN(parseInt(this.tempModifiers.value[tempMod], 10)) ?
          null : this.tempModifiers.value[tempMod];
        if (tempValue !== this.initialModValue[tempMod]) {
          return true;
        }
      }
    }
    return false;
  }

  formToAC() {
    const newValue = {...this.acValue};
    for (const tempMod in this.tempModifiers.value) {
      if (this.tempModifiers.value.hasOwnProperty(tempMod)) {
        const tempValue = isNaN(parseInt(this.tempModifiers.value[tempMod], 10)) ?
          0 : this.tempModifiers.value[tempMod];
        newValue[tempMod] = tempValue;
      }
    }
    return newValue;
  }

  acToForm() {
    return {
      armorBonusTemp: this.acValue.armorBonusTemp,
      shieldBonusTemp: this.acValue.shieldBonusTemp,
      statModTemp: this.acValue.statModTemp,
      sizeModTemp: this.acValue.sizeModTemp,
      naturalArmorTemp: this.acValue.naturalArmorTemp,
      deflectionTemp: this.acValue.deflectionTemp,
      dodgeBonusTemp: this.acValue.dodgeBonusTemp,
      classBonusTemp: this.acValue.classBonusTemp,
      miscTemp: this.acValue.miscTemp,
      insightTemp: this.acValue.insightTemp,
      moraleTemp: this.acValue.moraleTemp,
      sacredTemp: this.acValue.sacredTemp,
      profaneTemp: this.acValue.profaneTemp
    };
  }

  resetTable() {
    this.tempModifiers.patchValue(this.initialModValue);
  }

  editAC() {
    this.tempModifiers.markAllAsTouched();
    if (this.tempModifiers.valid) {
      this.loadingModal = true;
      const updatedAC = this.formToAC();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {ac: updatedAC},
        ['ac'],
        [updatedAC],
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

  computeAC() {
    [this.totalAC, this.touchAC, this.flatAC] = SheetService.computeAC(
      this.acValue,
      this.acValue.statMod,
      true
    );
  }

  getNumberSign(numberToVerify: number): string {
    return UtilsService.getNumberSign(numberToVerify);
  }

  public show() {
    this.modal.show();
  }
}
