import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Initiative } from 'src/app/shared/models/initiative/initiative.model';

@Component({
  selector: 'app-initiative-modal',
  templateUrl: './initiative-modal.component.html',
  styleUrls: ['./initiative-modal.component.scss']
})
export class InitiativeModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  initiativeValue: Initiative = null;
  initialModValue: {temp: number} = null;

  tempModifier = this.form.group({
    temp: this.form.control(''),
  });

  loadingModal = false;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() set initiative(value: Initiative) {
    if (!!value) {
      this.initiativeValue = {...value};
      this.initialModValue = this.initiativeToForm();
      this.tempModifier.patchValue(this.initialModValue);
    }
  }

  get temp() {
    return this.tempModifier.get('temp').value;
  }

  constructor(private form: FormBuilder,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  checkDifferences() {
    const newValue = isNaN(parseInt(this.temp, 10)) ?
      0 : this.temp;
    return newValue !== this.initialModValue.temp;
  }

  formToInitiative(): number {
    const newValue = isNaN(parseInt(this.temp, 10)) ?
      0 : this.temp;
    return newValue;
  }

  initiativeToForm(): {temp: number} {
    return {
      temp: this.initiativeValue.tempMod
    };
  }

  resetTable() {
    this.tempModifier.patchValue(this.initialModValue);
  }

  editInitiative() {
    this.tempModifier.markAllAsTouched();
    if (this.tempModifier.valid) {
      this.loadingModal = true;
      const updatedInitiative = this.formToInitiative();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {initiative: {tempMod: updatedInitiative}},
        ['initiative.tempMod'],
        [updatedInitiative],
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
