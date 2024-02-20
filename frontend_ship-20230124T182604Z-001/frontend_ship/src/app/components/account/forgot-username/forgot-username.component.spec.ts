import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUsernameComponent } from './forgot-username.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ForgotUsernameComponent', () => {
  let component: ForgotUsernameComponent;
  let fixture: ComponentFixture<ForgotUsernameComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
       providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ ForgotUsernameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllSecurity() on init method', () => {
    spyOn(component, 'getAllSecurity').and.callThrough();
    component.ngOnInit();
    expect(component.getAllSecurity).toHaveBeenCalled();
  });

  it('onclick should send request to forgot username ', () => {
    // component.showAnswerDiv = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.forgotUsername-button'));
    buttonElement.triggerEventHandler('click', null);
  });

});
