import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../shared/notfound/notfound.component';

const routes: Routes = [
    {
        path: "", pathMatch: "full", loadChildren: () => import("./auth.module").then(m => m.AuthModule)
    },
    {
        path: "home", component: HomeComponent, canActivate: [AuthGuard]
    },
    {
        path: "account", canActivate: [AuthGuard], loadChildren: () => import("./account.module").then(m => m.AccountModule)
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
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})

export class AppRouterModule {

}