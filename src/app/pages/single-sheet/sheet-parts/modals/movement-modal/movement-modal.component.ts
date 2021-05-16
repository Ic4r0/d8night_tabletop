import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-movement-modal',
  templateUrl: './movement-modal.component.html',
  styleUrls: ['./movement-modal.component.scss']
})
export class MovementModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  movementList: {name: string, rate: string, squares: number}[] = [];

  @Input() set movement(value: {name: string, rate: string, squares: number}[]) {
    if (!!value) {
      this.movementList = [...value];
    }
  }

  constructor() { }

  public show() {
    this.modal.show();
  }
}
