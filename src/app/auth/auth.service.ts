import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import * as AppActions from '../ztore/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private logoutTimer: any;

    setLogoutTimer(expiredIn: number) {       
        this.logoutTimer=setTimeout(() => {
            this.store.dispatch(new AuthActions.AuthLogout);
        }, expiredIn);
    }

    clearLogoutTimer() {
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }
    }

    constructor(private store: Store<AppActions.AppState>) { }

}