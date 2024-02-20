import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as Highcharts from 'highcharts';
import { ServiceService } from '../shared/service.service';
import { FunctionService } from '../shared/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import Map from 'ol/Map';
import { defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol/index';
import { Style, Icon } from 'ol/style';
import { MultiLineString } from 'ol/geom';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';

export interface ShipType {
  mmsi: number;
  trajid: number;
  cat: string;
  predictiontype0: string;
  predictionscore0: number;
  predictiontype1: string;
  predictiontype2: string;
  predictionscore1: number;
  predictionscore2: number;
}

export interface Destination {
  st: string;
  msi: number;
  trajid: number;
  dd: string;
  predictedDestination: string;
  ad: string;
  portname: string;
  tm: string;
}

export interface Anchorage {
  msi: number;
  trajid: number;
  tm: string;
  ap: string;
  nap: string;
  dis: number;
  occupancy: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  constructor(private service: ServiceService, private cookieService: CookieService,
              private toastr: ToastrService, private functionservice: FunctionService) { }

  loginStatus: string;
  userId: string;
  localtime: any;
  roleFeatures: any;
  roleSoiStatus = false;

  // ships
  totalShips: string;
  allshipspiechartData = [];

  // neighbouring

  neighbouringShipsDetails = [];
  neighbouringShips: string;
  allNeighbouringCountries = [];
  totalNeighbouringCountries: number;
  neighbhouringshipspiechartData = [];
  selectedNeighbhouringCountry = [];
  countries = [];


  // Incursion to indian waters
  incurstionToIndianWatersRange: string;
  // Ship type deviation
  shiptypeDeviationData: ShipType[];
  shiptypeDeviationsortedData: ShipType[];
  shiptypeDeviationGraphData = [];
  totalShiptypeDeviation: number;
  shipTypeDeviationThreshold: number;
  showTopValue: number;
  shiptypecurrentPage = 1;
  showtopOptions = [];
  itemsPerPage: number;
  labelCount: number;
  dataUrl = [];
  predictionOptions = [];
  selectedshipDeviaitionExplain = '';

  // Destination Deviation
  totalDestinationDeviation: number;
  desinationDeviationData: Destination[];
  destinationDeviationsortedData: Destination[];
  destinationcurrentPage = 1;
  destinationDevationRange: string;

  // Anchorage deviation
  totalAnchorageDeviation: number;
  anchorageDeviationData: Anchorage[];
  anchorageDeviationsortedData: Anchorage[];
  anchoragecurrentPage = 1;
  anchorageDeviationRange: string;
  selectedAnchorageArray = [];
  selectedAnchorage = [];
  selectAllAnchorage = false;

  // Map in anchorage deviation
  dashboardMap: Map;
  maptype: string;

  setShowTopForm = new FormGroup({
    top: new FormControl()
  });

  incursionToIndianWatersTimeForm = new FormGroup({
    fromandtodate: new FormControl('')
  });

  destinationDeviationTimeForm = new FormGroup({
    fromandtodate: new FormControl('')
  });

  anchorageDeviationTimeForm = new FormGroup({
    fromandtodate: new FormControl('')
  });

  shiptypeSearchForm = new FormGroup({
    shiptype_search_text: new FormControl('')
  });

  destinationSearchForm = new FormGroup({
    destination_search_text: new FormControl('')
  });

  anchorageSearchForm = new FormGroup({
    anchorage_search_text: new FormControl('')
  });

  setPredImageForm = new FormGroup({
    predtype: new FormControl()
  });

  ngOnInit(): void {
    this.loginStatus = this.cookieService.get('loginStatus');
    this.userId = this.cookieService.get('userid');
    this.getAllInitiallyContants();
    this.service.setTitle('Dashboard');
    this.getFeatureForRole();
  }

  // get features assigned for the user
  getFeatureForRole(): void {
    const startDate = new Date();
    const functionName = 'Get features for role in play history';
    this.functionservice.functionCallLogging(functionName);
    this.service.getFeatureForRole(this.cookieService.get('roleid')).subscribe(result => {
      if (result.status === 'success') {
        this.roleFeatures = result.data;
        this.roleFeatures.features.forEach(feature => {
          if (feature.featurename === 'Ships of Interest') {
            this.roleSoiStatus = true;
          }
        });
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Get All constants required.
  getAllInitiallyContants(): void {
    this.showtopOptions = [ { name: 'All', value: -1 },
                            { name: '20', value: 20 },
                            { name: '50', value: 50 },
                            { name: '100', value: 100 },
                            { name: '500', value: 500 }];
    this.showTopValue = -1;
    this.setShowTopForm.setValue({ top: this.showTopValue });
    this.shipTypeDeviationThreshold = 35;
    this.itemsPerPage = 10;

    this.incurstionToIndianWatersRange = '01-04-2018 16:34:51 - 10-04-2018 16:34:51';
    this.incursionToIndianWatersTimeForm.setValue({ fromandtodate: ['2018-04-02 16:34:51', '2018-4-10 16:34:51'] });

    this.destinationDevationRange = '01-04-2018 16:34:51 - 10-04-2018 16:34:51';
    this.destinationDeviationTimeForm.setValue({ fromandtodate: ['2018-04-01 16:34:51', '2018-4-10 16:34:51'] });

    this.anchorageDeviationRange = '01-04-2018 16:34:51 - 10-04-2018 16:34:51';
    this.anchorageDeviationTimeForm.setValue({ fromandtodate: ['2018-04-02 16:34:51', '2018-4-10 16:34:51'] });

    this.labelCount = 2;
  }

  // Calling all rest api to get data
  ngAfterViewInit(): void {
    this.localtime = this.cookieService.get('localtime');
    this.getTotalShips();
    this.getNeighbouringCountries();
    // this.getIncursionToIndianWaters();
    this.getShiptypeDeviation();
    this.getDestinationDeviation();
    this.getAnchorageDeviation();
    this.displayMap();
  }

  // Display map in anchorage anomaly
  displayMap(): void {
    this.maptype = this.cookieService.get('map');
    this.dashboardMap = new Map({
      controls: defaultControls({ zoom: false }).extend([new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        undefinedHTML: '&nbsp;'
      })]),
      target: 'map1',
      view: new View({
        center: [70, 20],
        zoom: 4,
        maxZoom: 15,
        projection: 'EPSG:4326'
      }),
    });
    const map = [{ mapname: 'Standard Map', layername: 'osm' }, { mapname: 'Satellite Map', layername: 'simple_dark' }, { mapname: 'Nautical Map', layername: 'ENC' }];
    map.forEach(maptype => {
      let visibility;
      if (maptype.mapname === this.maptype) {
        visibility = true;
      } else {
        visibility = false;
      }
      let workspace;
      if (maptype.layername === 'ENC') {
        workspace = 'ENC_Workspace';
      }
      else {
        workspace = 'osm';
      }
      this.dashboardMap.addLayer(
        new TileLayer({
          source: new TileWMS({
            url: this.service.mapURL + workspace + '/wms',
            // url: 'http://20.20.20.112:8090/geoserver/ENC_Workspace/wms',
            params: { LAYERS: maptype.layername, TILED: true },
            serverType: 'geoserver',
            transition: 0,
          }),
          name: maptype.mapname,
          visible: visibility
        })
      );
    });
  }

  /* Get total ships and its graph data
    Method type: Get.
    Request Parameters: userid, localtime
    Expected response: Total ship count and individual category count for graph
    Process: Success- Total ship count which comes as a response is stored in a
                      variable(totalShips) and data is sent for graph.
             Failure or error- Error message is displayed on the top. */
  getTotalShips(): void {
    const startDate = new Date();
    const functionName = 'Get Total number of ships in dashboard';
    this.functionservice.functionCallLogging(functionName);
    if (document.getElementById('shipsummary') !== null) {
      document.getElementById('shipsummary').setAttribute('style', 'cursor: wait;');
    }
    this.allshipspiechartData = [];
    this.service.getTotalVesselCount(this.userId, this.localtime).subscribe((result) => {
      if (result.status === 'success') {
        this.totalShips = result.count;
        result.data.forEach(type => {
          this.allshipspiechartData.push({ name: type.cat, data: [type.cnt], type: 'bar' });
        });
        // this.getNeighbouringCountries();
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
        document.getElementById('shipsummary').setAttribute('style', 'cursor: default;');
      });
  }

  /* Get all neighbouring countries for the user
  Method type: Get.
  Request Parameters: userid
  Expected response: Neighbouring coutries and its status for the user.
  Process: Success- Neighbouring coutries which comes as a response is stored in a
                    variable(allNeighbouringCountries).
            Failure or error- Error message is displayed on the top. */
  getNeighbouringCountries(): void {
    const startDate = new Date();
    const functionName = 'Get all neighbouring countries in dashboard';
    this.functionservice.functionCallLogging(functionName);
    this.service.getUserNeighbouringCountries(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        result.data.forEach(element => {
          if (element.flag === false) {
            element.class = 'countries notselected';
          } else {
            element.class = 'countries selected';
            this.selectedNeighbhouringCountry.push(element.code);
          }
        });
        this.allNeighbouringCountries = result.data;
        this.totalNeighbouringCountries = result.data.length;
        document.getElementById('shipsummary').setAttribute('style', 'cursor: default;');
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
      if (this.selectedNeighbhouringCountry.length >= 1) {
        this.getNeighbouringShipsCount();
      } else {
        this.neighbouringShips = '';
        this.neighbouringShipsDetails = [];
        this.getPieChart(this.allshipspiechartData, 'Ships');
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
        document.getElementById('shipsummary').setAttribute('style', 'cursor: default;');
      });
  }

  // on clicking neighbouring country get its details and change the graph
  getNeibhouringdetails(code, cname): void {
    let flag;
    if (document.getElementById(cname).getAttribute('class') === 'countries notselected') {
      document.getElementById(cname).setAttribute('class', 'countries selected');
      this.selectedNeighbhouringCountry.push(code);
      flag = 'true';
    } else {
      document.getElementById(cname).setAttribute('class', 'countries notselected');
      const index = this.selectedNeighbhouringCountry.indexOf(code);
      if (index > -1) {
        this.selectedNeighbhouringCountry.splice(index, 1);
      }
      flag = 'false';
    }
    this.changeCountryStatus(code, flag);
    if (this.selectedNeighbhouringCountry.length >= 1) {
      this.getNeighbouringShipsCount();
    } else {
      this.neighbouringShips = '';
      this.neighbouringShipsDetails = [];
      this.getPieChart(this.allshipspiechartData, 'Ships');
    }
  }

  /* Update country status to selected or not selected.
  Method type: Post.
  Request Parameters: userid, country, flag.
  Expected response: Success message.
  Process: Success-
           Failure or error- Error message is displayed on the top. */
  changeCountryStatus(countryName, statusFlag): void {
    const startDate = new Date();
    const functionName = 'Change country status to selected or not in dashboard';
    this.functionservice.functionCallLogging(functionName);
    const reqdata = { userid: this.userId, country: countryName, flag: statusFlag };
    this.service.updateCountryStatus(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  /* Get neibhouring countries total data and its graph details
  Method type: Post.
  Request Parameters: userid, timestamp, country
  Expected response: Selected neighbouring coutries total count and its individual count.
  Process: Success- Selected neighbouring coutries total count which comes as a response is stored in a
                    variable(neighbouringShips) and its individual count is stored in a variable(neighbouringShipsDetails).
            Failure or error- Error message is displayed on the top. */
  getNeighbouringShipsCount(): void {
    const startDate = new Date();
    const functionName = 'Get neighbouring countries count in dashboard';
    this.functionservice.functionCallLogging(functionName);
    this.neighbhouringshipspiechartData = [];
    const reqdata = {
      userid: this.userId, timestamp: this.localtime,
      country: this.selectedNeighbhouringCountry
    };
    document.getElementById('neighbouringCountries-overall').setAttribute('style', 'cursor:progress;pointer-events:none;');
    this.service.getNeighbouringshipsCount(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.neighbouringShips = data.total_count;
          this.neighbouringShipsDetails = data.ind_count;
          document.getElementById('neighbouringCountries-overall').setAttribute('style', 'cursor:default;');
          data.chart_data.forEach(type => {
            this.neighbhouringshipspiechartData.push({ name: type.ct, data: [type.cnt], type: 'bar' });
          });
          this.getPieChart(this.neighbhouringshipspiechartData, 'Neighbouring Ships');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        document.getElementById('neighbouringCountries-overall').setAttribute('style', 'cursor:default;');
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }


  // draw pie chart
  getPieChart(chartdata, title): void {
    if (chartdata.length >= 1) {
      document.getElementById('highcharts').setAttribute('class', 'col-sm-12 h-100');
      const neighboringCharts = Highcharts.chart('highcharts', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'bar',
          margin: [0, 0, 5, 5]
        },
        title: {
          text: title
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Vessel count'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          bar: {
            pointPadding: 0.25,
            pointWidth: 10,
            // showInLegend: false
          }
        },

        series: chartdata
      });
      neighboringCharts.reflow();
    } else {
      document.getElementById('highcharts').innerHTML = 'No Graph Data';
      document.getElementById('highcharts').setAttribute('class', 'col-sm-12 h-100 subtitle');
    }
  }

  // getIncursionToIndianWaters(): void {
  //   const reqdata = {
  //     userid: this.userId,
  //     from_date: this.incursionToIndianWatersTimeForm.value.fromandtodate[0],
  //     to_date: this.incursionToIndianWatersTimeForm.value.fromandtodate[1],
  //     // shiptype, coo
  //   };
  // }

  // // Setting date and time range in Incursion To IndianWaters
  // setIncursionToIndianWatersTime(): void {
  //   this.incursionToIndianWatersTimeForm.value.fromandtodate[0] =
  //  formatDate(this.incursionToIndianWatersTimeForm.value.fromandtodate[0], 'yyyy-MM-dd HH:mm:ss', 'en-US');
  // this.incursionToIndianWatersTimeForm.value.fromandtodate[1] =
  // formatDate(this.incursionToIndianWatersTimeForm.value.fromandtodate[1], 'yyyy-MM-dd HH:mm:ss', 'en-US');
  //   this.getIncursionToIndianWaters();
  // }

  // Changed ship type in Incursion To IndianWaters
  // changedShipTypeInIncursionToIndianWaters(): void {
  //   this.shipTypeInIncursionToIndianWater = this.setshipTypeInIncurstionForm.value.top;
  //   this.setshipTypeInIncurstionForm.setValue({ shiptype: this.shipTypeInIncurstion });
  //   this.getIncursionToIndianWaters();
  // }

  // // Changed coo in Incursion To IndianWaters
  // changedCOOInIncursionToIndianWaters(): void {
  //   this.cooInIncurstion = this.setCooInIncurstionForm.value.top;
  //   this.setCooInIncurstionForm.setValue({ coo: this.cooInIncurstion });
  //   this.getIncursionToIndianWaters();
  // }

  // Search in Incursion To IndianWaters.
  // getSearchResultForIncursionToIndianWaters(e): void {
  //   // const destinationDeviationData = this.desinationDeviationData.filter( obj => {
  //   //   const mmsi = obj.msi.toString();
  //   //   if (mmsi.indexOf(e) === 0) {
  //   //     return obj;
  //   //   }
  //   // });
  //   // this.destinationDeviationsortedData = destinationDeviationData.slice();
  //   // this.destinationcurrentPage = 1;
  // }

  /* Get Shiptype Deviation
  Method type: Post.
  Request Parameters: userid, threshold, top
  Expected response: Shiptype Deviation total count and data for individual category.
  Process: Success- Shiptype Deviation total count which comes has response is stored in variable(totalShiptypeDeviation)
                     and data for individual category is stored in variable(shiptypeDeviationGraphdata)
            Failure or error- Error message is displayed on the top. */
  getShiptypeDeviation(): void {
    const startDate = new Date();
    const functionName = 'Get Ship type deviation in dashboard';
    this.functionservice.functionCallLogging(functionName);
    if (document.getElementById('shiptypedeviation-event') !== null) {
      document.getElementById('shiptypedeviation-event').setAttribute('style', 'cursor:progress;pointer-events:none');
    }
    if (document.getElementById('shiptypedeviation') !== null) {
      document.getElementById('shiptypedeviation').setAttribute('style', 'cursor: wait;');
    }
    if (document.getElementById('top') !== null) {
      document.getElementById('top').setAttribute('disabled', 'true');
    }
    if (document.getElementById('shiptype_search') !== null) {
      document.getElementById('shiptype_search').setAttribute('disabled', 'true');
    }
    this.shiptypeDeviationGraphData = [];
    const reqdata = {
      userid: this.userId, threshold: this.shipTypeDeviationThreshold,
      top: this.showTopValue,
    };
    this.service.getShipTypeDeviation(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.totalShiptypeDeviation = data.count;
          data.cat_count.forEach(type => {
            this.shiptypeDeviationGraphData.push({ name: type.ct, data: [type.cnt], type: 'bar' });
          });
          this.drawshiptypeDeviationPieChart();
          data.data.forEach(mmsi => {
            mmsi.pred.forEach((pre, i) => {
              const type = 'predictiontype' + i;
              const score = 'predictionscore' + i;
              mmsi[type] = pre.type;
              mmsi[score] = pre.value + '%';
            });
          });
          this.shiptypeDeviationData = data.data;
          this.shiptypeDeviationsortedData = this.shiptypeDeviationData.slice();
          document.getElementById('shiptypedeviation-event').setAttribute('style', 'cursor:default;');
          document.getElementById('shiptypedeviation').setAttribute('style', 'cursor: default;');
          document.getElementById('top').removeAttribute('disabled');
          document.getElementById('shiptype_search').removeAttribute('disabled');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        document.getElementById('shiptypedeviation-event').setAttribute('style', 'cursor:default;');
        document.getElementById('shiptypedeviation').setAttribute('style', 'cursor: default;');
        document.getElementById('top').removeAttribute('disabled');
        document.getElementById('shiptype_search').removeAttribute('disabled');
      }
    );
  }

  /* Get Shiptype Deviation details
  Method type: Post.
  Request Parameters: userid, mmsi, label
  Expected response: Images URL.
  Process: Success- Images URL which comes has response is stored in variable(predictionOptions).
            Failure or error- Error message is displayed on the top. */
  getShipTypeDeviationDetails(e, reqMMSI, trajID): void {
    if (this.selectedshipDeviaitionExplain !== '') {
      if (document.getElementById(this.selectedshipDeviaitionExplain) !== null) {
        document.getElementById(this.selectedshipDeviaitionExplain).setAttribute('class', 'btn dashboard-btn');
      }
    }
    document.getElementById(reqMMSI).setAttribute('class', 'btn dashboard-btn active-btn');
    const startDate = new Date();
    const functionName = 'Get ahip type deviation deatils in dashboard';
    this.functionservice.functionCallLogging(functionName);
    e.target.setAttribute('style', 'cursor:wait');
    e.target.setAttribute('disabled', true);
    this.selectedshipDeviaitionExplain = reqMMSI;
    const reqdata = { userid: this.userId, mmsi: reqMMSI, label: this.labelCount, trajid: trajID };
    this.service.getShipTypeDeviationDetails(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.selectedshipDeviaitionExplain = reqMMSI;
          this.predictionOptions = data.url;
          this.setPredImageForm.setValue({ predtype: this.predictionOptions[0].url });
          this.dataUrl = this.setPredImageForm.value.predtype;
          document.getElementById('openExplainforShiptypeDeviaiton').click();
          let predictedclasstype;
          this.shiptypeDeviationData.forEach(ship => {
            if (ship.mmsi === reqMMSI) {
              const pred = 'pred';
              predictedclasstype = ship[pred];
            }
          });
          const jsondata = {
            mmsi: reqMMSI, prediction: predictedclasstype,
            features: data.features, featureValue: data.pred[0].details
          };
          const newdata = JSON.stringify(jsondata);
          this.cookieService.set('dataObj', newdata);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
        e.target.setAttribute('style', 'cursor:default');
        e.target.removeAttribute('disabled');
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        e.target.setAttribute('style', 'cursor:default');
        e.target.removeAttribute('disabled');
      }
    );
  }
  // amal
  setPredImage(): void {
    this.dataUrl = this.setPredImageForm.value.predtype;
  }
  // Draw BAR chart in ship type deviation
  drawshiptypeDeviationPieChart(): void {
    if (this.shiptypeDeviationGraphData.length >= 1) {
      Highcharts.chart('highcharts_shiptype_deviations', {
        chart: {
          plotShadow: false,
          type: 'bar',
          height: '775',
          margin: [0, 0, 5, 5]
        },
        title: {
          text: ''
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Vessel count'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          bar: {
            pointPadding: 0.25,
            pointWidth: 13
          }
        },
        series: this.shiptypeDeviationGraphData,
      });
    } else {
      document.getElementById('highcharts_shiptype_deviations').innerHTML = 'No Graph Data';
    }
  }

  // Slider moving in ship type deviation
  sliderMove(data): void {
    this.shipTypeDeviationThreshold = data.value;
  }

  // Slider changed in ship type deviation
  sliderChanged(data): void {
    this.shipTypeDeviationThreshold = data.value;
    this.getShiptypeDeviation();
  }

  // Changed show top value in ship type deviation
  changedShowTopValue(): void {
    this.showTopValue = this.setShowTopForm.value.top;
    this.setShowTopForm.setValue({ top: this.showTopValue });
    this.getShiptypeDeviation();
  }

  // Restrict to only number in mobile number
  onlyNumberKey(event): any {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  // Search in ship type deviation table
  getSearchResultForShiptypeDeviation(e): void {
    const shiptypeDeviationData = this.shiptypeDeviationData.filter(obj => {
      const mmsi = obj.mmsi.toString();
      if (mmsi.indexOf(e) === 0) {
        return obj;
      }
    });
    this.shiptypeDeviationsortedData = shiptypeDeviationData.slice();
    this.shiptypecurrentPage = 1;
  }

  /* Get Destination Deviation details
  Method type: Post.
  Request Parameters: userid, from_date, to_date
  Expected response: Total destination deviaiton count and individual deviation details.
  Process: Success- Total destination deviaiton count which comes has response is stored in variable(totalDestinationDeviation)
                    and individual deviation details is stored in variable(desinationDeviationData).
            Failure or error- Error message is displayed on the top. */
  getDestinationDeviation(): void {
    const startDate = new Date();
    const functionName = 'Get Destination deviation in dashboard';
    this.functionservice.functionCallLogging(functionName);
    if (document.getElementById('destinationdeviation-event') !== null) {
      document.getElementById('destinationdeviation-event').setAttribute('style', 'cursor:progress;pointer-events:none');
    }
    if (document.getElementById('destinationdeviation') !== null) {
      document.getElementById('destinationdeviation').setAttribute('style', 'cursor: wait;');
    }
    if (document.getElementById('destination_search') !== null) {
      document.getElementById('destination_search').setAttribute('disabled', 'true');
    }

    const reqdata = {
      userid: this.userId,
      from_date: this.destinationDeviationTimeForm.value.fromandtodate[0],
      to_date: this.destinationDeviationTimeForm.value.fromandtodate[1]
    };
    this.service.getDestinationDeviation(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.totalDestinationDeviation = data.ct;
          this.desinationDeviationData = data.data;
          this.desinationDeviationData.forEach(mmsi => {
            if (mmsi.st !== 'In Transit') {
              mmsi.tm = formatDate(mmsi.tm, 'dd-MM-yyyy, HH:mm:ss', 'en-US');
            } else {
              mmsi.tm = '-';
            }
          });
          this.destinationDeviationsortedData = this.desinationDeviationData.slice();
          document.getElementById('destinationdeviation').setAttribute('style', 'cursor: default;');
          document.getElementById('destinationdeviation-event').setAttribute('style', 'cursor:default;');
          document.getElementById('destination_search').removeAttribute('disabled');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        document.getElementById('destinationdeviation').setAttribute('style', 'cursor: default;');
        document.getElementById('destinationdeviation-event').setAttribute('style', 'cursor:default;');
        document.getElementById('destination_search').removeAttribute('disabled');
      }
    );
  }

  // Setting date and time range in destination deviation
  setDestinationDeviaitonTime(): void {
    this.destinationDeviationTimeForm.value.fromandtodate[0] = formatDate(this.destinationDeviationTimeForm.value.fromandtodate[0], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.destinationDeviationTimeForm.value.fromandtodate[1] = formatDate(this.destinationDeviationTimeForm.value.fromandtodate[1], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.getDestinationDeviation();
  }

  // Search in destination deviation.
  getSearchResultForDestinationDeviation(e): void {
    const destinationDeviationData = this.desinationDeviationData.filter(obj => {
      const mmsi = obj.msi.toString();
      if (mmsi.indexOf(e) === 0) {
        return obj;
      }
    });
    this.destinationDeviationsortedData = destinationDeviationData.slice();
    this.destinationcurrentPage = 1;
  }

  /* Get Anchorage Deviation details
  Method type: Post.
  Request Parameters: userid, from_date, to_date
  Expected response: Total Anchorage deviaiton count and individual deviation details.
  Process: Success- Total Anchorage deviation count which comes has response is stored in variable(totalAnchorageDeviation)
                    and individual deviation details is stored in variable(anchorageDeviationData).
            Failure or error- Error message is displayed on the top. */
  getAnchorageDeviation(): void {
    const startDate = new Date();
    const functionName = 'Get Anchorage deviation in dashboard';
    this.functionservice.functionCallLogging(functionName);
    if (document.getElementById('anchoragedeviation-event') !== null) {
      document.getElementById('anchoragedeviation-event').setAttribute('style', 'cursor:progress;pointer-events:none');
    }
    if (document.getElementById('anchoragedeviation') !== null) {
      document.getElementById('anchoragedeviation').setAttribute('style', 'cursor: wait;');
    }
    if (document.getElementById('anchoragedeviation-input-disabled') !== null) {
      document.getElementById('anchoragedeviation-input-disabled').setAttribute('disabled', 'true');
    }
    if (document.getElementById('anchorage_search') !== null) {
      document.getElementById('anchorage_search').setAttribute('disabled', 'true');
    }

    const reqdata = {
      userid: this.userId,
      from_date: this.anchorageDeviationTimeForm.value.fromandtodate[0],
      to_date: this.anchorageDeviationTimeForm.value.fromandtodate[1]
    };
    this.service.getAnchorageDeviation(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.totalAnchorageDeviation = data.ct;
          data.data.forEach(mmsi => {
            mmsi.ap = mmsi.aplt + ',' + mmsi.aplg;
            mmsi.nap = mmsi.aalt + ',' + mmsi.aalg;
            mmsi.tm = formatDate(mmsi.tm, 'dd-MM-yyyy, HH:mm:ss', 'en-US');
          });
          this.anchorageDeviationData = data.data;
          this.anchorageDeviationsortedData = this.anchorageDeviationData.slice();
          document.getElementById('anchoragedeviation').setAttribute('style', 'cursor: default;');
          document.getElementById('anchoragedeviation-event').setAttribute('style', 'cursor:default;');
          document.getElementById('anchoragedeviation-input-disabled').removeAttribute('disabled');
          document.getElementById('anchorage_search').removeAttribute('disabled');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        document.getElementById('anchoragedeviation').setAttribute('style', 'cursor: default;');
        document.getElementById('anchoragedeviation-event').setAttribute('style', 'cursor:default;');
        document.getElementById('anchoragedeviation-input-disabled').removeAttribute('disabled');
        document.getElementById('anchorage_search').removeAttribute('disabled');
      }
    );
  }

  // set date and time in anchorage deviation.
  setAnchorageDeviaitonTime(): void {
    this.anchorageDeviationTimeForm.value.fromandtodate[0] = formatDate(this.anchorageDeviationTimeForm.value.fromandtodate[0], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.anchorageDeviationTimeForm.value.fromandtodate[1] = formatDate(this.anchorageDeviationTimeForm.value.fromandtodate[1], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.getAnchorageDeviation();
  }

  // Search in anchorage deviation.
  getSearchResultForAnchorageDeviation(e): void {
    const anchorageDeviationData = this.anchorageDeviationData.filter(obj => {
      const mmsi = obj.msi.toString();
      if (mmsi.indexOf(e) === 0) {
        return obj;
      }
    });
    this.anchorageDeviationsortedData = anchorageDeviationData.slice();
    this.anchoragecurrentPage = 1;
  }

  // on click of select all ships to show in map in anchorage deviation
  onSelectAllAnchorageShips(event): void {
    this.selectedAnchorageArray = [];
    this.selectedAnchorage = [];
    this.anchorageDeviationData.forEach(ship => {
      this.dashboardMap.getLayers().getArray()
        .filter(layer => layer.get('name') === Number(ship.msi))
        .forEach(layer => this.dashboardMap.removeLayer(layer));
    });

    if (event.target.checked === true) {
      this.anchorageDeviationData.forEach(ship => {
        this.selectedAnchorageArray.push(ship.msi);
        this.selectedAnchorage[ship.msi] = true;
        this.plotAnchorageDeviation(ship);
      });
      this.selectAllAnchorage = true;
    }
    else {
      this.selectAllAnchorage = false;
    }
  }

  // show in map checkbox for individual ship
  anchorageDeviationCheckboxChange(e): void {
    if (e.target.checked) {
      this.selectedAnchorageArray.push(e.target.value);
      this.selectedAnchorage[e.target.value] = true;
      this.anchorageDeviationData.forEach(ship => {
        if (ship.msi === Number(e.target.value)) {
          this.plotAnchorageDeviation(ship);
        }
      });
    } else {
      const index = this.selectedAnchorageArray.indexOf(Number(e.target.value));
      if (index > -1) {
        this.selectedAnchorageArray.splice(index, 1);
      }
      this.selectedAnchorage[e.target.value] = false;
      this.selectAllAnchorage = false;

      this.dashboardMap.getLayers().getArray()
        .filter(layer => layer.get('name') === Number(e.target.value))
        .forEach(layer => this.dashboardMap.removeLayer(layer));
    }
  }

  // Plot anchorage deviaition on map
  plotAnchorageDeviation(data): void {
    const anchoragefeature = [];
    const anchoragePoint = [data.aalg, data.aalt];
    const nearestAnchoragePoint = [data.aplg, data.aplt];
    anchoragefeature.push(
      new Feature({
        geometry: new Point(anchoragePoint),
        anchoragePointData: 'Anchorage Point: ' + anchoragePoint
      })
    );

    anchoragefeature[0].setStyle(
      new Style({
        image: new Icon({
          src: '../../assets/dashboard/anchor_red.svg',
          scale: 1
        }),
      })
    );
    anchoragefeature.push(
      new Feature({
        geometry: new Point(nearestAnchoragePoint),
        anchoragePointData: 'Nearest Anchorage Point: ' + nearestAnchoragePoint
      })
    );
    anchoragefeature[1].setStyle(
      new Style({
        image: new Icon({
          src: '../../assets/dashboard/anchor_green.svg',
          scale: 1
        }),
      })
    );

    anchoragefeature.push(
      new Feature({
        geometry: new MultiLineString([[anchoragePoint, nearestAnchoragePoint]]),
        anchoragePointData: 'MMSI: ' + data.msi + ', <br/> ' + 'Distance: ' + data.dis + ' km'
      })
    );
    anchoragefeature[2].setStyle(
      new Style({
        stroke: new Stroke({
          color: 'pink',
          width: 5,
          lineDash: [10, 10]
        }),
      })
    );
    this.dashboardMap.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: anchoragefeature
        }),
        name: data.msi
      })
    );
    // hover
    const trajhovercontainer = document.getElementById('trajhover');
    const trajoverlay = new Overlay({
      element: trajhovercontainer,
      positioning: 'center-center',
    });
    this.dashboardMap.on('pointermove', (e) => {
      const trajhoverData = e.map.forEachFeatureAtPixel(e.pixel, ((feature): any => {
        return feature;
      }));
      if (trajhoverData && trajhoverData.get('anchoragePointData') !== undefined) {
        const traj = trajhoverData.get('anchoragePointData');
        trajhovercontainer.setAttribute('style', 'display:block');
        trajhovercontainer.innerHTML = traj;
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning('bottom-right');
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.dashboardMap, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning('bottom-center');
        }
        trajoverlay.setOffset(delta);
        this.dashboardMap.addOverlay(trajoverlay);
      } else {
        if (trajhovercontainer) {
          trajhovercontainer.setAttribute('style', 'display:none');
        }
      }
    });
  }

  // over lay position
  getOverlayOffsets(mapName, overlay): any {
    const overlayRect = overlay.getElement().getBoundingClientRect();
    const mapRect = mapName.getTargetElement().getBoundingClientRect();
    const margin = 15;
    const offsetLeft = overlayRect.left - mapRect.left - 75;
    const offsetRight = mapRect.right - overlayRect.right - 75;
    const offsetTop = overlayRect.top - mapRect.top - 75;
    const offsetBottom = mapRect.bottom - overlayRect.bottom - 75;
    const delta = [20, 20];
    if (offsetLeft < 0) {
      delta[0] = margin - offsetLeft;
    } else if (offsetRight < 0) {
      delta[0] = -(Math.abs(offsetRight) + margin);
    }
    if (offsetTop < 0) {
      delta[1] = margin - offsetTop;
    } else if (offsetBottom < 0) {
      delta[1] = -(Math.abs(offsetBottom) + margin);
    }
    return (delta);
  }

  /* Add to ship of interest.
  Method type: Post.
  Request Parameters: mmsi, userid.
  Expected response: succcess message.
  Process: Success- Success message is diaplayed on top.
            Failure or error- Error message is displayed on the top. */
  addToSoI(selectedMMSI): void {
    const startDate = new Date();
    const functionName = 'Add to ship of interest in dashboard';
    this.functionservice.functionCallLogging(functionName);
    const addSOIData = {
      mmsi: selectedMMSI,
      userid: this.userId
    };
    this.service.addSoI(addSOIData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success(data.data, '', {
            timeOut: 3000,
          });
          const soi = 'soi';
          this.shiptypeDeviationData.forEach(ship => {
            if (ship.mmsi === selectedMMSI) {
              ship[soi] = 1;
            }
          });
          this.shiptypeDeviationsortedData = this.shiptypeDeviationData.slice();

          this.anchorageDeviationData.forEach(ship => {
            if (ship.msi === selectedMMSI) {
              ship[soi] = 1;
            }
          });
          this.anchorageDeviationsortedData = this.anchorageDeviationData.slice();

          this.desinationDeviationData.forEach(ship => {
            if (ship.msi === selectedMMSI) {
              ship[soi] = 1;
            }
          });
          this.destinationDeviationsortedData = this.desinationDeviationData.slice();
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Sorting ship type deviation
  sortShipTypeDeviationData(sort: Sort): any {
    const data = this.shiptypeDeviationData.slice();

    if (!sort.active || sort.direction === '') {
      this.shiptypeDeviationsortedData = data;
      return;
    }
    this.shiptypeDeviationsortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'mmsi':
          return this.compare(a.mmsi, b.mmsi, isAsc);
        case 'trajid':
            return this.compare(a.trajid, b.trajid, isAsc);
        case 'cat':
          return this.compare(a.cat, b.cat, isAsc);
        case 'predictiontype0':
          return this.compare(a.predictiontype0, b.predictiontype0, isAsc);
        case 'predictiontype1':
          return this.compare(a.predictiontype1, b.predictiontype1, isAsc);
        case 'predictiontype2':
          return this.compare(a.predictiontype2, b.predictiontype2, isAsc);
        case 'predictionscore0':
          return this.compare(a.predictionscore0, b.predictionscore0, isAsc);
        case 'predictionscore1':
          return this.compare(a.predictionscore1, b.predictionscore1, isAsc);
        case 'predictionscore2':
          return this.compare(a.predictionscore2, b.predictionscore2, isAsc);
        default:
          return 0;
      }
    });
  }

  // Sorting destination deviation
  sortDestinationDeviationData(sort: Sort): any {
    const data = this.desinationDeviationData.slice();

    if (!sort.active || sort.direction === '') {
      this.destinationDeviationsortedData = data;
      return;
    }
    this.destinationDeviationsortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'st':
          return this.compare(a.st, b.st, isAsc);
        case 'msi':
          return this.compare(a.msi, b.msi, isAsc);
        case 'trajid':
            return this.compare(a.trajid, b.trajid, isAsc);
        case 'dd':
          return this.compare(a.dd, b.dd, isAsc);
        case 'predictedDestination':
          return this.compare(a.predictedDestination, b.predictedDestination, isAsc);
        case 'ad':
          return this.compare(a.ad, b.ad, isAsc);
        case 'portname':
          return this.compare(a.portname, b.portname, isAsc);
        case 'tm':
          return this.compare(a.tm, b.tm, isAsc);
        default:
          return 0;
      }
    });
  }

  // Sorting anchorage deviation
  sortAnchorageDeviationData(sort: Sort): any {
    const data = this.anchorageDeviationData.slice();

    if (!sort.active || sort.direction === '') {
      this.anchorageDeviationsortedData = data;
      return;
    }
    this.anchorageDeviationsortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'msi':
          return this.compare(a.msi, b.msi, isAsc);
        case 'trajid':
            return this.compare(a.trajid, b.trajid, isAsc);
        case 'tm':
          return this.compare(a.tm, b.tm, isAsc);
        case 'ap':
          return this.compare(a.ap, b.ap, isAsc);
        case 'nap':
          return this.compare(a.nap, b.nap, isAsc);
        case 'dis':
          return this.compare(a.dis, b.dis, isAsc);
        case 'occupancy':
          return this.compare(a.occupancy, b.occupancy, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
