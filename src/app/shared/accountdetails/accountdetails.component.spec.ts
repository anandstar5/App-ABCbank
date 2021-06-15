import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { getMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CoreModule } from 'src/app/modules/core.module';
import { User } from 'src/app/user/user.model';
import { appReducer } from 'src/app/ztore/app.reducer';
import { AccountdetailsComponent } from './accountdetails.component';


describe('AccountdetailsComponent', () => {
  let component: AccountdetailsComponent;
  let fixture: ComponentFixture<AccountdetailsComponent>;
  let store: MockStore;
  const initialState = {
    claim: null,
    authError: null,
    isLoading: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountdetailsComponent],
      imports: [
        StoreModule.forRoot(appReducer),
        HttpClientTestingModule,
        CoreModule,
        RouterTestingModule
      ],
      providers: [{
        provide: ActivatedRoute, useValue: {
          params: of({ "accountno": "123" }),
          data: of({
            "AccountInfo":
            {
              accountnumber: "123",
              accountbranch: "ABC00005",
              accounttype: 2,
              customerphone: 94587755,
              accountbalance: 500,
              user: new User("anantha", "test@test.com", "123546")
            }

          })
        }
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = getMockStore({ initialState });
    fixture = TestBed.createComponent(AccountdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    let store = fixture.debugElement.injector.get(Store);
    store = getMockStore({ initialState });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
