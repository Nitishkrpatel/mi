import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  submitted = false;
  registerWithUserID = 'true';
  registerWithMobileNumber = 'false';
  loginBox = 'true';
  rolebox = 'false';
  loginButton = 'true';
  hide = true;
  hideconfirm = true;
  otpSent = 'false';
  validatedotp = 'false';
  submittedPreregistration = false;
  submittedValidateOTP = false;
  submittedRegister = false;

  constructor(private service: ServiceService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.service.setTitle('Register')

  }



  get f() {
    return this.preregisterationForm.controls;
  }

  get o() {
    return this.otpValidationForm.controls;
  }

  get r() {
    return this.registerationForm.controls
  }

  registerWith = new FormGroup({
    options: new FormControl('userID')
  });

  preregisterationForm = new FormGroup({
    userID: new FormControl('', [Validators.email, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$')]),
    mobileNumber: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]),
    flag: new FormControl('e')
  });

  otpValidationForm = new FormGroup({
    userID: new FormControl(''),
    mobileNumber: new FormControl(''),
    otp: new FormControl('L', [Validators.required]),
    flag: new FormControl('')

  });

  registerationForm = new FormGroup({
    userID: new FormControl(''),
    mobileNumber: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    flag: new FormControl('')

  });

  registerWithuserID() {
    this.registerWithUserID = 'true';
    this.registerWithMobileNumber = 'false';
    this.submitted = false;
    this.preregisterationForm.setValue({ userID: '', mobileNumber: '', flag: 'e' });
  }

  registerWithmobileNumber() {
    this.registerWithUserID = 'false';
    this.registerWithMobileNumber = 'true';
    this.submitted = false;
    this.preregisterationForm.setValue({ userID: '', mobileNumber: '', flag: 'p' });
  }

  preRegister() {
    if (this.preregisterationForm.controls.flag.value == 'e') {
      this.registerWithUser();
    }
    else {
      this.registerWithMobile();
    }
  }

  registerWithUser() {
    this.submitted = true;
    if (this.registerWithUserID === 'true' && this.preregisterationForm.value.userID === '') {
      this.preregisterationForm.controls.userID.setErrors({ required: true });
    }

    if (this.preregisterationForm.invalid) {
      return;
    }
    this.service.preregistrationOTP(this.preregisterationForm.value).subscribe(data => {

      if (data.status == 'success') {
        this.submittedPreregistration = false;
        this.otpSent = 'true';
        this.otpValidationForm.setValue({
          userID: this.preregisterationForm.value.userID,
          mobileNumber: this.preregisterationForm.value.mobileNumber, otp: 'L', flag: this.preregisterationForm.value.flag
        });

      }
    },
      (error) => {
        if (error.status == 'failure') {
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });
        }
      })

  }

  registerWithMobile() {
    this.submitted = true;
    if (this.registerWithMobileNumber === 'true' && this.preregisterationForm.value.mobileNumber === '') {
      this.preregisterationForm.controls.mobileNumber.setErrors({ required: true });
    }

    if (this.preregisterationForm.invalid) {
      return;
    }
    this.service.preregistrationOTP(this.preregisterationForm.value).subscribe(data => {

      if (data.status == 'success') {
        this.submittedPreregistration = false;
        this.otpSent = 'true';
        this.otpValidationForm.setValue({
          userID: this.preregisterationForm.value.userID,
          mobileNumber: this.preregisterationForm.value.mobileNumber, otp: 'L', flag: this.preregisterationForm.value.flag
        });

      }
    },
      (error) => {
        if (error.status == 'failure') {
          console.log(error)
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });

        }

      })


  }

  validateOTP() {
    if (this.otpValidationForm.invalid) {
      return;
    }
    this.service.validateRegistrationOTP(this.otpValidationForm.value).subscribe(data => {

      if (data.status === 'success') {
        this.submittedValidateOTP = false;
        this.validatedotp = 'true';
        this.registerationForm.setValue({
          userID: this.preregisterationForm.value.userID,
          mobileNumber: this.preregisterationForm.value.mobileNumber, password: '', flag: this.preregisterationForm.value.flag
        });
      }
    },
      (error) => {
        if (error.status == 'failure') {
          this.otpValidationForm.controls.otp.setErrors({ invalidOTP: true });
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });

        }
      });
  }

  registerUser() {
    this.submittedRegister = true;
    if (this.registerationForm.invalid) {
      return;
    }
    this.service.register(this.registerationForm.value).subscribe(data => {
      if (data.status === 'success') {

        this.toastr.success('User Registered', '', {
          timeOut: 3000,
        });
        this.router.navigateByUrl('');
      }
    },
      (error) => {
        if (error.status == 'failure') {
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
