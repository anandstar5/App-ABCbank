import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

export interface canComponentDeActivate {
    canDeActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeActivateGuard implements CanDeactivate<canComponentDeActivate>{

    canDeactivate(component: canComponentDeActivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return component.canDeActivate();
    }

}