import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';

@Component({
  selector: 'app-sheet-header',
  templateUrl: './sheet-header.component.html',
  styleUrls: ['./sheet-header.component.scss']
})
export class SheetHeaderComponent {
  currentSheet: Sheet;
  classes: string;

  @Input() set sheet(value: Sheet) {
    if (!!value) {
      this.currentSheet = value;
      this.classes = this.currentSheet.classes.map(({name, level}) => name + ' ' + level.toString()).join(' ');
    }
  }
  @Input() currentHp = 0;
  @Input() maxHp = 0;

  @Output() conditions = new EventEmitter();
  @Output() rest = new EventEmitter();
  @Output() hitPoints = new EventEmitter();

  onConditions() {
    this.conditions.emit();
  }

  onRest() {
    this.rest.emit();
  }

  openHPModal() {
    this.hitPoints.emit();
  }
}
