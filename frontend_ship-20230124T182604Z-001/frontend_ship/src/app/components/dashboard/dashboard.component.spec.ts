import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule, NgxPaginationModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loginStatus = 'true';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFeatureForRole() on init method', () => {
    spyOn(component, 'getFeatureForRole').and.callThrough();
    component.ngOnInit();
    expect(component.getFeatureForRole).toHaveBeenCalled();
  });

  it('should call getAllInitiallyContants() on ngOnInit', () => {
    spyOn(component, 'getAllInitiallyContants').and.callThrough();
    component.roleFeatures =  { Map: [{ featurelink: 'Standard-Map', featurename: 'Standard Map', fid: 'f05' },
                              { featurelink: 'Satellite-Map', featurename: 'Satellite Map', fid: 'f06'},
                              { featurelink: 'Nautical-Map', featurename: 'Nautical Map', fid: 'f07'}],
                              features: [{ featurelink: 'Vessel-Filters', featurename: 'Vessel Filters', fid: 'f01'},
                              { featurelink: 'Ships-of-Interest', featurename: 'Ships of Interest', fid: 'f02'},
                              { featurelink: 'Region-of-Interest', featurename: 'Region of Interest', fid: 'f03'},
                              { featurelink: 'Density-Map', featurename: 'Density Map', fid: 'f04'}],
                              layers: [{ featurelink: 'Ports', featurename: 'Ports', fid: 'f08'},
                              { featurelink: 'Anchors', featurename: 'Anchors', fid: 'f09'},
                              { featurelink: 'Lighthouses', featurename: 'Lighthouses', fid: 'f10'}]};
    component.ngOnInit();
    expect(component.getAllInitiallyContants).toHaveBeenCalled();
  });

  it('should call displayMap() on ngAfterViewInit', () => {
    spyOn(component, 'displayMap').and.callThrough();
    component.ngAfterViewInit();
    expect(component.displayMap).toHaveBeenCalled();
  });

  it('should call getTotalShips() on ngAfterViewInit', () => {
    spyOn(component, 'getTotalShips').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getTotalShips).toHaveBeenCalled();
  });

  it('should call getNeighbouringCountries() on ngAfterViewInit', () => {
    spyOn(component, 'getNeighbouringCountries').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getNeighbouringCountries).toHaveBeenCalled();
  });

  it('should call getShiptypeDeviation() on ngAfterViewInit', () => {
    spyOn(component, 'getShiptypeDeviation').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getShiptypeDeviation).toHaveBeenCalled();
  });

  it('should call getDestinationDeviation() on ngAfterViewInit', () => {
    spyOn(component, 'getDestinationDeviation').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getDestinationDeviation).toHaveBeenCalled();
  });

  it('should call getAnchorageDeviation() on ngAfterViewInit', () => {
    spyOn(component, 'getAnchorageDeviation').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getAnchorageDeviation).toHaveBeenCalled();
  });

  it('get neibhouring country details ', () => {
    component.allNeighbouringCountries = [{country: 'China', flag: 1, class: 'countries selected'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.getNeibhouringdetails'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('threshold slider move', () => {
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.threshold-slider')).nativeElement;
    select.value = 'Navy Theme';
    select.dispatchEvent(new Event('input'));
  });

  it('threshold slider change', () => {
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.threshold-slider')).nativeElement;
    select.value = 'Navy Theme';
    select.dispatchEvent(new Event('change'));
  });

  it('Select show top', () => {
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.select_showtop')).nativeElement;
    select.value = 'Navy Theme';
    select.dispatchEvent(new Event('change'));
  });

  it('accept only numbers', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.onlyNumberKey')).nativeElement;
    buttonElement.dispatchEvent(new Event('keypress'));
  });

  it('search shiptype deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-shiptypedeviation-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('ngModelChange'));
  });

  it('sort ship type deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.sortShipTypeDeviation'));
    buttonElement.triggerEventHandler('matSortChange', null);
  });

  it('set destination deviation time', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.setdestdeviationtime-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('ngModelChange'));
  });

  it('search destination deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-destdeviation-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('ngModelChange'));
  });

  it('sort destination deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.sortDestinationDeviation'));
    buttonElement.triggerEventHandler('matSortChange', null);
  });

  it('search anchorage deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-anchdeviation-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('ngModelChange'));
  });

  it('sort anchorage deviation', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.sortAnchorageDeviation'));
    buttonElement.triggerEventHandler('matSortChange', null);
  });

});
