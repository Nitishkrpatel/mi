import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ SidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.rolefeatures =  { Map: [{ featurelink: 'Standard-Map', featurename: 'Standard Map', fid: 'f05' },
                              { featurelink: 'Satellite-Map', featurename: 'Satellite Map', fid: 'f06'},
                              { featurelink: 'Nautical-Map', featurename: 'Nautical Map', fid: 'f07'}],
                              features: [{ featurelink: 'Vessel-Filters', featurename: 'Vessel Filters', fid: 'f01'},
                              { featurelink: 'Ships-of-Interest', featurename: 'Ships of Interest', fid: 'f02'},
                              { featurelink: 'Region-of-Interest', featurename: 'Region of Interest', fid: 'f03'},
                              { featurelink: 'Density-Map', featurename: 'Density Map', fid: 'f04'}],
                              layers: [{ featurelink: 'Ports', featurename: 'Ports', fid: 'f08'},
                              { featurelink: 'Anchors', featurename: 'Anchors', fid: 'f09'},
                              { featurelink: 'Lighthouses', featurename: 'Lighthouses', fid: 'f10'}]};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick should toggle side nav bar ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggle-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should open fullscreen map ', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.fullscreen-btn'));
    buttonElement.triggerEventHandler('click', null);
  });


  it('should call getFeatureForRole() on init method', () => {
    spyOn(component, 'getFeatureForRole').and.callThrough();
    component.ngOnInit();
    expect(component.getFeatureForRole).toHaveBeenCalled();
  });

  it('onclick should toggle second side nav ', () => {
    component.isExpanded = true;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggle-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should toggle second side nav ', () => {
    component.isExpanded = true;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggle-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should toggle second side nav ', () => {
    component.isExpanded = false;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggle-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should toggle second side nav ', () => {
    component.isExpanded = false;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.toggle-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change feature ', () => {
    component.isExpanded = true;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changefeature'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change feature ', () => {
    component.isExpanded = true;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changefeature'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change feature ', () => {
    component.isExpanded = false;
    component.collapseNav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changefeature'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change feature ', () => {
    component.isExpanded = false;
    component.collapseNav = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changefeature'));
    buttonElement.triggerEventHandler('click', null);
  });
});
