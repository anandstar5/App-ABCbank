import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { AuthEffects } from './auth/store/auth.effects';
import { HomeComponent } from './home/home.component';
import { CoreModule } from './modules/core.module';
import { HeaderModule } from './modules/header.module';
import { AppRouterModule } from './modules/router.module';
import { SharedModule } from './modules/shared.module';
import { AccountEffects } from './shared/store/account.effects';
import { appReducer } from './ztore/app.reducer';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, AccountEffects]),
    CoreModule,
    SharedModule,
    HeaderModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    //commented below modules - application getting hang while adding dev tools so commented as of now.
    // StoreDevtoolsModule.instrument({logOnly:environment.production}),
    // StoreRouterConnectingModule.forRoot(), 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
