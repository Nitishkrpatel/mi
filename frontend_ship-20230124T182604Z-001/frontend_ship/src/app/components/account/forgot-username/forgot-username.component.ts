import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../../shared/service.service';
import { FunctionService } from '../../shared/functions.service';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit {

  constructor(private service: ServiceService, private functionservice: FunctionService) { }
  sendrequest = 'true';
  usernameformSubmitted = false;
  securityquestions = [];
  selectedTitle: string;
  errorMessage: string;

  usernameForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    security_quest: new FormControl(''),
    sq_answer: new FormControl('', [Validators.required])
  });

  get u(): any {
    return this.usernameForm.controls;
  }

  ngOnInit(): void {
    this.service.setTitle('Forgot Username');
    this.getAllSecurity();
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
    const functionName = 'Get all security question in forgot username';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllSecurityQuestions().subscribe((result) => {
      if (result.status === 'success') {
        this.securityquestions = result.data;
        this.selectedTitle = this.securityquestions[0];
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

  /* Send forgot password request
    Method type: Post.
    Request Parameters: firstname, lastname, email, security_quest, sq_answer.
    Expected response: Success message.
    Process: Success- Success message is displayed.
             Failure or error- Error message is displayed on the top. */
  forgotUserName(): void {
    const startDate = new Date();
    const functionName = 'Forgot username request to admin forgot username';
    this.functionservice.functionCallLogging(functionName);
    this.usernameformSubmitted = true;
    if (this.usernameForm.value.security_quest === '') {
      this.usernameForm.controls.security_quest.setErrors({ required: true });
    }
    if (this.usernameForm.invalid) {
      return;
    }
    this.service.forgotUserName(this.usernameForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
          this.sendrequest = 'false';
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

}
