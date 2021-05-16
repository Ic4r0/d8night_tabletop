import { createAction, props } from '@ngrx/store';
import { User } from './users.model';

export const setListUsers = createAction('USERS/SET_LIST', props<{ list: Array<User> }>());
export const setCurrentUser = createAction('USERS/SET_CURRENT', props<{ user: User }>());
export const searchUser = createAction('USERS/SEARCH_USER', props<{ key: string, value: any }>());
export const deleteUsers = createAction('USERS/DELETE_USERS', props<{ list: Array<User> }>());
export const updateUsers = createAction('USERS/UPDATE_USERS', props<{ list: Array<User> }>());
export const updateCookiesConsent = createAction('USERS/COOKIES_CONSENT', props<{ consent: boolean }>());
