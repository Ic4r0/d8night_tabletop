import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-money-modal',
  templateUrl: './money-modal.component.html',
  styleUrls: ['./money-modal.component.scss']
})
export class MoneyModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() wealth = 0;

  loadingModal = false;

  userInput = this.form.group({
    pp: this.form.control('', [this.positiveValidator]),
    gp: this.form.control('', [this.positiveValidator]),
    sp: this.form.control('', [this.positiveValidator]),
    cp: this.form.control('', [this.positiveValidator]),
  }, {validators: [this.atLeastOne]});

  get pp() {
    return this.userInput.get('pp');
  }
  get gp() {
    return this.userInput.get('gp');
  }
  get sp() {
    return this.userInput.get('sp');
  }
  get cp() {
    return this.userInput.get('cp');
  }

  constructor(private form: FormBuilder,
              private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  private positiveValidator(control: FormControl): { [error: string]: any } {
    return Number(control.value) < 0 ? ({ invalidNumber: true }) : null;
  }

  private atLeastOne(group: FormGroup): { [error: string]: any } {
    const controls = Object.keys(group.controls);
    for (const control of controls) {
      const value = group.get(control).value;
      if (!isNaN(parseInt(value, 10))) {
        return null;
      }
    }
    return ({ atLeastOneRequired: true });
  }

  public show() {
    this.modal.show();
  }

  controlsInvalid() {
    return ((this.pp.touched || this.pp.dirty) && this.pp.invalid) ||
      ((this.gp.touched || this.gp.dirty) && this.gp.invalid) ||
      ((this.sp.touched || this.sp.dirty) && this.sp.invalid) ||
      ((this.cp.touched || this.cp.dirty) && this.cp.invalid);
  }

  resetModal() {
    this.userInput.reset();
  }

  submit(isAdded: boolean) {
    this.userInput.markAllAsTouched();
    if (this.userInput.valid) {
      this.loadingModal = true;
      const pp = isNaN(parseInt(this.pp.value, 10)) ? 0 : 10 * this.pp.value;
      const gp = isNaN(parseInt(this.gp.value, 10)) ? 0 : this.gp.value;
      const sp = isNaN(parseInt(this.sp.value, 10)) ? 0 : 0.1 * this.sp.value;
      const cp = isNaN(parseInt(this.cp.value, 10)) ? 0 : 0.01 * this.cp.value;
      const sign = isAdded ? 1 : -1;
      const value = this.wealth + sign * (pp + gp + sp + cp);
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {gear: {gold: value}},
        ['gear.gold'],
        [value],
      ).pipe(
        first(),
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

}
