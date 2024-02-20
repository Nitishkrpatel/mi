import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';
import { FunctionService } from '../../shared/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted = false;
  errorMessage: any;
  passwordicon = 'visibility_off';
  loginstatus: any;
  userID = '';

  updateNewUserDetails = false;
  securityquestions = [];
  selectedSecurityQuestion = '';

  updateTempPassword = false;
  updateSubmitted = false;

  theme: string;
  loginForm = new FormGroup({
    userid: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  get f(): any {
    return this.loginForm.controls;
  }

  updateUserDetailsForm = new FormGroup({
    userid: new FormControl(''),
    se_qn: new FormControl(''),
    se_ans: new FormControl(''),
    pwd: new FormControl('', [Validators.minLength(6), Validators.required])
  });

  get u(): any {
    return this.updateUserDetailsForm.controls;
  }

  constructor(
    private service: ServiceService,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private functionservice: FunctionService) { }

  ngOnInit(): void {
    this.loginstatus = this.cookieService.get('loginStatus');
    // If login status is true redirect to ship map page.
    if (this.loginstatus === 'true') {
      this.router.navigateByUrl('/ship-map');
    }
    this.service.setTitle('Login');
  }

  /* User Login.
    Method type: Post.
    Request Parameters: userid, password.
    Expected response: Success message with all initial required data.
    Process: Success- Data which comes as response is stored in cookies. And a model is displayed if the user is in adjusted time.
             Failure or error- Error message is displayed on the top. */
  login(): void {
    const startDate = new Date();
    const functionName = 'Login user in login component';
    this.functionservice.functionCallLogging(functionName);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const currenttime = new Date();
    this.loginForm.value.login = formatDate(currenttime, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.service.userLogin(this.loginForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.userID = data.data.userid;
          // If user is a new user update password and security questions page is shown.
          if (data.data.new_user === 1) {
            this.updateNewUserDetails = true;
            this.updateTempPassword = false;
            this.getAllSecurity();
          } else if (data.data.temp_pwd === true) { // if password is reset by admin, update password page is shown.
            this.updateNewUserDetails = false;
            this.updateTempPassword = true;
          } else { // Login
            this.cookieService.set('loginStatus', 'true');
            this.cookieService.set('token', data.data.token);
            this.cookieService.set('roleid', data.data.roleid);
            this.cookieService.set('role', data.data.role);
            this.cookieService.set('name', data.data.name);
            this.cookieService.set('userid', data.data.userid);
            this.cookieService.set('speed', data.data.speed);
            this.cookieService.set('map', data.data.map);
            this.cookieService.set('theme', data.data.theme);
            this.theme = data.data.theme;
            if (data.data.time_flag === false) {
              document.getElementById('adjustedModel').click();
            } else if (data.data.time_flag === null) {
              this.cookieService.set('adjustedClock', 'true');
              this.router.navigateByUrl('/ship-map');
            } else {
              this.cookieService.set('adjustedClock', 'true');
              this.router.navigateByUrl('/ship-map');
            }
            this.cookieService.set('shipColors', JSON.stringify(data.data.ship_color));
          }

          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === 'failure') {
          this.errorMessage = error.message;
          this.setTimeoutFunction();
          this.functionservice.errorLogging(functionName, error.message, seconds);
        } else {
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      }
    );
  }

  // Show alert message and set timeout for that alert message.
  setTimeoutFunction(): void {
    document.getElementById('alert-message').style.display = 'block';
    setTimeout(() => {
      document.getElementById('alert-message').style.display = 'none';
    }, 5000);
  }

  // To toggle type of input(password) to text or password.
  showPassword(): void {
    const inputType = document.getElementById('password').getAttribute('type');
    if (inputType === 'password') {
      document.getElementById('password').setAttribute('type', 'text');
      this.passwordicon = 'visibility';
    } else if (inputType === 'text') {
      document.getElementById('password').setAttribute('type', 'password');
      this.passwordicon = 'visibility_off';
    }
  }

  // reset to current time (on clock of no in the model)
  resetToCurrentTime(): void {
    this.cookieService.set('adjustedClock', 'true');
    this.changeClockStatus();
  }

  // Continue and login (on click of yes in the model)
  continueInAdjustedTime(): void {
    this.cookieService.set('adjustedClock', 'false');
    this.toastr.success('You are in adjusted time ', '', {
      timeOut: 3000,
    });
    this.router.navigateByUrl('/ship-map');
  }

  /* Reset clock status to play when user clicks on NO.
  Method type: Post.
  Request Parameters: userid, pause, flag.
  Expected response: Success message.
  Process: Success- Reset time to current time.
            Failure or error- Error message is displayed on the top. */
  changeClockStatus(): void {
    const startDate = new Date();
    const functionName = 'Change clock status to play in login';
    this.functionservice.functionCallLogging(functionName);
    const clockstatusdata = { userid: this.userID, pause: false, flag: 2 };
    this.service.clockStatus(clockstatusdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.resetTime();
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

  /* Reset time to current time.
  Method type: Post.
  Request Parameters: userid, timestamp, flag.
  Expected response: Success message.
  Process: Success- Success message is shown and user is routed to ship map page.
            Failure or error- Error message is displayed on the top. */
  resetTime(): void {
    const startDate = new Date();
    const functionName = 'Reset adjusted time to current time in login';
    this.functionservice.functionCallLogging(functionName);
    const resettimedata = { userid: this.userID, timestamp: '', flag: 1 };
    this.service.updateLocalTime(resettimedata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('Date & time is synced to server time', '', {
            timeOut: 3000,
          });
          document.getElementById('closerestingmodelbutton').click();
          this.router.navigateByUrl('/ship-map');
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


  /* Get all security questions
  Method type: Get.
  Request Parameters:
  Expected response: All security questions.
  Process: Success- Security questions which comes as a response is stored in a
                    variable(securityquestions) and first question is marked as selected.
           Failure or error- Error message is displayed on the top. */
  getAllSecurity(): void {
    const startDate = new Date();
    const functionName = 'Get all security question in register component';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllSecurityQuestions().subscribe((result) => {
      if (result.status === 'success') {
        this.securityquestions = result.data;
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

  // Disable other input boxes when one input box is focused in security question form.
  disableOtherInputs(id): void {
    this.updateUserDetailsForm.setValue({
      userid: this.userID, se_qn: '',
      se_ans: '',
      pwd: this.updateUserDetailsForm.value.pwd
    });
    for (let i = 0; i < this.securityquestions.length; i++) {
      if (i !== id) {
        document.getElementById('li_' + i.toString()).setAttribute('class', 'security-question-answer');
      }
      if (i === id) {
        document.getElementById('li_' + i.toString()).setAttribute('class', 'highlight');
      }
    }
    this.selectedSecurityQuestion = this.securityquestions[id];
  }

  // Submit security question and answer for new user
  submitNewUserDetails(): void {
    this.updateSubmitted = true;
    if (this.selectedSecurityQuestion === '' || this.updateUserDetailsForm.value.se_ans === '') {
      this.updateUserDetailsForm.controls.se_ans.setErrors({ req: true });
      return;
    }
    this.submitDetails();
  }

  /*  Update User Details
  Method type: Post.
  Request Parameters: userid, se_qn, se_ans, password.
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
            Failure or error- Error message is displayed on the top. */
  submitDetails(): void {
    this.updateSubmitted = true;
    this.updateUserDetailsForm.setValue({
      userid: this.userID, se_qn: this.selectedSecurityQuestion,
      se_ans: this.updateUserDetailsForm.value.se_ans,
      pwd: this.updateUserDetailsForm.value.pwd
    });
    if (this.updateUserDetailsForm.invalid) {
      return;
    }
    const startDate = new Date();
    const functionName = 'Update User Details in login';
    this.functionservice.functionCallLogging(functionName);
    this.service.updateUserDetails(this.updateUserDetailsForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          document.getElementById('notificationModal').click();
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

  goBackToLogin(): void {
    this.updateNewUserDetails = false;
    this.updateTempPassword = false;
    this.submitted = false;
    this.loginForm.setValue({ userid: '', password: '' });
  }

}
