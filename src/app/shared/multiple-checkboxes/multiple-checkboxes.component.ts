import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multiple-checkboxes',
  templateUrl: './multiple-checkboxes.component.html',
  styleUrls: ['./multiple-checkboxes.component.scss']
})
export class MultipleCheckboxesComponent implements OnInit {
  maxValue = 0;
  isChecked: {[checkBoxNumber: number]: boolean} = {};
  checkedCheckboxes = 0;

  @Input() set quantity(value: number) {
    if (!!value) {
      this.maxValue = value;
    }
  }
  @Input() set selected(value: number) {
    if (value !== undefined && value !== null && value !== this.checkedCheckboxes) {
      this.checkedCheckboxes = value;
      if (!!this.maxValue) {
        this.initializeCheckboxes();
      }
    }
  }
  @Input() text = '';

  @Output() ticks = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.initializeCheckboxes();
  }

  initializeCheckboxes() {
    this.isChecked = {};
    this.tickCheckbox();
  }

  onTickCheckbox(checkboxId: number) {
    if (!this.isChecked[checkboxId]) {
      this.checkedCheckboxes += 1;
      this.tickCheckbox();
    } else {
      this.checkedCheckboxes -= 1;
      this.tickCheckbox();
    }
    this.ticks.emit(this.checkedCheckboxes);
  }

  tickCheckbox() {
    for (let i = 0; i < this.maxValue; i++) {
      this.isChecked[i] = i < this.checkedCheckboxes;
    }
  }

  isNotLastCheckbox(idx: string) {
    return parseInt(idx, 10) < this.maxValue - 1;
  }

}
