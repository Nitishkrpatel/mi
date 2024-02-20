import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipOfInterstComponent } from './ship-of-interst.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ShipOfInterstComponent', () => {
  let component: ShipOfInterstComponent;
  let fixture: ComponentFixture<ShipOfInterstComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
                  {provide: Router, useValue: router}],
      declarations: [ ShipOfInterstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipOfInterstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Delete SoI', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.getSOI = [{flag: 0, mmsi: '201601682', name: 'UNAVAILABLE'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteSoI'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('get Ships For Selected SoI', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.getSOI = [{flag: 0, mmsi: '201601682', name: 'UNAVAILABLE'}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.getDetailsForSelectedShipInSoi-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Show All Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.trackdetails = [{Journeys_completed: 1, MMSI: '257277000',
      traj_details: [{AIS_transmission: 9063, ATD: '01-04-2018, 06:11 AM', ATD_act: '2018-04-01 06:11:50', Days_on_sea: 9, Distance: '74.66 Kilometers',
      ETA: '09-04-2018, 07:54 PM', ETA_act: '2018-04-09 19:54:05', Port_From: 'NA', Port_To: 'NA', index: 1, src: '../../../assets/soi/switch-offf.svg',
      src_points: '../../../assets/soi/switch-offf.svg', traj_id: 7527, value: 'false', value_points: 'false'}],
      Ship_name: 'BONAS', detailslength: 1}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showAllTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Hide All Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.trackdetails = [{Journeys_completed: 1, MMSI: '257277000',
      traj_details: [{AIS_transmission: 9063, ATD: '01-04-2018, 06:11 AM', ATD_act: '2018-04-01 06:11:50', Days_on_sea: 9, Distance: '74.66 Kilometers',
      ETA: '09-04-2018, 07:54 PM', ETA_act: '2018-04-09 19:54:05', Port_From: 'NA', Port_To: 'NA', index: 1, src: '../../../assets/soi/switch-offf.svg',
      src_points: '../../../assets/soi/switch-offf.svg', traj_id: 7527, value: 'false', value_points: 'false'}],
      Ship_name: 'BONAS', detailslength: 1}];
    fixture.detectChanges();
    document.getElementById('alltrajectory').setAttribute('value', 'true');
    const buttonElement = fixture.debugElement.query(By.css('.showAllTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Show SoI Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.trackdetails = [{Journeys_completed: 1, MMSI: '257277000',
      traj_details: [{AIS_transmission: 9063, ATD: '01-04-2018, 06:11 AM', ATD_act: '2018-04-01 06:11:50', Days_on_sea: 9, Distance: '74.66 Kilometers',
      ETA: '09-04-2018, 07:54 PM', ETA_act: '2018-04-09 19:54:05', Port_From: 'NA', Port_To: 'NA', index: 1, src: '../../../assets/soi/switch-offf.svg',
      src_points: '../../../assets/soi/switch-offf.svg', traj_id: 7527, value: 'false', value_points: 'false'}],
      Ship_name: 'BONAS', detailslength: 1}];
      // document.getElementById('257277000' + '_' + '7527' + '_points').setAttribute('value', 'true')
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showSoiTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  // showPointsForTrackTraj

  it('Hide SoI Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.trackdetails = [{Journeys_completed: 1, MMSI: '257277000',
      traj_details: [{AIS_transmission: 9063, ATD: '01-04-2018, 06:11 AM', ATD_act: '2018-04-01 06:11:50', Days_on_sea: 9, Distance: '74.66 Kilometers',
      ETA: '09-04-2018, 07:54 PM', ETA_act: '2018-04-09 19:54:05', Port_From: 'NA', Port_To: 'NA', index: 1, src: '../../../assets/soi/switch-offf.svg',
      src_points: '../../../assets/soi/switch-offf.svg', traj_id: 7527, value: 'false', value_points: 'false'}],
      Ship_name: 'BONAS', detailslength: 1}];
    fixture.detectChanges();
    component.showtracjectorymmsi = ['257277000'];
    component.showtracjectorytrajid = [7527];
    document.getElementById('257277000_7527').setAttribute('src', '../../../assets/soi/switch-on.svg');
    document.getElementById('257277000_7527').setAttribute('value', 'true');
    const buttonElement = fixture.debugElement.query(By.css('.showSoiTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Edit GoI', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.goi = [{Group_ID: 'test', group_details: [{mmsi: 538006304, name: 'VICTORIA'}]}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.editGoI'));
    buttonElement.triggerEventHandler('click', null);
  });


  it('Delete GoI', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.goi = [{Group_ID: 'test', group_details: [{mmsi: 538006304, name: 'VICTORIA'}]}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteGoI'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Delete MMSI from GoI', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.goi = [{Group_ID: 'test', group_details: [{mmsi: 538006304, name: 'VICTORIA'}]}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteMMSIFromGroup'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('get Details For selected Group', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.goi = [{Group_ID: 'test', group_details: [{mmsi: 538006304, name: 'VICTORIA'}]}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.getDetailsForselectedGroup-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('get Details for Selected Ship InGroup', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.goi = [{Group_ID: 'test', group_details: [{mmsi: 538006304, name: 'VICTORIA'}]}];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.getDetailsforSelectedShipInGroup-checkbox')).nativeElement;
    select.dispatchEvent(new Event('change'));
  });

  it('Show GoI Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.goitrackdetails = [{group_name: 'test',
    traj_data: [{Journeys_completed: 1, MMSI: 538006304, Ship_name: 'VICTORIA', detailslength: 1, display: true,
                traj_details: [{AIS_transmission: 3287, ATD: '10-04-2018,10:24 PM', ATD_act: '2018-04-10 22:24:45',
                Days_on_sea: 21, Distance: '83.96 Kilometers', ETA_act: '2018-05-01 05:25:49', Port_From: 'As Suways (Suez)',
                Port_To: 'Fuyong', index: 1, src: '../../../assets/soi/switch-offf.svg', traj_id: 146520, value: 'false'}]
              }]
    }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showgoiTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Hide GoI Trajectory', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.goitrackdetails = [{group_name: 'test',
    traj_data: [{Journeys_completed: 1, MMSI: 538006304, Ship_name: 'VICTORIA', detailslength: 1, display: true,
                traj_details: [{AIS_transmission: 3287, ATD: '10-04-2018,10:24 PM', ATD_act: '2018-04-10 22:24:45',
                Days_on_sea: 21, Distance: '83.96 Kilometers', ETA_act: '2018-05-01 05:25:49', Port_From: 'As Suways (Suez)',
                Port_To: 'Fuyong', index: 1, src: '../../../assets/soi/switch-offf.svg', traj_id: 146520, value: 'false'}]
              }]
    }];
    fixture.detectChanges();
    document.getElementById('test_538006304_146520').setAttribute('src', '../../../assets/soi/switch-on.svg');
    document.getElementById('test_538006304_146520').setAttribute('value', 'true');
    component.showgrptracjectorymmsi = [538006304];
    component.showgrptracjectorytrajid = [146520];
    component.showgrptrajectorygid = ['test'];
    const buttonElement = fixture.debugElement.query(By.css('.showgoiTrajectory'));
    buttonElement.triggerEventHandler('click', null);
  });

  // it('Reload Soi and GoI', () => {
  //   component.featureSelectedSOI = 'true';
  //   component.featureSelectedSOISidenav = true;
  //   component.trackdetailslength = 1;
  //   component.soiselectedmmsi.length = 2
  //   component.goiselected.length = 2;
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.reloadSoiAndGoiTrackInfo'));
  //   buttonElement.triggerEventHandler('click', null);
  // });

  it('move to play history', () => {
    component.featureSelectedSOI = 'true';
    component.featureSelectedSOISidenav = true;
    component.trackdetailslength = 1;
    component.trackdetails = [{Journeys_completed: 1, MMSI: '257277000',
      traj_details: [{AIS_transmission: 9063, ATD: '01-04-2018, 06:11 AM', ATD_act: '2018-04-01 06:11:50', Days_on_sea: 9, Distance: '74.66 Kilometers',
      ETA: '09-04-2018, 07:54 PM', ETA_act: '2018-04-09 19:54:05', Port_From: 'NA', Port_To: 'NA', index: 1, src: '../../../assets/soi/switch-offf.svg',
      src_points: '../../../assets/soi/switch-offf.svg', traj_id: 7527, value: 'false', value_points: 'false'}],
      Ship_name: 'BONAS', detailslength: 1}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.playHistory-button'));
    buttonElement.triggerEventHandler('click', null);
  });
});
