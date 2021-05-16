import { AppState } from './store.model';
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { storeLogger } from 'ngrx-store-logger';
import { StoreModule as NgRxStoreModule, ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { rootReducer } from './store.reducer';

export function logger(reducer: ActionReducer<AppState>): any {
  return storeLogger()(reducer);
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['quotes'], rehydrate: true})(reducer);
}

export const metaReducers = environment.production ? [localStorageSyncReducer] : [logger, localStorageSyncReducer];

@NgModule({
  imports: [
    CommonModule,
    NgRxStoreModule.forRoot(rootReducer, {metaReducers})
  ],
  declarations: [],
})
export class StoreModule {}
