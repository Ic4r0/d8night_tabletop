import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/store.model';
import { Quote } from '../store/quotes/quotes.model';

import { QuotesApiService } from '../services/quotes-api.service';
import { tap, first, mergeMap, catchError, map } from 'rxjs/operators';
import { setQuotesList } from '../store/quotes/quotes.actions';
import { getQuotesList } from '../store/store.reducer';
import { of } from 'rxjs';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable()
export default class QuotesResolver implements Resolve<Array<Quote>> {
  constructor(private quotesApi: QuotesApiService,
              private store: Store<AppState>,
              private toastr: CustomToastrService) { }

  resolve() {
    return this.store.select(getQuotesList).pipe(
      first(),
      mergeMap((quotes: Array<Quote>) => {
        if (quotes.length === 0) {
          return this.quotesApi.getQuotesList().pipe(
            tap(list => {
              this.store.dispatch(setQuotesList({ list }));
            })
          );
        }
        return of(quotes);
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
