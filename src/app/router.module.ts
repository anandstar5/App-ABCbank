import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AdminGuard, AuthGuard, UserGuard } from './auth/auth.guard';
import { AccountdetailsComponent } from './shared/accountdetails/accountdetails.component';
import { AccountSummaryComponent } from './shared/accountsummary/accountsummary.component';
import { NotFoundComponent } from './shared/notfound/notfound.component';
import { FundtransferComponent } from './user/fundtransfer/fundtransfer.component';
import { ResolveGuard } from './shared/accountdetails/resolve.guard';
import { AccountActiveGuard } from './shared/accountdetails/accountactive.guard';
import { StatementComponent } from './user/statement/statement.component';
import { DeActivateGuard } from './shared/others/deactivate.guard';

const routes: Routes = [
    {
        path: "", component: AuthComponent, pathMatch: "full"
    },
    {
        path: "home", component: HomeComponent, canActivate: [AuthGuard]
    },
    {
        path: "account", canActivate: [AuthGuard], children: [
            {
                path: "", component: AccountdetailsComponent, canActivate: [AdminGuard]
            },
            {
                path: "fundtransfer", component: FundtransferComponent, canActivate: [UserGuard],canDeactivate:[DeActivateGuard]
            },
            {
                path: ":accountno", component: AccountdetailsComponent,canActivate:[AccountActiveGuard], resolve: { AccountInfo: ResolveGuard }
            },
            {
                path: "summary/:customerid", component: AccountSummaryComponent
            },
            {
                path:"statement/:accountno",component:StatementComponent,canActivate:[AccountActiveGuard]
            }

        ]
    },
    {
        path: "notfound", component: NotFoundComponent
    },
    {
        path: "**", redirectTo: "notfound"
    }
]

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRouterModule {

}