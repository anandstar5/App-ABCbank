import { NgModule } from "@angular/core";
import { AccountdetailsComponent } from "../shared/accountdetails/accountdetails.component";
import { AccountSummaryComponent } from "../shared/accountsummary/accountsummary.component";
import { FundtransferComponent } from "../user/fundtransfer/fundtransfer.component";
import { UserListComponent } from '../shared/popup/userlist/userlist.component';
import { StatementComponent } from '../user/statement/statement.component';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdminGuard, UserGuard } from "../auth/auth.guard";
import { AccountActiveGuard } from "../shared/accountdetails/accountactive.guard";
import { DeActivateGuard } from "../shared/others/deactivate.guard";
import { ResolveGuard } from "../shared/accountdetails/resolve.guard";
import { SharedModule } from "./shared.module";

@NgModule({
    declarations: [
        AccountdetailsComponent,
        FundtransferComponent,
        AccountSummaryComponent,
        UserListComponent,
        StatementComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: "", component: AccountdetailsComponent, canActivate: [AdminGuard]
            },
            {
                path: "fundtransfer", component: FundtransferComponent, canActivate: [UserGuard], canDeactivate: [DeActivateGuard]
            },
            {
                path: ":accountno", component: AccountdetailsComponent, canActivate: [AccountActiveGuard], resolve: { AccountInfo: ResolveGuard }
            },
            {
                path: "summary/:customerid", component: AccountSummaryComponent
            },
            {
                path: "statement/:accountno", component: StatementComponent, canActivate: [AccountActiveGuard]
            }

        ])
    ]
})

export class AccountModule {

}