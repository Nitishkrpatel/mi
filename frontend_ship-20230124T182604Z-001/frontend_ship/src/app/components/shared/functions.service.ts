import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceService } from '../shared/service.service';
import { formatDate } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})

export class FunctionService {

constructor(private service: ServiceService, private toastr: ToastrService,
            private router: Router, private cookieService: CookieService) { }

logoutUserFunction(fn): void {
    const startDate = new Date();
    const functionName = fn + ' called logout';
    this.functionCallLogging(functionName);
    const userId = this.cookieService.get('userid');
    const currenttime = new Date();
    const currentdatetime = formatDate(currenttime, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.service.logout(userId, currentdatetime).subscribe((result) => {
        const status = 'status';
        if (result[status] === 'success') {
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.successLogging(functionName + ' success', seconds);
            this.cookieService.delete('loginStatus');
            this.cookieService.delete('roleid');
            this.cookieService.delete('role');
            this.cookieService.delete('name');
            this.cookieService.delete('userid');
            this.cookieService.delete('speed');
            this.cookieService.delete('map');
            this.cookieService.delete('theme');
            this.cookieService.delete('token');

            this.cookieService.delete('localtime');
            this.cookieService.delete('clockStatus');
            this.cookieService.delete('adjustedClock');

            this.cookieService.delete('infoLogging');
            this.cookieService.delete('errorLogging');

            this.router.navigateByUrl('');
        }
    },
        error => {
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.getErrorCond(error, functionName, seconds);
        });
}

getErrorCond(error, functionName, seconds): void {
    if (error.error.status === 'failure' ) {
        this.errorLogging(functionName, error.error.message, seconds);
        this.toastr.warning(error.error.message, '', {
            timeOut: 3000,
        });
    } else if (error.error.status === 'error') {
        this.errorLogging(functionName, error.error.message, seconds);
        this.toastr.warning('Something gone wrong! Please Check', '', {
            timeOut: 3000,
        });
    } else if (error.error.status === 'logout') {
        this.logoutUserFunction(functionName);
    }
    else {
        this.errorLogging(functionName, 'Check Network!', seconds);
        this.toastr.warning('Check Network! ', '', {
            timeOut: 3000,
        });
    }
}

PostErrorCond(error, functionName, seconds): void {
    if (error.status === 'failure') {
        this.errorLogging(functionName, error.message, seconds);
        this.toastr.warning(error.message, '', {
            timeOut: 3000,
        });
    } else if (error.status === 'error') {
        this.errorLogging(functionName, error.message, seconds);
        this.toastr.warning('Something gone wrong! Please Check', '', {
            timeOut: 3000,
        });
    } else if (error.status === 'logout') {
        this.logoutUserFunction(functionName);
    }
    else {
        this.errorLogging(functionName, 'Check Network!', seconds);
        this.toastr.warning('Check Network!', '', {
            timeOut: 3000,
        });
    }
}

getCalibratedTime(time, speed, refreshAt): any {
    let calibreateddatetime;
    const a: Date = new Date(time);
    const speedinms = (Number(speed.replace('x', '')) * refreshAt);
    calibreateddatetime = new Date(a.getTime() + (speedinms));
    calibreateddatetime = formatDate(calibreateddatetime, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    return calibreateddatetime;
}

functionCallLogging(functionName): void {
    const infoLogging = this.cookieService.get('infoLogging');
    if (infoLogging === 'True' ) {
        this.service.logging({
            message: functionName,
            type: 'info'
          }).subscribe(res => {
          });
    }
}

successLogging(functionName, time): void {
    const infoLogging = this.cookieService.get('infoLogging');
    if (infoLogging === 'True' ) {
        this.service.logging({
            message: functionName + ' Time taken - ' + time,
            type: 'info'
          }).subscribe(res => {
          });
    }
}

errorLogging(functionName, errorMsg, time): void {
    const errorLogging = this.cookieService.get('errorLogging');
    if (errorLogging === 'True' ) {
        this.service.logging({
            message: functionName + ' ' + errorMsg + ' Time taken - ' + time,
            type: 'error'
          }).subscribe(res => {
          });
    }
}

}
