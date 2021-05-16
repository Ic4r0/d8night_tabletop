import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';

@Component({
  selector: 'app-over-sections-tab',
  templateUrl: './over-sections-tab.component.html',
  styleUrls: ['./over-sections-tab.component.scss']
})
export class OverSectionsTabComponent {
  @Input() initiative = '';
  @Input() ac = 0;
  @Input() defenses: string[] = null;
  @Input() senses = '';

  @Output() initiativeModal = new EventEmitter();
  @Output() acModal = new EventEmitter();
  @Output() defSensesModal = new EventEmitter();

  constructor(public rollDice: DiceRollService) { }

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
