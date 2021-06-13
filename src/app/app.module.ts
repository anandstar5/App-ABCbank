import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';
import { AccountdetailsComponent } from './shared/accountdetails/accountdetails.component';
import { FundtransferComponent } from './user/fundtransfer/fundtransfer.component';
import { AppRouterModule } from './router.module';
import { appReducer } from './ztore/app.reducer';
import { LoaderComponent } from './shared/loader/loader.component';
import { CommonService } from './shared/common.service';
import { AuthEffects } from './auth/store/auth.effects';
import { AlertComponent } from './shared/popup/alert/alert.component';
import { PlaceHolderDirective } from './shared/others/placeholder.directive';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserListComponent } from './shared/popup/userlist/userlist.component';
import { FilterPipe } from './shared/others/filter.pipe';
import { AccountEffects } from './shared/store/account.effects';
import { AccountSummaryComponent } from './shared/accountsummary/accountsummary.component';
import { PageClickDirective } from './shared/others/pageclick.directive';
import { AmountValidatorDirective, SelectValidatorDirective } from './shared/others/validators.directive';
import { StatementComponent } from './user/statement/statement.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { DeActivateGuard } from './shared/others/deactivate.guard';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    HomeComponent,
    AccountdetailsComponent,
    FundtransferComponent,
    AccountSummaryComponent,
    LoaderComponent,
    AlertComponent,
    UserListComponent,
    StatementComponent,
    PlaceHolderDirective,
    PageClickDirective,
    SelectValidatorDirective,
    AmountValidatorDirective,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRouterModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer),
    //commented below modules - application getting hang while adding dev tools so commented as of now.
    // StoreDevtoolsModule.instrument({logOnly:environment.production}),
    // StoreRouterConnectingModule.forRoot(), 
    EffectsModule.forRoot([AuthEffects, AccountEffects])
  ],
  providers: [CommonService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, DeActivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
