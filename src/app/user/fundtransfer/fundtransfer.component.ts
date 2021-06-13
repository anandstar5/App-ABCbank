import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Account } from 'src/app/shared/account.model';
import { CommonService } from 'src/app/shared/common.service';
import { AppState } from 'src/app/ztore/app.reducer';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Transaction } from '../Transaction.model';
import * as AccountActions from '../../shared/store/account.actions';
import { canComponentDeActivate } from 'src/app/shared/others/deactivate.guard';

@Component({
  selector: 'app-fundtransfer',
  templateUrl: './fundtransfer.component.html',
  styleUrls: ['./fundtransfer.component.css']
})
export class FundtransferComponent implements OnInit, OnDestroy, canComponentDeActivate {
  customerid = null;
  authSubscription: Subscription;
  commonSubscription: Subscription;
  userSubscription: Subscription;
  accountSubscription: Subscription;
  accountsList: Account[] = null;
  payeeList: Account[] = null;
  allAccounts: Account[] = null;
  isAccountsExist = null;
  fromaccount: any = "-1";
  payee = "-1";
  transferAmount: null;
  remark: null;
  selectedAccountBalance = 0;
  accountActionResponse: string = null;
  isloading = false;

  ngOnInit(): void {

    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      if (authState) {
        this.customerid = authState.claim?.id.substring(0, 6);
      }
    })

    this.accountSubscription = this.store.select("account").subscribe(accountState => {
      if (accountState.actionResponse) {
        this.accountActionResponse = accountState.actionResponse;
        this.isloading = false;
      }

      this.commonSubscription = this.commonService.totalAccounts.subscribe((accounts) => {
        const userAccounts = accounts.filter(x => x.user.customerid == this.customerid);
        if (userAccounts?.length > 0) {
          this.isAccountsExist = true;
          this.accountsList = userAccounts;
          this.allAccounts = accounts;
          this.payeeList = this.allAccounts;
        }
        else {
          this.isAccountsExist = false;
        }
      });

    })

  }

  onSelectAccount() {
    const fromAccount = JSON.parse(this.fromaccount);
    const payeeAccount = JSON.parse(this.payee);
    if (fromAccount?.accountnumber === payeeAccount?.accountnumber) {
      this.payee = "-1";
    }
    this.payeeList = this.allAccounts.filter(x => x.accountnumber != fromAccount?.accountnumber);
    this.selectedAccountBalance = fromAccount?.accountbalance;
  }

  onSubmit(form: NgForm) {
    this.isloading = true;
    const fromAccount = JSON.parse(form.value.fromaccount);
    const payeeAccount = JSON.parse(form.value.payee);

    const transactionDate = new Date();
    const transactionDetails = new Transaction(transactionDate.getTime(), fromAccount.accountnumber, +fromAccount.accountbalance, payeeAccount.accountnumber, +payeeAccount.accountbalance, form.value.transferAmount, form.value.remark, transactionDate);
    this.store.dispatch(new AccountActions.FundTransfer(transactionDetails));

    setTimeout(() => {
      form.reset();
      this.fromaccount = "-1";
      this.payee = "-1";
    }, 1000);
  }

  onCancel(form: NgForm) {
    form.reset();
    this.fromaccount = "-1";
    this.payee = "-1";
  }

  onAlertClose() {
    this.accountActionResponse = null;
    this.isloading = false;
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

  canDeActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.fromaccount != "-1" || this.payee != "-1" || this.transferAmount || this.remark) {
      return (confirm('Do you want to discard?'));
    }
    else {
      return true;
    }
  }

  constructor(private store: Store<AppState>, private commonService: CommonService, private userService: UserService) { }

}
