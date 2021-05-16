import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, of } from 'rxjs';
import { User } from 'src/app/store/users/users.model';
import { AppState } from 'src/app/store/store.model';
import { getCampaignsTotalList, getUserCurrent, getUsersListFiltered } from 'src/app/store/store.reducer';
import { searchUser, deleteUsers, updateUsers } from 'src/app/store/users/users.actions';
import { UsersApiService } from 'src/app/services/users-api.service';
import { first, tap, catchError } from 'rxjs/operators';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  @ViewChild('editModal', {static: true}) editModal: ModalComponent;
  @ViewChild('deleteModal', {static: true}) deleteModal: ModalComponent;

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '', name: 'Manage authorizations' }
  ];

  footerButtons: { icon: string, text: string, label: string }[] = [
    { icon: 'pencil', text: 'Edit authorizations', label: 'edit' },
    { icon: 'trash', text: 'Delete', label: 'delete' }
  ];

  loading = false;

  page = 1;

  usersListFiltered: Array<User>;
  subscriptions: Subscription[] = [];

  currentUser: User;

  campaignTotalList: Array<Campaign> = [];

  selectedUsers: Array<User> = [];
  selectedAuth: any = null;
  basicAuth = {
    basic: true,
    player: false,
    admin: false
  };
  playerAuth = {
    basic: true,
    player: true,
    admin: false
  };
  adminAuth = {
    basic: true,
    player: true,
    admin: true
  };

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private usersApi: UsersApiService,
              private toastr: CustomToastrService) {
    this.titleService.setTitle('Gestione utenti - d8 Night');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(getUsersListFiltered).subscribe((list) => {
        this.usersListFiltered = [...list];
      }),
      this.store.select(getUserCurrent).subscribe((user) => {
        this.currentUser = {...user};
      }),
      this.store.select(getCampaignsTotalList).subscribe((list) => {
        this.campaignTotalList = [...list];
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
    this.store.dispatch(searchUser(filter));
    this.page = 1;
  }

  selectUser(user: User) {
    if (user.uid === this.currentUser.uid) {
      this.toastr.warning('You cannot edit your own authorization level', 'Warning');
    } else {
      const uidIndex = this.selectedUsers.findIndex(({uid}) => uid === user.uid);
      if (uidIndex >= 0) {
        this.selectedUsers.splice(uidIndex, 1);
      } else {
        this.selectedUsers.push(user);
      }
    }
  }

  checkFunction(rowUid: string): boolean {
    return this.selectedUsers.some(({uid}) => uid === rowUid);
  }

  openModals(modalType: string): void {
    if (this.selectedUsers.length > 0) {
      if (modalType === 'edit') {
        this.editModal.show();
      } else if (modalType === 'delete') {
        this.deleteModal.show();
      }
    } else {
      this.toastr.warning('You did not select any user', 'Warning');
    }
  }

  confirmChange(): void {
    this.loading = true;
    const suppSelectedUsers = [...this.selectedUsers];
    const suppSelectedAuth = this.selectedAuth;
    let auth: any;
    switch (suppSelectedAuth) {
      case 'basic':
        auth = {...this.basicAuth};
        break;
      case 'player':
        auth = {...this.playerAuth};
        break;
      case 'admin':
        auth = {...this.adminAuth};
        break;
    }
    const suppUpdatedUsers = suppSelectedUsers.map((user) => ({
      ...user,
      auth
    }));
    this.usersApi
      .updateUsers(suppUpdatedUsers)
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(updateUsers({ list: suppUpdatedUsers }));
          this.selectedUsers = [];
          this.selectedAuth = null;
          this.editModal.hide();
          this.loading = false;
          this.toastr.success('Authorizations updated');
        }),
        catchError((err) => {
          this.loading = false;
          this.toastr.error(err);
          return of(err);
        })
        ).subscribe();
  }

  confirmRemoval(): void {
    this.loading = true;
    const suppSelectedUsers = [...this.selectedUsers];
    this.usersApi
      .deleteUsers(suppSelectedUsers, this.campaignTotalList)
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(deleteUsers({ list: suppSelectedUsers }));
          this.selectedUsers = [];
          this.deleteModal.hide();
          this.loading = false;
          this.toastr.success('Users deleted');
        }),
        catchError((err) => {
          this.loading = false;
          this.toastr.error(err);
          return of(err);
        })
        ).subscribe();
  }

  onFooterClicked(label: string) {
    if (label === 'edit') {
      this.openModals('edit');
    } else if (label === 'delete') {
      this.openModals('delete');
    }
  }

}
