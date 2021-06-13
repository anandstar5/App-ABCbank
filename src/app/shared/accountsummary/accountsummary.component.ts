import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ztore/app.reducer";
import { Account } from "../account.model";
import { CommonService } from "../common.service";
import * as AccountActions from '../store/account.actions';

@Component({
    selector: 'app-accountsummary',
    templateUrl: './accountsummary.component.html',
    styleUrls: ['./accountsummary.component.css']
})

export class AccountSummaryComponent implements OnInit, OnDestroy {
    isAdminUser = false;
    customerid = "";
    searchValue: string = null;
    accountSummary: Account[] = null;
    isAccountsExist = false;
    authSubscription: Subscription;
    commonSubscription: Subscription;
    accountSubscription: Subscription;
    accountActionResponse: string = null;

    ngOnInit() {
        this.authSubscription = this.store.select("auth").subscribe((authState) => {
            if (authState?.claim) {
                this.isAdminUser = authState.claim.isAdminUser;
                this.customerid = authState.claim.id.substring(0, 6);
            }
        });

        this.route.params.subscribe((params: Params) => {
            this.accountSummary = null;
            this.isAccountsExist = false;
            this.searchValue = params["customerid"];
            this.getAccountSummary();
        });

        this.accountSubscription = this.store.select("account").subscribe(accountState => {
            if (accountState.actionResponse) {
                this.accountActionResponse = accountState.actionResponse;
                this.getAccountSummary();
            }
        })
    }

    getAccountSummary() {

        if (Boolean(this.searchValue)) {
            this.commonSubscription = this.commonService.totalAccounts.subscribe((accounts) => {
                if (this.isAdminUser) {

                    this.accountSummary = accounts.filter(account => {
                        if (account.accountnumber.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1) {
                            return true;
                        }
                        else if (account.user.customername.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                }
                else {
                    if (this.searchValue == this.customerid) {
                        this.accountSummary = accounts.filter(x => x.user.customerid == this.searchValue);
                    }
                    else {
                        this.router.navigate(["notfound"]);
                    }
                }

                if (this.accountSummary?.length > 0) {
                    this.isAccountsExist = true;
                }
            });
        }
    }

    getBranchName(branchCode) {
        return this.commonService.getBranchByValue(branchCode);
    }

    getAccountType(typeCode) {
        return this.commonService.getAccounTypeByValue(typeCode);
    }

    onDelete(accountnumber) {
        if (confirm("Are you sure to delete Account:" + accountnumber)) {
            this.store.dispatch(new AccountActions.AccountDelete(accountnumber));            
        }
    }

    onAlertClose() {
        this.accountActionResponse = null;
        this.store.dispatch(new AccountActions.AccountResponseReset);
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        if (this.commonSubscription) {
            this.commonSubscription.unsubscribe();
        }
        if (this.accountSubscription) {
            this.accountSubscription.unsubscribe();
        }
    }

    constructor(private store: Store<AppState>, private commonService: CommonService, private route: ActivatedRoute, private router: Router) {
    }

}