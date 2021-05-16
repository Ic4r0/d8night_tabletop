import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { HitPoints } from 'src/app/shared/models/hit-points/hit-points.model';

@Component({
  selector: 'app-hit-points-modal',
  templateUrl: './hit-points-modal.component.html',
  styleUrls: ['./hit-points-modal.component.scss']
})
export class HitPointsModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  hpValue: HitPoints = null;
  currentHpValue: number;
  maxHpValue: number;
  hpRolls: {lvl: number, roll: number}[] = [];
  conValue: {original: number, temp: number} = null;
  conDifference: number = null;
  initialModValue: {maxHpTemp: number, tempHp: number} = null;

  tempModifiers = this.form.group({
    maxHpTemp: this.form.control(''),
    tempHp: this.form.control(''),
  });

  newHpValue: number = null;

  loadingModal = false;

  @Input() set constitution(value: {
    original: number,
    temp: number
  }) {
    if (!!value) {
      this.conValue = {...value};
      this.computeHP();
    }
  }
  @Input() set hitPoints(value: HitPoints) {
    if (!!value) {
      this.hpValue = {...value};
      this.computeHP();
      const levels = Object.keys(value.rollByLevel).map((elem) => parseInt(elem, 10));
      this.hpRolls = levels.map((lvl) => ({
        lvl,
        roll: value.rollByLevel[lvl]
      }));
    }
  }
  @Input() campaign: string;
  @Input() sheet: string;

  @Output() hp: EventEmitter<any> = new EventEmitter();

  get maxHpTemp() {
    return this.tempModifiers.get('maxHpTemp').value;
  }
  get tempHp() {
    return this.tempModifiers.get('tempHp').value;
  }

  constructor(private form: FormBuilder,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  formToHP() {
    const maxHpTemp = isNaN(parseInt(this.maxHpTemp, 10)) ?
      null : this.maxHpTemp - this.conDifference;
    const tempHp = isNaN(parseInt(this.tempHp, 10)) ?
      0 : this.tempHp;
    return {
      maxHpTemp,
      tempHp
    };
  }

  hpToForm() {
    return {
      maxHpTemp: this.hpValue.maxHpTemp,
      tempHp: this.hpValue.tempHp,
    };
  }

  editHP() {
    this.tempModifiers.markAllAsTouched();
    if (this.tempModifiers.valid) {
      this.loadingModal = true;
      const updatedHP = this.formToHP();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {hp: updatedHP},
        ['hp'],
        [updatedHP]
      ).pipe(
        first(),
        tap(() => {
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

  computeHP() {
    if (!!this.conValue && !! this.hpValue) {
      if (this.conValue.temp !== null) {
        const pcLevel = Math.max(
          ...Object.keys(this.hpValue.rollByLevel).map((elem) => parseInt(elem, 10))
        );
        this.conDifference += (UtilsService.computeModifier(this.conValue.temp) -
          UtilsService.computeModifier(this.conValue.original)) * pcLevel;
      }
      this.hpValue.maxHp += this.conDifference;
      if (!!this.hpValue.maxHpTemp) {
        this.hpValue.maxHpTemp += this.conDifference;
        this.maxHpValue = this.hpValue.maxHpTemp;
      } else {
        this.maxHpValue = this.hpValue.maxHp;
      }
      this.currentHpValue = this.hpValue.currentHp;
      this.initialModValue = this.hpToForm();
      this.tempModifiers.patchValue(this.initialModValue);
    }
  }

  resetTable() {
    this.tempModifiers.patchValue(this.initialModValue);
  }

  checkDifferences() {
    const maxHpTemp = isNaN(parseInt(this.maxHpTemp, 10)) ?
      null : this.maxHpTemp - this.conDifference;
    const tempHp = isNaN(parseInt(this.tempHp, 10)) ?
      0 : this.tempHp;
    return maxHpTemp !== this.initialModValue?.maxHpTemp ||
      tempHp !== this.initialModValue?.tempHp;
  }

  getNumberSign(numberToVerify: number): string {
    return UtilsService.getNumberSign(numberToVerify);
  }

  changeHP(isAdded: boolean) {
    if (!!this.newHpValue && this.newHpValue > 0) {
      this.hp.emit({isAdded, hpValue: this.newHpValue});
      this.newHpValue = null;
    }
  }

  public show() {
    this.modal.show();
  }
}
