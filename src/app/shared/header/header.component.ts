import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../ztore/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { CommonService } from '../common.service';
import { Subscription } from 'rxjs';
import { Claim } from 'src/app/auth/claim.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    customerid = "";
    claim: Claim = null;
    isAuthenticate = false;
    isAdmin = false;
    authSubscription: Subscription;

    ngOnInit() {
        this.authSubscription = this.store.select("auth").subscribe((authState) => {
            this.isAuthenticate = !!authState.claim;
            this.isAdmin = !!authState.claim?.isAdminUser;
            this.claim = authState.claim;

            if (this.claim && !this.isAdmin) {
                this.customerid = this.claim.id.substring(0, 6);
            }
        });
    }

    onLogout() {
        this.store.dispatch(new AuthActions.AuthLogout);
    }

    onSearch(searchValue) {
        this.router.navigate(['account/summary', searchValue]);
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

    constructor(private store: Store<AppState>, private commonService: CommonService, private router: Router) {

    }

}