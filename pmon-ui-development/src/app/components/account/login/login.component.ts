import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../shared/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginwithuserID = 'true';
  loginwithmobileNumber = 'false';
  loginBox = 'true';
  rolebox = 'false';
  loginButton = 'true';

  constructor(private service: ServiceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.setTitle('Login')

  }

  loginWithuserID() {
    this.loginwithuserID = 'true';
    this.loginwithmobileNumber = 'false';
    this.submitted = false;
    this.loginForm.setValue({ userID: '', mobileNumber: '', password: '', flag: 'e' });
  }

  loginWithmobileNumber() {
    this.loginwithuserID = 'false';
    this.loginwithmobileNumber = 'true';
    this.submitted = false;
    this.loginForm.setValue({ userID: '', mobileNumber: '', password: '', flag: 'p' });
  }

  loginForm = new FormGroup({
    userID: new FormControl('', Validators.email),
    mobileNumber: new FormControl('', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    flag: new FormControl('e')
  });

  get f() {
    return this.loginForm.controls;
  }


  loginWith = new FormGroup({
    options: new FormControl('userID')
  });

  login() {
    if (this.loginForm.controls.flag.value == 'e') {
      this.loginWithUser();
    }
    else {
      this.loginWithMobile();
    }
  }

  loginWithUser() {
    if (this.loginwithuserID === 'true' && this.loginForm.value.userID === '') {
      this.loginForm.controls.userID.setErrors({ required: true });
    }

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.service.userlogin(this.loginForm.value).subscribe(
      data => {
        if (data.status == 'success') {
        localStorage.setItem('role', data.data.role);
          localStorage.setItem('accountId', data.data.accountID);
          localStorage.setItem('customerID', data.data.customerID);
          localStorage.setItem('loginStatus', data.data.loginStatus);
          this.router.navigateByUrl('/user');
        }
      },

      error => {
        if (error.status == 'failure') {
          console.log(error)
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });
        }

      })

  }




  loginWithMobile() {
    this.submitted = true;
    if (this.loginwithmobileNumber === 'true' && this.loginForm.value.mobileNumber === '') {
      this.loginForm.controls.mobileNumber.setErrors({ required: true });
    }

    if (this.loginForm.invalid) {
      return;
    }
    this.service.userlogin(this.loginForm.value).subscribe(data => {
      if (data.status == 'success') {
        localStorage.setItem('role', data.data.role);
        localStorage.setItem('accountId', data.data.accountID);
        localStorage.setItem('customerID', data.data.customerID);
        localStorage.setItem('loginStatus', data.data.loginStatus);
        this.router.navigateByUrl('/user');
      }
    },
      (error) => {                              //Error callback
        this.toastr.error(error.message, '', {
          timeOut: 3000,
        });
        console.log(error)

      }
    )
  }
  onlyNumberKey(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



}
