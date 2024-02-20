import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../shared/Profile.service';
import { FunctionService } from '../../shared/functions.service';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editProfile: boolean;
  editSub: Subscription;
  theme: string;
  userId: string;
  userprofile: [];
  passwordicon = 'visibility_off';


  constructor(public Profileservice: ProfileService, private functionservice: FunctionService,
              private service: ServiceService, private cookieService: CookieService, private toastr: ToastrService) { }

  profileForm = new FormGroup({
    userid: new FormControl(''),
    fname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    mobile: new FormControl('', [Validators.minLength(10)]),
    pwd: new FormControl('', [Validators.minLength(6)])
  });

  get p(): any {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    this.theme = this.cookieService.get('theme');
    this.userId = this.cookieService.get('userid');
    this.editSub = this.Profileservice.EP.subscribe(message => {
      if (message === 'true') {
        this.editProfile = true;
        if (document.getElementById('Edit-Profile') !== null) {
          if (this.theme === 'navy') {
            document.getElementById('Edit-Profile_img').setAttribute('src', '../../../../assets/profile/selected/Edit-Profile.svg');
          } else {
            document.getElementById('Edit-Profile_img').setAttribute('src', '../../../../assets/profile/selected-white/Edit-Profile.svg');
          }
          document.getElementById('Edit-Profile').setAttribute('class', 'admin-active-background');
        }
        this.getUserDetails();
      } else {
        this.editProfile = false;
        if (document.getElementById('Edit-Profile') !== null) {
          if (this.theme === 'navy') {
            document.getElementById('Edit-Profile_img').setAttribute('src', '../../../../assets/profile/navy/Edit-Profile.svg');
          } else {
            document.getElementById('Edit-Profile_img').setAttribute('src', '../../../../assets/profile/Edit-Profile.svg');
          }
          document.getElementById('Edit-Profile').removeAttribute('class');
        }

      }
    });
  }

  /* Get user profile details.
  Method type: Get.
  Request Parameters: userid
  Expected response: Get user profile details.
  Process: Success- User Profile details which comes as a response is stored in a variable(userprofile).
            Failure or error- Error message is displayed on the top. */
  getUserDetails(): void {
    const startDate = new Date();
    const functionName = 'Get user profile details';
    this.functionservice.functionCallLogging(functionName);
    this.service.getUserProfileDetails(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.userprofile = result.data[0];
        const firstname = 'firstname';
        const lastname = 'lastname';
        const email = 'email';
        const mobilenumber = 'mobilenumber';
        this.profileForm.setValue({ userid: this.userId, fname: this.userprofile[firstname], lname: this.userprofile[lastname],
                                    email: this.userprofile[email], mobile: this.userprofile[mobilenumber], pwd: ''});
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

  // Restrict users to enter only number.
  onlyNumberKey(event): any {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  // To toggle type of input(password) to text or password.
  showPassword(): void {
    const inputType = document.getElementById('pwd').getAttribute('type');
    if (inputType === 'password') {
      document.getElementById('pwd').setAttribute('type', 'text');
      this.passwordicon = 'visibility';
    } else if (inputType === 'text') {
      document.getElementById('pwd').setAttribute('type', 'password');
      this.passwordicon = 'visibility_off';
    }
  }

  /*  Update User Profile
      Method type: Post.
      Request Parameters: userid, fname, lname, email, mobile, password
      Expected response: Success message.
      Process: Success- Success message is displayed on the top.
                Failure or error- Error message is displayed on the top. */
  submitEditProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    const startDate = new Date();
    const functionName = 'Update user profile';
    this.functionservice.functionCallLogging(functionName);
    this.service.updateUserProfile(this.profileForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success(data.message, '', {
            timeOut: 3000,
          });
          this.getUserDetails();
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
