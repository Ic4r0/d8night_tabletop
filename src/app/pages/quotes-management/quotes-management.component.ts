import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { Quote } from 'src/app/store/quotes/quotes.model';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store.model';
import { QuotesApiService } from 'src/app/services/quotes-api.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { getQuotesListFiltered, getQuotesList } from 'src/app/store/store.reducer';
import { searchQuote, updateQuote, deleteQuote, addQuote } from 'src/app/store/quotes/quotes.actions';
import { first, tap, catchError } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';

@Component({
  selector: 'app-quotes-management',
  templateUrl: './quotes-management.component.html',
  styleUrls: ['./quotes-management.component.scss']
})
export class QuotesManagementComponent implements OnInit, OnDestroy {
  @ViewChild('quoteModal', {static: true}) quoteModal: ModalComponent;

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '', name: 'Sidebar quotes' }
  ];

  footerButtons: { icon: string, text: string, label: string }[] = [
    { icon: 'plus', text: 'Add quote', label: 'new' }
  ];

  loadingModal = false;

  page = 1;

  quotesList: Array<Quote> = [];
  quotesListFiltered: Array<Quote> = [];
  quotesSubscription: Array<Subscription> = [];

  selectedQuote: Quote;
  editedQuote: string;

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private quotesApi: QuotesApiService,
              private toastr: CustomToastrService) {
    this.titleService.setTitle('Sidebar quotes - d8 Night');
  }

  ngOnInit(): void {
    this.quotesSubscription.push(
      this.store.select(getQuotesList).subscribe((list) => {
        this.quotesList = [...list];
      }),
      this.store.select(getQuotesListFiltered).subscribe((list) => {
        this.quotesListFiltered = [...list];
      }));
  }

  ngOnDestroy(): void {
    this.quotesSubscription.forEach((sub) => sub.unsubscribe());
  }

  search(searchString: any) {
    const value = (searchString.target as HTMLInputElement).value;
    this.store.dispatch(searchQuote({value}));
    this.page = 1;
  }

  selectQuote(quote: Quote) {
    this.selectedQuote = quote;
    this.editedQuote = quote.quote;
    this.quoteModal.show();
  }

  editQuote() {
    this.loadingModal = true;
    const suppQuote = {
      ...this.selectedQuote,
      quote: this.editedQuote
    };
    this.quotesApi
      .updateQuote(suppQuote)
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(updateQuote({ quote: suppQuote }));
          this.selectedQuote = null;
          this.editedQuote = null;
          this.quoteModal.hide();
          this.loadingModal = false;
          this.toastr.success('Quote updated');
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
        ).subscribe();
  }

  deleteQuote() {
    this.loadingModal = true;
    const suppQuote = {...this.selectedQuote};
    this.quoteModal.hide();
    this.quotesApi
      .deleteQuote(suppQuote.id)
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(deleteQuote({ quote: suppQuote }));
          this.selectedQuote = null;
          this.editedQuote = null;
          this.quoteModal.hide();
          this.loadingModal = false;
          this.toastr.success('Quote deleted');
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
        ).subscribe();
  }

  addQuote() {
    this.loadingModal = true;
    const nextId = Math.max(...this.quotesList.map(({id}) => id)) + 1;
    const suppQuote = {
      id: nextId,
      quote: this.editedQuote
    };
    this.quotesApi
      .addQuote(suppQuote)
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(addQuote({ quote: suppQuote }));
          this.selectedQuote = null;
          this.editedQuote = null;
          this.quoteModal.hide();
          this.loadingModal = false;
          this.toastr.success('Quote added');
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
        ).subscribe();
  }

  onFooterClicked(label: string) {
    if (label === 'new') {
      this.selectQuote({id: null, quote: ''});
    }
  }

}
