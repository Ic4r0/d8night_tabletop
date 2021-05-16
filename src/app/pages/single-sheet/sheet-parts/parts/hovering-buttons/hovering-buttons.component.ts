import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hovering-buttons',
  templateUrl: './hovering-buttons.component.html',
  styleUrls: ['./hovering-buttons.component.scss']
})
export class HoveringButtonsComponent {
  @Output() roll = new EventEmitter();
  @Output() section = new EventEmitter();

  onRoll() {
    this.roll.emit();
  }

  onSectionChange() {
    this.section.emit();
  }
}
