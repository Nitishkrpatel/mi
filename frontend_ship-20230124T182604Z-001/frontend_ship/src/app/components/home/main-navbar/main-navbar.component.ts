import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { ServiceService } from '../../shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../../shared/Data.service';
import { FunctionService } from '../../shared/functions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss']
})

export class MainNavbarComponent implements OnInit {
  dashboardstatus: string;
  loginStatus: string;
  userId: string;
  currentURL: string;
  userName: string;
  Role: string;
  adminRole: boolean;
  theme: string;
  adjustedClock: string;
  speed: string;
  clockStatus: boolean;
  adjusted: any;
  localtime: any;
  convertedLocalTime: any;
  digitaldate: string;
  digitaltime: string;
  resetclockStatus = true;
  inputtosettimeflag = false;
  startAt: any;
  value = 'value';
  private themesource = new BehaviorSubject('theme');
  thememessage = this.themesource.asObservable();
  criteriaoptions = [
    { name: 'Ship Name', value: 'Shipname' },
    { name: 'MMSI', value: 'MMSI' },
    { name: 'IMO', value: 'IMO' },
    { name: 'COO', value: 'Coo' },
    { name: 'End Port', value: 'End_port' }
  ];
  selectiondata: Array<object>;
  searchhistory: Array<object>;
  searchedresult: Array<object>;

  navbarinVFSub: Subscription;
  hideSpeed = false;
  hidePlayPause = false;
  hideSetTime = false;
  hideResetTime = false;
  hideplotTime = false;
  hideSearch = false;
  navbarinROISub: Subscription;

  @Output() speedEvent = new EventEmitter<string>();
  @Output() clockstatusEvent = new EventEmitter();
  @Output() localtimeEvent = new EventEmitter<string>();
  @Output() searchedEvent = new EventEmitter<Array<object>>();
  @Output() searchedDataEvent = new EventEmitter<Array<object>>();
  @Output() themeEvent = new EventEmitter<string>();

  constructor(private service: ServiceService, private toastr: ToastrService,
              private router: Router, private cookieService: CookieService, private Dataservice: DataService,
              private functionservice: FunctionService ) { }

  changeThemeForm = new FormGroup({
    userid: new FormControl(),
    theme: new FormControl()
  });

  setSpeedForm = new FormGroup({
    userid: new FormControl(),
    speed: new FormControl()
  });

  setTimeForm = new FormGroup({
    userid: new FormControl(),
    timestamp: new FormControl('', [Validators.required])
  });

  searchForm = new FormGroup({
    localtime: new FormControl(),
    criteria: new FormControl(this.criteriaoptions[0][this.value]),
    search_text: new FormControl(''),
    userid: new FormControl()
  });

  ngOnInit(): void {
    this.loginStatus = this.cookieService.get('loginStatus');
    // if (this.loginStatus === 'true') {
    this.userId = this.cookieService.get('userid');
    this.currentURL = this.router.url;
    this.userName = this.cookieService.get('name');
    this.Role = this.cookieService.get('role');
    const rolearr = this.Role.split(',');
    this.theme = this.cookieService.get('theme');
    this.themeEvent.emit(this.theme);
    this.Dataservice.changetheme(this.theme);
    this.themesource.next(this.theme);
    this.adjustedClock = this.cookieService.get('adjustedClock');
    this.speed = this.cookieService.get('speed');
    this.speedEvent.emit(this.speed);
    rolearr.forEach(role => {
      if (role === 'Admin') {
        this.adminRole = true;
      }
    });
    this.setSpeedForm.setValue({ userid: this.userId, speed: this.speed  });
    this.changeThemeForm.setValue({ userid: this.userId, theme: this.theme });
    this.getClockStatus();

    this.navbarinROISub = this.Dataservice.NavbarInROI.subscribe(msg => {
      this.hideSpeed = msg;
      this.hidePlayPause = msg;
      this.hideSetTime = msg;
      this.hideResetTime = msg;
      this.hideplotTime = msg;
      this.hideSearch = msg;
    });

    this.navbarinVFSub = this.Dataservice.navbarInVF.subscribe(msg => {
      this.hideSpeed = msg;
      this.hidePlayPause = msg;
      this.hideSetTime = msg;
      this.hideResetTime = msg;
      // this.hideplotTime = msg;
      this.hideSearch = msg;
    });

    // }
  }

  // Reloading current url
  reloadCurrentPage(data): void {
    if (this.router.url === '/' + data) {
      location.reload();
    }
  }

  /* Get clock status (play or pause)
  Method type: Post.
  Request Parameters: userid, flag
  Expected response: Clock status Play or Pause.
  Process: Success- Clock status which comes has response is stored in variable(clockStatus)
           Failure or error- Error message is displayed on the top. */
  getClockStatus(): void {
    const startDate = new Date();
    const functionName = 'Get clock status in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    const clockstatusdata = { userid: this.userId, flag: 1 };
    this.service.clockStatus(clockstatusdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.clockStatus = data.data;
          this.clockstatusEvent.emit(this.clockStatus);
          this.getLocaltime();
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

  /* Get users adjusted/local time.
  Method type: Post.
  Request Parameters: userid
  Expected response: Adjusted and plot time
  Process: Success- Adjusted time which comes has response is stored in variable(adjusted)
                    and plot time is stored in variable(localtime).
           Failure or error- Error message is displayed on the top. */
  getLocaltime(): void {
    const startDate = new Date();
    const functionName = 'Get Localtime in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.service.getLocalTime(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        const time = result.data;
        this.adjusted = time.adjusted;
        this.localtime = time.plot;
        this.localtimeEvent.emit(this.localtime);
        this.convertedLocalTime = formatDate(this.adjusted, 'dd-MM-yyyy,hh:mm a', 'en-US');
        this.setTimeForm.setValue({ userid: this.userId, timestamp: this.adjusted });
        this.digitaldate = formatDate(this.localtime, 'dd/MM/yyyy', 'en-US');
        this.digitaltime = formatDate(this.localtime, 'HH:mm:ss', 'en-US');
        if (document.getElementById('digitaldate') !== null) {
          document.getElementById('digitaldate').innerHTML = this.digitaldate;
        }
        if ( document.getElementById('digitaltime') !== null ) {
          document.getElementById('digitaltime').innerHTML = this.digitaltime;
        }
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

  /* Update clock status.
  Method type: Post.
  Request Parameters: userid, flag
  Expected response: Success message.
  Process: Success- Clock status is changed from play to pause / pause to play.
           Failure or error- Error message is displayed on the top. */
  changeClockStatus(): void {
    const startDate = new Date();
    const functionName = 'Change clock status to play or pause in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    const clockstatusdata = { userid: this.userId, pause: !this.clockStatus, flag: 2 };
    this.service.clockStatus(clockstatusdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          let clockstatustext = '';
          if (this.clockStatus === true) {
            clockstatustext = 'play';
          } else if (this.clockStatus === false) {
            clockstatustext = 'paused';
          }
          this.toastr.success('Plot clock is in ' + clockstatustext + ' state. ', '', {
            timeOut: 3000,
          });
          this.getClockStatus();
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

  /* Update user theme
  Method type: Post.
  Request Parameters: userid, theme
  Expected response: Success message with theme.
  Process: Success- Theme data which comes has response is stored in variable(themetext).
           Failure or error- Error message is displayed on the top. */
  changeTheme(): void {
    const startDate = new Date();
    const functionName = 'Change theme in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.loginStatus = this.cookieService.get('loginStatus');
    if (this.loginStatus === 'true') {
      this.changeThemeForm.setValue({ userid: this.userId, theme: this.changeThemeForm.value.theme });
      this.service.updateTheme(this.changeThemeForm.value).subscribe(
        (data) => {
          if (data.status === 'success') {
            let themetext = '';
            if (data.data === 'grey') {
              themetext = 'Grey';
            } else if (data.data === 'navy') {
              themetext = 'Navy';
            }
            this.toastr.success(themetext + ' theme is applied', '', {
              timeOut: 3000,
            });
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(functionName + ' success', seconds);
          }
          this.cookieService.set('theme', data.data);
          this.theme = data.data;
          this.themeEvent.emit(this.theme);
          this.Dataservice.changetheme(this.theme);
          this.ngOnInit();
        },
        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      );
    }
  }

  /* Update clock speed for the user.
  Method type: Post.
  Request Parameters: userid, speed
  Expected response: Clock speed.
  Process: Success- Clock speed which comes has response is stored in variable(speed).
           Failure or error- Error message is displayed on the top. */
  setSpeed(): void {
    const startDate = new Date();
    const functionName = 'Set Speed of the clock in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.loginStatus = this.cookieService.get('loginStatus');
    if (this.loginStatus === 'true') {
      this.setSpeedForm.setValue({ userid: this.userId, speed: this.setSpeedForm.value.speed });
      this.service.updateSpeed(this.setSpeedForm.value).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.toastr.success('Clock speed is set to ' + data.data, '', {
              timeOut: 3000,
            });
            this.cookieService.set('speed', data.data);
            this.speed = this.cookieService.get('speed');
            this.speedEvent.emit(this.speed);
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

  // Open input to set time wwith user is in current time.
  openInputToSetTime(): void {
    this.inputtosettimeflag = !this.inputtosettimeflag;
  }

  /* Set User adjusted time.
  Method type: Post.
  Request Parameters: userid, timestamp, flag
  Expected response: Succcess message
  Process: Success- success message.
           Failure or error- Error message is displayed on the top. */
  setTime(): void {
    const startDate = new Date();
    const functionName = 'Set time in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.loginStatus = this.cookieService.get('loginStatus');
    if (this.loginStatus === 'true' && this.setTimeForm.value.timestamp !== '') {
      this.startAt = new Date(formatDate(this.setTimeForm.value.timestamp, 'yyyy-MM-dd HH:mm:ss', 'en-US'));
      this.setTimeForm.value.timestamp = formatDate(this.setTimeForm.value.timestamp, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      this.setTimeForm.value.timestamp = this.setTimeForm.value.timestamp.toString();
      if (this.adjusted === this.setTimeForm.value.timestamp) {
        return;
      }
      const settimedata = { userid: this.userId, timestamp: this.setTimeForm.value.timestamp, flag: 0 };
      this.service.updateLocalTime(settimedata).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.toastr.success('Adjusted date & time is updated', '', {
              timeOut: 3000,
            });
            this.cookieService.set('adjustedClock', 'false');
            this.inputtosettimeflag = false;
            this.ngOnInit();
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

  /* Reset clock to server time.
  Method type: Post.
  Request Parameters: userid, timestamp, flag.
  Expected response: Success message.
  Process: Success- Success message.
           Failure or error- Error message is displayed on the top. */
  resetTime(): void {
    const startDate = new Date();
    const functionName = 'Reset time to current time in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.startAt = new Date();
    this.loginStatus = this.cookieService.get('loginStatus');
    if (this.loginStatus === 'true') {
      const resetdata = { userid: this.userId, timestamp: '', flag: 1 };
      this.service.updateLocalTime(resetdata).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.toastr.success('Date & time is synced to server time', '', {
              timeOut: 3000,
            });
            this.cookieService.set('adjustedClock', 'true');
            this.ngOnInit();
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

  /* Get search history for the user.
  Method type: Post.
  Request Parameters: userid
  Expected response: Search history.
  Process: Success- Search history which comes has response is stored in variable(searchhistory).
           Failure or error- Error message is displayed on the top. */
  getSearchHistory(): void {
    const startDate = new Date();
    const functionName = 'Get search history in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.service.getSearchHistory(this.userId).subscribe(result => {
      if (result.status === 'success') {
        this.searchhistory = result.data;
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

  // Closing search popup
  closeSearchPopup(): void {
    document.getElementById('popup-search').setAttribute('style', 'display:none');
  }

  // open search popup
  openSearchPopup(): void {
    document.getElementById('popup-search').setAttribute('style', 'display:block');
    const selectedId = this.searchForm.value.criteria;
    document.getElementById(selectedId).setAttribute('class', 'btn btn-dark');
  }

  // Clearing search
  clearSearch(): void {
    document.getElementById('popup-search').setAttribute('style', 'display:none');
    this.selectiondata = [];
    this.searchForm.setValue({
      search_text: '', criteria: this.criteriaoptions[0].value,
      localtime: this.localtime, userid: this.userId
    });
    document.getElementById(this.criteriaoptions[0].value).setAttribute('class', 'btn btn-dark');
    this.criteriaoptions.forEach(ele => {
      if (ele.value === this.criteriaoptions[0].value) {
        document.getElementById(ele.value).setAttribute('class', 'btn btn-dark');
      } else {
        document.getElementById(ele.value).setAttribute('class', 'btn btn-light');
      }
    });
    this.searchedresult = [];
    this.searchedEvent.emit(this.searchedresult);
    this.searchedDataEvent.emit([]);
  }

  /* Get search data.
  Method type: Post.
  Request Parameters: searchtext, criteria, userid, localtime.
  Expected response: Searched data.
  Process: Success- Searched data which comes has response is stored in variable(selectiondata).
           Failure or error- Error message is displayed on the top. */
  onSearchkeyup(): void {
    const startDate = new Date();
    const functionName = 'Get search results in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    document.getElementById('disable-mapevent').setAttribute('style', 'cursor:progress;pointer-events:none');
    document.getElementById('overall').setAttribute('style', 'cursor: wait;');
    this.searchForm.value.userid = this.userId;
    this.searchForm.value.localtime = this.localtime;
    this.service.getSearchOptionsResult(this.searchForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.selectiondata = data.data;
          document.getElementById('disable-mapevent').setAttribute('style', 'cursor:default;');
          document.getElementById('overall').setAttribute('style', 'cursor: default;');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }

      },

      (error) => {
        document.getElementById('disable-mapevent').setAttribute('style', 'cursor:default;');
        document.getElementById('overall').setAttribute('style', 'cursor: default;');
        // this.progressbar = false;
        this.selectiondata = [];
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // selecting search result for search details
  selectOption(value, criteriatype): void {
    this.clearSearch(); // amal
    this.searchForm.setValue({
      search_text: value, criteria: this.searchForm.value.criteria,
      localtime: this.localtime, userid: this.userId
    });
    const searchdata = { search_text: value, criteria: criteriatype, userid: this.userId,
                         localtime: this.localtime };
    document.getElementById('popup-search').setAttribute('style', 'display:none');
    this.getSearchResults(searchdata);
  }

  // Change search criteria
  changeCriteria(name): void {
    this.searchForm.setValue({
      search_text: this.searchForm.value.search_text, criteria: name,
      localtime: this.localtime, userid: this.userId
    });
    document.getElementById(name).setAttribute('class', 'btn btn-dark');
    this.criteriaoptions.forEach(ele => {
        if (ele.value === name) {
        document.getElementById(ele.value).setAttribute('class', 'btn btn-dark');
      } else {
        document.getElementById(ele.value).setAttribute('class', 'btn btn-light');
      }
    });
    if (this.searchForm.value.search_text !== '') {
      this.onSearchkeyup();
    }
  }

  /* Get search results details
  Method type: Post.
  Request Parameters: searchtext, criteria,userid, localtime
  Expected response: Searched result details.
  Process: Success- Searched result details which comes has response is stored in variable(searchedresult).
           Failure or error- Error message is displayed on the top. */
  getSearchResults(searchdata): void {
    const startDate = new Date();
    const functionName = 'Get searched results details in main nav bar';
    this.functionservice.functionCallLogging(functionName);
    this.selectiondata = [];
    this.service.getSearchResult(searchdata).subscribe(
      (result) => {
        if (result.status === 'success') {
          document.getElementById('popup-search').setAttribute('style', 'display:none');
          this.searchedresult = result.data;
          this.searchedEvent.emit(this.searchedresult);
          this.searchedDataEvent.emit(searchdata);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        document.getElementById('popup-search').setAttribute('style', 'display:none');
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  logoutUser(): void {
    this.functionservice.logoutUserFunction('Main Navbar');
  }


  clearUsingBackspace(): void {
    this.searchedresult = [];
    this.searchedEvent.emit(this.searchedresult);
    this.searchedDataEvent.emit([]);
  }

}
