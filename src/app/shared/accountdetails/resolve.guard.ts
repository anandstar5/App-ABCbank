import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Account } from "../account.model";
import { CommonService } from "../common.service";

@Injectable({ providedIn: "root" })
export class ResolveGuard implements Resolve<Account> {

    constructor(private commonService: CommonService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<Account> | Promise<Account> | Account {

        return this.commonService.totalAccounts.pipe(map((accounts) => {
            if (accounts) {
                const account = accounts.find(x => x.accountnumber == route?.params['accountno']);
                return account;
            }
            return null;
        }))
    };
}