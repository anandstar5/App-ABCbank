import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { CommonService } from '../shared/common.service';
import { DeActivateGuard } from '../shared/others/deactivate.guard';

@NgModule({
    providers: [CommonService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, DeActivateGuard],
})

export class CoreModule {

}