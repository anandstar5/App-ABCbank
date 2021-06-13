import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Account } from "../account.model";
import * as AccountActions from './account.actions';

@Injectable()
export class AccountEffects {

    createAccount = createEffect(() =>
        this.actions$.pipe(ofType(AccountActions.ACC_CREATEACCOUNT), switchMap((accountDetails: AccountActions.CreateAccount) => {
            return this.http.put<Account>("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + accountDetails.payload.accountnumber + ".json", accountDetails.payload).pipe(map(() => {
                return new AccountActions.AccountActionResponse("Account Created Successfully..!");
            }), catchError(() => {
                return of(new AccountActions.AccountActionResponse("An Unknow error occured..!"));
            }))
        }))
    );

    updateAccount = createEffect(() =>
        this.actions$.pipe(ofType(AccountActions.ACC_UPDATEACCOUNT), switchMap((accountDetails: AccountActions.UpdateAccount) => {
            return this.http.put<Account>("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + accountDetails.payload.accountnumber + ".json", accountDetails.payload).pipe(map(() => {
                return new AccountActions.AccountActionResponse("Account Updated Successfully..!");
            }), catchError(() => {
                return of(new AccountActions.AccountActionResponse("An Unknow error occured..!"));
            }))
        }))
    );

    accountExist = createEffect(() =>
        this.actions$.pipe(ofType(AccountActions.ACC_ACCOUNTEXIST), switchMap((accountDetails: AccountActions.AccountExist) => {
            return this.http.get<Account>("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + accountDetails.payload.accountnumber + ".json").pipe(map((response) => {
                if (response) {
                    return new AccountActions.AccountActionResponse((response.accounttype == 0 ? "Savings " : (response.accounttype == 1 ? "Current " : "Checking ")) + "Account Already Exist..!");
                }
                return new AccountActions.CreateAccount(accountDetails.payload);
            }), catchError(() => {
                return of(new AccountActions.AccountActionResponse("An Unknow error occured..!"));
            }))
        }))
    );

    deleteAccount = createEffect(() =>
        this.actions$.pipe(ofType(AccountActions.ACC_ACCOUNTDELETE), switchMap((accountDetails: AccountActions.AccountDelete) => {
            return this.http.delete("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + accountDetails.payload + ".json").pipe(map(() => {
                return new AccountActions.AccountActionResponse("Account Deleted Successfully..!");
            }), catchError(() => {
                return of(new AccountActions.AccountActionResponse("An Unknow error occured..!"));
            }));
        }))
    );

    fundtrasfer = createEffect(() =>
        this.actions$.pipe(ofType(AccountActions.ACC_FUNDTRASFER), switchMap((transactionDetails: AccountActions.FundTransfer) => {
            return this.http.patch("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + transactionDetails.payload.accountnumber + ".json", {
                accountbalance: (transactionDetails.payload.accountbalance - transactionDetails.payload.transferAmount)
            }).pipe(switchMap(() => {
                return this.http.patch("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts/" + transactionDetails.payload.payeeaccountnumber + ".json", {
                    accountbalance: (transactionDetails.payload.payeeaccountbalance + transactionDetails.payload.transferAmount)
                }).pipe(switchMap(() => {
                    return this.http.put("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/transactions/" + transactionDetails.payload.transactionnumber.toString() + ".json", transactionDetails.payload).pipe(map(() => {
                        return new AccountActions.AccountActionResponse("Transaction Completed Successfully..!");
                    }));
                }));
            }), catchError(() => {
                return of(new AccountActions.AccountActionResponse("An Unknow error occured..!"));
            }));
        }))
    );

    constructor(private actions$: Actions, private http: HttpClient) {
    }

}