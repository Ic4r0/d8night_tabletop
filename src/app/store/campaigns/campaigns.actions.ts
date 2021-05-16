import { createAction, props } from '@ngrx/store';
import { Sheet } from '../../shared/models/sheets/sheets.model';
import { User } from '../users/users.model';
import { Campaign } from './campaigns.model';

export const setListCampaigns = createAction('CAMPAIGNS/SET_LIST', props<{ list: Array<Campaign> }>());
export const setTotalListCampaigns = createAction('CAMPAIGNS/SET_TOTAL_LIST', props<{ list: Array<Campaign> }>());
export const newCampaign = createAction('CAMPAIGNS/NEW_CAMPAIGN', props<{ campaign: Campaign }>());
export const searchCampaigns = createAction('CAMPAIGNS/SEARCH_CAMPAIGN', props<{ key: string, value: any }>());
export const setCurrentCampaign = createAction('CAMPAIGNS/SET_CURRENT', props<{ campaign: Campaign }>());
export const deleteCampaign = createAction('CAMPAIGNS/DELETE_CAMPAIGNS', props<{ campaignToDelete: string }>());
export const updateCampaign = createAction('CAMPAIGNS/UPDATE_CAMPAIGN', props<{ campaign: Campaign }>());
export const addSheet = createAction('CAMPAIGNS/ADD_SHEET', props<{
  sheet: Sheet,
  id: string,
  sheetSharingInfo: {
    player: User,
    sharedWith: Array<User>,
    info: {
      name: string,
      classes: Array<{
        name: string,
        level: number
      }>,
      maxHp: number
    }
  }
}>());
export const updateSheet = createAction('CAMPAIGNS/UPDATE_SHEET', props<{
  sheet: Sheet,
  id: string,
}>());
export const reloadSheet = createAction('CAMPAIGNS/RELOAD_SHEET', props<{
  sheet: Sheet
}>());
export const deleteSheet = createAction('CAMPAIGNS/DELETE_SHEET', props<{ id: string }>());
export const updateSheetAuth = createAction('CAMPAIGNS/UPDATE_SHEET_AUTH', props<{
  id: string,
  sheetSharingInfo: {
    player: User,
    sharedWith: Array<User>,
    info: {
      name: string,
      classes: Array<{
        name: string,
        level: number
      }>,
      maxHp: number
    }
  }
}>());
export const setCurrentSheet = createAction('CAMPAIGNS/SET_CURRENT_SHEET', props<{ id: string, sheet: Sheet }>());
export const updateSheetProperty = createAction('CAMPAIGNS/UPDATE_SHEET_PROPERTY', props<{ key: string, value: any }>());
