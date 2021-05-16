import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-skill-modifiers-modal',
  templateUrl: './skill-modifiers-modal.component.html',
  styleUrls: ['./skill-modifiers-modal.component.scss']
})
export class SkillModifiersModalComponent {
  @ViewChild('modal', { static: true }) modal: ModalComponent;

  @Input() modifiers: string[];

  public show() {
    this.modal.show();
  }
}
