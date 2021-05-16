import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-descriptions',
  templateUrl: './descriptions.component.html',
  styleUrls: ['./descriptions.component.scss']
})
export class DescriptionsComponent {
  @Input() mobile = false;
  @Input() tablet = false;
  @Input() alignment: string;
  @Input() info: any;
  @Input() deity: any;

  constructor() { }
}
