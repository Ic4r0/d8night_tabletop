import { Component, Input } from '@angular/core';
import { BreadcrumbItems } from '../models/breadcrumb-items/breadcrumb-items.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  prevPath: Array<BreadcrumbItems>;
  currentPath: string;

  @Input() set list(value: Array<BreadcrumbItems>) {
    if (value && value.find(({path}) => path === '')) {
      this.prevPath = value.filter(({path}) => path !== '');
      this.currentPath = value.find(({path}) => path === '').name;
    }
  }

  constructor() { }
}
