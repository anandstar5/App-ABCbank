import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Claim } from '../auth/claim.model';
import { Account } from '../shared/account.model';
import { CommonService } from '../shared/common.service';
import { UserService } from '../user/user.service';
import { AppState } from '../ztore/app.reducer';

@Component({
    selector: 'app-admin',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
    accountno = "";
    savingsbalance=0;
    customerid = "";
    isAdminUser = false;
    isAccountExist = null;
    authSubscription: Subscription;
    commonSubscription: Subscription;
    totalAccounts = 0;
    claim: Claim = null;

    ngOnInit() {
        this.authSubscription = this.store.select('auth').subscribe((authState) => {
            if (authState.claim) {
                this.isAdminUser = authState.claim.isAdminUser;
                this.claim = authState.claim;

                if (this.isAdminUser) {
                    this.commonSubscription = this.commonService.totalAccounts.subscribe(accounts => {
                        this.totalAccounts = accounts.length;
                    });
                }
                else {
                    this.commonSubscription = this.commonService.totalAccounts.subscribe(accounts => {
                        if (this.claim) {
                            this.customerid = this.claim.id.substring(0, 6);
                        }
                        const savingsAccount = accounts.find(x => x.accounttype == 0 && x.user.customerid == this.customerid);
                        if (savingsAccount) {
                            this.accountno = savingsAccount.accountnumber;
                            this.savingsbalance=savingsAccount.accountbalance;
                            this.isAccountExist = true;
                        }
                        else {
                            this.isAccountExist = false;
                        }
                    });
                }

            }
        });
    }

    constructor(private store: Store<AppState>, private commonService: CommonService) {
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        if (this.commonSubscription) {
            this.commonSubscription.unsubscribe();
        }
    }
}