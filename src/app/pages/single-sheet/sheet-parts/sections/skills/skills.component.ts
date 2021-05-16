import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { SkillDisplay } from 'src/app/shared/models/skill/skill.model';
import { SkillModifiersModalComponent } from '../../modals/skill-modifiers-modal/skill-modifiers-modal.component';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  @ViewChild('skillsModsModal', { static: true }) skillsModsModal: SkillModifiersModalComponent;

  @Input() skills: SkillDisplay[] = [];
  @Input() modifiers: string[];
  @Output() selected = new EventEmitter<string>();
  @Output() skillsModal = new EventEmitter();

  constructor(public rollDice: DiceRollService) { }

  onSelectedSkill(skillName: string) {
    this.selected.emit(skillName);
  }

  onOpenSkillsModal() {
    this.skillsModal.emit();
  }

}
