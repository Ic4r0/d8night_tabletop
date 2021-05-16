import { Component, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { SkillDisplay } from 'src/app/shared/models/skill/skill.model';

@Component({
  selector: 'app-display-skills-modal',
  templateUrl: './display-skills-modal.component.html',
  styleUrls: ['./display-skills-modal.component.scss']
})
export class DisplaySkillsModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  displayedSkills: string[] = [];
  originalDisplayedSkills: string[] = [];

  @Input() set display(value: string[]) {
    if (!!value) {
      this.displayedSkills = [...value];
      this.originalDisplayedSkills = [...value];
    }
  }
  @Input() totalSkills: SkillDisplay[] = [];
  @Input() campaign: string;
  @Input() sheet: string;

  loadingModal = false;

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService,
              public rollDice: DiceRollService) { }

  addDisplayedSkill(skillName: string) {
    const skillIdx = this.displayedSkills.findIndex((elem) => elem === skillName);
    if (skillIdx > -1) {
      this.displayedSkills.splice(skillIdx, 1);
    } else if (this.displayedSkills.length < 16) {
      this.displayedSkills.push(skillName);
    }
  }

  cancelEditDisplaySkill() {
    this.displayedSkills = [...this.originalDisplayedSkills];
  }

  confirmEditDisplaySkill() {
    this.loadingModal = true;
    this.displayedSkills.sort();
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      { skills: { display: [...this.displayedSkills] } },
      ['skills.display'],
      [[...this.displayedSkills]]
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

  checkDifferences() {
    return !UtilsService.equals(this.originalDisplayedSkills, this.displayedSkills);
  }

  public show() {
    this.modal.show();
  }
}
