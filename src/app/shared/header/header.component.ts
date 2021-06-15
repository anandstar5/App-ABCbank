import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../ztore/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { CommonService } from '../common.service';
import { Observable, Subscription } from 'rxjs';
import { Claim } from 'src/app/auth/claim.model';
import { Router } from '@angular/router';
import { animate, group, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    animations: [
        trigger("logoAnimation", [
            state("start", style({
                color: "orange"
            })),
            state("stop", style({
                color: "rgba(0,0,0,.9)"
            })),
            transition("start <=> stop", animate(500))
        ])
    ]
})

export class HeaderComponent implements OnInit, OnDestroy {
    customerid = "";
    claim: Claim = null;
    isAuthenticate = false;
    isAdmin = false;
    authSubscription: Subscription;
    animationSubscription: Subscription;
    animationState = "start";

    ngOnInit() {
        this.authSubscription = this.store.select("auth").subscribe((authState) => {
            this.isAuthenticate = !!authState.claim;
            this.isAdmin = !!authState.claim?.isAdminUser;
            this.claim = authState.claim;

            if (this.claim && !this.isAdmin) {
                this.customerid = this.claim.id.substring(0, 6);
            }
        });

        //Logo Animations Start
        const animationObserver = new Observable((observer) => {
            let count = 0;
            setInterval(() => {
                if (count % 2) {
                    observer.next("stop");
                }
                else {
                    observer.next("start");
                }

                if (count === 100) {
                    observer.complete();
                }
                count++;
            }, 1000)
        })

        this.animationSubscription = animationObserver.subscribe((response: string) => {
            this.animationState = response;
        });
        //Logo Animations End

    }

    onLogout() {
        this.store.dispatch(new AuthActions.AuthLogout);
    }

    onSearch(searchValue) {
        this.router.navigate(['account/summary', searchValue]);
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
        this.animationSubscription.unsubscribe();
    }

    constructor(private store: Store<AppState>, private commonService: CommonService, private router: Router) {

    }

}