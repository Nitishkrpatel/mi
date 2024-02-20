import { Component, OnInit } from '@angular/core';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
// import { Keepalive } from '@ng-idle/keepalive';
import { ServiceService } from '../app/components/shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { FunctionService } from './components/shared/functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ship2021frontend';

  // idleState = 'Not started.';
  // timedOut = false;
  // lastPing?: Date = null;
  // loginStatus: any;
  // sessiontimeoutTime: any;

  ngOnInit(): void {
    // this.loginStatus = this.cookieService.get('loginStatus');
    this.getconfigparameters();
  }
  // private idle: Idle, private keepalive: Keepalive,
  constructor(private service: ServiceService, private functionservice: FunctionService,
              private cookieService: CookieService) {

  }

  // reset(): void {
  //   this.idle.watch();
  //   this.idleState = 'Started.';
  //   this.timedOut = false;
  // }

  // logoutUser(): void {
  //   this.functionservice.logoutUserFunction();
  // }

  getconfigparameters(): void {
    const startDate = new Date();
    const functionName = 'Get Configuration parameters in App';
    this.functionservice.functionCallLogging(functionName);
    this.service.getConfigparamters().subscribe((result) => {
      if (result.status === 'success') {
        // this.sessiontimeoutTime = Number(result.data.sessionTimeout);
        this.cookieService.set('refreshrate',  result.data.refresh_rate);
        this.cookieService.set('sliderFromYear', result.data.from_year);
        this.cookieService.set('sliderToYear', result.data.to_year);
        this.cookieService.set('sliderMinYear', result.data.min_year);
        this.cookieService.set('sliderMaxYear', result.data.max_year);
        this.cookieService.set('infoLogging', result.data.info_log);
        this.cookieService.set('errorLogging', result.data.error_log);
        // this.starttimer();
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

  // starttimer(): void {
  //   this.loginStatus = this.cookieService.get('loginStatus');
  // if ( this.loginStatus === 'true' ) {
  // sets an idle timeout of 5 seconds, for testing purposes.
  //   this.idle.setIdle(this.sessiontimeoutTime);
   // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
  //   this.idle.setTimeout(10);
     // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
  //   this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  //   this.idle.onIdleEnd.subscribe(() => {
  //     this.idleState = 'No longer idle.';
  //     document.getElementById('closeidlestateModel').click();
  //     this.reset();
  //   });

  //   this.idle.onTimeout.subscribe(() => {
  //     this.idleState = 'Session logged out!';
  //     this.timedOut = true;
  //     this.logoutUser();
  //   });

  //   this.idle.onIdleStart.subscribe(() => {
  //     this.loginStatus = this.cookieService.get('loginStatus');
  //     this.idleState = 'You\'ve gone idle!';
  //     if (this.loginStatus === 'true') {
  //       document.getElementById('openidlestateModel').click();
  //     }
  //      this.childModal.show();
  //   });

  //   this.idle.onTimeoutWarning.subscribe((countdown) => {
  //     this.idleState = 'Your session will logged out in ' + countdown + ' seconds!';
  //   });

  //    sets the ping interval to 15 seconds
  //   this.keepalive.interval(15);

  //   this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

  //   this.reset();
  //   }
  // }
}
