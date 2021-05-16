import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store.model';
import { User } from '../store/users/users.model';

import { UsersApiService } from '../services/users-api.service';
import { tap, catchError } from 'rxjs/operators';
import { setListUsers } from '../store/users/users.actions';
import { of } from 'rxjs';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable()
export default class UsersManagementResolver implements Resolve<Array<User>> {
  constructor(private usersApi: UsersApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  resolve() {
    return this.usersApi.getUsersList().pipe(
      tap(list => {
        this.store.dispatch(setListUsers({ list }));
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
