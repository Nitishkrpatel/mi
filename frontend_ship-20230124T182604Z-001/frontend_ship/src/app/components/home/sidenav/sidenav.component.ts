import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';
import { FunctionService } from '../../shared/functions.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {
  isExpanded = false;
  rolefeatures = { features: [], Map: [], layers: [] };
  Roleid: string;
  loginStatus: string;
  userId: string;
  themesub: Subscription;
  theme: string;
  vesselCount: number;
  vesselCountSub: Subscription;
  zoomLevel: number;
  zoomLevelSub: Subscription;
  fullScreen: string;
  collapseNav = true;
  localtime: any;

  @Output() fullscreenEvent = new EventEmitter<string>();
  @Output() rolFeaturesEvent = new EventEmitter();

  constructor(private service: ServiceService,
              private cookieService: CookieService, private Dataservice: DataService,
              private functionservice: FunctionService) { }

  ngOnInit(): void {
    this.Roleid = this.cookieService.get('roleid');
    this.userId = this.cookieService.get('userid');
    this.theme = this.cookieService.get('theme');
    this.getFeatureForRole();
    this.vesselCountSub = this.Dataservice.vesselCount.subscribe(message => {
      this.vesselCount = message;
      this.localtime = this.cookieService.get('localtime');
    });
    this.zoomLevelSub = this.Dataservice.zoomLevel.subscribe(msg => {
      this.zoomLevel = msg;
    });
    this.themesub = this.Dataservice.theme.subscribe(msg => {
      this.theme = msg;
    });
  }

  // Toggle First Sidenav bar
  toggleFirstSidenav(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded === true && this.collapseNav === true) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:475px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'left:200px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;');
    } else if (this.isExpanded === true && this.collapseNav === false) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:200px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'display: none');
    } else if (this.isExpanded === false && this.collapseNav === true) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:350px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'left:75px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;');
    } else if (this.isExpanded === false && this.collapseNav === false) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:75px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'display: none');
    }
  }

  // View fullscreen map
  fullscreen(): void {
    this.fullscreenEvent.emit('yes');
  }

  /* Get features assigned for the user
  Method type: Get.
  Request Parameters: roleid
  Expected response: List of features for the role assigned for that user.
  Process: Success- Details which comes has response is stored in variable(rolefeatures).
           Failure or error- Error message is displayed on the top. */
  getFeatureForRole(): void {
    const startDate = new Date();
    const functionName = 'Get features for role in side navbar';
    this.functionservice.functionCallLogging(functionName);
    this.service.getFeatureForRole(this.Roleid).subscribe(result => {
      if (result.status === 'success') {
        this.rolefeatures = result.data;
        this.rolFeaturesEvent.emit(this.rolefeatures);
        // this.cookieService.set('rolefeatures', JSON.stringify(this.rolefeatures));
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

  // Switching between features
  changeFeature(f): void {
    if (this.isExpanded === true && this.collapseNav === true) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:475px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'left:200px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;');
    } else if (this.isExpanded === true && this.collapseNav === false) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:200px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'display: none');
    } else if (this.isExpanded === false && this.collapseNav === true) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:350px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'left:75px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;');
    } else if (this.isExpanded === false && this.collapseNav === false) {
      document.getElementById('collapse-sidenav').setAttribute('style', 'left:75px;display:block;');
      document.getElementById('secondnavbar').setAttribute('style', 'display: none');
    }

    if (f === 'Ships of Interest') {
      this.Dataservice.changedtoSOI('true');
      this.Dataservice.changedtoROI('false');
      this.Dataservice.changedtoVF('false');
      this.Dataservice.changedtoDM('false');
    } else if (f === 'Region of Interest') {
      this.Dataservice.changedtoSOI('false');
      this.Dataservice.changedtoROI('true');
      this.Dataservice.changedtoVF('false');
      this.Dataservice.changedtoDM('false');
    } else if (f === 'Vessel Filters') {
      this.Dataservice.changedtoSOI('false');
      this.Dataservice.changedtoROI('false');
      this.Dataservice.changedtoVF('true');
      this.Dataservice.changedtoDM('false');
    } else if (f === 'Density Map') {
      this.Dataservice.changedtoSOI('false');
      this.Dataservice.changedtoROI('false');
      this.Dataservice.changedtoVF('false');
      this.Dataservice.changedtoDM('true');
    }
  }

}
