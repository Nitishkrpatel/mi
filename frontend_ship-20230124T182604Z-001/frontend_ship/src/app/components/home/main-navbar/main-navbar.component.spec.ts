import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainNavbarComponent } from './main-navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('MainNavbarComponent', () => {
  let component: MainNavbarComponent;
  let fixture: ComponentFixture<MainNavbarComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ MainNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loginStatus = 'true';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getClockStatus() on init method', () => {
    component.loginStatus = 'true';
    component.Role = 'Admin';
    spyOn(component, 'getClockStatus').and.callThrough();
    component.ngOnInit();
    expect(component.getClockStatus).toHaveBeenCalled();
  });

  it('onclick should change clock status', () => {
    component.adjustedClock = 'false';
    component.hidePlayPause = false;
    component.currentURL = '/ship-map';
    component.resetclockStatus = true;
    component.clockStatus = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.clockstatus'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should open Input To SetTime', () => {
    component.adjustedClock = 'true';
    component.hideSetTime = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openInputToSetTime'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should Reset Time', () => {
    component.adjustedClock = 'false';
    component.hideResetTime = false;
    component.currentURL = '/ship-map';
    component.resetclockStatus = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.resetTime'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should get search history', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should open Search Popup', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search')).nativeElement;
    buttonElement.dispatchEvent(new Event('focus'));
  });

  it('onclick should search on key enter', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search')).nativeElement;
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
  });

  it('onclick should clear using backspace', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search')).nativeElement;
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Backspace'}));
  });

  it('onclick should reload', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.dashboard'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change clock speed', () => {
    component.adjustedClock = 'false';
    component.hideSpeed = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.speed-select')).nativeElement;
    select.value = '100x';
    select.dispatchEvent(new Event('change'));
  });

  it('onclick should change theme', () => {
    component.adjustedClock = 'false';
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.theme-select')).nativeElement;
    select.value = 'Navy Theme';
    select.dispatchEvent(new Event('change'));
  });

  it('onclick should close search', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.ol-popup-search-closer'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should clear search', () => {
    component.hideSearch = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.clearSearch'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should select Search Option', () => {
    component.hideSearch = false;
    component.searchhistory = [ { result: '201601682', type: 'MMSI' },
                                { result: '201006210', type: 'MMSI' },
                                { result: '201011000', type: 'MMSI' },
                                { result: '200800016', type: 'MMSI' },
                                { result: '200800016', type: 'Ship_name' }];
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.selectSearchOption'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change Criteria', () => {
    component.hideSearch = false;
    component.criteriaoptions = [
      { name: 'Ship Name', value: 'Shipname' },
      { name: 'MMSI', value: 'MMSI' },
      { name: 'IMO', value: 'IMO' },
      { name: 'COO', value: 'Coo' },
      { name: 'End Port', value: 'End_port' }
    ];
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeCriteria'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should logout user', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.logoutUser'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should set time', () => {
    component.inputtosettimeflag = true;
    component.hideSetTime = false;
    component.currentURL = '/ship-map';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.settimestamp'));
    buttonElement.triggerEventHandler('ngModelChange', null);
  });
});
