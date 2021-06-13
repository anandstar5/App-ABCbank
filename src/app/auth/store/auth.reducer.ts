import { Claim } from '../claim.model';
import * as AuthActions from './auth.actions';

export interface state {
    claim: Claim,
    authError: string,
    isLoading: boolean
}

const initialstate: state = {
    claim: null,
    authError: null,
    isLoading: false

}

export function AuthReducer(state = initialstate, action: AuthActions.AuthActions) {

    switch (action.type) {
        case AuthActions.AUTH_LOGINSTART:
        case AuthActions.AUTH_SIGNUPSTART:
            return {
                ...state,
                authError: null,
                isLoading: true
            }
        case AuthActions.AUTH_AUTHSUCCESS:
            return {
                ...state,
                claim: action.payload,
                authError: null,
                isLoading: false
            }
        case AuthActions.AUTH_AUTHFAIL:
            return {
                ...state,
                authError: action.payload,
                isLoading: false
            }
        case AuthActions.AUTH_LOGOUT:
            return {
                ...state,
                claim: null,
                authError: null,
                isLoading: false
            }
        default:
            return {
                ...state,
                authError: null,
                isLoading: false
            }

    }

}