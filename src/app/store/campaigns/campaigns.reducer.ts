import { createReducer, Action, on } from '@ngrx/store';
import { Campaign, CampaignsState } from './campaigns.model';
import * as CampaignsActions from './campaigns.actions';
import { Sheet } from '../../shared/models/sheets/sheets.model';
import set from 'lodash-es/set';
import merge from 'lodash-es/merge';
import get from 'lodash-es/get';
import cloneDeep from 'lodash-es/cloneDeep';

const initialState: CampaignsState = {
  total: [],
  list: [],
  filtered: [],
  filters: {},
  current: null,
  currentSheet: null
};

const campaignsReducer = createReducer<CampaignsState>(
  initialState,
  on(CampaignsActions.setListCampaigns, (state, { list }) => ({
    ...state,
    list: [...list],
    filtered: [...list],
  })),
  on(CampaignsActions.setTotalListCampaigns, (state, { list }) => ({
    ...state,
    total: [...list],
  })),
  on(CampaignsActions.newCampaign, (state, { campaign }) => ({
    ...state,
    filters: {},
    list: [
      ...state.list,
      campaign
    ],
    filtered: [
      ...state.list,
      campaign
    ],
    current: campaign
  })),
  on(CampaignsActions.searchCampaigns, (state, { key , value }) => {
    const filters = { ...state.filters, [key]: value };
    if (!value) {
      delete filters[key];
    }
    let suppList = [...state.list];
    if ('search' in filters) {
      suppList = suppList.filter(campaign => campaign.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if ('master' in filters) {
      suppList = suppList.filter(({master}) => master.uid === filters.master);
    }

    return {
      ...state,
      filters,
      filtered: suppList
    };
  }),
  on(CampaignsActions.setCurrentCampaign, (state, { campaign }) => ({
    ...state,
    filters: {},
    list: [...state.list],
    filtered: [...state.list],
    current: campaign
  })),
  on(CampaignsActions.deleteCampaign, (state, { campaignToDelete }) => ({
    ...state,
    filtered: state.filtered.filter((campaign) => campaign.id !== campaignToDelete),
    list: state.list.filter((campaign) => campaign.id !== campaignToDelete),
    current: null
  })),
  on(CampaignsActions.updateCampaign, (state, { campaign }) => ({
    ...state,
    filtered: state.filtered.map((elem) => {
      if (elem.id === campaign.id) {
        return campaign;
      }
      return elem;
    }),
    list: state.list.map((elem) => {
      if (elem.id === campaign.id) {
        return campaign;
      }
      return elem;
    }),
    current: campaign,
  })),
  on(CampaignsActions.addSheet, (state, { sheet, id, sheetSharingInfo }) => {
    const updatedCampaign: Campaign = {
      ...state.current,
      sheetSharing: {
        ...state.current.sheetSharing,
        [id]: {
          ...sheetSharingInfo
        }
      },
      sheets: {
        ...state.current.sheets,
        [id]: sheet
      }
    };
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
    };
  }),
  on(CampaignsActions.updateSheet, (state, { sheet, id }) => {
    const updatedCampaign: Campaign = {
      ...state.current,
      sheets: {
        ...state.current.sheets,
        [id]: sheet
      }
    };
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
    };
  }),
  on(CampaignsActions.reloadSheet, (state, { sheet }) => ({
    ...state,
    currentSheet: {
      ...state.currentSheet,
      sheet
    },
  })),
  on(CampaignsActions.deleteSheet, (state, { id }) => {
    const { [id]: unusedSheetSharing, ...updatedSheetSharing } = {...state.current.sheetSharing};
    let updatedCampaign: Campaign = cloneDeep({
      ...state.current,
      sheetSharing: {
        ...updatedSheetSharing
      }
    });
    if (id in state.current.sheets) {
      const { [id]: unusedSheet, ...updatedSheets } = {...state.current.sheets};
      updatedCampaign = {
        ...updatedCampaign,
        sheets: {
          ...updatedSheets
        }
      };
    }

    const campaignSheets = Object.keys(updatedCampaign.sheetSharing);
    for (const singleSheet of campaignSheets) {
      const isCompanion = !!updatedCampaign.sheetSharing[singleSheet].isCompanion &&
        updatedCampaign.sheetSharing[singleSheet]?.isCompanion === id;
      const isOwner = !!updatedCampaign.sheetSharing[singleSheet].isOwner &&
        updatedCampaign.sheetSharing[singleSheet]?.isOwner.includes(id);
      if (isCompanion) {
        delete updatedCampaign.sheetSharing[singleSheet].isCompanion;
      }
      if (isOwner) {
        const idx = updatedCampaign.sheetSharing[singleSheet]?.isOwner.findIndex((elem) => elem === id);
        const newCompanions = [...updatedCampaign.sheetSharing[singleSheet]?.isOwner];
        newCompanions.splice(idx, 1);
        if (newCompanions.length > 0) {
          updatedCampaign.sheetSharing[singleSheet].isOwner = [...newCompanions];
        } else {
          delete updatedCampaign.sheetSharing[singleSheet].isOwner;
        }
      }
    }
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
    };
  }),
  on(CampaignsActions.updateSheetAuth, (state, { id, sheetSharingInfo }) => {
    const updatedCampaign: Campaign = {
      ...state.current,
      sheetSharing: {
        ...state.current.sheetSharing,
        [id]: {
          ...sheetSharingInfo
        }
      }
    };
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
    };
  }),
  on(CampaignsActions.setCurrentSheet, (state, { id, sheet }) => {
    const updatedCampaign: Campaign = {
      ...state.current,
      sheets: {
        ...state.current.sheets,
        [id]: sheet
      }
    };
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
      currentSheet: { id, sheet }
    };
  }),
  on(CampaignsActions.updateSheetProperty, (state, { key, value }) => {
    const sheetIdx: string = state.currentSheet.id;
    const updatedSheet: Sheet = cloneDeep(state.currentSheet.sheet);
    let valueToUpdate = value;
    if (typeof value !== 'string' && typeof value !== 'number' && value !== null && value !== undefined && !Array.isArray(value)) {
      valueToUpdate = get(updatedSheet, key);
      merge(valueToUpdate, value);
    }
    set(updatedSheet, key, valueToUpdate);
    const updatedCampaign: Campaign = {
      ...state.current,
      sheets: {
        ...state.current.sheets,
        [sheetIdx]: updatedSheet
      }
    };
    return {
      ...state,
      filtered: state.filtered.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      list: state.list.map((elem) => {
        if (elem.id === updatedCampaign.id) {
          return updatedCampaign;
        }
        return elem;
      }),
      current: updatedCampaign,
      currentSheet: {
        ...state.currentSheet,
        sheet: updatedSheet
      }
    };
  }),
);

export function reducer(state: CampaignsState, action: Action) {
  return campaignsReducer(state, action);
}

export const getCampaignsList = (state: CampaignsState) => state.list;
export const getCampaignsTotalList = (state: CampaignsState) => state.total;
export const getCampaignsListFiltered = (state: CampaignsState) => state.filtered;
export const getCampaignCurrent = (state: CampaignsState) => state.current;
export const getSheetCurrent = (state: CampaignsState) => state.currentSheet;
