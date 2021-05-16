import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Conditions } from 'src/app/shared/models/conditions/conditions.model';
import { conditions } from 'src/assets/rules/conditions.list';
import mapValues from 'lodash-es/mapValues';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { catchError, first, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-conditions-modal',
  templateUrl: './conditions-modal.component.html',
  styleUrls: ['./conditions-modal.component.scss']
})
export class ConditionsModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  conditionsValue: {[condition: string]: boolean} = {};
  conditionsList: Conditions[] = [...conditions];
  descriptionOpen: {[condition: string]: boolean} = {};

  loadingModal = false;

  @Input() set conditions(value: {[condition: string]: boolean}) {
    if (!!value) {
      this.conditionsValue = {...value};
      this.descriptionOpen = mapValues(value, () => false);
      this.tempValues.patchValue(value);
    }
  }
  @Input() campaign: string;
  @Input() sheet: string;

  tempValues = this.form.group({
    bleed: this.form.control(false),
    blinded: this.form.control(false),
    confused: this.form.control(false),
    cowering: this.form.control(false),
    dazzled: this.form.control(false),
    deafened: this.form.control(false),
    dying: this.form.control(false),
    energyDrained: this.form.control(false),
    entangled: this.form.control(false),
    exhausted: this.form.control(false),
    fascinated: this.form.control(false),
    fatigued: this.form.control(false),
    frightned: this.form.control(false),
    grappled: this.form.control(false),
    helpless: this.form.control(false),
    invisible: this.form.control(false),
    nauseated: this.form.control(false),
    panicked: this.form.control(false),
    paralyzed: this.form.control(false),
    petrified: this.form.control(false),
    pinned: this.form.control(false),
    shaken: this.form.control(false),
    sickened: this.form.control(false),
    staggered: this.form.control(false),
    stunned: this.form.control(false),
    unconscious: this.form.control(false),
  });


  constructor(private form: FormBuilder,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  reset() {
    this.tempValues.patchValue(this.conditionsValue);
  }

  checkDifferences() {
    for (const tempValue in this.tempValues.value) {
      if (this.tempValues?.value.hasOwnProperty(tempValue) &&
        this.tempValues.value[tempValue] !== this.conditionsValue[tempValue]) {
        return true;
      }
    }
    return false;
  }

  formToConditions() {
    return this.tempValues.value;
  }

  editConditions() {
    this.tempValues.markAllAsTouched();
    if (this.tempValues.valid) {
      this.loadingModal = true;
      const updatedConditions = this.formToConditions();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {conditions: updatedConditions},
        ['conditions'],
        [updatedConditions]
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

  changeValue(conditionName: string) {
    this.tempValues.controls[conditionName].setValue(
      !this.tempValues.get(conditionName).value
    );
  }

  toggleDescription(conditionName: string) {
    for (const name of Object.keys(this.descriptionOpen)) {
      this.descriptionOpen[name] = name === conditionName ?
        !this.descriptionOpen[name] :
        false;
    }
  }

  checkString(description: any) {
    return typeof description === 'string';
  }

  public show() {
    this.modal.show();
  }
}
