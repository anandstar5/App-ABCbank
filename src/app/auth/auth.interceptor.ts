import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { take, map, exhaustMap } from "rxjs/operators";
import { AppState } from "../ztore/app.reducer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return this.store.select('auth').pipe(take(1), map((authState) => {
            return authState.claim;
        }), exhaustMap((claim) => {
            if (!claim) {
                return next.handle(req);
            }

            const modifiedReq = req.clone({ params: new HttpParams().set("auth", claim.token) });
            return next.handle(modifiedReq);
        }));

    }

    constructor(private store: Store<AppState>) {

    }

}