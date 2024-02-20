import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMapComponent } from './live-map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LiveMapComponent', () => {
  let component: LiveMapComponent;
  let fixture: ComponentFixture<LiveMapComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ LiveMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveMapComponent);
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


  it('Zoom in map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.zoomin'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Zoom out map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.zoomout'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Show graticule on map', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.graticule'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Hide graticule on map', () => {
    component.graticule = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.graticule'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('collapse sidenav (cond 1)', () => {
    component.isExpanded = true;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.collapse-sidenav'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('collapse sidenav (cond 2)', () => {
    component.isExpanded = true;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.collapse-sidenav'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('collapse sidenav (cond 3)', () => {
    component.isExpanded = false;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.collapse-sidenav'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('collapse sidenav (cond 4)', () => {
    component.isExpanded = false;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.collapse-sidenav'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Add to soi or goi button', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.addfav-btn'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Add to soi', () => {
    component.isFav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.addtoSoi-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Get goi ships for that user', () => {
    component.isFav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.getGoiShipsOnPopup'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('open Model To Add New Group From Popup ', () => {
    component.isFav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openModelToAddnewGroupFromPopup'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Add ship to existing group ', () => {
    component.isFav = true;
    component.togroup = true;
    component.goiforpopup = [{Group_ID: 'test', group_details: [], img: 'tick', disable: 'true'}];
    component.goiforpopuplength = 1;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.addMMSIToExistingGOI'));
    buttonElement.triggerEventHandler('click', null);
  });

  // it('Show vessel filter track', () => {
  //   document.getElementById('vfTrack').setAttribute('style', 'display: block');
  //   console.log(document.getElementById('vfTrack'))
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.showvfTrack'));
  //   buttonElement.triggerEventHandler('click', null);
  // });

  it('Predict Vessel Type', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.predictClass'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Predict Vessel types aand explain', () => {
    component.predictedclasstypelength = 1;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.predictedTypeExplain'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Predict Destination', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.predictDestination'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Past Track', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.pastTrack'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Predict Route', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.predictRoute'));
    buttonElement.triggerEventHandler('click', null);
  });

});
