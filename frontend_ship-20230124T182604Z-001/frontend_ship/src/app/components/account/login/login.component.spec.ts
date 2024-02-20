import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick should show / hide password ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should show / hide password ', () => {
    fixture.detectChanges();
    document.getElementById('password').setAttribute('type', 'text');
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should login user ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.login-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should reset to current time ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.btn-light'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should continue in adjusted time ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.btn-dark'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should disable Other Inputs to update security question', () => {
    component.securityquestions = [
      'What is the name of the company of your first job?',
      'Which college did you graduate from?',
      'What was your childhood nickname?'
    ];
    component.updateNewUserDetails = true;
    component.updateTempPassword = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.disableOtherInputs'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should submit New User Details', () => {
    component.updateNewUserDetails = true;
    component.updateTempPassword = false;
    // component.updateUserDetailsForm.setValue({
    //   userid: 'u123', se_qn: 'test',
    //   se_ans: 'test',
    //   pwd: '12345678'
    // });
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitNewUserDetails'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should go back to login page', () => {
    component.updateNewUserDetails = true;
    component.updateTempPassword = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.goBackToLogin'));
    buttonElement.triggerEventHandler('click', null);
  });

});
