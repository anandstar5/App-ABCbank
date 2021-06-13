import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { Account } from "./account.model";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class CommonService {

    constructor(private http: HttpClient) {

    }

    isLoading = new BehaviorSubject<boolean>(false);        

    getBranchList() {
        let branchList = new Map<string, string>();
        branchList.set("Mumbai", "ABC000001");
        branchList.set("Delhi", "ABC000002");
        branchList.set("Bangalore", "ABC000003");
        branchList.set("Hyderabad", "ABC000004");
        branchList.set("Chennai", "ABC000005");
        branchList.set("Kolkata", "ABC000006");
        return branchList;
    }

    getBranchByValue(val:string){
        return [...this.getBranchList()].find(([key, value]) => val === value)[0];
    }

    getAccoutTypes() {
        let accountTypes = new Map<string, string>();
        accountTypes.set("Savings Account", "0");
        accountTypes.set("Current Account", "1");
        accountTypes.set("Checking Account", "2");
        return accountTypes;
    }

    getAccounTypeByValue(val:string){
        return [...this.getAccoutTypes()].find(([key,value])=>val===value)[0];
    }

    selectValidation(control: FormControl): { [key: string]: boolean } {
        if (control.value === "-1") {
            return { "isSelected": false }
        }
        return null;
    }

    get totalAccounts() {
        return this.http.get("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/accounts.json").pipe(map((response) => {

            const accounts: Account[] = [];
            if (response) {
                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        accounts.push({ ...response[key] });
                    }
                }
            }
            return accounts;
        }), catchError(error => {
            return throwError(error);
        }));
    }   

}