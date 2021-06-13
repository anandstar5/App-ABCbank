import { Action } from '@ngrx/store';
import { Claim } from '../claim.model';

export const AUTH_LOGINSTART = "[Auth] LoginStart";
export const AUTH_AUTHSUCCESS = "[Auth] AuthSuccess";
export const AUTH_AUTHFAIL = "[Auth] AuthFail";
export const AUTH_SIGNUPSTART = "[Auth] SignUpStart";
export const AUTH_LOGOUT="[Auth] Logout";
export const AUTH_AUTOLOGIN="[Auth] AutoLogin";

export class AuthLoginStart implements Action {
    readonly type = AUTH_LOGINSTART;
    constructor(public payload: { email: string, password: string }) {
    }
}

export class AuthSuccess implements Action {
    readonly type = AUTH_AUTHSUCCESS;
    constructor(public payload: Claim) {
    }
}

export class AuthFail implements Action {
    readonly type = AUTH_AUTHFAIL;
    constructor(public payload: string) {
    }
}

export class AuthSignUpStart implements Action {
    readonly type = AUTH_SIGNUPSTART;
    constructor(public payload: {username:string, email: string, password: string }) {
    }
}

export class AuthLogout implements Action {
    readonly type = AUTH_LOGOUT;
}

export class AuthAutoLogin implements Action{
    readonly type=AUTH_AUTOLOGIN;
}

export type AuthActions = AuthLoginStart | AuthSuccess | AuthFail | AuthSignUpStart |AuthLogout | AuthAutoLogin;