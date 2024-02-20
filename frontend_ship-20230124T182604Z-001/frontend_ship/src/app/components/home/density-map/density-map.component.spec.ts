import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DensityMapComponent } from './density-map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('DensityMapComponent', () => {
  let component: DensityMapComponent;
  let fixture: ComponentFixture<DensityMapComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ DensityMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DensityMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // it('should show top 10', () => {
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.showtop'));
  //   buttonElement.triggerEventHandler('click', null);
  // });

  // it('onclick should show density and ships', () => {
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.density-ships'));
  //   buttonElement.triggerEventHandler('click', null);
  // });

  it('should call getAllShipCategories() on init method', () => {
    component.Dataservice.changedtoDM('true');
    component.featureSelectedDM = 'true';
    component.featureSelectedDMSidenav = true;
    spyOn(component, 'getAllShipCategories').and.callThrough();
    component.ngOnInit();
    expect(component.getAllShipCategories).toHaveBeenCalled();
  });

  // it('onclick checkbox should select all category', () => {
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.checkbox-selectAll'));
  //   buttonElement.triggerEventHandler('click', null);
  // });
});
