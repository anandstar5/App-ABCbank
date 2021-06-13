import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Transaction } from "../Transaction.model";
import * as xlsx from 'xlsx';

@Component({
    selector: "app-statement",
    templateUrl: "./statement.component.html",
    styleUrls: ["./statement.component.css"]
})
export class StatementComponent implements OnInit, OnDestroy {
    accountnumber: string = null;
    debitList: Transaction[] = null;
    creditList: Transaction[] = null;
    allTransactionList: Transaction[] = [];
    isStatementExist = false;
    httpSubscription: Subscription;

    ngOnInit() {

        this.route.params.subscribe((params: Params) => {
            this.accountnumber = params['accountno'];
            this.httpSubscription = this.http.get("https://ng-project-abcbank-default-rtdb.asia-southeast1.firebasedatabase.app/transactions.json").subscribe((response) => {
                const transactionlist: Transaction[] = [];
                if (response) {
                    for (let key in response) {
                        if (response.hasOwnProperty(key)) {
                            transactionlist.push({ ...response[key] })
                        }
                    }
                }
                this.debitList = transactionlist.filter(x => x.accountnumber == this.accountnumber);
                this.creditList = transactionlist.filter(x => x.payeeaccountnumber == this.accountnumber);

                if (this.debitList?.length > 0) {
                    this.isStatementExist = true;
                    this.allTransactionList.push(...this.debitList);
                }
                if (this.creditList?.length > 0) {
                    this.isStatementExist = true;
                    this.allTransactionList.push(...this.creditList);
                }
            });
        });
    }

    onExport() {
        //for timebeing downloading data like below..! There might be difference between UI and Excel..!
        const filename = this.accountnumber + ".xlsx";
        let element = this.allTransactionList;
        const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(element);
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'ABC Bank');
        xlsx.writeFile(wb, filename);
    }

    ngOnDestroy() {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    constructor(private http: HttpClient, private route: ActivatedRoute) {

    }

}