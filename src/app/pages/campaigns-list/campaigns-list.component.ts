import { Component, OnInit, OnDestroy } from '@angular/core';
import { CampaignsApiService } from 'src/app/services/campaigns-api.service';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store.model';
import { Observable, Subscription } from 'rxjs';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { getCampaignsListFiltered, getUserCurrent } from 'src/app/store/store.reducer';
import { searchCampaigns, setCurrentCampaign } from 'src/app/store/campaigns/campaigns.actions';
import { User } from 'src/app/store/users/users.model';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.scss']
})
export class CampaignsListComponent implements OnInit, OnDestroy {

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '', name: 'Campaigns' }
  ];

  footerButtons: { icon: string, text: string, label: string }[] = [
    { icon: 'plus', text: 'New campaign', label: 'new' }
  ];

  masterFilter = false;
  subscriptions: Subscription[] = [];

  campaignsListFiltered: Array<Campaign>;
  campaignsImageUrl: {[id: string]: Observable<string>} = {};
  user: User;

  page = 1;

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private router: Router,
              private storage: AngularFireStorage) {
    this.titleService.setTitle('Proprie campagne - d8 Night');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(getCampaignsListFiltered).subscribe((list) => {
        this.campaignsListFiltered = [...list];
        list.forEach((elem) => this.campaignsImageUrl[elem.id] = this.storage.ref(elem.pic).getDownloadURL());
      }),
      this.store.select(getUserCurrent).subscribe((loggedUser) => {
        this.user = {...loggedUser};
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  inputFilter(filterValue: any, formType: string) {
    const filter = {
      key: formType,
      value: (filterValue.target as HTMLInputElement).value
    };
    this.store.dispatch(searchCampaigns(filter));
    this.page = 1;
  }

  activateMasterFilter() {
    const filterValue = this.masterFilter ? '' : this.user.uid;
    this.store.dispatch(searchCampaigns({key: 'master', value: filterValue}));
    this.masterFilter = !this.masterFilter;
    this.page = 1;
  }

  selectCampaign(campaign: Campaign) {
    this.store.dispatch(setCurrentCampaign({ campaign }));
  }

  onFooterClicked(label: string) {
    if (label === 'new') {
      this.router.navigate(['/campaigns/new']);
    }
  }

}
