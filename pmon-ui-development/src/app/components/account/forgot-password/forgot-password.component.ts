import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  forgotWithUserID = 'true';
  forgotWithMobileNumber = 'false';
  loginBox = 'true';
  rolebox = 'false';
  loginButton = 'true';
  hide = true;
  hideconfirm = true;

  otpSent = 'false';
  validatedotp = 'false';
  submittedValidateOTP = false;
  submittedForgot = false;

  constructor(private service:ServiceService,private toastr:ToastrService , private router:Router) { }

  ngOnInit(): void {
    this.service.setTitle('Forgot Password')

  }

  get f() {
    return this.sendForgotPasswordOTPForm.controls;
  }

  get o() {
    return this.forgotpassowordForm.controls;
  }

  forgotWith = new FormGroup({
    options: new FormControl('userID')
  });

  sendForgotPasswordOTPForm = new FormGroup({
    userID: new FormControl('', [Validators.email]),
    mobileNumber: new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.maxLength(10),Validators.minLength(10)]),
    flag: new FormControl('e')
  });

  forgotpassowordForm = new FormGroup({
    userID: new FormControl(''),
    mobileNumber: new FormControl(''),
    otp: new FormControl('L', [Validators.required]),
    flag: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),

  });

  forgotWithuserID() {
    this.forgotWithUserID = 'true';
    this.forgotWithMobileNumber = 'false';
    this.submitted = false;
    this.sendForgotPasswordOTPForm.setValue({ userID: '', mobileNumber: '', flag: 'e' });
  }

  forgotWithmobileNumber() {
    this.forgotWithUserID = 'false';
    this.forgotWithMobileNumber = 'true';
    this.submitted = false;
    this.sendForgotPasswordOTPForm.setValue({ userID: '', mobileNumber: '', flag: 'p'});
  }

  forgotWithUserMobile() {
    if (this.sendForgotPasswordOTPForm.controls.flag.value == 'e') {
      this.forgotWithUser();
    }
    else {
      this.forgotWithMobile();
    }
  }

  forgotWithUser() {
    this.submitted = true;
   
    if (this.forgotWithUserID === 'true' && this.sendForgotPasswordOTPForm.value.userID === '') {
      this.sendForgotPasswordOTPForm.controls.userID.setErrors({ required: true });
    }
    if (this.sendForgotPasswordOTPForm.invalid) {
      return;
    }
    this.service.sendForgotPassworOTP(this.sendForgotPasswordOTPForm.value).subscribe(data => {

      if (data.status == 'success') {
        if(data.data.msg == 'OTP Sent')
        {
          console.log()
          this.otpSent = 'true';
          this.forgotpassowordForm.setValue({
            userID: this.sendForgotPasswordOTPForm.value.userID,
            mobileNumber: this.sendForgotPasswordOTPForm.value.mobileNumber,otp:'L',flag: this.sendForgotPasswordOTPForm.value.flag,password:''
          });
        }

      }
    },
      (error) => {                              
        if (error.status == 'failure') {
          this.sendForgotPasswordOTPForm.controls.userID.setErrors({ notregisterd: true });
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });

        }

      })

  }

  forgotWithMobile() {
    this.submitted = true;

    if (this.forgotWithMobileNumber === 'true' && this.sendForgotPasswordOTPForm.value.mobileNumber === '') {
      this.sendForgotPasswordOTPForm.controls.mobileNumber.setErrors({ required: true });
    }
    if (this.sendForgotPasswordOTPForm.invalid) {
      return;
    }
  this.service.sendForgotPassworOTP(this.sendForgotPasswordOTPForm.value).subscribe(data => {

      if (data.status == 'success') {
        if(data.data.msg == 'OTP Sent')
        {
          this.otpSent = 'true';
          this.forgotpassowordForm.setValue({
            userID: this.sendForgotPasswordOTPForm.value.userID,
            mobileNumber: this.sendForgotPasswordOTPForm.value.mobileNumber,otp:'L',flag: this.sendForgotPasswordOTPForm.value.flag,password:''
          });
        }
       

      }
    },
      (error) => {                              
        if (error.status == 'failure') {
          console.log(error)
          this.sendForgotPasswordOTPForm.controls.mobileNumber.setErrors({ notregisterd: true });
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });

        }

      })

  }

  validateOTP() {
    this.submittedForgot= true;
    if (this.forgotpassowordForm.invalid) {
      return;
    }
    this.service.validateForgotPasswordOTP(this.forgotpassowordForm.value).subscribe(data => {

      if (data.status === 'success') {
         this.toastr.success('Password Updated' ,'', {
          timeOut:3000
        });
        this.router.navigateByUrl('');

      }
    },
    (error) => {                              
      if (error.status == 'failure') {
      this.forgotpassowordForm.controls.otp.setErrors({ invalidOTP: true });
      this.toastr.error(error.message, '', {
        timeOut: 3000,
      });

      }
  });

  }


  onlyNumberKey(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
