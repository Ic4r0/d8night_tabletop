import { UsersState } from './users/users.model';
import { CampaignsState } from './campaigns/campaigns.model';
import { QuotesState } from './quotes/quotes.model';

export interface AppState {
  users: UsersState;
  quotes: QuotesState;
  campaigns: CampaignsState;
}
