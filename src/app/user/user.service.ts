import { HttpClient, HttpParams } from "@angular/common/http";
import { ComponentFactoryResolver, Injectable, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { PlaceHolderDirective } from "../shared/others/placeholder.directive";
import { UserListComponent } from "../shared/popup/userlist/userlist.component";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {

    placeHolderSubscription: Subscription;

    addUser(email: string, customername: string, localId: string, idToken: string) {

        const customerid = localId.substring(0, 6);
        this.http.patch("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/users/" +
            customerid + ".json", {
            email: email,
            customername: customername,
            customerid: customerid
        }, { params: new HttpParams().set("auth", idToken) }).subscribe(() => {
            console.log("user stored to Database Successfully..!")
        }, (error) => {
            console.log(error);
        });

    }

    getUser() {

        return this.http.get("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/users.json").pipe(map((response) => {

            const userlist: User[] = [];
            if (response) {
                for (const key in response) {
                    if (response.hasOwnProperty(key)) {
                        userlist.push({ ...response[key] });
                    }
                }
            }
            return userlist;
        }), catchError((error) => {
            return throwError(error);

        }));

    }

    onSearchUsers(placeHolderDirective: PlaceHolderDirective, pageForm: FormGroup) {
        const componentFactory = this.compnentFactory.resolveComponentFactory(UserListComponent);
        const placeholderDirective = placeHolderDirective.viewcontainerRef;
        placeholderDirective.clear();
        const placeholderContent = placeholderDirective.createComponent(componentFactory);
        this.getUser().subscribe((userslist) => {
            placeholderContent.instance.userList = userslist;
        });
        this.placeHolderSubscription = placeholderContent.instance.cancel.subscribe(() => {
            this.placeHolderSubscription.unsubscribe();
            placeholderDirective.clear();
        });
        this.placeHolderSubscription = placeholderContent.instance.onSelectUser.subscribe((user) => {
            this.placeHolderSubscription.unsubscribe();
            placeholderDirective.clear();
            if (user) {
                pageForm.patchValue({
                    user: {
                        customerid: user.customerid,
                        customername: user.customername,
                        email: user.email
                    }
                })
            }
        })
    }

    constructor(private http: HttpClient, private compnentFactory: ComponentFactoryResolver) {
    }

    ngOnDestroy() {
        if (this.placeHolderSubscription) {
            this.placeHolderSubscription.unsubscribe();
        }
    }

}