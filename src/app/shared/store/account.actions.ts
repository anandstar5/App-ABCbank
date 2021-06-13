import { Action } from '@ngrx/store';
import { Transaction } from 'src/app/user/Transaction.model';
import { Account } from '../account.model';

export const ACC_CREATEACCOUNT = "[Acc] CreateAccount";
export const ACC_UPDATEACCOUNT = "[Acc] UpdateAccount";
export const ACC_ACCOUNTEXIST = "[Acc] AccountExist";
export const ACC_ACTIONRESPONSE = "[Acc] ActionResponse";
export const ACC_RESPONSERESET = "[Acc] ResponseReset";
export const ACC_ACCOUNTDELETE = "[Acc] AccountDelete";
export const ACC_FUNDTRASFER = "[Acc] FundTransfer";

export class CreateAccount implements Action {
    readonly type = ACC_CREATEACCOUNT;
    constructor(public payload: Account) {
    }
}

export class UpdateAccount implements Action {
    readonly type = ACC_UPDATEACCOUNT;
    constructor(public payload: Account) {
    }
}

export class AccountActionResponse implements Action {
    readonly type = ACC_ACTIONRESPONSE;
    constructor(public payload: string) {
    }
}

export class AccountExist implements Action {
    readonly type = ACC_ACCOUNTEXIST;
    constructor(public payload: Account) {

    }
}

export class AccountResponseReset implements Action {
    readonly type = ACC_RESPONSERESET;
}

export class AccountDelete implements Action {
    readonly type = ACC_ACCOUNTDELETE;
    constructor(public payload: string) {
    }
}

export class FundTransfer implements Action {
    readonly type = ACC_FUNDTRASFER;
    constructor(public payload: Transaction) {
    }
}

export type AccountActions = CreateAccount | UpdateAccount | AccountActionResponse | AccountExist | AccountResponseReset | AccountDelete | FundTransfer;