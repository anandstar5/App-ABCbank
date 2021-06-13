import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../ztore/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { CommonService } from '../shared/common.service';
import { PlaceHolderDirective } from '../shared/others/placeholder.directive';
import { AlertComponent } from '../shared/popup/alert/alert.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit, OnDestroy {
    isLogin = true;
    error: string | null = null;
    @ViewChild(PlaceHolderDirective, { static: false }) placeholderDirective!: PlaceHolderDirective;
    closeAlertSubscription!: Subscription;
    authSubscrption: Subscription;

    ngOnInit() {
        this.authSubscrption = this.store.select("auth").subscribe((authState) => {
            this.error = authState.authError;
            this.commonService.isLoading.next(authState.isLoading);
            if (this.error) {
                this.showErrorAlert(this.error);
            }

            if (authState.claim) {
                this.router.navigate(["home"]);
            }
        });
    }

    onSwitch() {
        this.isLogin = !this.isLogin;
    }

    onSubmit(authForm: NgForm) {

        if (!authForm.valid) {
            return;
        }

        const email = authForm.value.email;
        const password = authForm.value.password;
        const username = authForm.value.username;

        if (this.isLogin) {
            this.store.dispatch(new AuthActions.AuthLoginStart({
                email: email,
                password: password
            }
            ))
        }
        else {
            this.store.dispatch(new AuthActions.AuthSignUpStart({
                username: username,
                email: email,
                password: password
            }))
        }
        authForm.reset();
    }

    showErrorAlert(errorMessage: string) {
        const componentFactory = this.componentFactory.resolveComponentFactory(AlertComponent);
        const placeHolderDirective = this.placeholderDirective.viewcontainerRef;
        placeHolderDirective.clear();
        const placeHolderContent = placeHolderDirective.createComponent(componentFactory);
        placeHolderContent.instance.errorMessage = errorMessage;
        this.closeAlertSubscription = placeHolderContent.instance.close.subscribe(() => {
            this.closeAlertSubscription.unsubscribe();
            placeHolderDirective.clear();
        });
    }

    constructor(private store: Store<AppState>, private commonService: CommonService,
        private componentFactory: ComponentFactoryResolver, private router: Router) {
    }

    ngOnDestroy() {
        this.authSubscrption.unsubscribe();
        if (this.closeAlertSubscription) {
            this.closeAlertSubscription.unsubscribe();
        }

    }

}