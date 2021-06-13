import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../ztore/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.store.select('auth').pipe(take(1), map((authState) => {
            if (authState.claim) {
                return true;
            }
            return this.router.createUrlTree(["/"]);

        }));

    }

    constructor(private store: Store<AppState>, private router: Router) {

    }

}

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.store.select('auth').pipe(take(1), map((authState) => {
            if (authState.claim.isAdminUser) {
                return this.router.createUrlTree(["notfound"]);
            }
            return true;

        }));

    }

    constructor(private store: Store<AppState>, private router: Router) {

    }

}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.store.select('auth').pipe(take(1), map((authState) => {
            if (authState.claim.isAdminUser) {
                return true;
            }
            return this.router.createUrlTree(["notfound"]);

        }));

    }

    constructor(private store: Store<AppState>, private router: Router) {

    }

}