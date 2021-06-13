import { ActionReducerMap } from '@ngrx/store';
import * as AuthReducer from '../auth/store/auth.reducer';
import * as AccountReducer from '../shared/store/account.reducer';


export interface AppState {
    auth: AuthReducer.state,
    account: AccountReducer.state
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: AuthReducer.AuthReducer,
    account: AccountReducer.AccountReducer
}