import { createReducer, Action, on } from '@ngrx/store';
import { UsersState } from './users.model';
import * as UsersActions from './users.actions';

const initialState: UsersState = {
  list: [],
  filters: {},
  filtered: [],
  current: null
};

const usersReducer = createReducer<UsersState>(
  initialState,
  on(UsersActions.setListUsers, (state, { list }) => ({
    ...state,
    list: [...list],
    filtered: [...list]
  })),
  on(UsersActions.setCurrentUser, (state, { user }) => ({
    ...state,
    current: user
  })),
  on(UsersActions.searchUser, (state, { key, value }) => {
    const filters = { ...state.filters, [key]: value };
    if (!value) {
      delete filters[key];
    }
    let suppList = [...state.list];
    if ('search' in filters) {
      suppList = suppList.filter(user => user.displayName.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if ('auth' in filters) {
      suppList = suppList.filter(({auth}) => {
        const isBasic = auth.basic;
        const isPlayer = auth.player;
        const isAdmin = auth.admin;
        if (filters.auth === 'basic') {
          return isBasic && !isPlayer && !isAdmin;
        } else if (filters.auth === 'player') {
          return isBasic && isPlayer && !isAdmin;
        } else {
          return isBasic && isPlayer && isAdmin;
        }
      });
    }

    return {
      ...state,
      filters,
      filtered: suppList
    };
  }),
  on(UsersActions.deleteUsers, (state, { list }) => ({
    ...state,
    list: state.list.filter((user) => !list.some(({uid}) => uid === user.uid)),
    filtered: state.filtered.filter((user) => !list.some(({uid}) => uid === user.uid))
  })),
  on(UsersActions.updateUsers, (state, { list }) => ({
    ...state,
    list: state.list.map((user) => {
      const userId = list.findIndex(({uid}) => uid === user.uid);
      if (userId >= 0) {
        return {
          ...list[userId]
        };
      } else {
        return user;
      }
    }),
    filtered: state.filtered.map((user) => {
      const userId = list.findIndex(({uid}) => uid === user.uid);
      if (userId >= 0) {
        return {
          ...list[userId]
        };
      } else {
        return user;
      }
    }),
  })),
  on(UsersActions.updateCookiesConsent, (state, { consent }) => ({
    ...state,
    current: {
      ...state.current,
      privacyConsent: consent
    }
  })),
);

export function reducer(state: UsersState, action: Action) {
  return usersReducer(state, action);
}

export const getUsersList = (state: UsersState) => state.list;
export const getUserCurrent = (state: UsersState) => state.current;
export const getUsersListFiltered = (state: UsersState) => state.filtered;
