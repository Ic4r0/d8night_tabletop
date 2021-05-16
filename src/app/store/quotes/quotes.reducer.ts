import { createReducer, Action, on } from '@ngrx/store';
import { QuotesState } from './quotes.model';
import * as QuotesActions from './quotes.actions';

const initialState: QuotesState = {
  list: [],
  filtered: [],
};

const usersReducer = createReducer<QuotesState>(
  initialState,
  on(QuotesActions.setQuotesList, (state, { list }) => ({
    ...state,
    list: [...list],
    filtered: [...list]
  })),
  on(QuotesActions.searchQuote, (state, { value }) => ({
    ...state,
    filtered: state.list.filter(singleQuote => singleQuote.quote.toLowerCase().includes(value.toLowerCase()))
  })),
  on(QuotesActions.deleteQuote, (state, { quote }) => ({
    ...state,
    list: state.list.filter(({id}) => id !== quote.id),
    filtered: state.filtered.filter(({id}) => id !== quote.id)
  })),
  on(QuotesActions.updateQuote, (state, { quote }) => ({
    ...state,
    list: state.list.map((singleQuote) => (singleQuote.id === quote.id ? quote : singleQuote)),
    filtered: state.filtered.map((singleQuote) => (singleQuote.id === quote.id ? quote : singleQuote)),
  })),
  on(QuotesActions.addQuote, (state, { quote }) => ({
    ...state,
    filtered: [
      ...state.filtered,
      quote
    ],
    list: [
      ...state.list,
      quote
    ],
  })),
);

export function reducer(state: QuotesState, action: Action) {
  return usersReducer(state, action);
}

export const getQuotesList = (state: QuotesState) => state.list;
export const getQuotesListFiltered = (state: QuotesState) => state.filtered;
