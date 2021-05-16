import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit {

  iconName: string;
  iconWidth: string;
  ukButton = false;

  @Input() set name(value: any) {
    if (typeof value !== 'undefined') {
      this.iconName = value;
    } else {
      this.iconName = 'hearts';
    }
  }

  @Input() set width(value: any) {
    if (typeof value !== 'undefined') {
      if (typeof value === 'string') {
        if (value === 'button') {
          this.iconWidth = '20px';
          this.ukButton = true;
        } else {
          this.iconWidth = '2.5rem';
        }
      } else {
        this.iconWidth = value.toString() + 'px';
      }
    } else {
      this.iconWidth = '20px';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
