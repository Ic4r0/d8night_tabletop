import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Spell } from 'src/app/shared/models/spell/spell.model';

@Component({
  selector: 'app-spell-details-modal',
  templateUrl: './spell-details-modal.component.html',
  styleUrls: ['./spell-details-modal.component.scss']
})
export class SpellDetailsModalComponent {
  @ViewChild('modal', { static: true }) modal: ModalComponent;

  @Input() spell: Spell;

  public show() {
    this.modal.show();
  }
}
