import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsComponent } from './profile-settings.component';
import { By } from '@angular/platform-browser';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick should call changeProfile() ', () => {
    component.loginStatus = 'true';
    component.profileSettingData = [{ name: 'Edit Profile', img: 'Edit-Profile' }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.Edit-Profile'));
    buttonElement.triggerEventHandler('click', null);
  });

});
