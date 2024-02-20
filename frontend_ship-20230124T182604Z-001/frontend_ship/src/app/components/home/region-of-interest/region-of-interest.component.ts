import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import * as Highcharts from 'highcharts';
import { FunctionService } from '../../shared/functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-region-of-interest',
  templateUrl: './region-of-interest.component.html',
  styleUrls: ['./region-of-interest.component.scss']
})

export class RegionOfInterestComponent implements OnInit {

  constructor(private service: ServiceService,
              private cookieService: CookieService, private Dataservice: DataService,
              private functionservice: FunctionService, private router: Router) { }

  featureSelectedROI = 'false';
  featureSelectedROISidenav = false;
  roisub: Subscription;
  userId: string;
  loginStatus: string;
  // slider
  minValue: number;
  maxValue: number;
  yearslideroptions: any;
  allCategory: Array<object>;
  usersroi: Array<object>;
  selectedregionid = [];
  selectedregion = [];
  roiselectedmmsi = [];
  roiData = [];
  // shiptypes
  selectedtimelinecriteria = [];
  // stats info
  statinfo = [];
  statinfolength: number;
  roitimeline = [];
  UpdateroiSub: Subscription;

  deletingregionname = '';

  regionmmsiList = [];
  roishiptypedeviation = [];
  roianchoragedeviation = [];

  @Output() markareaEvent = new EventEmitter();
  @Output() markregionEvent = new EventEmitter();
  @Output() removemarkedregionEvent = new EventEmitter();
  @Output() ROISelectedEvent = new EventEmitter();
  @Output() EditROIEvent = new EventEmitter();
  @Output() DeleteROIEvent = new EventEmitter();
  @Output() RoITrajectoryEvent = new EventEmitter();
  @Output() RemoveRoITrajectoryEvent = new EventEmitter();
  @Output() UpdateROIShipstoView = new EventEmitter(); // amal

  ngOnInit(): void {
    this.userId = this.cookieService.get('userid');
    this.roisub = this.Dataservice.ROI.subscribe(message => {
      if (message === 'true') {
        this.ROISelectedEvent.emit('Restart Live Map');
        document.getElementById('Region of Interest').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted active-background');

        if (document.getElementById('Region of Interest_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Region of Interest_img').setAttribute('src', '../../../assets/features/selected_features_orange/Region-of-Interest.svg');
          } else {
            document.getElementById('Region of Interest_img').setAttribute('src', '../../../assets/features/selected_features_white/Region-of-Interest.svg');
          }
        }
        if (document.getElementById('Region of Interest_name') !== null) {
          document.getElementById('Region of Interest_name').setAttribute('class', 'active_text');
        }
        if (this.featureSelectedROI === 'true') {
          this.featureSelectedROISidenav = !this.featureSelectedROISidenav;
        } else {
          this.featureSelectedROISidenav = true;
        }
        this.featureSelectedROI = 'true';
        this.getYearSliderValues();
        this.getAllCategory();
        this.getRegionOfInterest();
        this.UpdateroiSub = this.Dataservice.updateroi.subscribe(msg => {
          if (msg === 'update roi details') {
            this.getRegionOfInterest();
            const index = this.selectedregionid.indexOf(this.deletingregionname);
            if (index > -1) {
              this.selectedregionid.splice(index, 1);

              // remove ships in that region
              this.roiData.forEach((region, i) => {
                if (region.region === this.deletingregionname) {
                  region.details.forEach(mmsi => {
                    this.roiselectedmmsi.forEach((selectedmmsi, shipindex) => {
                      if (mmsi.msi === selectedmmsi.msi) {
                        this.roiselectedmmsi.splice(shipindex, 1);
                      }
                    });
                  });
                  this.roiData.splice(i, 1);
                  this.ROISelectedEvent.emit(this.roiselectedmmsi);
                }
              });

              // remove timeline info
              this.roitimeline.forEach((region, r) => {
                if (this.deletingregionname === region.region_id) {
                  this.roitimeline.splice(r, 1);
                }
              });

              // remove statistical info
              this.statinfo.forEach((region, r) => {
                if (this.deletingregionname === region.region_id) {
                  this.statinfo.splice(r, 1);
                }
              });
              this.statinfolength = this.statinfo.length;

              // remove mmsi from the list
              this.regionmmsiList.forEach((r, j) => {
                if (r.regionid === this.deletingregionname) {
                  this.regionmmsiList.splice(j, 1);
                }
              });
            }
          }
        });
      } else if (message === 'false') {
        this.Dataservice.changeNavbarInROI(false);
        this.featureSelectedROI = 'false';
        this.featureSelectedROISidenav = false;
        document.getElementById('Region of Interest').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted');
        if (document.getElementById('Region of Interest_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Region of Interest_img').setAttribute('src', '../../../assets/features/blue_features/Region-of-Interest.svg');
          } else {
            document.getElementById('Region of Interest_img').setAttribute('src', '../../../assets/features/Region-of-Interest.svg');
          }
        }
        if (document.getElementById('Region of Interest_name') !== null) {
          document.getElementById('Region of Interest_name').setAttribute('class', '');
        }
        this.selectedregionid.forEach(ele => {
          this.removemarkedregionEvent.emit(ele);
          this.RemoveRoITrajectoryEvent.emit(ele);
        });
        this.selectedregionid = [];
        this.selectedregion = [];
        this.roiselectedmmsi = [];
        this.statinfo = [];
        this.statinfolength = 0;
        this.roitimeline = [];
        this.selectedtimelinecriteria = [];
        this.markareaEvent.emit('no');
      }
    });
  }

  /* Get RoI details for user
  Method type: Get.
  Request Parameters: userid
  Expected response: List of RoI for that user.
  Process: Success- RoI details which comes has response is stored in variable(usersroi).
           Failure or error- Error message is displayed on the top. */
  getRegionOfInterest(): void {
    this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get All region of interestfor the user in region of interest';
    this.functionservice.functionCallLogging(functionName);
    this.service.getRoIDetailsForUser(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.setROIwaitState(false);
        this.usersroi = result.data.RoI;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setROIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Edit region of interest name
  editRoI(roi): void {
    this.EditROIEvent.emit(roi);
  }

  // Delete region of interest
  deleteRoI(roi): void {
    this.DeleteROIEvent.emit(roi);
    this.deletingregionname = roi.Region_ID;
  }

  // Get year slider value from storage
  getYearSliderValues(): void {
    this.minValue = Number(this.cookieService.get('sliderFromYear'));
    this.maxValue = Number(this.cookieService.get('sliderToYear'));
    this.yearslideroptions = {
      floor: Number(this.cookieService.get('sliderMinYear')),
      ceil: Number(this.cookieService.get('sliderMaxYear')),
      step: 1,
      // showTicks: true
    };
  }

  /* Get all categories
  Method type: Get.
  Request Parameters: userid
  Expected response: List of ship type categories.
  Process: Success- Details which comes has response is stored in variable(allCategory).
           Failure or error- Error message is displayed on the top. */
  getAllCategory(): void {
    this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get all categories in region of interest';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllCategories(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.setROIwaitState(false);
        this.allCategory = result.data;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setROIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Add interaction to mark area on map
  addInteraction(): void {
    this.markareaEvent.emit('yes');
    document.getElementById('markarea-color').setAttribute('class', 'btn markarea selected-markarea-button');
  }

  /* Get ship details for selected region
  Method type: Post.
  Request Parameters: from_year, to_year, category, region_if, userid
  Expected response: List of ships details for that region.
  Process: Success- Details which comes has response is stored in variable(roiData).
           Failure or error- Error message is displayed on the top. */
  getShipsForSelectedRegion(e, val): void {
    const startDate = new Date();
    const functionName = 'Get ships for selected region in region of interest';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      this.selectedregion[val.Region_ID] = true;
      let c = val.coord.replace('POLYGON((', '');
      c = c.replaceAll(')', '');
      const coordArray = [];
      c.split(',').forEach(a => {
        a = a.split(' ');
        coordArray.push([parseFloat(a[0]), parseFloat(a[1])]);
      });
      this.selectedregionid.push(val.Region_ID);
      this.markregionEvent.emit({ regionid: val.Region_ID, points: [coordArray] });
      this.ROISelectedEvent.emit('Stop Live Map');
      // this.getStatInfo();

      if (this.selectedregionid.length === 1) {
        this.ROISelectedEvent.emit('Show time alert');
      }
      const regiondata = {
        from_year: this.minValue.toString(),
        to_year: this.maxValue.toString(),
        category: this.selectedtimelinecriteria,
        region_id: [val.Region_ID],
        userid: this.userId
      };
      this.setROIwaitState(true);
      this.service.getShipDetailsBasedOnRoI(regiondata).subscribe((result) => {
        if (result.status === 'success') {
          this.roiData.push(result.data[0]);
          result.data[0].details.forEach(ship => {
            this.roiselectedmmsi.push(ship);
          });
          this.setROIwaitState(false);
          // this.getAllTraj(result.data[0].mmsi, val.Region_ID);
          this.regionmmsiList.push({ regionid: val.Region_ID, mmsi: result.data[0].mmsi });
          // get anomaly info
          this.getAnomalyInfo(result.data[0].mmsi, val.Region_ID);
          this.ROISelectedEvent.emit(this.roiselectedmmsi);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
        error => {
          this.setROIwaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        });
      // get stats info
      this.service.getStatInfo(regiondata).subscribe((result) => {
        if (result.status === 'success') {
          result.data[0].src = '../../../assets/soi/switch-offf.svg';
          result.data[0].value = 'false';
          this.statinfo.push(result.data[0]);
          this.statinfolength = this.statinfo.length;

          this.roitimeline.push(result.timeline[0]);
          this.drawHighCharts();

          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
        error => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        });
    }
    else {
      this.selectedregion[val.Region_ID] = false;
      const index = this.selectedregionid.indexOf(val.Region_ID);
      if (index > -1) {
        this.selectedregionid.splice(index, 1);
      }
      this.removemarkedregionEvent.emit(val.Region_ID);

      this.RemoveRoITrajectoryEvent.emit(val.Region_ID);

      this.statinfo.forEach((region, i) => {
        if (region.region_id === val.Region_ID) {
          this.statinfo.splice(i, 1);
        }
      });
      this.regionmmsiList.forEach((r, j) => {
        if (r.regionid === val.Region_ID) {
          this.regionmmsiList.splice(j, 1);
        }
      });
      this.statinfolength = this.statinfo.length;
      this.roitimeline.forEach((region, i) => {
        if (region.region_id === val.Region_ID) {
          this.roitimeline.splice(i, 1);
        }
      });

      this.roiData.forEach((region, i) => {
        if (region.region === val.Region_ID) {
          region.details.forEach(mmsi => {
            this.roiselectedmmsi.forEach((selectedmmsi, shipindex) => {
              if (mmsi.msi === selectedmmsi.msi) {
                this.roiselectedmmsi.splice(shipindex, 1);
              }
            });
          });
          this.roiData.splice(i, 1);
          this.ROISelectedEvent.emit(this.roiselectedmmsi);
        }
      });

      if (this.selectedregionid.length === 0) {
        this.ROISelectedEvent.emit('Restart Live Map');
      }
    }

  }

  // Changing timeline criteria (selecting ship category)
  ChangeTimelineCriteria(name): void {
    if (document.getElementById(name).getAttribute('class') === 'btn timelineinfo_category') {
      this.selectedtimelinecriteria.push(name);
      document.getElementById(name).setAttribute('class', 'btn timelineinfo_category_active');
      document.getElementById(name + '_img').setAttribute('class', 'activeshipImg');
    } else {
      document.getElementById(name).setAttribute('class', 'btn timelineinfo_category');
      document.getElementById(name + '_img').setAttribute('class', 'defaultshipImg');
      const index = this.selectedtimelinecriteria.indexOf(name);
      if (index > -1) {
        this.selectedtimelinecriteria.splice(index, 1);
      }
    }
    this.getRoIShipsInfo();
    this.getStatInfo();
  }

  // select year range
  sliderChanged(min, max): void {
    this.minValue = min;
    this.maxValue = max;
    this.getRoIShipsInfo();
    this.getStatInfo();
  }

  /* Get ships details for selected region
  Method type: Post.
  Request Parameters: from_year, to_year, category, region_id, userid
  Expected response: ship details for that region.
  Process: Success- Details which comes has response is stored in variable(roiDate).
           Failure or error- Error message is displayed on the top. */
  getRoIShipsInfo(): void {
    this.selectedregionid.forEach(r => {
      this.RemoveRoITrajectoryEvent.emit(r);
    });
    this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get ships details in selected region in region of interest';
    this.functionservice.functionCallLogging(functionName);

    this.roiData = [];
    const regiondata = {
      from_year: this.minValue.toString(),
      to_year: this.maxValue.toString(),
      category: this.selectedtimelinecriteria,
      region_id: this.selectedregionid,
      userid: this.userId
    };
    this.service.getShipDetailsBasedOnRoI(regiondata).subscribe((result) => {
      this.roiselectedmmsi = [];
      if (result.status === 'success') {
        this.setROIwaitState(false);
        this.roiData = result.data;

        result.data.forEach(region => {
          const regionMMSI = [];
          region.details.forEach(mmsi => {
            this.roiselectedmmsi.push(mmsi);
            regionMMSI.push(mmsi.msi);
          });
          // this.getAllTraj(regionMMSI, region.region);
          this.regionmmsiList.forEach((r, j) => {
            if (r.regionid === region.region) {
              this.regionmmsiList.splice(j, 1);
            }
          });
          this.regionmmsiList.push({ regionid: region.region, mmsi: regionMMSI });
          this.getAnomalyInfo(regionMMSI, region.region);
        });
        this.ROISelectedEvent.emit(this.roiselectedmmsi);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setROIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }


  /* Get Statistcal info for selected region
  Method type: Post.
  Request Parameters: from_year, to_year, category, region_id, userid
  Expected response: Statistcal details for that region.
  Process: Success- Details which comes has response is stored in variable(statinfo).
           Failure or error- Error message is displayed on the top. */
  getStatInfo(): void {
    this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get Statistical info for selected region in region of interest';
    this.functionservice.functionCallLogging(functionName);
    const requestdata = {
      from_year: this.minValue.toString(),
      to_year: this.maxValue.toString(),
      category: this.selectedtimelinecriteria,
      region_id: this.selectedregionid,
      userid: this.userId
    };
    this.service.getStatInfo(requestdata).subscribe((result) => {
      if (result.status === 'success') {
        this.setROIwaitState(false);
        this.statinfo = result.data;
        this.statinfo.forEach(grp => {
          grp.src = '../../../assets/soi/switch-offf.svg';
          grp.value = 'false';
        });
        this.statinfolength = this.statinfo.length;

        this.roitimeline = result.timeline;
        this.drawHighCharts();

        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setROIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }

  // Draw Graph
  drawHighCharts(): void {
    this.roitimeline.forEach(timelinedata => {
      Highcharts.chart(timelinedata.region_id + '_highcharts', {
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: 'Region: ' + timelinedata.region_id
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        series: timelinedata.details
      });
    });
  }

  showRoITrajectory(rid): void {
    if (document.getElementById(rid + '_traj').getAttribute('value') === 'true') {
      document.getElementById(rid + '_traj').setAttribute('value', 'false');
      document.getElementById(rid + '_traj').setAttribute('src', '../../../assets/soi/switch-offf.svg');
      // Hide Traj
      this.RemoveRoITrajectoryEvent.emit(rid);
    } else {
      document.getElementById(rid + '_traj').setAttribute('value', 'true');
      document.getElementById(rid + '_traj').setAttribute('src', '../../../assets/soi/switch-on.svg');
      // Show traj
      this.regionmmsiList.forEach( r => {
        if ( r.regionid === rid) {
          this.getAllTraj(r.mmsi, rid);
        }
      });
    }
  }


  /* Get trajectory for selected region
  Method type: Post.
  Request Parameters: from_year, to_year, mmsi_list, region_id, userid
  Expected response: Trajectory deatils for that region.
  Process: Success- Details which comes has response is sent to live map.
           Failure or error- Error message is displayed on the top. */
  getAllTraj(mmsi, regionid): void {
    this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get all trajectory in selected region in region of interest';
    this.functionservice.functionCallLogging(functionName);
    const regiondata = {
      from_year: this.minValue.toString(),
      to_year: this.maxValue.toString(),
      region_id: regionid,
      mmsi_list: mmsi,
      userid: this.userId
    };
    this.service.getTrajDetailsBasedOnRoI(regiondata).subscribe((result) => {
      if (result.status === 'success') {
        this.setROIwaitState(false);
        this.RoITrajectoryEvent.emit({ rid: regionid, traj: result.data.traj });

        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setROIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }

  /* Get anomaly info for selected region
  Method type: Post.
  Request Parameters: from_year, to_year, mmsi_list, region_id, userid
  Expected response: Trajectory deatils for that region.
  Process: Success- Details which comes has response is sent to live map.
           Failure or error- Error message is displayed on the top. */
  getAnomalyInfo(mmsi, rid): void {
    // this.setROIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get anomaly info for selected region in region of interest';
    this.functionservice.functionCallLogging(functionName);
    const regiondata = {
      from_year: this.minValue.toString(),
      to_year: this.maxValue.toString(),
      region_id: rid,
      mmsi_list: mmsi
    };
    this.service.getAnomalyInfoInRoI(regiondata).subscribe((result) => {
      if (result.status === 'success') {
        this.setROIwaitState(false);
        // console.log(result);
        this.roishiptypedeviation.push({ region_id: result.region_id, type_anomaly: result.type_anomaly,
                                         type_anomaly_length: result.type_anomaly.length });

        this.roianchoragedeviation.push({ region_id: result.region_id, anch_anomaly: result.anch_anomaly,
          anch_anomaly_length: result.anch_anomaly.length });
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
    error => {
      this.setROIwaitState(false);
      const endDate = new Date();
      const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
      this.functionservice.PostErrorCond(error, functionName, seconds);
    });
  }

  playHistory(mmsi, data): void {
    this.cookieService.set('playhistorymmsi', mmsi);
    this.cookieService.set('playhistorystartTime', data[data.length - 1].ATD_act);
    this.cookieService.set('playhistoryendTime', data[0].ETA_act);
    this.router.navigateByUrl('/Play-History');
  }

  setROIwaitState(data): void {
    if (data === true) {
      if (document.getElementById('roi-top-pannel') !== null) {
        document.getElementById('roi-top-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('roi-bottom-pannel') !== null) {
        document.getElementById('roi-bottom-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('roi-Overall') !== null) {
        document.getElementById('roi-Overall').setAttribute('style', 'cursor: wait;');
      }
    }
    if (data === false) {
      if (document.getElementById('roi-top-pannel') !== null) {
        document.getElementById('roi-top-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('roi-bottom-pannel') !== null) {
        document.getElementById('roi-bottom-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('roi-Overall') !== null) {
        document.getElementById('roi-Overall').setAttribute('style', 'cursor: default;');
      }
    }
  }
}
