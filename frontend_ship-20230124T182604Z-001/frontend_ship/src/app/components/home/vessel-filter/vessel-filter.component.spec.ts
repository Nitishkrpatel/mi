import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselFilterComponent } from './vessel-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('VesselFilterComponent', () => {
  let component: VesselFilterComponent;
  let fixture: ComponentFixture<VesselFilterComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ VesselFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Select all Category ', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    component.allCategory = [{color: 'yellow', vessel_category: 'Cargo'}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectAllCategory-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Select Category', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    component.allCategory = [{color: 'yellow', vessel_category: 'Cargo'}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectCategory-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  // it('Toggle Extent ', () => {
  //   component.featureSelectedVF = 'true';
  //   component.featureSelectedVFSidenav = true;
  //   component.editPresetFlag = false;
  //   // component.allCategory = [{color: 'yellow', vessel_category: 'Cargo'}];
  //   fixture.detectChanges();
  //   const select = fixture.debugElement.query(By.css('.toggleExtent')).nativeElement;
  //   select.dispatchEvent(new Event('change'));
  // });

  it('Select all search ', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.searchOptions = [
      { name: 'Ship Name', value: 'Ship_name' },
      { name: 'MMSI', value: 'MMSI' },
      { name: 'IMO', value: 'IMO' },
      { name: 'Country Of Origin', value: 'COO' },
      { name: 'End Port', value: 'End_port' }
    ];
    component.editPresetFlag = false;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectallSearch-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Select Search', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    component.searchOptions = [
      { name: 'Ship Name', value: 'Ship_name' },
      { name: 'MMSI', value: 'MMSI' },
      { name: 'IMO', value: 'IMO' },
      { name: 'Country Of Origin', value: 'COO' },
      { name: 'End Port', value: 'End_port' }
    ];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectSearch-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Search input focus ', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('focus'));
  });

  it('search input on key enter', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-input')).nativeElement;
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
  });

  it('Select Option In Search Result', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    component.searchresult = [{type: 'Ship_name', value: 'A'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.selectOptionInSearchResult'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Vesssel Filter Submit', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.VF-submit-btn'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Get all Presets', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.getAllPresets'));
    buttonElement.triggerEventHandler('click', null);
  });

  // it('open Add Preset Input', () => {
  //   component.featureSelectedVF = 'true';
  //   component.featureSelectedVFSidenav = true;
  //   component.editPresetFlag = false;
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.openAddPresetInput'));
  //   buttonElement.triggerEventHandler('click', null);
  // });

  it('Change Preset Selection', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    component.allPreset = [{pid: 38, pname: 'one'}];
    component.presetExpanded = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.changePresetSelection-radio')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Edit Preset', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    component.allPreset = [{pid: 38, pname: 'one'}];
    component.presetExpanded = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.edit-Preset'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Select all Edit search ', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.searchOptions = [
      { name: 'Ship Name', value: 'Ship_name' },
      { name: 'MMSI', value: 'MMSI' },
      { name: 'IMO', value: 'IMO' },
      { name: 'Country Of Origin', value: 'COO' },
      { name: 'End Port', value: 'End_port' }
    ];
    component.editPresetFlag = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectallEditSearch-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Select Edit Search', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    component.searchOptions = [
      { name: 'Ship Name', value: 'Ship_name' },
      { name: 'MMSI', value: 'MMSI' },
      { name: 'IMO', value: 'IMO' },
      { name: 'Country Of Origin', value: 'COO' },
      { name: 'End Port', value: 'End_port' }
    ];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectEditSearch-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });


  it('Select all Category in edit ', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    component.allCategory = [{color: 'yellow', vessel_category: 'Cargo'}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectAllCategory-checkbox-inedit')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Select Category in edit', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    component.allCategory = [{color: 'yellow', vessel_category: 'Cargo'}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.selectCategory-checkbox-inedit')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Search input focus in edit', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-input-inedit')).nativeElement;
    buttonElement.dispatchEvent(new Event('focus'));
  });

  it('search input on key enter in edit', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.search-input-inedit')).nativeElement;
    buttonElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
  });

  it('Select Option In Edit Search Result', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    component.searchresult = [{type: 'Ship_name', value: 'A'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.selectOptionInSearchResult-inedit'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Submit Edit Preset', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitEditPreset'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Cancel Edit Preset', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.cancel-Edit'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Delete Preset', () => {
    component.featureSelectedVF = 'true';
    component.featureSelectedVFSidenav = true;
    component.editPresetFlag = false;
    fixture.detectChanges();
    component.allPreset = [{pid: 38, pname: 'one'}];
    component.presetExpanded = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.delete-Preset'));
    buttonElement.triggerEventHandler('click', null);
  });

});
