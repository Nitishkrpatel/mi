import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ RegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick should continue to credentials tab ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.continueToCredentials'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should continue to security questions tab ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.continueToSecurity'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should register the user ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.register'));
    buttonElement.triggerEventHandler('click', null);
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

  it('should check for userid', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.checkForUserId-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keyup'));
  });

  it('should check for emailid', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.checkForEmailId-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keyup'));
  });

  it('onclick should accept only numbers', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.mobile-number-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keypress'));
  });
});
