import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent {

  @Input() buttons: { icon: string, text: string, label: string, svg?: boolean }[] = [];
  @Output() label: EventEmitter<string> = new EventEmitter();

  constructor() { }

  onButtonClick(buttonClicked: string) {
    this.label.emit(buttonClicked);
  }

}
