import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core.module';
import { CommonService } from './shared/common.service';
import { appReducer } from './ztore/app.reducer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[
        StoreModule.forRoot(appReducer),
        HttpClientModule,
        CoreModule
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let commonService=fixture.debugElement.injector.get(CommonService);
    let store=fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });
 
});