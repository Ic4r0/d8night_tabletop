import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '', name: 'Cookies policy' }
  ];

  constructor(private titleService: Title) {
    this.titleService.setTitle('Cookies policy - d8 Night');
  }

  ngOnInit(): void {
  }

}
