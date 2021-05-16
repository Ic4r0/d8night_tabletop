import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firestore from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { Quote } from '../store/quotes/quotes.model';
import { catchError, first, map } from 'rxjs/operators';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class QuotesApiService {

  constructor(private afs: AngularFirestore,
              private toastr: CustomToastrService) {}

  public getQuotesList(): Observable<Array<Quote>> {
    return this.afs.doc('quotes/quotes').valueChanges().pipe(
      first(),
      map((data) => Quote.arrayFromREST(data)),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public deleteQuote(quoteToRemove: number) {
    return from(this.afs.doc('quotes/quotes').update({
      [quoteToRemove]: firestore.firestore.FieldValue.delete()
    })).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public updateQuote(quoteToUpdate: Quote) {
    return from(this.afs.doc('quotes/quotes').set(
      { [quoteToUpdate.id]: quoteToUpdate.quote },
      { merge: true }
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  public addQuote(quoteToAdd: Quote) {
    return from(this.afs.doc('quotes/quotes').set(
      { [quoteToAdd.id]: quoteToAdd.quote },
      { merge: true }
    )).pipe(
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }
}
