import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayHistoryComponent } from './play-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PlayHistoryComponent', () => {
  let component: PlayHistoryComponent;
  let fixture: ComponentFixture<PlayHistoryComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
        providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ PlayHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loginStatus = 'true';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call displayMap() on ngAfterViewInit', () => {
    spyOn(component, 'displayMap').and.callThrough();
    component.ngAfterViewInit();
    expect(component.displayMap).toHaveBeenCalled();
  });


  it('playhistory from soi/goi on ngAfterViewInit', () => {
    component.SOImmsi = '201001101';
  });

  it('should call getFeatureForRole() on init method', () => {
    spyOn(component, 'getFeatureForRole').and.callThrough();
    component.ngOnInit();
    expect(component.getFeatureForRole).toHaveBeenCalled();
  });

  it('onclick should close Search Popup', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.ol-popup-search-closer-playhistory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should get history list', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.HistoryList'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should Zoom in map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.zoomin'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should Zoom out map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.zoomout'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should show graticule on map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.graticule'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should hide graticule on map', () => {
    component.graticule = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.graticule'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should add search to list', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.addToList'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should toggle repeat to on', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggleRepeat'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should get play history data', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.PlayHistory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('ngDestroy', () => {
    component.ngDestroy();
  });

});
