import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AppState } from "src/app/ztore/app.reducer";
import { CommonService } from "../common.service";

@Injectable({ providedIn: "root" })
export class AccountActiveGuard implements CanActivate {

    constructor(private store: Store<AppState>, private router: Router, private commonService: CommonService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.store.select('auth').pipe(take(1), map((authState) => {
            if (authState?.claim?.isAdminUser) {
                return "admin";
            }
            if (authState?.claim?.id) {
                return authState.claim.id.substring(0, 6);
            }
            return "0";
        }), switchMap((customerid) => {

            return this.commonService.totalAccounts.pipe(map((accounts) => {
                if (customerid === "admin") {
                    return true;
                }
                const account = accounts.find(x => x.accountnumber == route.params['accountno'] && x.user.customerid == customerid);
                if (account) {
                    return true;
                }
                return this.router.createUrlTree(["notfound"]);
            }));
        }));
    }

}