import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FunctionService } from '../shared/functions.service';

import Map from 'ol/Map';
import { Vector as VectorLayer, Group as LayerGroup } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { Style, Icon, Text } from 'ol/style';
import Stroke from 'ol/style/Stroke';
import { Feature } from 'ol/index';
import { MultiLineString } from 'ol/geom';
import { Point } from 'ol/geom';
import { WebGLPoints } from 'ol/layer';
import { Fill } from 'ol/style';
import Graticule from 'ol/layer/Graticule';
import Overlay from 'ol/Overlay';
import Polygon from 'ol/geom/Polygon';

@Component({
  selector: 'app-play-history',
  templateUrl: './play-history.component.html',
  styleUrls: ['./play-history.component.scss']
})
export class PlayHistoryComponent implements OnInit, AfterViewInit {
  loginStatus: string;
  criteriaoptions = [
    { name: 'Ship Name', value: 'Shipname' },
    { name: 'MMSI', value: 'MMSI' },
    { name: 'IMO', value: 'IMO' },
  ];
  value = 'value';
  searchedData = [];
  selectedResult = [];
  userId = '';
  historyList = [];
  selectedShipsInHistoryList = [];
  historylistlength: any;

  startTimePlaceHolder = 'set time';
  today = new Date();
  timeframe: any;
  showShipName = false;
  showShiptraj = true;
  map: Map;
  playhistoryExpanded = false;
  repeat = false;

  SOImmsi: any;
  selectVesselExpanded = false;
  timeframeExpanded = false;
  minDate: number;
  maxDate: number;
  sliderSelectedTime = '';
  sliderSelectedTimeUnix: number;
  historyResult = [];
  allHistoryResult = [];
  playStatus = 'not playing';
  TimerFunction: any;
  timerIndex: number;


  graticule = false;
  opacitySildervalue = parseFloat('1');
  maptype = '';
  rolefeatures: any;

  PortsSource = new VectorSource();
  PredictedAnchorsSource = new VectorSource();
  KnownAnchorsSource = new VectorSource();
  knownanchors = [];
  checkedknownanchors = false;
  predictedanchors = [];
  checkedpredictanchors = false;
  ports = [];
  checkedports = false;
  checkedanchors = false;

  constructor(private service: ServiceService, private cookieService: CookieService,
              private functionservice: FunctionService, private toastr: ToastrService) { }

  searchForm = new FormGroup({
    search_text: new FormControl(''),
    criteria: new FormControl(this.criteriaoptions[0][this.value]),
    userid: new FormControl('')
  });

  timeFrameForm = new FormGroup({
    from_date: new FormControl(''),
    duration: new FormControl(''),
  });

  setSpeedForm = new FormGroup({
    speed: new FormControl()
  });


  ngOnInit(): void {
    this.service.setTitle('Play History');
    this.loginStatus = this.cookieService.get('loginStatus');
    this.userId = this.cookieService.get('userid');
    this.setSpeedForm.setValue({ speed: '1' });
    this.getFeatureForRole();
    this.selectVesselExpanded = true;
  }

  /* Get features assigned for the user
  Method type: Get.
  Request Parameters: roleid
  Expected response: List of features for the role assigned for that user.
  Process: Success- Details which comes has response is stored in variable(rolefeatures).
           Failure or error- Error message is displayed on the top. */
  getFeatureForRole(): void {
    const startDate = new Date();
    const functionName = 'Get features for role in play history';
    this.functionservice.functionCallLogging(functionName);
    this.service.getFeatureForRole(this.cookieService.get('roleid')).subscribe(result => {
      if (result.status === 'success') {
        this.rolefeatures = result.data;
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

  // directPlayHistory(): void {
  //   if (this.selectedResult.length > 0) {
  //     this.selectedResult.forEach(data => {
  //       this.selectedShipsInHistoryList.push(data.MMSI);
  //     });
  //     document.getElementById('playhistory-pannel').click();
  //   }
  // }

  // After view init render map
  ngAfterViewInit(): void {
    this.displayMap();
    this.SOImmsi = this.cookieService.get('playhistorymmsi');
    let soimmsiList = [];
    if (this.SOImmsi !== '') {
      const startTime = new Date(this.cookieService.get('playhistorystartTime'));
      this.startTimePlaceHolder = this.cookieService.get('playhistorystartTime');
      const endTime = new Date(this.cookieService.get('playhistoryendTime'));
      const hours = (endTime.getTime() - startTime.getTime()) / 3600000;
      soimmsiList = this.SOImmsi.split(',');
      soimmsiList.forEach(m => {
        this.selectedShipsInHistoryList.push(m);
      });
      this.timeFrameForm.setValue({ from_date: this.cookieService.get('playhistorystartTime'), duration: hours });
      this.cookieService.set('playhistorymmsi', '');
      document.getElementById('playhistory-pannel').click();
    }
  }

  ngDestroy(): void {
    clearInterval(this.TimerFunction);
  }

  // Display map
  displayMap(): void {
    this.maptype = this.cookieService.get('map');
    this.map = new Map({
      controls: defaultControls({ zoom: false }).extend([new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        undefinedHTML: '&nbsp;'
      })]),
      target: 'map2',
      view: new View({
        center: [78, 20],
        zoom: 4,
        // maxZoom: 15,
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
      this.map.addLayer(
        new TileLayer({
          source: new TileWMS({
            url: this.service.mapURL + workspace + '/wms',
            // url: 'http://20.20.20.112:8090/geoserver/ENC_Workspace/wms',
            params: { LAYERS: maptype.layername, TILED: false },
            // serverType: 'geoserver',
            // transition: 0,
          }),
          name: maptype.mapname,
          visible: visibility
        })
      );
    });
  }

  /* Get search results.
      Method type: Post.
      Request Parameters: search_text, criteria.
      Expected response: Array of ships for the searched text.
      Process: Success- Show the searched option in a dropdown.
          Failure or error- Error message is displayed on the top. */
  onSearchkeyup(): void {
    this.setPlayHistorywaitState(true);
    const startDate = new Date();
    const functionName = 'Search in play history';
    this.functionservice.functionCallLogging(functionName);
    this.searchForm.setValue({
      search_text: this.searchForm.value.search_text,
      criteria: this.searchForm.value.criteria, userid: this.userId
    });
    this.service.getSearchResultInPlayHistory(this.searchForm.value).subscribe((result) => {
      if (result.status === 'success') {
        this.setPlayHistorywaitState(false);
        this.searchedData = result.data;
        document.getElementById('popup-search-playhistory').setAttribute('style', 'display:block');
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setPlayHistorywaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }


  // Closing search popup
  closeSearchPopup(): void {
    document.getElementById('popup-search-playhistory').setAttribute('style', 'display:none');
  }

  // Selecting the searhed result and storinf in a variable.
  selectedOption(searchedval, mmsi, sn): void {
    this.selectedResult.push({ val: searchedval, MMSI: mmsi, shipname: sn });
    document.getElementById('popup-search-playhistory').setAttribute('style', 'display:none');
    this.searchForm.setValue({ search_text: '', criteria: this.searchForm.value.criteria, userid: this.userId });
    this.searchedData = [];
  }

  // Clear searched and selected ship
  clearOption(val): void {
    this.selectedResult.forEach((value, i) => {
      if (value.val === val) {
        this.selectedResult.splice(i, 1);
      }
    });
  }

  /* Add searched ships to list of ships.
  Method type: Post.
  Request Parameters: userid, array of mmsi(ships).
  Expected response: Success message.
  Process: Success- Success message.
          Failure or error- Error message is displayed on the top. */
  addToList(): void {
    
    const startDate = new Date();
    const functionName = 'Add to List in play history';
    this.functionservice.functionCallLogging(functionName);
    const selectedmmsi = [];
    this.selectedResult.forEach(data => {
      selectedmmsi.push(data.MMSI);
    });

    if (selectedmmsi.length < 1) {
      this.toastr.info('Select atleast one ship to add.', '', {
        timeOut: 3000,
      });
      return;
    }
    const reqData = { userid: this.userId, mmsi: selectedmmsi };
    this.setPlayHistorywaitState(true);
    this.service.addToList(reqData).subscribe((result) => {
      if (result.status === 'success') {
        this.setPlayHistorywaitState(false);
        this.toastr.success('Successfully added to list', '', {
          timeOut: 3000,
        });
        this.selectedResult = [];
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setPlayHistorywaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }


  /* Get all ships added to history.
  Method type: Post.
  Request Parameters: userid.
  Expected response: Array of ships.
  Process: Success- Array of ships.
            Failure or error- Error message is displayed on the top. */
  getHistoryList(): void {
    this.setPlayHistorywaitState(true);
    const startDate = new Date();
    const functionName = 'Get History list in play history';
    this.functionservice.functionCallLogging(functionName);
    this.service.getHistoryList(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.setPlayHistorywaitState(false);
        this.historyList = result.data;
        this.historyList.forEach(l => {
          const index = this.selectedShipsInHistoryList.indexOf(l.msi);
          if (index > -1) {
            l.className = 'btn historyList_button_active';
          } else {
            l.className = 'btn historyList_button';
          }
        });
        this.historylistlength = result.data.length;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setPlayHistorywaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Select ship in history list to show play history
  selectShipInHistoryList(mmsi): void {
    if (document.getElementById(mmsi).getAttribute('class') === 'btn historyList_button_active') {
      const index = this.selectedShipsInHistoryList.indexOf(mmsi);
      if (index > -1) {
        this.selectedShipsInHistoryList.splice(index, 1);
      }
      document.getElementById(mmsi).setAttribute('class', 'btn historyList_button');

    } else {
      this.selectedShipsInHistoryList.push(mmsi);
      document.getElementById(mmsi).setAttribute('class', 'btn historyList_button_active');
    }
  }

  /* Delete ship from history list.
  Method type: Post.
  Request Parameters: userid, mmsi.
  Expected response: Success message.
  Process: Success- Success message.
            Failure or error- Error message is displayed on the top. */
  deleteFromHistoryList(deletingMMSI): void {
    this.setPlayHistorywaitState(true);
    const startDate = new Date();
    const functionName = 'Delete from history list in play history';
    this.functionservice.functionCallLogging(functionName);
    const reqData = { userid: this.userId, mmsi: deletingMMSI };
    this.service.deleteFromHistoryList(reqData).subscribe((result) => {
      if (result.status === 'success') {
        this.setPlayHistorywaitState(false);
        this.toastr.success('Successfully deleted', '', {
          timeOut: 3000,
        });
        const index = this.selectedShipsInHistoryList.indexOf(deletingMMSI);
        if (index > -1) {
          this.selectedShipsInHistoryList.splice(index, 1);
        }
        this.historyList.forEach((ship, i) => {
          if (ship.msi === deletingMMSI) {
            this.historyList.splice(i, 1);
          }
        });
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setPlayHistorywaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }

  // Toggle in repeat video
  toggleRepeat(): void {
    if (document.getElementById('toggleRepeat').getAttribute('src') === '../../../assets/densitymap/switch-off.svg') {
      document.getElementById('toggleRepeat').setAttribute('src', '../../../assets/densitymap/switch-on.svg');
      this.repeat = true;
    } else {
      document.getElementById('toggleRepeat').setAttribute('src', '../../../assets/densitymap/switch-off.svg');
      this.repeat = false;
    }
  }

  changePlayHistryExpandToFalse(): void {
    this.playhistoryExpanded = false;
  }


  /* Play history video.
  Method type: Post.
  Request Parameters: mmsi, from_date, duration.
  Expected response: LAst know position and trajectory details to play video.
  Process: Success- Success message.
            Failure or error- Error message is displayed on the top. */
  getPlayHistoryData(): void {
    this.playStatus = 'not playing';
    this.timerIndex = 0;
    clearInterval(this.TimerFunction);
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'Trajectory' || layer.get('name') === 'Trajectory Start Layer' ||
        layer.get('name') === 'Trajectory End Layer')
      .forEach(layer => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    this.historyResult.forEach(ship => {
      const mmsi = ship.mmsi;
      this.map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'Animating Layer' + mmsi)
        .forEach(layer => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    });
    if (this.playhistoryExpanded === false) {
      this.playhistoryExpanded = true;
      const startDate = new Date();
      const functionName = 'Get play history data in play history';
      this.functionservice.functionCallLogging(functionName);
      let fromDate = '';
      if (this.selectedShipsInHistoryList.length === 0) {
        this.toastr.error('Please select on ship from history list ', '', {
          timeOut: 3000,
        });
        this.playhistoryExpanded = false;
        this.timeframeExpanded = true;
        return;
      }
      if (this.timeFrameForm.value.from_date === '') {
        this.toastr.error('Please select start date to show the history ', '', {
          timeOut: 3000,
        });
        this.playhistoryExpanded = false;
        this.timeframeExpanded = true;
        return;
      }
      if (this.timeFrameForm.value.from_date !== '') {
        fromDate = formatDate(this.timeFrameForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      }
      this.setPlayHistorywaitState(true);
      const reqData = {
        mmsi: this.selectedShipsInHistoryList,
        from_date: fromDate,
        to_date: this.timeFrameForm.value.duration,
        userid: this.userId
      };
      this.service.getPlayHistory(reqData).subscribe((result) => {
        if (result.status === 'success') {
          this.setPlayHistorywaitState(false);
          this.minDate = new Date(formatDate(result.frm, 'yyyy-MM-dd HH:mm:ss', 'en-US')).getTime() / 1000;
          this.maxDate = new Date(formatDate(result.to, 'yyyy-MM-dd HH:mm:ss', 'en-US')).getTime() / 1000;
          this.sliderSelectedTime = formatDate(result.frm, 'dd-MM-yyyy HH:mm:ss', 'en-US');
          // this.sliderSelectedTimeUnix = new Date(formatDate(result.frm, 'yyyy-MM-dd HH:mm:ss', 'en-US')
          // .replace('-', '/')).getTime() / 1000;
          this.sliderSelectedTimeUnix = new Date(formatDate(result.frm, 'yyyy-MM-dd HH:mm:ss', 'en-US')).getTime() / 1000;
          this.timeframe = formatDate(result.frm, 'dd-MM-yyyy HH:mm:ss', 'en-US') + ' to ' + formatDate(result.to, 'dd-MM-yyyy HH:mm:ss', 'en-US');
          this.allHistoryResult = result.traj;
          if (this.showShiptraj === true) {
            this.plotTrajectory(this.allHistoryResult);
          }
          result.traj.forEach((ship) => {
            const allPtsForSingleShip = [];
            ship.traj_details.forEach(tj => {
              tj.pts.forEach(p => {
                allPtsForSingleShip.push(p);
              });
            });
            const traj = { mmsi: ship.mmsi, name: ship.name, traj: allPtsForSingleShip };
            this.historyResult.push(traj);
          });
          // this.animate(result.traj);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
        error => {
          this.setPlayHistorywaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        });
    } else {
      this.playhistoryExpanded = false;
    }
  }

  // Draw trajectory.
  plotTrajectory(allMmsiTrack): void {
    const trajectoryfeature = [];
    allMmsiTrack.forEach((mmsi, i) => {
      const polygoncoordinates = [];
      const startfeature = [];
      const endfeatues = [];
      mmsi.traj_details.forEach((t, j) => {
        if (t.pts.length !== 0) {
          t.pts.forEach(tH => {
            polygoncoordinates.push([tH.lg, tH.lt]);
          });
          startfeature.push(
            new Feature({
              geometry: new Point([t.pts[0].lg, t.pts[0].lt]),
            })
          );

          startfeature[j].setStyle(
            new Style({
              image: new Icon({
                src: '../../assets/soi/circle.svg',
                scale: 1
              }),
            }),
          );

          endfeatues.push(
            new Feature({
              geometry: new Point([t.pts[t.pts.length - 1].lg, t.pts[t.pts.length - 1].lt]),
            })
          );

          endfeatues[j].setStyle(
            new Style({
              image: new Icon({
                src: '../../assets/soi/ship-green.svg',
                scale: 1,
                rotation: (Math.PI / 180) * t.pts[t.pts.length - 1].cg,
              }),
            })
          );
        } else {
          this.toastr.warning(mmsi.name + ' has no trajectory details in the selected range', '', {
            timeOut: 3000,
          });
        }

        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({
              features: startfeature
            }),
            name: 'Trajectory Start Layer'
          })
        );
        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({
              features: endfeatues
            }),
            name: 'Trajectory End Layer'
          })
        );
      });

      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
        })
      );
      trajectoryfeature[i].setStyle(
        new Style({
          stroke: new Stroke({
            color: 'brown',
            width: 1,
          }),
        })
      );
    });

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: trajectoryfeature
        }),
        name: 'Trajectory'
      })
    );
  }

  // Show ship name checkbox
  showShipNameCheckboxChange(e): void {
    this.showShipName = e.target.checked;
    e.stopPropagation();
  }

  // show trajectory checkbox
  showTrajectoryCheckboxChange(e): void {
    this.showShiptraj = e.target.checked;
    e.stopPropagation();
    if (this.showShiptraj === true) {
      this.plotTrajectory(this.allHistoryResult);
    } else {
      this.map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'Trajectory' || layer.get('name') === 'Trajectory Start Layer' ||
          layer.get('name') === 'Trajectory End Layer')
        .forEach(layer => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    }
  }

  // Set speed select change
  setSpeed(): void {
    this.playhistoryExpanded = true;
  }

  // Slider moving in ship type deviation
  sliderMove(data): void {
    const conver = new Date(data * 1000).toUTCString();
    this.sliderSelectedTime = formatDate(conver, 'dd-MM-yyyy HH:mm:ss', 'en-US');
    this.sliderSelectedTimeUnix = data;
  }

  // Slider changed in ship type deviation
  sliderChanged(data): void {
    const conver = new Date(data * 1000).toUTCString();
    this.sliderSelectedTime = formatDate(conver, 'dd-MM-yyyy HH:mm:ss', 'en-US');
    this.sliderSelectedTimeUnix = data;
    this.timerIndex = data - this.minDate;
  }

  // Play and pause video
  play(): void {
    if (this.playStatus === 'not playing') {
      this.playStatus = 'playing';
      const diff = this.maxDate - this.minDate;
      this.TimerFunction = setInterval(() => {
        const time = this.minDate + this.timerIndex;
        this.sliderChanged(time);
        if (this.timerIndex >= diff && this.repeat === true) {
          this.timerIndex = 0;
        } else if (this.timerIndex >= diff && this.repeat === false) {
          clearInterval(this.TimerFunction);
          this.timerIndex = 0;
          this.playStatus = 'not playing';
        }
        this.timerIndex = this.timerIndex + (1 * this.setSpeedForm.value.speed);
        const convertedTime = new Date(time * 1000).toUTCString();
        this.plotMarker(formatDate(convertedTime, 'dd-MM-yyyy HH:mm:ss', 'en-US'));
      }, 1000);
    } else if (this.playStatus === 'playing') {
      this.playStatus = 'not playing';
      clearInterval(this.TimerFunction);
    }

  }

  // Plot animating marker
  plotMarker(time): void {
    this.historyResult.forEach(ship => {
      const animatingFeature = [];
      for (let i = 0; i < ship.traj.length; i++) {
        if (formatDate(ship.traj[i].tm, 'dd-MM-yyyy HH:mm:ss', 'en-US') > time) {
          const mmsi = ship.mmsi;
          this.map.getLayers().getArray()
            .filter(layer => layer.get('name') === 'Animating Layer' + mmsi)
            .forEach(layer => {
              layer.getSource().clear();
              this.map.removeLayer(layer);
            });

          animatingFeature.push(
            new Feature({
              geometry: new Point([ship.traj[i].lg, ship.traj[i].lt]),
            })
          );

          if (this.showShipName === true) {
            animatingFeature[0].setStyle(
              new Style({
                image: new Icon({
                  src: '../../assets/playhistory/animating-ship.svg',
                  scale: 1,
                  rotation: (Math.PI / 180) * ship.traj[i].cg,
                }),
                text: new Text({
                  text: ship.name,
                  fill: new Fill({ color: 'RED' }),
                  stroke: new Stroke({
                    color: '#FFF',
                    width: 3
                  })
                })
              })
            );
          } else {
            animatingFeature[0].setStyle(
              new Style({
                image: new Icon({
                  src: '../../assets/playhistory/animating-ship.svg',
                  scale: 1,
                  rotation: (Math.PI / 180) * ship.traj[i].cg,
                })
              })
            );
          }
          this.map.addLayer(
            new VectorLayer({
              source: new VectorSource({
                features: animatingFeature
              }),
              name: 'Animating Layer' + mmsi
            })
          );
          i = ship.traj.length;
        }
      }
    });

  }

  // Wait state in play history
  setPlayHistorywaitState(data): void {
    if (data === true) {
      document.getElementById('bottom-panel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      document.getElementById('playhistory-Overall').setAttribute('style', 'cursor: wait;');
    }
    if (data === false) {
      document.getElementById('bottom-panel').setAttribute('style', 'cursor:default;');
      document.getElementById('playhistory-Overall').setAttribute('style', 'cursor: default;');
    }
  }

  // show Graticule on map
  showGraticule(): void {
    if (this.graticule === false) {
      this.graticule = true;
      this.map.addLayer(new Graticule({
        strokeStyle: new Stroke({
          color: 'rgba(255,120,0,0.9)',
          width: 2,
          lineDash: [0.5, 4],
        }),
        showLabels: true,
        wrapX: true,
        name: 'Graticule'
      }));
    } else {
      this.graticule = false;
      this.map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'Graticule')
        .forEach(layer => this.map.removeLayer(layer));
    }
  }

  // Zooming In map
  zoomIn(): void {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  // Zooimg Out map
  zoomOut(): void {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }

  // Change opacity of the map
  fnChangeMapOpacity(val): void {
    // const opacity = typeof(e.target) === 'undefined' ? parseFloat(e.value) : parseFloat(e.target.value);
    this.opacitySildervalue = parseFloat(val);
    this.map.getLayers().getArray().forEach(layer => {
      if (layer.getVisible() && (layer.get('name') === 'Standard Map' || layer.get('name') === 'Satellite Map' || layer.get('name') === 'Nautical Map')) {
        layer.setOpacity(this.opacitySildervalue);
      }
    });
  }

  /* Changing map type
  Method type: Post.
  Request Parameters: userid,map
  Expected response: success message.
  Process: Success- Success message is displayed on the top.
           Failure or error- Error message is displayed on the top. */
  changeMapType(mapType): void {
    const startDate = new Date();
    const functionName = 'Update mao type in ship map';
    this.functionservice.functionCallLogging(functionName);
    const updatingdata = { userid: this.userId, map: mapType };
    this.service.updateMapType(updatingdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.cookieService.set('map', data.data);
          this.maptype = data.data;
          const map = [{ mapname: 'Standard Map', layername: 'osm' }, { mapname: 'Satellite Map', layername: 'simple_dark' }, { mapname: 'Nautical Map', layername: 'ENC' }];
          map.forEach(maptype => {
            this.map.getLayers().getArray().forEach(layer => {
              if (layer.get('name') === maptype.mapname) {
                if (layer.get('name') === this.maptype) {
                  layer.setVisible(true);
                }
                else {
                  layer.setVisible(false);
                }
              }
            });
          });
          this.opacitySildervalue = parseFloat('1');
          this.fnChangeMapOpacity(this.opacitySildervalue);
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


  /* Get ports details
  Method type: Get.
  Request Parameters: userid
  Expected response: List of ports details.
  Process: Success- Ports details which comes as a response is stored in a variable(ports)
           Failure or error- Error message is displayed on the top. */
  getPorts(e): void {
    const startDate = new Date();
    const functionName = 'Get ports in ship map';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      // this.progressbar = true;
      // document.getElementById('overall').setAttribute('style', 'cursor: wait;');
      this.checkedports = true;
      this.service.getPorts(this.userId).subscribe(result => {
        if (result.status === 'success') {
          this.ports = result.data;
          this.plotPorts();
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
      // this.progressbar = false;
      // document.getElementById('overall').setAttribute('style', 'cursor: default;');
    }
    else {
      this.ports = [];
      this.PortsSource.clear();
      this.plotPorts();
      this.checkedports = false;
    }
  }

  // plot ports
  plotPorts(): void {
    const portsfeature = [];
    this.ports.forEach(port => {
      portsfeature.push(new Feature({
        geometry: new Point([port.long, port.lat]),
        portsData: port
      })
      );
    });

    this.PortsSource.addFeatures(portsfeature);
    const portStyle = {
      symbol: {
        symbolType: 'image',
        src: '../../assets/map/Ports_orange.svg',
        size: 15,
        color: 'YELLOW',
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: this.PortsSource,
        name: 'Ports Layers',
        style: portStyle
      })
    );
    const portshovercontainer = document.getElementById('portshover');
    const portsoverlay = new Overlay({
      element: portshovercontainer,
      positioning: 'center-center',
    });
    this.map.on('pointermove', (e) => {
      // if (this.progressbar === false) {
      //   document.getElementById('map').setAttribute('style', 'cursor: default');
      // } else {
      //   document.getElementById('map').setAttribute('style', 'cursor: wait');
      // }
      const portsDataonhover = e.map.forEachFeatureAtPixel(e.pixel, ((feature): any => {
        return feature;
      }));
      if (portsDataonhover && portsDataonhover.get('portsData') !== undefined) {
        const ports = portsDataonhover.get('portsData');
        portshovercontainer.setAttribute('style', 'display:block');
        portshovercontainer.innerHTML = '<p style=margin-bottom:0px;> <b>Port ID: </b>' + ports.port_id + '</p> \
                                           <p style=margin-bottom:0px;> <b>Port name: </b>' + ports.port_name + '</p> \
                                           <p style=margin-bottom:0px;> <b>Country: </b>' + ports.country_code + '</p>\
                                           <p style=margin-bottom:0px;> <b>Latitude: </b>' + ports.lat + '</p>\
                                           <p style=margin-bottom:0px;> <b>Longitude: </b>' + ports.long + '</p>';
        portsoverlay.setOffset([0, 0]);
        portsoverlay.setPositioning('bottom-right');
        portsoverlay.setPosition(portsDataonhover.getGeometry().getCoordinates());
        const delta = this.getOverlayOffsets(this.map, portsoverlay);
        if (delta[1] > 0) {
          portsoverlay.setPositioning('bottom-center');
        }
        portsoverlay.setOffset(delta);
        this.map.addOverlay(portsoverlay);
      } else {
        if (portshovercontainer) {
          portshovercontainer.setAttribute('style', 'display:none');
        }
      }
    });
  }

  /* Get known anchors details
  Method type: Get.
  Request Parameters: userid
  Expected response: List of known anchors details.
  Process: Success- Known anchors details which comes as a response is stored in a variable(knownanchors)
           Failure or error- Error message is displayed on the top. */
  getKnownAnchors(e): void {
    const startDate = new Date();
    const functionName = 'Get known anchors in ship map';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      // this.progressbar = true;
      // document.getElementById('overall').setAttribute('style', 'cursor: wait;');
      this.checkedknownanchors = true;
      this.checkedanchors = true;
      this.service.getKnownAnchors(this.userId).subscribe(result => {
        if (result.status === 'success') {
          this.knownanchors = result.data;
          this.plotKnownAnchors();
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
      // this.progressbar = false;
      // document.getElementById('overall').setAttribute('style', 'cursor: default;');
    }
    else {
      this.knownanchors = [];
      this.KnownAnchorsSource.clear();
      this.plotKnownAnchors();
      this.checkedknownanchors = false;
      if (this.checkedpredictanchors === false) {
        this.checkedanchors = false;
      }
    }
  }

  // Plot known anchors data
  plotKnownAnchors(): void {
    const knownanchorsfeature = [];
    this.knownanchors.forEach(knownanchor => {
      knownanchorsfeature.push(
        new Feature({
          geometry: new Point([knownanchor.long, knownanchor.lat]),
          knownanchorsData: knownanchor
        })
      );
    });
    this.KnownAnchorsSource.addFeatures(knownanchorsfeature);
    const anchorStyle = {
      symbol: {
        symbolType: 'image',
        src: '../../assets/map/anchor_yellow.svg',
        size: 10,
        color: 'YELLOW',
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: this.KnownAnchorsSource,
        name: 'Known Anchors Layers',
        style: anchorStyle
      })
    );
    const knownanchorshovercontainer = document.getElementById('knownanchorshover');
    const knownanchorsoverlay = new Overlay({
      element: knownanchorshovercontainer,
      positioning: 'center-center',
    });
    this.map.on('pointermove', (e) => {
      // if (this.progressbar === false) {
      //   document.getElementById('map').setAttribute('style', 'cursor: default');
      // } else {
      //   document.getElementById('map').setAttribute('style', 'cursor: wait');
      // }
      const knownanchorsDataonhover = e.map.forEachFeatureAtPixel(e.pixel, ((feature): any => {
        return feature;
      }));
      if (knownanchorsDataonhover && knownanchorsDataonhover.get('knownanchorsData') !== undefined) {
        const knownanchors = knownanchorsDataonhover.get('knownanchorsData');
        knownanchorshovercontainer.setAttribute('style', 'display:block');
        knownanchorshovercontainer.innerHTML = '<p style=margin-bottom:0px;><b>Anchor ID: </b>' + knownanchors.anchorid + '</p> \
                                                    <p style=margin-bottom:0px;><b>Anchor Name: </b>' + knownanchors.label + '</p> \
                                                    <p style=margin-bottom:0px;><b>Anchor Source: </b>' + knownanchors.anchor_source + '</p>\
                                                    <p style=margin-bottom:0px;><b>Country: </b>' + knownanchors.country_code + '</p>\
                                                    <p style=margin-bottom:0px;><b>Distance from shore: </b>' +
          knownanchors.distance_from_shore + '</p>\
                                                    <p style=margin-bottom:0px;><b>Drift radius: </b>' + knownanchors.drift_radius + '</p>\
                                                    <p style=margin-bottom:0px;><b>Latitude: </b>' + knownanchors.lat + '</p>\
                                                    <p style=margin-bottom:0px;><b>Longitude: </b>' + knownanchors.long + '</p>';
        knownanchorsoverlay.setOffset([0, 0]);
        knownanchorsoverlay.setPositioning('bottom-right');
        knownanchorsoverlay.setPosition(knownanchorsDataonhover.getGeometry().getCoordinates());
        const delta = this.getOverlayOffsets(this.map, knownanchorsoverlay);
        if (delta[1] > 0) {
          knownanchorsoverlay.setPositioning('bottom-center');
        }
        knownanchorsoverlay.setOffset(delta);
        this.map.addOverlay(knownanchorsoverlay);

      } else {
        if (knownanchorshovercontainer) {
          knownanchorshovercontainer.setAttribute('style', 'display:none');
        }
      }
    });
  }

  /* Get predicted anchors details
  Method type: Get.
  Request Parameters: userid
  Expected response: List of predicted anchors details.
  Process: Success- predicted anchors details which comes as a response is stored in a variable(predictedanchors)
           Failure or error- Error message is displayed on the top. */
  getPredictedAnchors(e): void {
    const startDate = new Date();
    const functionName = 'Get predicted anchors in ship map';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      // this.progressbar = true;
      // // document.getElementById('disable-mapevent').setAttribute('style','cursor:progress;pointer-events:none');
      // document.getElementById('overall').setAttribute('style', 'cursor: wait;');
      this.checkedpredictanchors = true;
      this.checkedanchors = true;
      this.service.getPredictedAnchors(this.userId).subscribe(result => {
        if (result.status === 'success') {
          this.predictedanchors = result.data;
          this.plotPredictedAnchors();
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
      // this.progressbar = false;
      // document.getElementById('overall').setAttribute('style', 'cursor: default;');
    }
    else {
      this.predictedanchors = [];
      this.PredictedAnchorsSource.clear();
      this.plotPredictedAnchors();
      this.checkedpredictanchors = false;
      if (this.checkedknownanchors === false) {
        this.checkedanchors = false;
      }
    }
  }

  // plot predict anchors
  plotPredictedAnchors(): void {
    const predictedanchorsfeature = [];
    this.predictedanchors.forEach((PredAnchors, i) => {
      const predictedanchorsData = PredAnchors;
      const polygoncoordinates = [];
      predictedanchorsData.points.forEach(points => {
        polygoncoordinates.push([points.lg, points.lt]);
      });
      predictedanchorsfeature.push(
        new Feature({
          geometry: new Polygon([polygoncoordinates]),
          predictedanchorsData: PredAnchors
        })
      );
      if (PredAnchors.std === true) {
        PredAnchors.anchortype = 'Standard';
        PredAnchors.color = 'orange';
      } else {
        PredAnchors.anchortype = 'Non-standard';
        PredAnchors.color = 'red';
      }
      predictedanchorsfeature[i].setStyle(
        new Style({
          stroke: new Stroke({
            color: PredAnchors.color,
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255,255,255,0.75)'
          })
        })
      );
    });
    this.PredictedAnchorsSource.addFeatures(predictedanchorsfeature);
    this.map.addLayer(
      new VectorLayer({
        source: this.PredictedAnchorsSource,
        name: 'Predicted Anchors Layers'
      })
    );
    const predanchorshovercontainer = document.getElementById('predanchorshover');
    const predanchorsoverlay = new Overlay({
      element: predanchorshovercontainer,
      positioning: 'center-center',
    });
    this.map.on('pointermove', (e) => {
      // if (this.progressbar === false) {
      //   document.getElementById('map').setAttribute('style', 'cursor: default');
      // } else {
      //   document.getElementById('map').setAttribute('style', 'cursor: wait');
      // }
      const predanchorsDataonhover = e.map.forEachFeatureAtPixel(e.pixel, ((feature): any => {
        return feature;
      }));
      if (predanchorsDataonhover && predanchorsDataonhover.get('predictedanchorsData') !== undefined) {
        const predanchors = predanchorsDataonhover.get('predictedanchorsData');
        predanchorshovercontainer.setAttribute('style', 'display:block');
        predanchorshovercontainer.innerHTML = '<p style=margin-bottom:0px;><b>Anchor ID: </b>' + predanchors.anchorid + '</p>\
                                                  <p style=margin-bottom:0px;><b>Anchor Type: </b>' + predanchors.anchortype + '</p>';
        predanchorsoverlay.setOffset([0, 0]);
        predanchorsoverlay.setPositioning('bottom-right');
        predanchorsoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, predanchorsoverlay);
        if (delta[1] > 0) {
          predanchorsoverlay.setPositioning('bottom-center');
        }
        predanchorsoverlay.setOffset(delta);
        this.map.addOverlay(predanchorsoverlay);
      } else {
        if (predanchorshovercontainer) {
          predanchorshovercontainer.setAttribute('style', 'display:none');
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
}
