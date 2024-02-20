import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../../shared/service.service';
import { FunctionService } from '../../shared/functions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  isLinear = true;

  personalformsubmitted = false;
  credentialsformsubmitted = false;
  securitysubmitted = false;
  securityquestions: any;
  sendrequest = 'true';
  selectedSecurityQuestion: any;
  passwordicon = 'grey-visibility_off';

  constructor(private service: ServiceService,
              private functionservice: FunctionService) { }

  RegisterForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobilenumber: new FormControl('', [Validators.required]),
    message: new FormControl(''),
    userid: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    security_quest: new FormControl('', [Validators.required]),
    sq_answer: new FormControl('', [Validators.required])
  });

  get f(): any {
    return this.RegisterForm.controls;
  }

  personalinfoForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobilenumber: new FormControl('', [Validators.minLength(10)]),
    message: new FormControl(''),
  });

  get p(): any {
    return this.personalinfoForm.controls;
  }


  credentialsForm = new FormGroup({
    userid: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get c(): any {
    return this.credentialsForm.controls;
  }

  securityForm = new FormGroup({
    securityquestion: new FormControl(''),
    securityanswer: new FormControl('', [Validators.required])
  });

  get s(): any {
    return this.securityForm.controls;
  }


  ngOnInit(): void {
    this.service.setTitle('Register');
  }

  // After filling personal information form and click on continue control is moved to credentials form.
  continueToCredentials(): void {
    this.personalformsubmitted = true;
  }

  // After filling credentials form and click on continue control is moved to security form and get all security questions api is called.
  continueToSecurity(): void {
    this.getAllSecurity();
    this.credentialsformsubmitted = true;
  }

  /* User Register.
  Method type: Post.
  Request Parameters: firstname, lastname, email, mobilenumber, userid, password, security_quest, sq_answer.
  Expected response: Success message.
  Process: Success- Success message is displayed.
           Failure or error- Error message is displayed on the top. */
  register(): void {
    const startDate = new Date();
    const functionName = 'Register new user in register component';
    this.functionservice.functionCallLogging(functionName);
    this.securitysubmitted = true;
    if (this.securityForm.invalid) {
      return;
    }
    this.RegisterForm.setValue({
      firstname: this.personalinfoForm.value.firstname,
      lastname: this.personalinfoForm.value.lastname,
      email: this.personalinfoForm.value.email,
      mobilenumber: this.personalinfoForm.value.mobilenumber,
      message: this.personalinfoForm.value.message,
      userid: this.credentialsForm.value.userid,
      password: this.credentialsForm.value.password,
      security_quest: this.selectedSecurityQuestion,
      sq_answer: this.securityForm.value.securityanswer
    });
    this.service.userRegister(this.RegisterForm.value).subscribe(
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
    for (let i = 0; i < this.securityquestions.length; i++) {
      if (i !== id) {
        document.getElementById('li_' + i.toString()).setAttribute('class', 'security-question-answer');
      }
      if (i === id) {
        document.getElementById('li_' + i.toString()).setAttribute('class', 'highlight');
      }
    }
    this.securityForm.setValue({ securityquestion: this.securityquestions[id], securityanswer: '' });
    this.selectedSecurityQuestion = this.securityquestions[id];
  }

  /* Check for the availability of userid entered.
    Method type: Get.
    Request Parameters:
    Expected response: Available or not available.
    Process: Success-
             Failure or error- Error message is displayed. */
  checkForUserId(): void {
    const startDate = new Date();
    const functionName = 'Check for avaiability of userid in register component';
    this.functionservice.functionCallLogging(functionName);
    this.service.checkForUserId(this.credentialsForm.value.userid).subscribe((result) => {
      if (result.status === 'success') {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.error.status === 'failure') {
          this.credentialsForm.controls.userid.setErrors({ duplicate: true });
          this.functionservice.errorLogging(functionName, error.error.message, seconds);
        } else {
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      });
  }

  /* Check for the availability of emailid entered.
    Method type: Get.
    Request Parameters:
    Expected response: Available or not available.
    Process: Success-
             Failure or error- Error message is displayed. */
  checkForEmailId(): void {
    const startDate = new Date();
    const functionName = 'Check for avaiability of emailid in register component';
    this.functionservice.functionCallLogging(functionName);
    this.service.checkForEmailId(this.personalinfoForm.value.email).subscribe((result) => {
      if (result.status === 'success') {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.error.status === 'failure') {
          this.personalinfoForm.controls.email.setErrors({ duplicate: true });
          this.functionservice.errorLogging(functionName, error.error.message, seconds);
        } else {
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      });
  }

  // Restrict users to enter only number.
  onlyNumberKey(event): any {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  // To toggle type of input(password) to text or password.
  showPassword(): void {
    const inputType = document.getElementById('password').getAttribute('type');
    if (inputType === 'password') {
      document.getElementById('password').setAttribute('type', 'text');
      this.passwordicon = 'visibility';
    } else if (inputType === 'text') {
      document.getElementById('password').setAttribute('type', 'password');
      this.passwordicon = 'grey-visibility_off';
    }
  }

}
