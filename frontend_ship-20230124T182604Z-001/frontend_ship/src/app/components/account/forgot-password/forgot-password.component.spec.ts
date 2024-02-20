import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ ForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick should get security question for the user', () => {
    component.userIDForm.value.userid = 'u123';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.getSecurityQuestion-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should send request to forgot password ', () => {
    component.showAnswerDiv = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.forgotPassword-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should highlight input', () => {
    component.showAnswerDiv = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.sq_answer_input')).nativeElement;
    buttonElement.dispatchEvent(new Event('focus'));
  });


  it('onclick should not highlight input', () => {
    component.showAnswerDiv = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.sq_answer_input')).nativeElement;
    buttonElement.dispatchEvent(new Event('blur'));
  });

});
