import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Skill } from 'src/app/shared/models/skill/skill.model';

@Component({
  selector: 'app-single-skill-modal',
  templateUrl: './single-skill-modal.component.html',
  styleUrls: ['./single-skill-modal.component.scss']
})
export class SingleSkillModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  selectedSkill: Skill = null;
  initialModValue: {temp: number} = null;

  tempModifier = this.form.group({
    temp: this.form.control(''),
  });

  loadingModal = false;

  @Input() set skill(value: Skill) {
    if (!!value) {
      this.selectedSkill = {...value};
      this.initialModValue = this.skillToForm();
      this.tempModifier.patchValue(this.initialModValue);
    }
  }
  @Input() campaign: string;
  @Input() sheet: string;

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

  formToSkill(): number {
    const newValue = isNaN(parseInt(this.temp, 10)) ?
      0 : this.temp;
    return newValue;
  }

  skillToForm(): {temp: number} {
    return {
      temp: this.selectedSkill.modTemp
    };
  }

  resetTable() {
    this.tempModifier.patchValue(this.initialModValue);
  }

  editSingleSkill() {
    this.tempModifier.markAllAsTouched();
    if (this.tempModifier.valid) {
      this.loadingModal = true;
      const updatedSkill = this.formToSkill();
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        { skills: {skill: { [this.selectedSkill.name]: {modTemp: updatedSkill} } } },
        ['skills.skill.' + this.selectedSkill.name + '.modTemp'],
        [updatedSkill]
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
