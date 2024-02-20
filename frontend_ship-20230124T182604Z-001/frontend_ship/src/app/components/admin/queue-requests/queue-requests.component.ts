import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../shared/Admin.service';
import { FunctionService } from '../../shared/functions.service';
import { ServiceService } from '../../shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-queue-requests',
  templateUrl: './queue-requests.component.html',
  styleUrls: ['./queue-requests.component.scss']
})
export class QueueRequestsComponent implements OnInit, AfterViewInit {
  requestSub: Subscription;
  queueRequests = false;

  totalRequestCount = 0;
  accountRequestDetails = [];
  accountRequestCount = 0;
  passwordRequestDetails = [];
  passwordRequestCount = 0;
  forgotPasswordUserData = [];
  usernameRequestDetails = [];
  usernameRequestCount = 0;


  selectedroles = [];
  rolesubmitted = false;
  Allroles = [];

  tempPwd = 'false';
  submitted = false;

  theme = '';
  constructor(public Adminservice: AdminService, private functionservice: FunctionService,
              private service: ServiceService, private toastr: ToastrService, private cookieService: CookieService) { }

  roleForm = new FormGroup({
    requestid: new FormControl(''),
    role: new FormControl([]),
  });

  get r(): any {
    return this.roleForm.controls;
  }

  tempPwdForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    designation: new FormControl(''),
    email: new FormControl(''),
    mobilenumber: new FormControl(''),
    username: new FormControl(''),
    temppassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get p(): any {
    return this.tempPwdForm.controls;
  }


  ngOnInit(): void {
    this.theme = this.cookieService.get('theme');
  }

  ngAfterViewInit(): void {
    this.requestSub = this.Adminservice.QR.subscribe(message => {
      if (message === 'true') {
        this.queueRequests = true;
        this.getAllUserRequests();
        if (document.getElementById('Queue-Requests') !== null ) {
          if (this.theme === 'navy') {
            document.getElementById('Queue-Requests_img').setAttribute('src', '../../../../assets/admin/selected/Queue-Requests.svg');
          } else {
            document.getElementById('Queue-Requests_img').setAttribute('src', '../../../../assets/admin/selected-white/Queue-Requests.svg');
          }
          document.getElementById('Queue-Requests').setAttribute('class', 'admin-active-background');
        }
      } else {
        this.queueRequests = false;
        if (document.getElementById('Queue-Requests') !== null) {
          if (this.theme === 'navy') {
            document.getElementById('Queue-Requests_img').setAttribute('src', '../../../../assets/admin/navy/Queue-Requests.svg');
          } else {
            document.getElementById('Queue-Requests_img').setAttribute('src', '../../../../assets/admin/Queue-Requests.svg');
          }
          document.getElementById('Queue-Requests').removeAttribute('class');
        }
      }
    });
  }

  /* Get All user requests in queue
  Method type: Get.
  Request Parameters:
  Expected response: All user requests in queue.
  Process: Success- User requests which comes as a response is stored in a
                    variable(userrequests).
           Failure or error- Error message is displayed on the top. */
  getAllUserRequests(): void {
    const startDate = new Date();
    const functionName = 'Get All user request queue';
    this.functionservice.functionCallLogging(functionName);
    this.service.getUserRequests().subscribe((result) => {
      if (result.status === 'success') {
        this.totalRequestCount = result.acnt + result.pcnt + result.ncnt;
        this.accountRequestDetails = result.act;
        this.accountRequestCount = result.acnt;
        this.passwordRequestDetails = result.pwd;
        this.passwordRequestCount = result.pcnt;
        this.usernameRequestDetails = result.usrid;
        this.usernameRequestCount = result.ncnt;

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

  // opens role model when user click approve new user request.
  openRoleModel(rid): void {
    this.getAllRoles();
    this.roleForm.setValue({ requestid: rid, role: '' });
    document.getElementById('openrolemodel').click();
  }

  /* Get all roles
  Method type: Get.
  Request Parameters:
  Expected response: All user roles.
  Process: Success- Roles details which comes as a response is stored in a
                    variable(Allroles).
            Failure or error- Error message is displayed on the top. */
  getAllRoles(): void {
    const startDate = new Date();
    const functionName = 'Get all roles';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllRoles().subscribe((result) => {
      if (result.status === 'success') {
        this.Allroles = result.data;
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

  // Assign a role to the new user
  changeRoles(e): void {
    if (e.target.checked) {
      this.selectedroles.push(Number(e.target.value));
    } else {
      const index = this.selectedroles.indexOf(Number(e.target.value));
      if (index > -1) {
        this.selectedroles.splice(index, 1);
      }
    }
  }

  // Submit role and close role model
  submitRoleModel(): void {
    this.rolesubmitted = true;
    if (this.selectedroles.length <= 0) {
      this.roleForm.controls.role.setErrors({ required: true });
    }
    if (this.roleForm.invalid) {
      return;
    }
    const requestData = { status: 'approve', request_id: this.roleForm.value.requestid, role: this.selectedroles };
    this.approveOrDeclineNewUserRequest(requestData);
    document.getElementById('closerolemodel').click();
  }

  // Decline new user request
  declineNewUserRequest(rid): void {
    const requestData = { request_id: rid, status: 'decline', role: [] };
    this.approveOrDeclineNewUserRequest(requestData);
  }

  /* Approve or decline new user request.
      Method type: Post.
      Request Parameters: request id, status.
      Expected response: Success message.
      Process: Success- Success message is displayed on top.
                Failure or error- Error message is displayed on the top. */
  approveOrDeclineNewUserRequest(reqData): void {
    const startDate = new Date();
    const functionName = 'Approve or decline new user request';
    this.functionservice.functionCallLogging(functionName);
    this.service.newAccountApproveOrDecline(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.getAllUserRequests();
          if (reqData.status === 'decline') {
            this.toastr.success('Declined new account request for the userid ' + data.data, '', {
              timeOut: 3000,
            });
          } else {
            this.toastr.success('Approved new account request for the userid ' + data.data, '', {
              timeOut: 3000,
            });
          }
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

  /* Approve or decline forgot password request.
    Method type: Post.
    Request Parameters: request id, status, userid.
    Expected response: Success message.
    Process: Success- If status is decline success message is displayed on top or new page opens to update user password.
              Failure or error- Error message is displayed on the top. */
  approveOrDeclineForgotPasswordRequest(rid, uid, approveOrDecline): void {
    const reqData = { request_id: rid, userid: uid, status: approveOrDecline };
    const startDate = new Date();
    const functionName = 'Approve or decline forgot password request';
    this.functionservice.functionCallLogging(functionName);
    this.service.forgotPasswordApproveOrDecline(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.getAllUserRequests();
          if (reqData.status === 'decline') {
            this.toastr.success(data.data, '', {
              timeOut: 3000,
            });
          } else {
            this.forgotPasswordUserData = data.data;
            this.forgotPasswordUserData[0].userid = uid;
            this.forgotPasswordUserData[0].rid = rid;
            this.openCreateTempPassword();
          }
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

  // Open new page to create temp password
  openCreateTempPassword(): void {
    this.tempPwd = 'true';
    this.submitted = false;
    this.tempPwdForm.setValue({
      firstname: this.forgotPasswordUserData[0].firstname, lastname: this.forgotPasswordUserData[0].lastname,
      designation: '', email: this.forgotPasswordUserData[0].email,
      mobilenumber: this.forgotPasswordUserData[0].mobilenumber, username: this.forgotPasswordUserData[0].userid,
      temppassword: ''
    });
  }

  // Close temp password page
  closeCreateTempPwd(): void {
    this.tempPwd = 'false';
    this.submitted = false;
    this.forgotPasswordUserData = [];
  }

  /* Update Temporary.
  Method type: Post.
  Request Parameters: request id, userid, password.
  Expected response: Success message.
  Process: Success- Success Message is displayed on top.
            Failure or error- Error message is displayed on the top. */
  updateTempPwd(): void {
    this.submitted = true;
    if (this.tempPwdForm.invalid) {
      return;
    }
    const reqData = {
      userid: this.tempPwdForm.value.username, pwd: this.tempPwdForm.value.temppassword,
      request_id: this.forgotPasswordUserData[0].rid
    };
    const startDate = new Date();
    const functionName = 'Reset user password';
    this.functionservice.functionCallLogging(functionName);
    this.service.resetPassword(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('Successfully updated password for user ' + data.data, '', {
            timeOut: 3000,
          });

          this.closeCreateTempPwd();
          this.getAllUserRequests();
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

  /*  Approve or decline forgot username request
      Method type: Get.
      Request Parameters: requestid
      Expected response: Success message.
      Process: Success- Success message is displayed on the top.
              Failure or error- Error message is displayed on the top. */
  declineForgotusernameRequest(rid): void {
    const startDate = new Date();
    const functionName = 'Delete forgot username request';
    this.functionservice.functionCallLogging(functionName);
    this.service.updateForgotusername(rid).subscribe((result) => {
      if (result.status === 'success') {
        this.getAllUserRequests();
        this.toastr.success(result.data, '', {
          timeOut: 3000,
        });
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
}
