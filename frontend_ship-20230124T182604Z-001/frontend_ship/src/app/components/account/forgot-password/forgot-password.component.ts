import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../../shared/service.service';
import { FunctionService } from '../../shared/functions.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private service: ServiceService, private functionservice: FunctionService) { }
  sendrequest = 'true';
  securityquestion: string;
  useridsubmitted = false;
  forgotpasswordsubmitted = false;
  errorMessage: string;
  showAnswerDiv = 'false';

  userIDForm = new FormGroup({
    userid: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  get u(): any {
    return this.userIDForm.controls;
  }

  forgotpasswordForm = new FormGroup({
    userid: new FormControl(''),
    security_quest: new FormControl(''),
    sq_answer: new FormControl('', [Validators.required])
  });

  get f(): any {
    return this.forgotpasswordForm.controls;
  }

  ngOnInit(): void {
    this.service.setTitle('Forgot Password');
  }

  /* Get security question for user.
    Method type: Get.
    Request Parameters: Userid.
    Expected response: Security Question for the userid.
    Process: Success- Security question which comes as a response for the valid userid is stored in a variable(securityquestion).
             Failure or error- Error message is displayed on the top. */
  getSecurityQuestion(): void {
    const startDate = new Date();
    const functionName = 'Get security question function call in forgot password';
    this.functionservice.functionCallLogging(functionName);
    this.useridsubmitted = true;
    if (this.userIDForm.invalid) {
      return;
    }
    this.service.getSecurityQuestionForUser(this.userIDForm.value.userid).subscribe((result) => {
      if (result.status === 'success') {
        this.securityquestion = result.data;
        this.showAnswerDiv = 'true';
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.error.status === 'failure' ) {
          this.errorMessage = error.error.message;
          this.setTimeoutFunction();
          this.functionservice.errorLogging(functionName, error.error.message, seconds);
        } else {
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      });
  }

  /* Send forgot password request
    Method type: Post.
    Request Parameters: Userid, security question, secirity answer.
    Expected response: Success message.
    Process: Success- Success message is displayed.
             Failure or error- Error message is displayed on the top. */
  forgotPassword(): void {
    const startDate = new Date();
    const functionName = 'Post forgot password request to the admin in forgot password';
    this.functionservice.functionCallLogging(functionName);
    this.forgotpasswordsubmitted = true;
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    this.forgotpasswordForm.setValue({
      userid: this.userIDForm.value.userid, security_quest: this.securityquestion,
      sq_answer: this.forgotpasswordForm.value.sq_answer
    });
    this.service.forgotPassword(this.forgotpasswordForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.sendrequest = 'false';
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === 'failure' ) {
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

  // Change border of the input box to solid line when cursor is on input box.
  focus(): void {
    document.getElementById('security-question-answer').setAttribute('class', 'security-question-answer-highlight');
    document.getElementById('input-line').setAttribute('class', 'security-answer solidline');
  }

  // Change border of the input box to dashed line when cursor is not on input box.
  blur(): void {
    document.getElementById('input-line').setAttribute('class', 'security-answer dashedline');
    document.getElementById('security-question-answer').setAttribute('class', 'security-question-answer');
  }
}
