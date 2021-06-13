import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Claim } from 'src/app/auth/claim.model';
import { UserService } from 'src/app/user/user.service';
import { AppState } from 'src/app/ztore/app.reducer';
import { Account } from '../account.model';
import { CommonService } from '../common.service';
import { PlaceHolderDirective } from '../others/placeholder.directive';
import * as AccountActions from '../store/account.actions';

@Component({
  selector: 'app-accountdetails',
  templateUrl: './accountdetails.component.html',
  styleUrls: ['./accountdetails.component.css']
})

export class AccountdetailsComponent implements OnInit, OnDestroy {
  accountDetailsForm: FormGroup;
  isAdminUser = false;
  branchList: Map<string, string>;
  accountTypesList: Map<string, string>;
  minBalance = 0;
  authSubscription: Subscription;
  accountSubscription: Subscription;
  commonSubscription: Subscription;
  accountActionResponse: string = null;
  routeParam = null;
  claim: Claim = null;
  customerid = "";

  @ViewChild(PlaceHolderDirective, { static: false }) placeHolderDirective!: PlaceHolderDirective;

  ngOnInit(): void {
    this.accountDetailsFormGroup();
    this.branchList = this.commonService.getBranchList();
    this.accountTypesList = this.commonService.getAccoutTypes();

    this.authSubscription = this.store.select("auth").subscribe((authState) => {
      this.claim = authState.claim;
      if (authState.claim?.isAdminUser) {
        this.isAdminUser = authState.claim.isAdminUser;
      }

      if (this.claim) {
        this.customerid = this.claim.id.substring(0, 6);
      }

    });

    // Edit/View Account Start
    this.route.params.subscribe((params: Params) => {
      this.routeParam = params['accountno'];
    });

    this.getAccountInfo();

    // Edit/View Account End

    this.accountSubscription = this.store.select("account").subscribe(accountState => {
      if (accountState.actionResponse) {
        this.accountActionResponse = accountState.actionResponse;

        if (!this.routeParam) {
          if (!this.accountActionResponse) {
            this.accountDetailsForm.reset();
          }
          else if (this.accountActionResponse.indexOf("Exist") < 0) {
            this.accountDetailsForm.reset();
          }
        }
      }
    })

  }

  accountDetailsFormGroup() {
    this.accountDetailsForm = new FormGroup({
      'user': new FormGroup({
        'customerid': new FormControl('', Validators.required),
        'customername': new FormControl('', Validators.required),
        'email': new FormControl('', [Validators.required, Validators.required])
      }),
      'customerphone': new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]),
      'accountbranch': new FormControl('-1', [Validators.required, this.commonService.selectValidation]),
      'accounttype': new FormControl('-1', [Validators.required, this.commonService.selectValidation]),
      'accountbalance': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    const account: Account = this.accountDetailsForm.getRawValue();
    if (this.routeParam) {
      this.store.dispatch(new AccountActions.UpdateAccount({
        ...account,
        accountnumber: account.accountbranch.substring(0, 8) + account.accounttype + account.user.customerid
      }))
    }
    else {
      if (this.isAdminUser) {
        this.store.dispatch(new AccountActions.AccountExist({
          ...account,
          accountnumber: account.accountbranch.substring(0, 8) + account.accounttype + account.user.customerid
        }));
      }
    }

  }

  onSearchUsers() {
    if (this.isAdminUser) {
      this.userService.onSearchUsers(this.placeHolderDirective, this.accountDetailsForm);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
    if (this.commonSubscription) {
      this.commonSubscription.unsubscribe();
    }
  }

  onCancel() {
    this.accountDetailsForm.reset();
    this.getAccountInfo();
    if (!this.routeParam) {
      this.accountDetailsForm.patchValue({
        accountbranch: "-1",
        accounttype: "-1",
      });
    }
  }

  onAlertClose() {
    this.accountActionResponse = null;
    this.store.dispatch(new AccountActions.AccountResponseReset);
  }

  onAccountTypeChange() {
    const accoutType = this.accountDetailsForm.get('accounttype').value;
    if (accoutType === "0") {
      this.minBalance = 500;
    }
    else if (accoutType === "1") {
      this.minBalance = 1000;
    }
    else if (accoutType === "2") {
      this.minBalance = 1500;
    }
    else this.minBalance = 0;
  }

  getAccountInfo() {
    if (this.routeParam) {
      this.route.data.subscribe((data: Data) => {
        if (data['AccountInfo']) {
          this.setFormValues(data['AccountInfo']);
        }
        else {
          this.router.navigate(["notfound"]);
        }
      });
    }
  }

  setFormValues(account: Account) {
    this.accountDetailsForm.setControl('accountbranch', new FormControl({value:'-1',disabled:true}));
    this.accountDetailsForm.setControl('accounttype', new FormControl({value:'-1',disabled:true}));
    if (account) {
      this.accountDetailsForm.setValue({
        user: {
          customerid: account.user.customerid,
          customername: account.user.customername,
          email: account.user.email
        },
        accountbalance: account.accountbalance,
        accountbranch: account.accountbranch,
        customerphone: account.customerphone,
        accounttype: account.accounttype,
      });
    }
    this.onAccountTypeChange();    

  }

  constructor(private store: Store<AppState>, private userService: UserService, private commonService: CommonService, private route: ActivatedRoute, private router: Router) { }

}
