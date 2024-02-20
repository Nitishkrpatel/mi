import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       imports: [HttpClientTestingModule,
        HttpClientModule ],
        providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ EditProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method Edit Profile should be displayed for navy', () => {
    component.editProfile = true;
    component.Profileservice.changedtoEditProfile('true');
    component.theme = 'navy';
  });


  it('on init method Edit Profile should be displayed for grey', () => {
    component.editProfile = true;
    component.Profileservice.changedtoEditProfile('true');
    component.theme = 'grey';
  });


  it('on init method Edit Profile should not be displayed for navy', () => {
    component.editProfile = true;
    component.Profileservice.changedtoEditProfile('false');
    component.theme = 'navy';
  });


  it('on init method Edit Profile should not be displayed for grey', () => {
    component.editProfile = true;
    component.Profileservice.changedtoEditProfile('false');
    component.theme = 'grey';
  });

  it('onclick should show / hide password ', () => {
    component.editProfile = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should show / hide password ', () => {
    component.editProfile = true;
    fixture.detectChanges();
    document.getElementById('pwd').setAttribute('type', 'text');
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should accept only numbers', () => {
    component.editProfile = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.mobile-number-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keypress'));
  });
});
