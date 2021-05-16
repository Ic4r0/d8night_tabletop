import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { AbilitiesDisplay, abilitiesText } from 'src/app/shared/models/abilities/abilities.model';
import { CombatModifiersDisplay, combatModsText } from 'src/app/shared/models/combat-modifiers/combat-modifiers.model';
import { savesText, SavingThrowDisplay } from 'src/app/shared/models/saving-throw/saving-throw.model';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';
import { SkillDisplay } from 'src/app/shared/models/skill/skill.model';
import { SkillModifiersModalComponent } from '../../modals/skill-modifiers-modal/skill-modifiers-modal.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  @ViewChild('skillsModsModal', { static: true }) skillsModsModal: SkillModifiersModalComponent;

  savesText: {name: string, lowerCase: string}[] = savesText;
  combatModsText: {name: string, lowerCase: string}[] = combatModsText;

  @Input() campaign: Campaign;
  @Input() sheetId: string;
  @Input() tablet = false;
  @Input() mobile = false;
  @Input() abilities: {[abilityName: string]: AbilitiesDisplay} = null;
  @Input() walk = '';
  @Input() newHpValue: number = null;
  @Input() currentHp = 0;
  @Input() maxHp = 0;
  @Input() tempHp = 0;
  @Input() saves: {[saveName: string]: SavingThrowDisplay} = null;
  @Input() combat: {[combatMod: string]: CombatModifiersDisplay} = null;
  @Input() conditionalMods = false;
  @Input() proficiencies = '';
  @Input() languages = '';
  @Input() skills: SkillDisplay[] = [];
  @Input() initiative = '';
  @Input() ac = 0;
  @Input() defenses: string[] = null;
  @Input() senses = '';
  @Input() sheet: Sheet = null;

  @Output() abilityScoresModal = new EventEmitter();
  @Output() movementsModal = new EventEmitter();
  @Output() changeHP = new EventEmitter<boolean>();
  @Output() hpModal = new EventEmitter();
  @Output() savesModal = new EventEmitter();
  @Output() combatModsModal = new EventEmitter();
  @Output() profLangModal = new EventEmitter();
  @Output() selectSkill = new EventEmitter<string>();
  @Output() skillsModal = new EventEmitter();
  @Output() initiativeModal = new EventEmitter();
  @Output() acModal = new EventEmitter();
  @Output() defSensesModal = new EventEmitter();

  constructor(public rollDice: DiceRollService) { }

  onOpenAbilityScoresModal() {
    this.abilityScoresModal.emit();
  }

  onOpenMovementsModal() {
    this.movementsModal.emit();
  }

  onChangeHP(isAdded: boolean) {
    this.changeHP.emit(isAdded);
  }

  onOpenHPModal() {
    this.hpModal.emit();
  }

  onOpenSavesModal() {
    this.savesModal.emit();
  }

  onOpenCombatModsModal() {
    this.combatModsModal.emit();
  }

  onOpenProfLangModal() {
    this.profLangModal.emit();
  }

  onSelectedSkill(skillName: string) {
    this.selectSkill.emit(skillName);
  }

  onOpenSkillsModal() {
    this.skillsModal.emit();
  }

  onOpenInitiativeModal() {
    this.initiativeModal.emit();
  }

  onOpenACModal() {
    this.acModal.emit();
  }

  onOpenDefSensesModal() {
    this.defSensesModal.emit();
  }
}
