import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';
import { FunctionService } from '../../shared/functions.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ship-of-interst',
  templateUrl: './ship-of-interst.component.html',
  styleUrls: ['./ship-of-interst.component.scss']
})
export class ShipOfInterstComponent implements OnInit {

  constructor(private service: ServiceService, private toastr: ToastrService,
              private cookieService: CookieService, private Dataservice: DataService,
              private functionservice: FunctionService, private router: Router) { }

  featureSelectedSOI = 'false';
  featureSelectedSOISidenav = false;
  soisub: Subscription;
  userId: string;
  getSOI: any;
  loginStatus: string;
  // soi
  selectedsoiships = [];
  soiselectedmmsi = [];
  trackdetails = [];
  trackdetailslength = 0;
  soishiptypedeviation = [];
  soianchoragedeviation = [];
  soiData = [];
  // soi  track traj
  trajectoryData = [];
  showtracjectorymmsi = [];
  showtracjectorytrajid = [];
  // soi ship deviation traj
  shiptypedeviationtrajmmsi = [];
  shiptypedeviationtrajid = [];
  // soi anchorage deviaiton traj
  soianchoragedeviationtrajmmsi = [];
  soianchoragedeviationtrajid = [];
  // Delete SOI
  UpdatesoiSub: Subscription;
  deletingsoiship: any;
  // goi
  goi: any;
  selectedgoi = [];
  selectedgoiships = [];
  goiselected = [];
  goiselectedmmsi = [];
  goiselectedmmsiwithgrp = [];
  goitrackdetailslength = 0;
  // Goi track info
  goitrackdetails = [];
  showgrptrajectorygid = [];
  showgrptracjectorymmsi = [];
  showgrptracjectorytrajid = [];
  // Goi ship type anomaly
  goishiptypedeviation = [];
  goishiptypedeviationtrajgid = [];
  goishiptypedeviationtrajmmsi = [];
  goishiptypedeviationtrajid = [];
  // Goi anchorage anomaly
  goianchoragedeviation = [];
  goianchoragedeviationtrajgid = [];
  goianchoragedeviationtrajmmsi = [];
  goianchoragedeviationtrajid = [];
  // Delete goi
  UpdategoiSub: Subscription;
  deletinggoiship: any;
  deletingmmsiofgoiship: any;
  deletingmmsiofgoi: any;

  soiplottimerfunction: any;

  soiplotshipapiflag = 0;
  digitaltime: any;
  digitaldate: any;
  allTrajectoryInfo = [];

  @Output() SOISelectedEvent = new EventEmitter();
  @Output() TracktrajectoryEvent = new EventEmitter();
  @Output() removeTrackTrajEvent = new EventEmitter();
  @Output() shiptypedeviationtrajectoryEvent = new EventEmitter();
  @Output() shiptypedeviaitontrajanomalyEvent = new EventEmitter();
  @Output() removeanomalyTrajEvent = new EventEmitter();
  @Output() anchoragedeviationtrajectoryEvent = new EventEmitter();
  @Output() anchoageanomalyanomalyEvent = new EventEmitter();
  @Output() GOISelectedEvent = new EventEmitter();
  @Output() receivegoitracktraj = new EventEmitter();
  @Output() DeleteSOIEvent = new EventEmitter();
  @Output() EditGOIEvent = new EventEmitter();
  @Output() DeleteGoiEvent = new EventEmitter();
  @Output() DeleteGOIMMSIEvent = new EventEmitter();
  @Output() TrackTrajectoryPointsEvent = new EventEmitter();
  @Output() removeTrackTrajectoryPointsEvent = new EventEmitter();

  ngOnInit(): void {
    this.userId = this.cookieService.get('userid');
    this.soisub = this.Dataservice.SOI.subscribe(message => {
      if (message === 'true') {
        this.trackdetails = [];
        this.trackdetailslength = 0;
        this.soishiptypedeviation = [];
        this.soianchoragedeviation = [];
        // this.SOISelectedEvent.emit('Restart Live Map');
        document.getElementById('Ships of Interest').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted active-background');
        if (document.getElementById('Ships of Interest_name') !== null) {
          document.getElementById('Ships of Interest_name').setAttribute('class', 'active_text');
        }
        if (document.getElementById('Ships of Interest_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Ships of Interest_img').setAttribute('src', '../../../assets/features/selected_features_orange/Ships-of-Interest.svg');
          } else {
            document.getElementById('Ships of Interest_img').setAttribute('src', '../../../assets/features/selected_features_white/Ships-of-Interest.svg');
          }
        }
        if (this.featureSelectedSOI === 'true') {
          this.featureSelectedSOISidenav = !this.featureSelectedSOISidenav;
        } else {
          this.featureSelectedSOISidenav = true;
        }
        this.featureSelectedSOI = 'true';
        this.getSoiShips();
        this.getGoiShips();
        this.UpdatesoiSub = this.Dataservice.updatesoi.subscribe(msg => {
          if (msg === 'update soi details') {
            this.getSoiShips();
          } else if (msg === 'update soi track details') {
            const index = this.soiselectedmmsi.indexOf(Number(this.deletingsoiship));
            this.soiselectedmmsi.splice(index, 1);
            this.selectedsoiships[Number(this.deletingsoiship)] = false;
            this.soiData.forEach((ele, i) => {
              if (Number(ele.msi) === Number(this.deletingsoiship)) {
                this.soiData.splice(i, 1);
              }
            });
            this.Dataservice.changeVesselCount(this.soiData.length);
            this.SOISelectedEvent.emit(this.soiData);
            this.removeSoiTrajectory(this.deletingsoiship);

            // Remove track details when unchecked
            this.trackdetails.forEach((track, i) => {
              if (Number(track.MMSI) === Number(this.deletingsoiship)) {
                this.trackdetails.splice(i, 1);
              }
            });
            this.trackdetailslength = this.trackdetails.length;

            // Remove ship type anomaly details when unchecked
            this.soishiptypedeviation.forEach((typedev, i) => {
              if (Number(typedev.mmsi) === Number(this.deletingsoiship)) {
                this.soishiptypedeviation.splice(i, 1);
              }
            });

            // remove anchorage anomaly detials when unchecked
            this.soianchoragedeviation.forEach((anchordev, i) => {
              if (Number(anchordev.mmsi) === Number(this.deletingsoiship)) {
                this.soianchoragedeviation.splice(i, 1);
              }
            });
            if (this.soiselectedmmsi.length === 0 && this.goiselectedmmsi.length === 0) {
              this.SOISelectedEvent.emit('Restart Live Map');
              if (this.soiplottimerfunction) {
                clearInterval(this.soiplottimerfunction);
              }
            }
            this.selectedsoiships[this.deletingsoiship] = false;
            this.getSoiShips();
          } else if (msg === 'Get All soi and goi ships') {
            if (this.soiplottimerfunction) {
              clearInterval(this.soiplottimerfunction);
            }
            if ((this.cookieService.get('adjustedClock') === 'false' && this.cookieService.get('clockStatus') === 'true')) {
              this.getAllSoiShips(this.cookieService.get('localtime'));
            } else {
              this.callSoiDetailsInLoop();
            }
          }
        });
        this.UpdategoiSub = this.Dataservice.updategoi.subscribe(msg => {
          if (msg === 'update goi details') {
            this.getGoiShips();
          } else if (msg === 'update goi track details') {
            this.removeGoiTrajectory(this.deletinggoiship);
            this.selectedgoi[this.deletinggoiship] = false;
            this.selectedgoiships[this.deletinggoiship] = false;
            const index = this.goiselected.indexOf(this.deletinggoiship);
            if (index > -1) {
              this.goiselected.splice(index, 1);
            }
            this.goi.forEach(g => {
              if (g.Group_ID === this.deletinggoiship) {
                g.group_details.forEach(gd => {
                  const index2 = this.goiselectedmmsi.indexOf(gd.mmsi);
                  if (index2 > -1) {
                    this.goiselectedmmsi.splice(index2, 1);
                  }
                  const index3 = this.goiselectedmmsiwithgrp.indexOf(gd.mmsi + '_' + this.deletinggoiship);
                  if (index3 > -1) {
                    this.goiselectedmmsiwithgrp.splice(index3, 1);
                  }
                  this.soiData.forEach((s, i) => {
                    if (gd.mmsi === s.msi) {
                      this.soiData.splice(i, 1);
                    }
                  });
                });
                this.Dataservice.changeVesselCount(this.soiData.length);
                this.SOISelectedEvent.emit(this.soiData);
              }
            });

            this.goitrackdetails.forEach((gid, i) => {
              if (gid.group_name === this.deletinggoiship) {
                this.goitrackdetails.splice(i, 1);
              }
            });
            this.goitrackdetailslength = this.goitrackdetails.length;

            this.goishiptypedeviation.forEach((gid, i) => {
              if (gid.group_name === this.deletinggoiship) {
                this.goishiptypedeviation.splice(i, 1);
              }
            });

            this.goianchoragedeviation.forEach((gid, i) => {
              if (gid.group_name === this.deletinggoiship) {
                this.goianchoragedeviation.splice(i, 1);
              }
            });

            if (this.soiselectedmmsi.length === 0 && this.goiselectedmmsi.length === 0) {
              this.SOISelectedEvent.emit('Restart Live Map');
              if (this.soiplottimerfunction) {
                clearInterval(this.soiplottimerfunction);
              }
            }
          } else if (msg === 'update goi track details for mmsi') {
            this.removeGoiTrajectoryForShip(this.deletingmmsiofgoiship, this.deletingmmsiofgoi);
            const index = this.goiselected.indexOf(this.deletingmmsiofgoiship);
            this.goiselected.splice(index, 1);
            const index2 = this.goiselectedmmsi.indexOf(this.deletingmmsiofgoi);
            if (index2 > -1) {
              this.goiselectedmmsi.splice(index2, 1);
            }
            const index3 = this.goiselectedmmsiwithgrp.indexOf(this.deletingmmsiofgoi + '_' + this.deletingmmsiofgoiship);
            if (index3 > -1) {
              this.goiselectedmmsiwithgrp.splice(index3, 1);
            }
            this.goi.forEach(g => {
              if (g.Group_ID === this.deletingmmsiofgoiship) {
                this.soiData.forEach((s, i) => {
                  if (this.deletingmmsiofgoi === s.msi) {
                    this.soiData.splice(i, 1);
                  }
                });
                this.Dataservice.changeVesselCount(this.soiData.length);
                this.SOISelectedEvent.emit(this.soiData);
              }
            });

            this.goitrackdetails.forEach(grp => {
              if (this.deletingmmsiofgoiship === grp.group_name) {
                grp.traj_data.forEach((mmsi, i) => {
                  if (Number(this.deletingmmsiofgoi) === mmsi.MMSI) {
                    grp.traj_data.splice(i, 1);
                  }
                });
              }
            });

            this.goishiptypedeviation.forEach(grp => {
              if (this.deletingmmsiofgoiship === grp.group_name) {
                grp.type_anomaly.forEach((mmsi, i) => {
                  if (Number(this.deletingmmsiofgoi) === mmsi.mmsi) {
                    grp.type_anomaly.splice(i, 1);
                  }
                });
              }
            });

            this.goianchoragedeviation.forEach(grp => {
              if (this.deletingmmsiofgoiship === grp.group_name) {
                grp.anch_anomaly.forEach((mmsi, i) => {
                  if (Number(this.deletingmmsiofgoi) === mmsi.mmsi) {
                    grp.anch_anomaly.splice(i, 1);
                  }
                });
              }
            });
          }
        });
      } else if (message === 'false') {
        // cleaning soi
        if (this.soiplottimerfunction) {
          clearInterval(this.soiplottimerfunction);
        }

        this.featureSelectedSOI = 'false';
        this.featureSelectedSOISidenav = false;
        document.getElementById('Ships of Interest').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted');
        if (document.getElementById('Ships of Interest_name') !== null) {
          document.getElementById('Ships of Interest_name').setAttribute('class', '');
        }
        if (document.getElementById('Ships of Interest_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Ships of Interest_img').setAttribute('src', '../../../assets/features/blue_features/Ships-of-Interest.svg');
          } else {
            document.getElementById('Ships of Interest_img').setAttribute('src', '../../../assets/features/Ships-of-Interest.svg');
          }
        }
        const allmmsi = this.soiselectedmmsi;
        allmmsi.forEach(mmsi => {
          this.removeSoiTrajectory(mmsi.toString());
        });
        this.trackdetails = [];
        this.trackdetailslength = 0;
        this.soishiptypedeviation = [];
        this.soianchoragedeviation = [];
        this.soiselectedmmsi = [];
        this.selectedsoiships = [];
        //  cleaning goi
        const allgrp = this.goiselected;
        allgrp.forEach(grp => {
          this.removeGoiTrajectory(grp);
        });
        this.selectedgoi = [];
        this.selectedgoiships = [];
        this.goiselected = [];
        this.goiselectedmmsi = [];
        this.goiselectedmmsiwithgrp = [];
        this.goitrackdetails = [];
        this.goitrackdetailslength = 0;
        this.goishiptypedeviation = [];
        this.goianchoragedeviation = [];
      }
    });
  }

  /* Get SoI details for user
  Method type: Get.
  Request Parameters: userid
  Expected response: List of SoI for that user.
  Process: Success- Ship details which comes has response is stored in variable(getSOI).
           Failure or error- Error message is displayed on the top. */
  getSoiShips(): void {
    this.setSOIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get soi ships in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    this.trackdetails = [];
    this.trackdetailslength = 0;
    this.soishiptypedeviation = [];
    this.soianchoragedeviation = [];
    this.service.getSoIDetailsForUser(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.setSOIwaitState(false);
        this.getSOI = result.data;
        // this.getSOI.forEach(mmsi => {
        //   if (mmsi.flag === 1) {
        //     this.soiselectedmmsi.push(Number(mmsi.mmsi));
        //     this.selectedsoiships[mmsi.mmsi] = true;
        //     this.soiTrackInfoForsingleMMSI(mmsi.mmsi);
        //   }
        // });
        if (this.soiselectedmmsi.length === 0) {
          this.SOISelectedEvent.emit('Restart Live Map');
        }
        if (this.soiselectedmmsi.length !== 0) {
          this.SOISelectedEvent.emit('Stop Live Map');
          this.getAllSoiShips(this.cookieService.get('localtime'));

          if ((this.cookieService.get('adjustedClock') === 'false' && this.cookieService.get('clockStatus') === 'true')) {
            return;
          } else {
            if (this.soiplottimerfunction) {
              clearInterval(this.soiplottimerfunction);
            }
            this.callSoiDetailsInLoop();
          }

        }
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Delete Ship of interest ships
  deleteSoI(data): void {
    this.deletingsoiship = data.mmsi;
    this.DeleteSOIEvent.emit(data);
  }

  /* Get details of selected ships in SOI(checkbox)
  Method type: Post.
  Request Parameters: localtime, userid, mmsi, flag
  Expected response: List of SoI for that user.
  Process: Success- Details which comes has response is stored in variable(soiData).
          Failure or error- Error message is displayed on the top. */
  getDetailsForSelectedShipInSoi(e:any): void {
    const startDate = new Date();
    const functionName = 'Get deatils for soi selected ships in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      // update check or uncheck status
      // this.updateSoiCheckOrUncheckStatus(Number(e.target.value), 1);
      this.soiselectedmmsi.push(Number(e.target.value));
      this.selectedsoiships[e.target.value] = true;
      this.soiplotshipapiflag = this.soiplotshipapiflag + 1;
      const reqdata = {
        timestamp: this.cookieService.get('localtime'), userid: this.userId,
        mmsilist: [e.target.value], flag: this.soiplotshipapiflag
      };
      this.setSOIwaitState(true);
      this.service.getSelectedSoIDetails(reqdata).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.setSOIwaitState(false);
            if (data.data[0] !== undefined) {
              this.soiData.push(data.data[0]);
            }
            this.cookieService.set('localtime', data.timestamp);
            this.Dataservice.changeVesselCount(this.soiData.length);
            this.digitaldate = formatDate(data.timestamp, 'dd/MM/yyyy', 'en-US');
            this.digitaltime = formatDate(data.timestamp, 'HH:mm:ss', 'en-US');
            document.getElementById('digitaldate').innerHTML = this.digitaldate;
            document.getElementById('digitaltime').innerHTML = this.digitaltime;
            this.SOISelectedEvent.emit('Stop Live Map');
            this.SOISelectedEvent.emit(this.soiData);
            this.soiTrackInfoForsingleMMSI(e.target.value);
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(functionName + ' success', seconds);
          }
        },
        (error) => {
          this.setSOIwaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      );
      if ((this.cookieService.get('adjustedClock') === 'false' && this.cookieService.get('clockStatus') === 'true')) {
        return;
      } else {
        if (this.soiplottimerfunction) {
          clearInterval(this.soiplottimerfunction);
        }
        this.callSoiDetailsInLoop();
      }
    } else {
      // update check or uncheck status
      // this.updateSoiCheckOrUncheckStatus(Number(e.target.value), 0);
      const index = this.soiselectedmmsi.indexOf(Number(e.target.value));
      this.soiselectedmmsi.splice(index, 1);
      this.selectedsoiships[e.target.value] = false;
      this.soiData.forEach((ele, i) => {
        if (ele.msi.toString() === e.target.value) {
          this.soiData.splice(i, 1);
        }
      });
      this.Dataservice.changeVesselCount(this.soiData.length);
      this.SOISelectedEvent.emit('Stop Live Map');
      this.SOISelectedEvent.emit(this.soiData);
      this.removeSoiTrajectory(e.target.value);

      // Remove track details when unchecked
      this.trackdetails.forEach((track, i) => {
        if (track.MMSI === e.target.value) {
          this.trackdetails.splice(i, 1);
        }
      });
      this.trackdetailslength = this.trackdetails.length;

      // Remove ship type anomaly details when unchecked
      this.soishiptypedeviation.forEach((typedev, i) => {
        if (typedev.mmsi === e.target.value) {
          this.soishiptypedeviation.splice(i, 1);
        }
      });

      // remove anchorage anomaly detials when unchecked
      this.soianchoragedeviation.forEach((anchordev, i) => {
        if (anchordev.mmsi === e.target.value) {
          this.soianchoragedeviation.splice(i, 1);
        }
      });
      if (this.soiselectedmmsi.length === 0 && this.goiselectedmmsi.length === 0) {
        this.SOISelectedEvent.emit('Restart Live Map');
        if (this.soiplottimerfunction) {
          clearInterval(this.soiplottimerfunction);
        }
      }
    }
  }

  // Update soi checked or unchecked status
  // updateSoiCheckOrUncheckStatus(selectedmmsi, status): void {
  //   const startDate = new Date();
  //   const functionName = 'Update soi checked or unchecked in ship of interest';
  //   this.functionservice.functionCallLogging(functionName);
  //   this.loginStatus = this.cookieService.get('loginStatus');
  //   if (this.loginStatus === 'true') {
  //     const reqData = { userid: this.userId, mmsi: selectedmmsi, flag: status };
  //     this.service.checkOrUncheckSoI(reqData).subscribe(
  //       (data) => {
  //         if (data.status === 'success') {
  //           const endDate = new Date();
  //           const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  //           this.functionservice.successLogging(functionName + ' success', seconds);
  //         }
  //       },
  //       (error) => {
  //         const endDate = new Date();
  //         const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  //         this.functionservice.PostErrorCond(error, functionName, seconds);
  //       }
  //     );
  //   }
  // }

  // Calling soi and goi ship in loop
  callSoiDetailsInLoop(): void {
    const refreshAt = Number(this.cookieService.get('refreshrate')) * 1000;
    this.soiplottimerfunction = setInterval(() => {
      const adjustedClock = this.cookieService.get('adjustedClock');
      if (adjustedClock === 'true') {
        const calibreateddatetime = this.cookieService.get('localtime');
        this.getAllSoiShips(calibreateddatetime);
      } else {
        const localtime = this.cookieService.get('localtime');
        const speed = this.cookieService.get('speed');
        const calibreateddatetime = this.functionservice.getCalibratedTime(localtime, speed, refreshAt);
        this.getAllSoiShips(calibreateddatetime);
      }
    }, refreshAt);
  }

  /* get all soi and goi ships data
  Method type: Get.
  Request Parameters: localtime, userid, mmsi, flag
  Expected response: List of SoI and GoI data.
  Process: Success- Details which comes has response is stored in variable(soiData).
           Failure or error- Error message is displayed on the top. */
  getAllSoiShips(time): void {
    this.setSOIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get selected soi ship details in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    this.soiData = [];
    const mmsiList = [];
    this.soiplotshipapiflag = this.soiplotshipapiflag + 1;
    this.soiselectedmmsi.forEach(mmsi => {
      mmsiList.push(mmsi);
    });
    this.goiselectedmmsi.forEach(mmsi => {
      mmsiList.push(mmsi);
    });
    const reqdata = { timestamp: time, userid: this.userId, mmsilist: mmsiList, flag: this.soiplotshipapiflag };
    this.service.getSelectedSoIDetails(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.setSOIwaitState(false);
          if (data.data.length !== 0) {
            data.data.forEach(m => {
              this.soiData.push(m);
            });
          }

          this.cookieService.set('localtime', data.timestamp);
          this.Dataservice.changeVesselCount(this.soiData.length);
          this.digitaldate = formatDate(data.timestamp, 'dd/MM/yyyy', 'en-US');
          this.digitaltime = formatDate(data.timestamp, 'HH:mm:ss', 'en-US');
          document.getElementById('digitaldate').innerHTML = this.digitaldate;
          document.getElementById('digitaltime').innerHTML = this.digitaltime;
          this.SOISelectedEvent.emit('Stop Live Map');
          this.SOISelectedEvent.emit(this.soiData);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Soi track info details for single mmsi
  soiTrackInfoForsingleMMSI(receivedMMSI): void {
    this.setSOIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get soi track info for selected ship in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    let shipname;
    this.getSOI.forEach(shipmmsi => {
      if (shipmmsi.mmsi === receivedMMSI) {
        shipname = shipmmsi.name;
      }
    });
    const trackinfo = { mmsi: receivedMMSI, timestamp: this.cookieService.get('localtime'), userid: this.userId };
    this.service.soiTrackInfo(trackinfo).subscribe(
      (result) => {
        if (result.status === 'success') {
          this.setSOIwaitState(false);
          // for track info
          result.traj_data.Ship_name = shipname;
          result.traj_data.detailslength = result.traj_data.traj_details.length;
          result.traj_data.traj_details.forEach(tj => {
            tj.ATD_act = tj.ATD;
            tj.ETA_act = tj.ETA;
            tj.ATD = formatDate(tj.ATD, 'dd-MM-yyyy, hh:mm a', 'en-US');
            tj.ETA = formatDate(tj.ETA, 'dd-MM-yyyy, hh:mm a', 'en-US');
            tj.src_points = '../../../assets/soi/switch-offf.svg';
            tj.value_points = 'false';
            if (this.showtracjectorymmsi.includes(result.traj_data.MMSI) === true &&
              this.showtracjectorytrajid.includes(tj.traj_id)) {
              tj.src = '../../../assets/soi/switch-on.svg';
              tj.value = 'true';
            } else {
              tj.src = '../../../assets/soi/switch-offf.svg';
              tj.value = 'false';
            }

          });
          this.trackdetails.push(result.traj_data);
          this.trackdetailslength = this.trackdetails.length;

          // For ship type deviation
          result.type_anomaly.Ship_name = shipname;
          result.type_anomaly.detailslength = result.type_anomaly.type_anomalies.length;
          result.type_anomaly.type_anomalies.forEach(traj => {
            traj.ATD_act = traj.ATD;
            traj.ETA_act = traj.ETA;
            traj.ATD = new Date(traj.ATD);
            traj.ETA = new Date(traj.ETA);
            if (this.shiptypedeviationtrajmmsi.includes(result.type_anomaly.mmsi) === true &&
              this.shiptypedeviationtrajid.includes(traj.tj)) {
              traj.src = '../../../assets/soi/switch-on.svg';
              traj.value = 'true';
            } else {
              traj.src = '../../../assets/soi/switch-offf.svg';
              traj.value = 'false';
            }
            const totalTimeTravelled = Math.abs(traj.ETA - traj.ATD);
            traj.an.forEach((anomaly, i) => {
              anomaly.tm = new Date(anomaly.tm);
              const anomalyTimeFromStartTime = Math.abs(anomaly.tm - traj.ATD);
              anomaly.percentage = (anomalyTimeFromStartTime / totalTimeTravelled) * 100;
              if (i > 0) {
                const diff = Math.abs(anomaly.percentage - traj.an[i - 1].percentage);
                if (diff < 2) {
                  anomaly.percentage += 2;
                }
              }
              if (anomaly.percentage >= 98) {
                anomaly.percentage = 96;
              }
              anomaly.message = 'Change from ' + anomaly.pt + ' to ' + anomaly.ct;
            });

            traj.ATD = formatDate(traj.ATD, 'dd-MM-yyyy, hh:mm a', 'en-US');
            traj.ETA = formatDate(traj.ETA, 'dd-MM-yyyy, hh:mm a', 'en-US');
          });
          this.soishiptypedeviation.push(result.type_anomaly);
          // For anchorage deviation
          result.anch_anomaly.Ship_name = shipname;
          result.anch_anomaly.detailslength = result.anch_anomaly.anch_anomalies.length;
          result.anch_anomaly.anch_anomalies.forEach(traj => {
            traj.ATD_act = traj.ATD;
            traj.ETA_act = traj.ETA;
            traj.ATD = new Date(traj.ATD);
            traj.ETA = new Date(traj.ETA);
            if (this.soianchoragedeviationtrajmmsi.includes(result.anch_anomaly.mmsi) === true &&
              this.soianchoragedeviationtrajid.includes(traj.tj)) {
              traj.src = '../../../assets/soi/switch-on.svg';
              traj.value = 'true';
            } else {
              traj.src = '../../../assets/soi/switch-offf.svg';
              traj.value = 'false';
            }
            const totalTimeTravelled = Math.abs(traj.ETA - traj.ATD);
            traj.an.forEach((anomaly, i) => {
              anomaly.tm = new Date(anomaly.tm);
              const anomalyTimeFromStartTime = Math.abs(anomaly.tm - traj.ATD);
              anomaly.percentage = (anomalyTimeFromStartTime / totalTimeTravelled) * 100;
              if (i > 0) {
                const diff = Math.abs(anomaly.percentage - traj.an[i - 1].percentage);
                if (diff < 2) {
                  anomaly.percentage += 2;
                }
              }
              if (anomaly.percentage >= 98) {
                anomaly.percentage = 96;
              }
              anomaly.message = 'Unknown Anchorage';
            });
            traj.ATD = formatDate(traj.ATD, 'dd-MM-yyyy, hh:mm a', 'en-US');
            traj.ETA = formatDate(traj.ETA, 'dd-MM-yyyy, hh:mm a', 'en-US');
          });
          this.soianchoragedeviation.push(result.anch_anomaly);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // show all trajectory
  showAllTrajectory(): void {
    if (document.getElementById('alltrajectory').getAttribute('value') === 'false') {
      document.getElementById('alltrajectory').setAttribute('src', '../../../assets/soi/switch-on.svg');
      document.getElementById('alltrajectory').setAttribute('value', 'true');
      this.trackdetails.forEach(mmsi => {
        mmsi.traj_details.forEach(traj => {
          this.showtracjectorymmsi.push(mmsi.MMSI);
          this.showtracjectorytrajid.push(traj.traj_id);
          document.getElementById(mmsi.MMSI + '_' + traj.traj_id).setAttribute('src', '../../../assets/soi/switch-on.svg');
          document.getElementById(mmsi.MMSI + '_' + traj.traj_id).setAttribute('value', 'true');
        });
      });
      const showtrajectoryData = {
        localtime: this.cookieService.get('localtime'), mmsi: this.showtracjectorymmsi,
        traj_id: this.showtracjectorytrajid, userid: this.userId
      };
      if (this.showtracjectorymmsi.length > 0) {
        this.getShipTrack(showtrajectoryData, 'track', '');
      }
    }
    else {
      this.allTrajectoryInfo = [];
      this.trajectoryData = [];
      this.showtracjectorymmsi = [];
      this.showtracjectorytrajid = [];
      document.getElementById('alltrajectory').setAttribute('src', '../../../assets/soi/big-Switch.svg');
      document.getElementById('alltrajectory').setAttribute('value', 'false');
      this.trackdetails.forEach(mmsi => {
        mmsi.traj_details.forEach(traj => {
          const layername = mmsi.MMSI + '_' + traj.traj_id;
          document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
          document.getElementById(layername).setAttribute('value', 'false');

          document.getElementById(layername + '_points').setAttribute('src', '../../../assets/soi/switch-offf.svg');
          document.getElementById(layername + '_points').setAttribute('value', 'false');
          this.removeTrackTrajEvent.emit(layername);
        });
      });
    }
  }

  // show trajectory
  showTracjectory(mmsi, trajid): void {
    const mmsiArray = [];
    const trajidArray = [];
    if (document.getElementById(mmsi + '_' + trajid).getAttribute('value') === 'false' ||
      document.getElementById(mmsi + '_' + trajid).getAttribute('value') === null) {
      this.showtracjectorymmsi.push(mmsi);
      this.showtracjectorytrajid.push(trajid);
      mmsiArray.push(mmsi);
      trajidArray.push(trajid);
      document.getElementById(mmsi + '_' + trajid).setAttribute('src', '../../../assets/soi/switch-on.svg');
      document.getElementById(mmsi + '_' + trajid).setAttribute('value', 'true');
      const showtrajectoryData = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajidArray, userid: this.userId
      };
      if (this.showtracjectorymmsi.length > 0) {
        this.getShipTrack(showtrajectoryData, 'track', '');
      }
    } else if (document.getElementById(mmsi + '_' + trajid).getAttribute('value') === 'true') {
      document.getElementById('alltrajectory').setAttribute('src', '../../../assets/soi/big-Switch.svg');
      document.getElementById('alltrajectory').setAttribute('value', 'false');
      this.trajectoryData = [];
      const index = this.showtracjectorymmsi.indexOf(mmsi);
      if (index > -1) {
        this.showtracjectorymmsi.splice(index, 1);
      }
      const index2 = this.showtracjectorytrajid.indexOf(trajid);
      if (index2 > -1) {
        this.showtracjectorytrajid.splice(index2, 1);
      }
      const layername = mmsi + '_' + trajid;
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      document.getElementById(layername).setAttribute('value', 'false');

      document.getElementById(layername + '_points').setAttribute('src', '../../../assets/soi/switch-offf.svg');
      document.getElementById(layername + '_points').setAttribute('value', 'false');

      this.removeTrackTrajEvent.emit(layername);
    }
  }

  // Tracjectory for shiptype deviation
  showShiptypeDeviationTracjectory(selectedmmsi, selectedtj): void {
    if (document.getElementById(selectedmmsi + '_' + selectedtj + '_shiptypedeviation').getAttribute('value') === 'true') {
      const index = this.shiptypedeviationtrajmmsi.indexOf(selectedmmsi);
      if (index > -1) {
        this.shiptypedeviationtrajmmsi.splice(index, 1);
      }
      const index1 = this.shiptypedeviationtrajid.indexOf(selectedtj);
      if (index1 > -1) {
        this.shiptypedeviationtrajid.splice(index1, 1);
      }
      // remove trajectory
      const layername = selectedmmsi + '_' + selectedtj + '_shiptypedeviation';
      document.getElementById(layername).setAttribute('value', 'false');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      this.removeanomalyTrajEvent.emit(layername);

    } else {
      this.shiptypedeviationtrajmmsi.push(selectedmmsi);
      this.shiptypedeviationtrajid.push(selectedtj);
      document.getElementById(selectedmmsi + '_' + selectedtj + '_shiptypedeviation').setAttribute('value', 'true');
      document.getElementById(selectedmmsi + '_' + selectedtj + '_shiptypedeviation').setAttribute('src', '../../../assets/soi/switch-on.svg');
      // show trajctory
      const mmsiArray = [selectedmmsi];
      const trajArray = [selectedtj];
      const shiptypedeviation = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajArray, userid: this.userId
      };
      this.getShipTrack(shiptypedeviation, 'shiptype', '');
      let shiptypeanamolypoints = [];
      this.soishiptypedeviation.forEach(mmsi => {
        if (selectedmmsi === mmsi.mmsi) {
          mmsi.type_anomalies.forEach(points => {
            if (selectedtj === points.tj) {
              points.an.mmsi = selectedmmsi;
              points.an.tj = selectedtj;
              shiptypeanamolypoints = points.an;
            }
          });
        }
      });
      this.shiptypedeviaitontrajanomalyEvent.emit(shiptypeanamolypoints);
    }
  }

  // trajectory for anchorage anomaly
  showAnchorageAnomalyTracjectory(selectedmmsi, selectedtj): void {
    const layername = selectedmmsi + '_' + selectedtj + '_anchorageanomaly';
    if (document.getElementById(layername).getAttribute('value') === 'true') {
      const index = this.soianchoragedeviationtrajmmsi.indexOf(selectedmmsi);
      if (index > -1) {
        this.soianchoragedeviationtrajmmsi.splice(index, 1);
      }
      const index1 = this.soianchoragedeviationtrajid.indexOf(selectedtj);
      if (index1 > -1) {
        this.soianchoragedeviationtrajid.splice(index1, 1);
      }

      document.getElementById(layername).setAttribute('value', 'false');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      // remove trajectory
      this.removeanomalyTrajEvent.emit(layername);
    } else {
      this.soianchoragedeviationtrajmmsi.push(selectedmmsi);
      this.soianchoragedeviationtrajid.push(selectedtj);
      document.getElementById(layername).setAttribute('value', 'true');
      document.getElementById(layername).setAttribute('src',
        '../../../assets/soi/switch-on.svg');
      // show trajctory
      const mmsiArray = [selectedmmsi];
      const trajArray = [selectedtj];
      const anchoragedeviation = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajArray, userid: this.userId
      };
      this.getShipTrack(anchoragedeviation, 'anchorage', '');

      let anchorageanamolypoints = [];
      this.soianchoragedeviation.forEach(mmsi => {
        if (selectedmmsi === mmsi.mmsi) {
          mmsi.anch_anomalies.forEach(traj => {
            if (selectedtj === traj.tj) {
              traj.an.mmsi = selectedmmsi;
              traj.an.tj = selectedtj;
              anchorageanamolypoints = traj.an;
            }
          });
        }
      });
      this.anchoageanomalyanomalyEvent.emit(anchorageanamolypoints);
    }
  }

  // Remove soi trajectory
  removeSoiTrajectory(unmmsi): void {

    // removing trajectory and removing mmsi and trajid from trajectory details
    if (this.showtracjectorymmsi.length > 0) {
      const index1 = this.showtracjectorymmsi.indexOf(unmmsi);
      if (index1 > -1) {
        const trackdetails = this.trackdetails;
        trackdetails.forEach(ship => {
          if (ship.MMSI === unmmsi) {
            ship.traj_details.forEach(tj => {
              const index2 = this.showtracjectorymmsi.indexOf(ship.MMSI);
              if (index2 > -1) {
                this.showtracjectorymmsi.splice(index2, 1);
              }
              const index3 = this.showtracjectorytrajid.indexOf(tj.traj_id);
              if (index3 > -1) {
                this.showtracjectorytrajid.splice(index3, 1);
              }
              const layername = ship.MMSI + '_' + tj.traj_id;
              this.removeTrackTrajEvent.emit(layername);
            });
          }
        });
      }
    }

    if (this.shiptypedeviationtrajmmsi.length > 0) {
      const index1 = this.shiptypedeviationtrajmmsi.indexOf(unmmsi);
      if (index1 > -1) {
        const soishiptypedeviation = this.soishiptypedeviation;
        soishiptypedeviation.forEach(ship => {
          if (ship.mmsi === unmmsi) {
            ship.type_anomalies.forEach(tj => {
              const index2 = this.shiptypedeviationtrajmmsi.indexOf(ship.mmsi);
              if (index2 > -1) {
                this.shiptypedeviationtrajmmsi.splice(index2, 1);
              }
              const index3 = this.shiptypedeviationtrajid.indexOf(tj.tj);
              if (index3 > -1) {
                this.shiptypedeviationtrajid.splice(index3, 1);
              }
              const layername = ship.mmsi + '_' + tj.tj + '_shiptypedeviation';
              this.removeanomalyTrajEvent.emit(layername);
            });
          }
        });
      }
    }

    if (this.soianchoragedeviationtrajmmsi.length > 0) {
      const index1 = this.soianchoragedeviationtrajmmsi.indexOf(unmmsi);
      if (index1 > -1) {
        const soianchoragedeviation = this.soianchoragedeviation;
        soianchoragedeviation.forEach(ship => {
          if (ship.mmsi === unmmsi) {
            ship.anch_anomalies.forEach(tj => {
              const index2 = this.soianchoragedeviationtrajmmsi.indexOf(ship.mmsi);
              if (index2 > -1) {
                this.soianchoragedeviationtrajmmsi.splice(index2, 1);
              }
              const index3 = this.soianchoragedeviationtrajid.indexOf(tj.tj);
              if (index3 > -1) {
                this.soianchoragedeviationtrajid.splice(index3, 1);
              }
              const layername = ship.mmsi + '_' + tj.tj + '_anchorageanomaly';
              this.removeanomalyTrajEvent.emit(layername);
            });
          }
        });
      }
    }
  }

  // GOI
  getGoiShips(): void {
    this.setSOIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get goi ships in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    this.service.getGoIDetailsForUser(this.userId).subscribe(result => {
      if (result.status === 'success') {
        this.setSOIwaitState(false);
        this.goi = result.data;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      });
  }

  // Edit group name
  editGoI(gid): void {
    this.EditGOIEvent.emit(gid);
  }

  // Delete ship in a group
  deleteMMSIFromGroup(g, m): void {
    const data = { gid: g, mmsi: m };
    this.deletingmmsiofgoiship = g;
    this.deletingmmsiofgoi = m;
    this.DeleteGOIMMSIEvent.emit(data);
  }

  // Delete group
  deleteGoI(g): void {
    this.deletinggoiship = g.Group_ID;
    this.DeleteGoiEvent.emit(g);
  }

  // Get details for selected group
  getDetailsForselectedGroup(e): void {
    const startDate = new Date();
    const functionName = 'Get details for selected group in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      this.selectedgoi[e.target.id] = true;
      this.selectedgoiships[e.target.id] = true;
      this.goiselected.push(e.target.id);
      const mmsi = [];
      this.goi.forEach(grp => {
        if (grp.Group_ID === e.target.id) {
          grp.group_details.forEach(ship => {
            mmsi.push(ship.mmsi);
            this.goiselectedmmsi.push(ship.mmsi);
            this.goiselectedmmsiwithgrp.push(ship.mmsi + '_' + e.target.id);
          });
        }
      });
      if (mmsi.length !== 0) {
        this.soiplotshipapiflag = this.soiplotshipapiflag + 1;
        const reqdata = {
          timestamp: this.cookieService.get('localtime'), userid: this.userId,
          mmsilist: mmsi, flag: this.soiplotshipapiflag
        };
        this.setSOIwaitState(true);
        this.service.getSelectedSoIDetails(reqdata).subscribe(
          (data) => {
            if (data.status === 'success') {
              this.setSOIwaitState(false);
              if (data.data.length !== 0) {
                data.data.forEach(m => {
                  this.soiData.push(m);
                });
              }
              this.cookieService.set('localtime', data.timestamp);
              this.Dataservice.changeVesselCount(this.soiData.length);
              this.digitaldate = formatDate(data.timestamp, 'dd/MM/yyyy', 'en-US');
              this.digitaltime = formatDate(data.timestamp, 'HH:mm:ss', 'en-US');
              document.getElementById('digitaldate').innerHTML = this.digitaldate;
              document.getElementById('digitaltime').innerHTML = this.digitaltime;
              this.SOISelectedEvent.emit('Stop Live Map');
              this.SOISelectedEvent.emit(this.soiData);
              this.goiTrackInfoForSingleGroup(e.target.id);
              const endDate = new Date();
              const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
              this.functionservice.successLogging(functionName + ' success', seconds);
            }
          },
          (error) => {
            this.setSOIwaitState(false);
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.PostErrorCond(error, functionName, seconds);
          }
        );
        if ((this.cookieService.get('adjustedClock') === 'false' && this.cookieService.get('clockStatus') === 'true')) {
          return;
        } else {
          if (this.soiplottimerfunction) {
            clearInterval(this.soiplottimerfunction);
          }
          this.callSoiDetailsInLoop();
        }
      } else {
        this.goiTrackInfoForSingleGroup(e.target.id);
      }
    }
    else {
      this.selectedgoi[e.target.id] = false;
      this.selectedgoiships[e.target.id] = false;
      const index = this.goiselected.indexOf(e.target.id);
      if (index > -1) {
        this.goiselected.splice(index, 1);
      }

      this.goi.forEach(grp => {
        if (grp.Group_ID === e.target.id) {
          grp.group_details.forEach(ship => {
            const Index = this.goiselectedmmsi.indexOf(ship.mmsi);
            if (Index > -1) {
              this.goiselectedmmsi.splice(Index, 1);
            }
            const Index2 = this.goiselectedmmsiwithgrp.indexOf(ship.mmsi + '_' + e.target.id);
            if (Index2 > -1) {
              this.goiselectedmmsiwithgrp.splice(Index2, 1);
            }

            this.soiData.forEach((s, i) => {
              if (ship.mmsi === s.msi) {
                this.soiData.splice(i, 1);
              }
            });

          });
          this.Dataservice.changeVesselCount(this.soiData.length);
          this.SOISelectedEvent.emit(this.soiData);
        }
      });
      this.removeGoiTrajectory(e.target.id);

      this.goitrackdetails.forEach((gid, i) => {
        if (gid.group_name === e.target.id) {
          this.goitrackdetails.splice(i, 1);
        }
      });
      this.goitrackdetailslength = this.goitrackdetails.length;

      this.goishiptypedeviation.forEach((gid, i) => {
        if (gid.group_name === e.target.id) {
          this.goishiptypedeviation.splice(i, 1);
        }
      });

      this.goianchoragedeviation.forEach((gid, i) => {
        if (gid.group_name === e.target.id) {
          this.goianchoragedeviation.splice(i, 1);
        }
      });
      if (this.soiselectedmmsi.length === 0 && this.goiselectedmmsi.length === 0) {
        this.SOISelectedEvent.emit('Restart Live Map');
        if (this.soiplottimerfunction) {
          clearInterval(this.soiplottimerfunction);
        }
      }
    }
  }

  // get details for selected ship in group
  getDetailsforSelectedShipInGroup(gid, e): void {
    if (e.target.checked) {
      this.goiselectedmmsi.push(e.target.value);
      this.goiselectedmmsiwithgrp.push(e.target.value + '_' + gid);
      this.selectedgoi[gid] = true;
      // this.goiselected.push(gid);
      this.goiselected.forEach(g => {
        if (g !== gid) {
          this.goiselected.push(gid);
        }
      });
      const reqdata = {
        timestamp: this.cookieService.get('localtime'), userid: this.userId,
        mmsilist: [e.target.value], flag: this.soiplotshipapiflag
      };
      this.setSOIwaitState(true);
      const startDate = new Date();
      const functionName = 'Get details for selected mmsi in goi';
      this.service.getSelectedSoIDetails(reqdata).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.setSOIwaitState(false);
            if (data.data.length !== 0) {
              data.data.forEach(m => {
                this.soiData.push(m);
              });
            }
            this.cookieService.set('localtime', data.timestamp);
            this.Dataservice.changeVesselCount(this.soiData.length);
            this.digitaldate = formatDate(data.timestamp, 'dd/MM/yyyy', 'en-US');
            this.digitaltime = formatDate(data.timestamp, 'HH:mm:ss', 'en-US');
            document.getElementById('digitaldate').innerHTML = this.digitaldate;
            document.getElementById('digitaltime').innerHTML = this.digitaltime;
            this.SOISelectedEvent.emit('Stop Live Map');
            this.SOISelectedEvent.emit(this.soiData);
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(functionName + ' success', seconds);
          }
        },
        (error) => {
          this.setSOIwaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      );
      let grpNameStatus = true;
      this.goitrackdetails.forEach(grp => {
        if (gid === grp.group_name) {
          grpNameStatus = false;
        }
      });
      if (this.goitrackdetails.length === 0 || grpNameStatus === true) {
        this.goiTrackInfoForSingleGroup(gid);
        this.goitrackdetails.forEach(grp => {
          if (gid === grp.group_name) {
            grp.traj_data.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.MMSI) {
                mmsi.display = true;
              } else {
                mmsi.display = false;
              }
            });
          }
        });

        this.goishiptypedeviation.forEach(grp => {
          if (gid === grp.group_name) {
            grp.type_anomaly.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.mmsi) {
                mmsi.display = true;
              } else {
                mmsi.display = false;
              }
            });
          }
        });

        this.goianchoragedeviation.forEach(grp => {
          if (gid === grp.group_name) {
            grp.anch_anomaly.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.mmsi) {
                mmsi.display = true;
              } else {
                mmsi.display = false;
              }
            });
          }
        });
      } else {
        this.goitrackdetails.forEach(grp => {
          if (gid === grp.group_name) {
            grp.traj_data.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.MMSI) {
                mmsi.display = true;
              }
            });
          }
        });

        this.goishiptypedeviation.forEach(grp => {
          if (gid === grp.group_name) {
            grp.type_anomaly.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.mmsi) {
                mmsi.display = true;
              }
            });
          }
        });

        this.goianchoragedeviation.forEach(grp => {
          if (gid === grp.group_name) {
            grp.anch_anomaly.forEach(mmsi => {
              if (Number(e.target.value) === mmsi.mmsi) {
                mmsi.display = true;
              }
            });
          }
        });
      }
    } else {
      // this.selectedgoi[gid] = false;
      const index = this.goiselectedmmsi.indexOf(Number(e.target.value));
      if (index > -1) {
        this.goiselectedmmsi.splice(index, 1);
      }

      const Index2 = this.goiselectedmmsiwithgrp.indexOf(e.target.value + '_' + gid);
      if (Index2 > -1) {
        this.goiselectedmmsiwithgrp.splice(Index2, 1);
      }

      this.goi.forEach(g => {
        if (g.Group_ID === gid) {
          this.soiData.forEach((s, i) => {
            if (Number(e.target.value) === s.msi) {
              this.soiData.splice(i, 1);
            }
          });
          this.Dataservice.changeVesselCount(this.soiData.length);
          this.SOISelectedEvent.emit(this.soiData);
        }
      });

      // const index3 = this.goiselected.indexOf(gid);
      // if (index3 > -1) {
      //   this.goiselected.splice(Index2, 1);
      // }

      this.removeGoiTrajectoryForShip(gid, e.target.value);

      this.goitrackdetails.forEach(grp => {
        if (gid === grp.group_name) {
          grp.traj_data.forEach(mmsi => {
            if (Number(e.target.value) === mmsi.MMSI) {
              mmsi.display = false;
            }
          });
        }
      });

      this.goishiptypedeviation.forEach(grp => {
        if (gid === grp.group_name) {
          grp.type_anomaly.forEach(mmsi => {
            if (Number(e.target.value) === mmsi.mmsi) {
              mmsi.display = false;
            }
          });
        }
      });

      this.goianchoragedeviation.forEach(grp => {
        if (gid === grp.group_name) {
          grp.anch_anomaly.forEach(mmsi => {
            if (Number(e.target.value) === mmsi.mmsi) {
              mmsi.display = false;
            }
          });
        }
      });

    }

    // this.GOISelectedEvent.emit(this.goiselectedmmsi);
  }

  // Remove Goi trajectory
  removeGoiTrajectory(gid): void {
    // removing track info tracks
    if (this.showgrptrajectorygid.length > 0) {
      const grpidindex = this.showgrptrajectorygid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              const mmsiindex = this.showgrptracjectorymmsi.indexOf(ship.MMSI);
              if (mmsiindex > -1) {
                ship.traj_details.forEach(traj => {
                  const trajindex = this.showgrptracjectorytrajid.indexOf(traj.traj_id);
                  if (trajindex > -1) {
                    this.showgrptracjectorytrajid.splice(trajindex, 1);
                    this.showgrptracjectorymmsi.splice(mmsiindex, 1);
                    this.showgrptrajectorygid.splice(grpidindex, 1);
                    const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id;
                    this.removeTrackTrajEvent.emit(layername);
                  }
                });
              }
            });
          }
        });
      }
    }
    // removing shiptype deviations tracks
    if (this.goishiptypedeviationtrajgid.length > 0) {
      const grpidindex = this.goishiptypedeviationtrajgid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              const mmsiindex = this.goishiptypedeviationtrajmmsi.indexOf(ship.MMSI);
              if (mmsiindex > -1) {
                ship.traj_details.forEach(traj => {
                  const trajindex = this.goishiptypedeviationtrajid.indexOf(traj.traj_id);
                  if (trajindex > -1) {
                    this.goishiptypedeviationtrajid.splice(trajindex, 1);
                    this.goishiptypedeviationtrajmmsi.splice(mmsiindex, 1);
                    this.goishiptypedeviationtrajgid.splice(grpidindex, 1);
                    const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id + '_goishiptypedeviation';
                    this.removeanomalyTrajEvent.emit(layername);
                  }
                });
              }
            });
          }
        });
      }
    }
    // removing anchorage deviations tracks
    if (this.goianchoragedeviationtrajgid.length > 0) {
      const grpidindex = this.goianchoragedeviationtrajgid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              const mmsiindex = this.goianchoragedeviationtrajmmsi.indexOf(ship.MMSI);
              if (mmsiindex > -1) {
                ship.traj_details.forEach(traj => {
                  const trajindex = this.goianchoragedeviationtrajid.indexOf(traj.traj_id);
                  if (trajindex > -1) {
                    this.goianchoragedeviationtrajid.splice(trajindex, 1);
                    this.goianchoragedeviationtrajmmsi.splice(mmsiindex, 1);
                    this.goianchoragedeviationtrajgid.splice(grpidindex, 1);
                    const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id + '_goianchorageanomaly';
                    this.removeanomalyTrajEvent.emit(layername);
                  }
                });
              }
            });
          }
        });
      }
    }
  }

  removeGoiTrajectoryForShip(gid, msi): void {
    const mmsi = Number(msi);
    // removing track info tracks
    if (this.showgrptrajectorygid.length > 0) {
      const grpidindex = this.showgrptrajectorygid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              if (ship.MMSI === mmsi) {
                const mmsiindex = this.showgrptracjectorymmsi.indexOf(ship.MMSI);
                if (mmsiindex > -1) {
                  ship.traj_details.forEach(traj => {
                    const trajindex = this.showgrptracjectorytrajid.indexOf(traj.traj_id);
                    if (trajindex > -1) {
                      this.showgrptracjectorytrajid.splice(trajindex, 1);
                      this.showgrptracjectorymmsi.splice(mmsiindex, 1);
                      this.showgrptrajectorygid.splice(grpidindex, 1);
                      const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id;
                      this.removeTrackTrajEvent.emit(layername);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
    // removing shiptype deviations tracks
    if (this.goishiptypedeviationtrajgid.length > 0) {
      const grpidindex = this.goishiptypedeviationtrajgid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              if (ship.MMSI === mmsi) {
                const mmsiindex = this.goishiptypedeviationtrajmmsi.indexOf(ship.MMSI);
                if (mmsiindex > -1) {
                  ship.traj_details.forEach(traj => {
                    const trajindex = this.goishiptypedeviationtrajid.indexOf(traj.traj_id);
                    if (trajindex > -1) {
                      this.goishiptypedeviationtrajid.splice(trajindex, 1);
                      this.goishiptypedeviationtrajmmsi.splice(mmsiindex, 1);
                      this.goishiptypedeviationtrajgid.splice(grpidindex, 1);
                      const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id + '_goishiptypedeviation';
                      this.removeanomalyTrajEvent.emit(layername);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }

    // removing anchorage deviations tracks
    if (this.goianchoragedeviationtrajgid.length > 0) {
      const grpidindex = this.goianchoragedeviationtrajgid.indexOf(gid);
      if (grpidindex > -1) {
        this.goitrackdetails.forEach(grp => {
          if (grp.group_name === gid) {
            grp.traj_data.forEach(ship => {
              if (ship.MMSI === mmsi) {
                const mmsiindex = this.goianchoragedeviationtrajmmsi.indexOf(ship.MMSI);
                if (mmsiindex > -1) {
                  ship.traj_details.forEach(traj => {
                    const trajindex = this.goianchoragedeviationtrajid.indexOf(traj.traj_id);
                    if (trajindex > -1) {
                      this.goianchoragedeviationtrajid.splice(trajindex, 1);
                      this.goianchoragedeviationtrajmmsi.splice(mmsiindex, 1);
                      this.goianchoragedeviationtrajgid.splice(grpidindex, 1);
                      const layername = gid + '_' + ship.MMSI + '_' + traj.traj_id + '_goianchorageanomaly';
                      this.removeanomalyTrajEvent.emit(layername);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  }

  // GoI track info for a group
  goiTrackInfoForSingleGroup(gid): void {
    const startDate = new Date();
    const functionName = 'Get track info for selected group in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    const groupMMSIList = [];
    let shipName;
    this.goi.forEach(group => {
      if (gid === group.Group_ID) {
        shipName = group.group_details;
        group.group_details.forEach(mmsi => {
          groupMMSIList.push(mmsi.mmsi);
        });
      }
    });
    this.setSOIwaitState(true);
    const trackinfo = {
      group_name: gid, timestamp: this.cookieService.get('localtime'), userid: this.userId,
      mmsi: groupMMSIList
    };
    this.service.goiTrackInfo(trackinfo).subscribe(
      (result) => {
        if (result.status === 'success') {
          this.setSOIwaitState(false);
          // Track info
          result.traj_data.forEach(ship => {
            shipName.forEach(mmsi => {
              if (ship.MMSI === mmsi.mmsi) {
                ship.Ship_name = mmsi.name;
              }
            });
            const mmsiindex = this.goiselectedmmsiwithgrp.indexOf(ship.MMSI + '_' + gid);
            if (mmsiindex > -1) {
              ship.display = true;
            } else {
              ship.display = false;
            }
            ship.detailslength = ship.traj_details.length;
            ship.traj_details.forEach(traj => {
              traj.ATD_act = traj.ATD;
              traj.ETA_act = traj.ETA;
              traj.ATD = formatDate(traj.ATD, 'dd-MM-yyyy,hh:mm a', 'en-US');
              traj.ETA = formatDate(traj.ETA, 'dd-MM-yyyy,hh:mm a', 'en-US');
              if (this.showgrptrajectorygid.includes(gid) === true &&
                this.showgrptracjectorymmsi.includes(ship.MMSI) === true &&
                this.showgrptracjectorytrajid.includes(traj.traj_id)) {
                traj.src = '../../../assets/soi/switch-on.svg';
                traj.value = 'true';
              } else {
                traj.src = '../../../assets/soi/switch-offf.svg';
                traj.value = 'false';
              }
            });
          });
          this.goitrackdetails.push({ group_name: gid, traj_data: result.traj_data, traj_data_length: result.traj_data.length });
          this.goitrackdetailslength = this.goitrackdetails.length;

          // ship type anomaly
          result.type_anomaly.forEach(ship => {
            shipName.forEach(mmsi => {
              if (ship.mmsi === mmsi.mmsi) {
                ship.Ship_name = mmsi.name;
              }
            });
            const mmsiindex = this.goiselectedmmsiwithgrp.indexOf(ship.mmsi + '_' + gid);
            if (mmsiindex > -1) {
              ship.display = true;
            } else {
              ship.display = false;
            }

            ship.detailslength = ship.type_anomalies.length;
            ship.type_anomalies.forEach(traj => {
              traj.ATD_act = traj.ATD;
              traj.ETA_act = traj.ETA;
              if (this.goishiptypedeviationtrajgid.includes(gid) === true &&
                this.goishiptypedeviationtrajmmsi.includes(ship.mmsi) === true &&
                this.goishiptypedeviationtrajid.includes(traj.tj)) {
                traj.src = '../../../assets/soi/switch-on.svg';
                traj.value = 'true';
              } else {
                traj.src = '../../../assets/soi/switch-offf.svg';
                traj.value = 'false';
              }
              const totalTimeTravelled = Math.abs(traj.ETA - traj.ATD);
              traj.an.forEach((anomaly, i) => {
                anomaly.tm = new Date(formatDate(anomaly.tm, 'dd-MM-yyyy,hh:mm a', 'en-US'));
                const anomalyTimeFromStartTime = Math.abs(anomaly.tm - traj.ATD);
                anomaly.percentage = (anomalyTimeFromStartTime / totalTimeTravelled) * 100;
                if (i > 0) {
                  const diff = Math.abs(anomaly.percentage - traj.an[i - 1].percentage);
                  if (diff < 2) {
                    anomaly.percentage += 2;
                  }
                }
                anomaly.message = 'Change from ' + anomaly.pt + ' to ' + anomaly.ct;
              });
              traj.ATD = formatDate(traj.ATD, 'dd-MM-yyyy,hh:mm a', 'en-US');
              traj.ETA = formatDate(traj.ETA, 'dd-MM-yyyy,hh:mm a', 'en-US');
            });

          });
          this.goishiptypedeviation.push({ group_name: gid, type_anomaly: result.type_anomaly,
                                           type_anomaly_length: result.type_anomaly.length });

          // Anchorage anomaly
          result.anch_anomaly.forEach(ship => {
            shipName.forEach(mmsi => {
              if (ship.mmsi === mmsi.mmsi) {
                ship.Ship_name = mmsi.name;
              }
            });
            const mmsiindex = this.goiselectedmmsiwithgrp.indexOf(ship.mmsi + '_' + gid);
            if (mmsiindex > -1) {
              ship.display = true;
            } else {
              ship.display = false;
            }

            ship.detailslength = ship.anch_anomalies.length;
            ship.anch_anomalies.forEach(traj => {
              if (this.goianchoragedeviationtrajgid.includes(gid) === true &&
                this.goianchoragedeviationtrajmmsi.includes(ship.mmsi) === true &&
                this.goianchoragedeviationtrajid.includes(traj.tj)) {
                traj.src = '../../../assets/soi/switch-on.svg';
                traj.value = 'true';
              } else {
                traj.src = '../../../assets/soi/switch-offf.svg';
                traj.value = 'false';
              }
              traj.ATD_act = traj.ATD;
              traj.ETA_act = traj.ETA;
              traj.ATD = new Date(traj.ATD);
              traj.ETA = new Date(traj.ETA);
              const totalTimeTravelled = Math.abs(traj.ETA - traj.ATD);
              traj.an.forEach((anomaly, i) => {
                anomaly.tm = new Date(anomaly.tm);
                const anomalyTimeFromStartTime = Math.abs(anomaly.tm - traj.ATD);
                anomaly.percentage = (anomalyTimeFromStartTime / totalTimeTravelled) * 100;
                if (i > 0) {
                  const diff = Math.abs(anomaly.percentage - traj.an[i - 1].percentage);
                  if (diff < 2) {
                    anomaly.percentage += 2;
                  }
                }

                if (anomaly.percentage >= 98) {
                  anomaly.percentage = 96;
                }

                anomaly.message = 'Unknown Anchorage';
              });

              traj.ATD = formatDate(traj.ATD, 'dd-MM-yyyy,hh:mm a', 'en-US');
              traj.ETA = formatDate(traj.ETA, 'dd-MM-yyyy,hh:mm a', 'en-US');
            });

          });
          this.goianchoragedeviation.push({ group_name: gid, anch_anomaly: result.anch_anomaly,
                                            anch_anomaly_length: result.anch_anomaly.length });
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // show trajectory for group
  showTracjectoryForGroup(groupID, mmsi, trajid): void {
    const mmsiArray = [];
    const trajidArray = [];
    const layername = groupID + '_' + mmsi + '_' + trajid;
    if (document.getElementById(layername).getAttribute('value') === 'false' ||
      document.getElementById(layername).getAttribute('value') === null) {
      this.showgrptracjectorymmsi.push(mmsi);
      this.showgrptracjectorytrajid.push(trajid);
      this.showgrptrajectorygid.push(groupID);
      mmsiArray.push(mmsi);
      trajidArray.push(trajid);
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-on.svg');
      document.getElementById(layername).setAttribute('value', 'true');
      const showtrajectoryData = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajidArray, userid: this.userId, gid: groupID
      };
      this.getShipTrack(showtrajectoryData, 'track', groupID);
    } else if (document.getElementById(layername).getAttribute('value') === 'true') {
      document.getElementById('alltrajectory').setAttribute('src', '../../../assets/soi/big-Switch.svg');
      document.getElementById('alltrajectory').setAttribute('value', 'false');
      this.trajectoryData = [];
      const index = this.showgrptracjectorymmsi.indexOf(mmsi);
      if (index > -1) {
        this.showgrptracjectorymmsi.splice(index, 1);
      }
      const index2 = this.showgrptracjectorytrajid.indexOf(trajid);
      if (index2 > -1) {
        this.showgrptracjectorytrajid.splice(index2, 1);
      }
      const index3 = this.showgrptrajectorygid.indexOf(groupID);
      if (index3 > -1) {
        this.showgrptrajectorygid.splice(index3, 1);
      }
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      document.getElementById(layername).setAttribute('value', 'false');
      this.removeTrackTrajEvent.emit(layername);
    }
  }

  // show ship type deviaiton traj for a group
  showGoiShiptypeDeviationTracjectory(groupID, mmsi, tj): void {
    const layername = groupID + '_' + mmsi + '_' + tj + '_goishiptypedeviation';
    if (document.getElementById(layername).getAttribute('value') === 'true') {
      const index = this.goishiptypedeviationtrajmmsi.indexOf(mmsi);
      if (index > -1) {
        this.goishiptypedeviationtrajmmsi.splice(index, 1);
      }
      const index1 = this.goishiptypedeviationtrajid.indexOf(tj);
      if (index1 > -1) {
        this.goishiptypedeviationtrajid.splice(index1, 1);
      }
      const index2 = this.goishiptypedeviationtrajgid.indexOf(groupID);
      if (index2 > -1) {
        this.goishiptypedeviationtrajgid.splice(index2, 1);
      }
      document.getElementById(layername).setAttribute('value', 'false');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      // remove trajectory
      this.removeanomalyTrajEvent.emit(layername);
    } else {
      document.getElementById(layername).setAttribute('value', 'true');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-on.svg');
      this.goishiptypedeviationtrajgid.push(groupID);
      this.goishiptypedeviationtrajmmsi.push(mmsi);
      this.goishiptypedeviationtrajid.push(tj);
      // show trajctory
      const mmsiArray = [mmsi];
      const trajArray = [tj];
      const shiptypedeviation = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajArray, userid: this.userId, gid: groupID
      };
      this.getShipTrack(shiptypedeviation, 'shiptype', groupID);
      let goishiptypeanamolypoints = [];
      this.goishiptypedeviation.forEach(grp => {
        if (groupID === grp.group_name) {
          grp.type_anomaly.forEach(ship => {
            if (mmsi === ship.mmsi) {
              ship.type_anomalies.forEach(traj => {
                if (tj === traj.tj) {
                  const GID = 'gid';
                  const MMSI = 'mmsi';
                  const trajId = 'tj';
                  goishiptypeanamolypoints = traj.an;
                  goishiptypeanamolypoints[GID] = groupID;
                  goishiptypeanamolypoints[MMSI] = mmsi;
                  goishiptypeanamolypoints[trajId] = tj;
                }
              });
            }
          });
        }
      });
      this.shiptypedeviaitontrajanomalyEvent.emit(goishiptypeanamolypoints);
    }
  }

  // Show Goi anchorage anomaly trajectory
  showGoiAnchorageanomalyTracjectory(groupID, mmsi, tj): void {
    const layername = groupID + '_' + mmsi + '_' + tj + '_goianchorageanomaly';
    if (document.getElementById(layername).getAttribute('value') === 'true') {
      const index = this.goianchoragedeviationtrajmmsi.indexOf(mmsi);
      if (index > -1) {
        this.goianchoragedeviationtrajmmsi.splice(index, 1);
      }
      const index1 = this.goianchoragedeviationtrajid.indexOf(tj);
      if (index1 > -1) {
        this.goianchoragedeviationtrajid.splice(index1, 1);
      }
      const index2 = this.goianchoragedeviationtrajgid.indexOf(groupID);
      if (index2 > -1) {
        this.goianchoragedeviationtrajgid.splice(index2, 1);
      }
      document.getElementById(layername).setAttribute('value', 'false');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-offf.svg');
      // remove trajectory
      this.removeanomalyTrajEvent.emit(layername);
    } else {
      document.getElementById(layername).setAttribute('value', 'true');
      document.getElementById(layername).setAttribute('src', '../../../assets/soi/switch-on.svg');
      this.goianchoragedeviationtrajgid.push(groupID);
      this.goianchoragedeviationtrajmmsi.push(mmsi);
      this.goianchoragedeviationtrajid.push(tj);
      // show trajctory
      const mmsiArray = [mmsi];
      const trajArray = [tj];
      const anchoragedeviation = {
        localtime: this.cookieService.get('localtime'),
        mmsi: mmsiArray, traj_id: trajArray, userid: this.userId, gid: groupID
      };
      this.getShipTrack(anchoragedeviation, 'anchorage', groupID);
      let goianchorageanamolypoints = [];
      this.goianchoragedeviation.forEach(group => {
        if (groupID === group.group_name) {
          group.anch_anomaly.forEach(ship => {
            if (mmsi === ship.mmsi) {
              ship.anch_anomalies.forEach(traj => {
                if (tj === traj.tj) {
                  const GID = 'gid';
                  const MMSI = 'mmsi';
                  const trajId = 'tj';
                  goianchorageanamolypoints = traj.an;
                  goianchorageanamolypoints[GID] = groupID;
                  goianchorageanamolypoints[MMSI] = mmsi;
                  goianchorageanamolypoints[trajId] = tj;
                }
              });
            }
          });
        }
      });
      this.anchoageanomalyanomalyEvent.emit(goianchorageanamolypoints);
    }
  }
  // END GOI

  // Get ship track
  getShipTrack(reqdata, type, gid): void {
    this.setSOIwaitState(true);
    const startDate = new Date();
    const functionName = 'Get Track details in ship of interest';
    this.functionservice.functionCallLogging(functionName);
    this.service.shipTrack(reqdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          const track = data.data;
          this.allTrajectoryInfo.push(data.data);
          track.gid = gid;
          if (type === 'track') {
            this.TracktrajectoryEvent.emit(track);
          } else if (type === 'shiptype') {
            this.shiptypedeviationtrajectoryEvent.emit(track);
          } else if (type === 'anchorage') {
            this.anchoragedeviationtrajectoryEvent.emit(track);
          }
          this.setSOIwaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setSOIwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Reload soi and goi track info, anomalies
  reloadSoiAndGoiTrackInfo(): void {
    if (this.soiselectedmmsi.length >= 1) {
      this.trackdetails = [];
      // this.trackdetailslength = 0;
      this.soishiptypedeviation = [];
      this.soianchoragedeviation = [];
      this.soiselectedmmsi.forEach(mmsi => {
        this.soiTrackInfoForsingleMMSI(mmsi.toString());
      });
    }
    if (this.goiselected.length >= 1) {
      this.goitrackdetails = [];
      // this.goitrackdetailslength = 0;
      this.goishiptypedeviation = [];
      this.goianchoragedeviation = [];
      this.goiselected.forEach(gid => {
        this.goiTrackInfoForSingleGroup(gid);
      });
    }
  }

  showPointsForTrackTraj(mmsi, trajid): void {
    if (document.getElementById(mmsi + '_' + trajid + '_points').getAttribute('value') === 'true') {
      document.getElementById(mmsi + '_' + trajid + '_points').setAttribute('src', '../../../assets/soi/switch-offf.svg');
      document.getElementById(mmsi + '_' + trajid + '_points').setAttribute('value', 'false');
      const layer = mmsi + '_' + trajid + 'points';
      this.removeTrackTrajectoryPointsEvent.emit(layer);
    } else {
      if (this.allTrajectoryInfo.length === 0) {
        this.TrackTrajectoryPointsEvent.emit('Select respective trajectory');
      } else {
        if (document.getElementById(mmsi + '_' + trajid).getAttribute('value') === 'true') {
          document.getElementById(mmsi + '_' + trajid + '_points').setAttribute('src', '../../../assets/soi/switch-on.svg');
          document.getElementById(mmsi + '_' + trajid + '_points').setAttribute('value', 'true');
          // this.TrackTrajectoryPointsEvent.emit(traj);
          this.allTrajectoryInfo.forEach(traj => {
            traj.forEach(element => {
              if (mmsi === element.msi && trajid === element.id) {
                this.TrackTrajectoryPointsEvent.emit(element);
              }
            });
          });
        } else {
          this.TrackTrajectoryPointsEvent.emit('Select respective trajectory');
        }
      }
    }
  }

  playHistory(mmsi, data): void {
    this.cookieService.set('playhistorymmsi', mmsi);
    this.cookieService.set('playhistorystartTime', data[data.length - 1].ATD_act);
    this.cookieService.set('playhistoryendTime', data[0].ETA_act);
    this.router.navigateByUrl('/Play-History');
  }

  playHistoryForGroup(groupdata, t): void {
    const mmsi = [];
    const starttimeArray = [];
    const endtimeArray = [];
    if (t === 'track') {
      groupdata.forEach( ship => {
        mmsi.push(ship.MMSI);
        if ( ship.traj_details.length !== 0) {
          starttimeArray.push(new Date(ship.traj_details[ship.traj_details.length - 1].ATD_act));
          endtimeArray.push(new Date(ship.traj_details[0].ETA_act));
        }
      });
    } else if (t === 'shiptype') {
      groupdata.forEach( ship => {
        mmsi.push(ship.mmsi);
        if ( ship.type_anomalies.length !== 0) {
          starttimeArray.push(new Date(ship.type_anomalies[ship.type_anomalies.length - 1].ATD_act));
          endtimeArray.push(new Date(ship.type_anomalies[0].ETA_act));
        }
      });
    } else if (t === 'anchorage') {
      groupdata.forEach( ship => {
        mmsi.push(ship.mmsi);
        if ( ship.anch_anomaly.length !== 0) {
          starttimeArray.push(new Date(ship.anch_anomaly[ship.anch_anomaly.length - 1].ATD_act));
          endtimeArray.push(new Date(ship.anch_anomaly[0].ETA_act));
        }
      });
    }
    this.cookieService.set('playhistorymmsi', mmsi.toString());
    if (starttimeArray.length === 0  || endtimeArray.length === 0 ) {
      this.toastr.warning('No trajectories in selected group to play', '', {
        timeOut: 3000,
      });
      return;
    }
    if (starttimeArray.length === 1) {
      this.cookieService.set('playhistorystartTime', starttimeArray[0]);
    } else {
      starttimeArray.sort((date1, date2) => date1 - date2);
      this.cookieService.set('playhistorystartTime', starttimeArray[0]);
    }
    if ( endtimeArray.length === 1 ) {
      this.cookieService.set('playhistoryendtime', endtimeArray[0]);
    } else {
      endtimeArray.sort((date1, date2) => date1 - date2);
      this.cookieService.set('playhistoryendtime', endtimeArray[endtimeArray.length - 1]);
    }
    this.router.navigateByUrl('/Play-History');
  }

  setSOIwaitState(data): void {
    if (data === true) {
      if (document.getElementById('soi-top-pannel') !== null) {
        document.getElementById('soi-top-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('soi-bottom-pannel') !== null) {
        document.getElementById('soi-bottom-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('soi-Overall') !== null) {
        document.getElementById('soi-Overall').setAttribute('style', 'cursor: wait;');
      }
    }
    if (data === false) {
      if (document.getElementById('soi-top-pannel') !== null) {
        document.getElementById('soi-top-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('soi-bottom-pannel') !== null) {
        document.getElementById('soi-bottom-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('soi-Overall') !== null) {
        document.getElementById('soi-Overall').setAttribute('style', 'cursor: default;');
      }
    }
  }
}
