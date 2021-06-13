import * as AccountActions from './account.actions';

export interface state {
    actionResponse: string
}

const initialstate: state = {
    actionResponse: null
}

export function AccountReducer(state = initialstate, action: AccountActions.AccountActions) {

    switch (action.type) {
        case AccountActions.ACC_ACTIONRESPONSE:
            return {
                ...state,
                actionResponse: action.payload
            }
        default:
            return {
                ...state,
                actionResponse: null
            };

    }

}