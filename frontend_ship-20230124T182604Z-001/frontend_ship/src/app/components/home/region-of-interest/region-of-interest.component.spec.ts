import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionOfInterestComponent } from './region-of-interest.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RegionOfInterestComponent', () => {
  let component: RegionOfInterestComponent;
  let fixture: ComponentFixture<RegionOfInterestComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ RegionOfInterestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Edit ROI', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.usersroi = [{ Region_ID: 't1', bottom_left_coord: [56.0712890625, 13.759765625],
                            bottom_right_coord: [58.927734375, 13.759765625], top_left_coord: [56.0712890625, 16.8798828125],
                            top_right_coord: [58.927734375, 16.8798828125] }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.editRoI'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Delete ROI', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.usersroi = [{ Region_ID: 't1', bottom_left_coord: [56.0712890625, 13.759765625],
                            bottom_right_coord: [58.927734375, 13.759765625], top_left_coord: [56.0712890625, 16.8798828125],
                            top_right_coord: [58.927734375, 16.8798828125] }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteRoI'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Add Interaction', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.markarea'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('get Ships For Selected Region', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.usersroi = [{ Region_ID: 't1', bottom_left_coord: [56.0712890625, 13.759765625],
                            bottom_right_coord: [58.927734375, 13.759765625], top_left_coord: [56.0712890625, 16.8798828125],
                            top_right_coord: [58.927734375, 16.8798828125] }];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.getShipsForSelectedRegion-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Change Timeline Criteria (select shiptype)', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.allCategory = [ {color: 'yellow', vessel_category: 'Cargo'}, {color: 'orange', vessel_category: 'Diving'},
                              {color: 'silver', vessel_category: 'Dredging'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.timelineinfo_category'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('slider move', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.slider')).nativeElement;
    buttonElement.dispatchEvent(new Event('mouseup'));
  });

  it('Hide Trajectory ', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.statinfo = [{details: [], region_id: 't1', src: '../../../assets/soi/switch-offf.svg', value: 'false'}];
    fixture.detectChanges();
    document.getElementById('t1' + '_traj').setAttribute('value', 'true');
    const buttonElement = fixture.debugElement.query(By.css('.showRoITrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Show Trajectory ', () => {
    component.featureSelectedROI = 'true';
    component.featureSelectedROISidenav = true;
    component.statinfo = [{details: [], region_id: 't1', src: '../../../assets/soi/switch-on.svg', value: 'false'}];
    component.showRoITrajectoryData = [{rid: 't1', traj: []}];
    fixture.detectChanges();
    document.getElementById('t1' + '_traj').setAttribute('value', 'false');
    const buttonElement = fixture.debugElement.query(By.css('.showRoITrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

});
