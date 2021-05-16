import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { AbilitiesDisplay, abilitiesText } from 'src/app/shared/models/abilities/abilities.model';

@Component({
  selector: 'app-ability-grid',
  templateUrl: './ability-grid.component.html',
  styleUrls: ['./ability-grid.component.scss']
})
export class AbilityGridComponent {
  abilitiesText: {name: string, abbr: string}[] = abilitiesText;
  @Input() abilities: {[abilityName: string]: AbilitiesDisplay} = null;

  @Output() modal = new EventEmitter();

  constructor(public diceRoll: DiceRollService) { }

  onOpenAbilityScoresModal() {
    this.modal.emit();
  }
}
