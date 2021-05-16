import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-roll-modal',
  templateUrl: './roll-modal.component.html',
  styleUrls: ['./roll-modal.component.scss']
})
export class RollModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;
  d100 = 0;
  d20 = 0;
  d12 = 0;
  d10 = 0;
  d8 = 0;
  d6 = 0;
  d4 = 0;

  modifiersForm = this.form.group({
    d100Mod: this.form.control(''),
    d20Mod: this.form.control(''),
    d12Mod: this.form.control(''),
    d10Mod: this.form.control(''),
    d8Mod: this.form.control(''),
    d6Mod: this.form.control(''),
    d4Mod: this.form.control(''),
  });

  constructor(private rollService: DiceRollService,
              private form: FormBuilder) { }

  onRoll() {
    this.modifiersForm.markAllAsTouched();
    if (this.modifiersForm.valid) {
      let modifiersSum = 0;
      for (const el in this.modifiersForm.value) {
        if (this.modifiersForm.value.hasOwnProperty(el)) {
          if ((el === 'd100Mod' && this.d100 > 0) || (el === 'd20Mod' && this.d20 > 0) ||
            (el === 'd12Mod' && this.d12 > 0) || (el === 'd10Mod' && this.d10 > 0) ||
            (el === 'd8Mod' && this.d8 > 0) || (el === 'd6Mod' && this.d6 > 0) ||
            (el === 'd4Mod' && this.d4 > 0)) {
            modifiersSum += parseInt(this.modifiersForm.value[el], 10);
          }
        }
      }
      this.rollService.genericRoll(
        {
          d100: this.d100,
          d20: this.d20,
          d12: this.d12,
          d10: this.d10,
          d8: this.d8,
          d6: this.d6,
          d4: this.d4,
        },
        modifiersSum
      );
      this.reset();
    }
  }

  reset() {
    this.modifiersForm.reset();
    this.d100 = 0;
    this.d20 = 0;
    this.d12 = 0;
    this.d10 = 0;
    this.d8 = 0;
    this.d6 = 0;
    this.d4 = 0;
  }

  public show() {
    this.modal.show();
  }

}
