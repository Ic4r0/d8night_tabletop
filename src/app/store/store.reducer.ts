import * as users from './users/users.reducer';
import * as quotes from './quotes/quotes.reducer';
import * as campaigns from './campaigns/campaigns.reducer';
import { AppState } from './store.model';

export const rootReducer = ({
  users: users.reducer,
  quotes: quotes.reducer,
  campaigns: campaigns.reducer,
});

// USERS
export const getUsersList = (state: AppState) => users.getUsersList(state.users);
export const getUserCurrent = (state: AppState) => users.getUserCurrent(state.users);
export const getUsersListFiltered = (state: AppState) => users.getUsersListFiltered(state.users);

// QUOTES
export const getQuotesList = (state: AppState) => quotes.getQuotesList(state.quotes);
export const getQuotesListFiltered = (state: AppState) => quotes.getQuotesListFiltered(state.quotes);

// CAMPAIGNS
export const getCampaignsList = (state: AppState) => campaigns.getCampaignsList(state.campaigns);
export const getCampaignsTotalList = (state: AppState) => campaigns.getCampaignsTotalList(state.campaigns);
export const getCampaignsListFiltered = (state: AppState) => campaigns.getCampaignsListFiltered(state.campaigns);
export const getCampaignCurrent = (state: AppState) => campaigns.getCampaignCurrent(state.campaigns);
export const getSheetCurrent = (state: AppState) => campaigns.getSheetCurrent(state.campaigns);
