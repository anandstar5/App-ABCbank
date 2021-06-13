import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from './shared/common.service';
import { AppState } from './ztore/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isloading = false;
  ngOnInit() {
    this.commonService.isLoading.subscribe((response) => {
      this.isloading = response;
    });

    this.store.dispatch(new AuthActions.AuthAutoLogin);
  }

  constructor(private commonService: CommonService, private store: Store<AppState>) {

  }
}
