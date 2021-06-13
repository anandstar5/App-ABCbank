import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { Claim } from '../claim.model';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from 'src/app/user/user.service';

interface authResponse {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

const handleAuthentication = (
    email: string,
    id: string,
    _token: string,
    _tokenExpirationDate: Date
) => {
    const claim = new Claim(email, id, _token, _tokenExpirationDate);
    const expirationDate = _tokenExpirationDate + "";
    const localStorageClaim = {
        email: email, id: id, _token: _token,
        _tokenExpirationDate: expirationDate
    };
    localStorage.setItem("claimDetails", JSON.stringify(localStorageClaim));
    return new AuthActions.AuthSuccess(claim);
}

const handleError = (error: HttpErrorResponse) => {
    let errorMessage = "An unknown error occured!";    
    if (!error.error || !error.error.error) {
        return of(new AuthActions.AuthFail(errorMessage));
    }

    switch (error.error.error.message) {
        case "EMAIL_EXISTS":
            errorMessage = "Email already Exists!";
            break;
        case "EMAIL_NOT_FOUND":
            errorMessage = "This Email does not exists!"
            break;
        case "INVALID_PASSWORD":
            errorMessage = "Invalid Password!"
            break;
        default: "An Unknow error occured!";
    }
    return of(new AuthActions.AuthFail(errorMessage));
}

@Injectable()
export class AuthEffects {

    authLoginStart = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.AUTH_LOGINSTART),
            switchMap((loginData: AuthActions.AuthLoginStart) => {
                return this.http.post<authResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.apikey, {
                    email: loginData.payload.email,
                    password: loginData.payload.password,
                    returnSecureToken: true
                }).pipe(map((response) => {
                    let _tokenExpirationDate = new Date(new Date().getTime() +
                        +response.expiresIn * 1000);
                    return handleAuthentication(response.email, response.localId, response.idToken, _tokenExpirationDate);
                }), catchError((error) => {
                    return handleError(error);
                }));

            })

        )
    );

    authSignUpStart = createEffect(() =>

        this.actions$.pipe(ofType(AuthActions.AUTH_SIGNUPSTART),
            switchMap((signUpData: AuthActions.AuthSignUpStart) => {
                return this.http.post<authResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.apikey
                    , {
                        email: signUpData.payload.email,
                        password: signUpData.payload.password,
                        returnSecureToken: true
                    }).pipe(map((response) => {

                        // Add User Start
                        this.userService.addUser(signUpData.payload.email, signUpData.payload.username, response.localId,
                            response.idToken)
                        // Add User End

                        let _tokenExpirationDate = new Date(new Date().getTime() +
                            +response.expiresIn * 1000);
                        return handleAuthentication(response.email, response.localId, response.idToken, _tokenExpirationDate)
                    }), catchError((error) => {
                        return handleError(error);
                    }))
            })
        )

    );

    authSuccess = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.AUTH_AUTHSUCCESS)), { dispatch: false }
    );

    authLogout = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.AUTH_LOGOUT),
            tap(() => {
                localStorage.removeItem("claimDetails");
                this.authService.clearLogoutTimer();
                this.router.navigate(["/"]);
            })
        ), { dispatch: false }
    );

    authAutoLogin = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.AUTH_AUTOLOGIN), map(() => {
            if (!localStorage.getItem("claimDetails")) {
                return { type: "DUMMY" }
            }
            const claimDetails: Claim = JSON.parse(localStorage.getItem("claimDetails")!);
            if (!claimDetails) {
                return { type: "DUMMY" }
            }

            const claims = new Claim(claimDetails.email, claimDetails.id, claimDetails._token, claimDetails._tokenExpirationDate)
            if (claims.token) {
                const expriesIn = new Date(claims._tokenExpirationDate).getTime()
                    - new Date().getTime();
                this.authService.setLogoutTimer(expriesIn);

                return handleAuthentication(claims.email, claims.id, claims.token, claims._tokenExpirationDate);
            }

            return { type: "DUMMY" }
        }))
    )

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService, private userService: UserService) { }

}