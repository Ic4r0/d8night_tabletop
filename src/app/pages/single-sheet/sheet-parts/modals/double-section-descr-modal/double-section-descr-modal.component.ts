import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-double-section-descr-modal',
  templateUrl: './double-section-descr-modal.component.html',
  styleUrls: ['./double-section-descr-modal.component.scss']
})
export class DoubleSectionDescrModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  aboveValue: {title: string, text: string} = {title: '', text: ''};
  belowValue: {title: string, text: string} = {title: '', text: ''};

  @Input() set above(value: {title: string, text: string}) {
    if (!!value) {
      this.aboveValue = value;
    }
  }
  @Input() set below(value: {title: string, text: string}) {
    if (!!value) {
      this.belowValue = value;
    }
  }

  constructor() { }

  public show() {
    this.modal.show();
  }
}
