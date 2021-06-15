import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CoreModule } from 'src/app/modules/core.module';
import { appReducer } from 'src/app/ztore/app.reducer';

import { FundtransferComponent } from './fundtransfer.component';

describe('FundtransferComponent', () => {
  let component: FundtransferComponent;
  let fixture: ComponentFixture<FundtransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundtransferComponent ],
      imports:[
        StoreModule.forRoot(appReducer),
        CoreModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundtransferComponent);
    component = fixture.componentInstance;    
    fixture.detectChanges();
  });

  it('should create', () => {
    let store=fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
