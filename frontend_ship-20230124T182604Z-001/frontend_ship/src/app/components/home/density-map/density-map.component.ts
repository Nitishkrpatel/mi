import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../shared/service.service';
import { FunctionService } from '../../shared/functions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-density-map',
  templateUrl: './density-map.component.html',
  styleUrls: ['./density-map.component.scss']
})
export class DensityMapComponent implements OnInit {

  dmsub: Subscription;
  featureSelectedDM: string;
  featureSelectedDMSidenav: boolean;

  userId: string;
  selectallcat: boolean;
  allCategory = [];
  selectedCategory = [];
  selectedcat = [];

  portData = [];
  topPorts = [];

  constructor(private service: ServiceService, public Dataservice: DataService,
              private cookieService: CookieService, private functionservice: FunctionService) { }

  DurationForm = new FormGroup({
    fromandtodate: new FormControl('')
  });

  @Output() DMSelectedEvent = new EventEmitter();
  @Output() RangeEvent = new EventEmitter();
  @Output() PlotPortEvent = new EventEmitter();
  @Output() PlotDensityEvent = new EventEmitter();
  @Output() PlotDensityShipsEvent = new EventEmitter();

  ngOnInit(): void {

    this.dmsub = this.Dataservice.DM.subscribe(message => {
      if (message === 'true') {
        this.DMSelectedEvent.emit('Restart Live Map');
        this.getRange();
        if ( document.getElementById('Density Map') !== null ) {
          document.getElementById('Density Map').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted active-background');
        }
        if (document.getElementById('Density Map_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Density Map_img').setAttribute('src', '../../../assets/features/selected_features_orange/Density-Map.svg');
          } else {
            document.getElementById('Density Map_img').setAttribute('src', '../../../assets/features/selected_features_white/Density-Map.svg');
          }
        }
        if (document.getElementById('Density Map_name') !== null) {
          document.getElementById('Density Map_name').setAttribute('class', 'active_text');
        }
        if (this.featureSelectedDM === 'true') {
          this.featureSelectedDMSidenav = !this.featureSelectedDMSidenav;
        } else {
          this.featureSelectedDMSidenav = true;
        }
        this.featureSelectedDM = 'true';

      } else if (message === 'false') {
        this.RangeEvent.emit('Remove Range');
        this.featureSelectedDM = 'false';
        this.featureSelectedDMSidenav = false;
        if (document.getElementById('Density Map') !== null ) {
          document.getElementById('Density Map').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted');
        }
        if (document.getElementById('Density Map_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Density Map_img').setAttribute('src', '../../../assets/features/blue_features/Density-Map.svg');
          } else {
            document.getElementById('Density Map_img').setAttribute('src', '../../../assets/features/Density-Map.svg');
          }
        }
        if (document.getElementById('Density Map_name') !== null) {
          document.getElementById('Density Map_name').setAttribute('class', '');
        }
      }
    });
    this.userId = this.cookieService.get('userid');
    this.getAllShipCategories();
  }


  /*  Get Range and colors for the range.
      Method type: Get.
      Request Parameters:
      Expected response: All Ranges and colors for the ranges displayed in density map.
      Process: Success- All ranges and colors which comes as a response is Sent to live map component.
               Failure or error- Error message is displayed on the top. */
  getRange(): void {
    const startDate = new Date();
    const functionName = 'Get range block in density map';
    this.functionservice.functionCallLogging(functionName);
    this.service.getRangeBlock(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.RangeEvent.emit(result.data);
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


  // Switch for showing top ports.
  showtop(): void {
    if (document.getElementById('showtop').getAttribute('value') === 'off') {
      document.getElementById('showtop').setAttribute('value', 'on');
      document.getElementById('showtop').setAttribute('src', '../../../assets/densitymap/switch-on.svg');
      this.getTopNPorts(10);
    } else {
      document.getElementById('showtop').setAttribute('value', 'off');
      document.getElementById('showtop').setAttribute('src', '../../../assets/densitymap/switch-off.svg');
      this.PlotPortEvent.emit('Switch off show top ports');
    }
  }

  /*  Get top 'n' ports
      Method type: Get.
      Request Parameters: n (number for ports to be displayed)
      Expected response: Top 'n' ports with its position.
      Process: Success- Top 'n' ports which comes as a response is displayed on the map.
                Failure or error- Error message is displayed on the top. */
  getTopNPorts(n): void {
    const startDate = new Date();
    const functionName = 'Get top n ports in density map';
    this.functionservice.functionCallLogging(functionName);
    this.service.getTopNPorts(n, this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.portData = result.data;
        this.PlotPortEvent.emit(result.data);
        const ports = [];
        this.portData.forEach(port => {
          ports.push(port.pn);
        });
        this.topPorts = ports;
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


  // select or deselect all categories
  onSelectAllCat(event): void {
    if (event.target.checked === true) {
      this.allCategory.forEach(cat => {
        this.selectedCategory.push(cat.vessel_category);
        this.selectedcat[cat.vessel_category] = true;
      });
      this.selectallcat = true;
    }
    else {
      this.selectedCategory = [];
      this.selectedcat = [];
      this.selectallcat = false;
    }
  }

  /*  Get all ship categories.
      Method type: Get.
      Request Parameters:
      Expected response: All ship categories.
      Process: Success- Ship categories which comes as a response is stored in a variable(allCategory) and displayed in a checkbox.
          Failure or error- Error message is displayed on the top. */
  getAllShipCategories(): void {
    const startDate = new Date();
    const functionName = 'Get all ship categories in density map';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllCategories(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.allCategory = result.data;
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

  // Select or deselect single ship category
  shiptypeCheckboxChange(e): void {
    if (e.target.checked) {
      this.selectedCategory.push(e.target.value);
      this.selectedcat[e.target.value] = true;
    }
    else {
      const index = this.selectedCategory.indexOf(e.target.value);
      if (index > -1) {
        this.selectedCategory.splice(index, 1);
      }
      this.selectedcat[e.target.value] = false;
      this.selectallcat = false;
    }
  }

  /* Get trajectory Data to show density map.
Method type: Post.
Request Parameters: ports, from_date to_date, category.
Expected response: List of trajectories with start and end points and color for the trajectory.
Process: Success- Draw trajectories on the map with respective colors.
          Failure or error- Error message is displayed on the top. */
  showDensity(): void {
    const startDate = new Date();
    const functionName = 'Get density plots in density map';
    this.functionservice.functionCallLogging(functionName);
    this.DMSelectedEvent.emit('Stop Live Map');
    let fromDate = '';
    let toDate = '';
    if (this.DurationForm.value.fromandtodate !== '') {
      fromDate = formatDate(this.DurationForm.value.fromandtodate[0], 'yyyy-MM-dd HH:mm:ss', 'en-US');
      toDate = formatDate(this.DurationForm.value.fromandtodate[1], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    const requestData = {
      ports: this.topPorts,
      from_date: fromDate,
      to_date: toDate,
      category: this.selectedCategory,
      userid: this.userId
    };
    this.service.getDensityMapData(requestData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.PlotDensityEvent.emit(data.data);
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

  /*  Get Last know position of the ship.
      Method type: Post.
      Request Parameters: from_date to_date, category.
      Expected response: Array of ship data.
      Process: Success- plot ships on the map.
                Failure or error- Error message is displayed on the top. */
  getShips(): void {
    const startDate = new Date();
    const functionName = 'Get ships plots in density map';
    this.functionservice.functionCallLogging(functionName);
    let fromDate = '';
    let toDate = '';
    if (this.DurationForm.value.fromandtodate !== '') {
      fromDate = formatDate(this.DurationForm.value.fromandtodate[0], 'yyyy-MM-dd HH:mm:ss', 'en-US');
      toDate = formatDate(this.DurationForm.value.fromandtodate[1], 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    const requestData = {
      ports: this.topPorts,
      from_date: fromDate,
      to_date: toDate,
      category: this.selectedCategory,
      userid: this.userId
    };
    this.service.getDensityMapShipData(requestData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.PlotDensityShipsEvent.emit(data.data);
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


}
