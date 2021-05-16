import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';

@Component({
  selector: 'app-mobile-fixed-info',
  templateUrl: './mobile-fixed-info.component.html',
  styleUrls: ['./mobile-fixed-info.component.scss']
})
export class MobileFixedInfoComponent {
  @Input() tablet = false;
  @Input() mobile = false;
  @Input() walk = '';
  @Input() initiative = '';
  @Input() ac = 0;
  @Input() defenses: string[] = null;
  @Input() senses = '';

  @Output() movementsModal = new EventEmitter();
  @Output() initiativeModal = new EventEmitter();
  @Output() armorClassModal = new EventEmitter();
  @Output() defensesSensesModal = new EventEmitter();

  constructor(public rollDice: DiceRollService) { }

  onOpenMovementsModal() {
    this.movementsModal.emit();
  }

  onOpenInitiativeModal() {
    this.initiativeModal.emit();
  }

  onOpenACModal() {
    this.armorClassModal.emit();
  }

  onOpenDefensesSensesModal() {
    this.defensesSensesModal.emit();
  }
}
