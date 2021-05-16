import { createAction, props } from '@ngrx/store';
import { Quote } from './quotes.model';

export const setQuotesList = createAction('QUOTES/SET_LIST', props<{ list: Array<Quote> }>());
export const searchQuote = createAction('QUOTES/SEARCH_QUOTE', props<{ value: string }>());
export const deleteQuote = createAction('QUOTES/DELETE_QUOTE', props<{ quote: Quote }>());
export const updateQuote = createAction('QUOTES/UPDATE_QUOTE', props<{ quote: Quote }>());
export const addQuote = createAction('QUOTES/ADD_QUOTE', props<{ quote: Quote }>());
