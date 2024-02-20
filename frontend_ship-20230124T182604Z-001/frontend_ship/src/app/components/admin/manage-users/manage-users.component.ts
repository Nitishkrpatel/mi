import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../shared/Admin.service';
import { FunctionService } from '../../shared/functions.service';
import { ServiceService } from '../../shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, AfterViewInit {

  musub: Subscription;
  manageUser = false;
  itemsPerPage: number;
  currentPage = 1;
  userSearchedCount: number;
  seachedTextCount = 0;
  allUsers = [];
  allUsersSortedData = [];
  totalUserCount = 0;
  enabledSortedData = [];
  enabledCount = 0;
  disabledSortedData = [];
  disabledCount = 0;
  pendingSortedData = [];
  pendingCount = 0;
  newUser = false;
  editUser = false;
  edituserStatus = '';
  edituserImg = '';
  deletinguser = '';
  allRoles = [];
  addnewUserSubmitted = false;
  passwordicon = 'visibility_off';
  theme = '';

  constructor(public Adminservice: AdminService, private functionservice: FunctionService,
              private service: ServiceService, private toastr: ToastrService, private cookieService: CookieService) { }

  userNameSearchForm = new FormGroup({
    user_search_text: new FormControl('')
  });

  addNewUserForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    designation: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobilenumber: new FormControl('', [Validators.minLength(10), Validators.minLength(10)]),
    userid: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
    roleid: new FormControl([], [Validators.required])

  });

  get n(): any {
    return this.addNewUserForm.controls;
  }

  editUserForm = new FormGroup({
    userid: new FormControl(''),
    fname: new FormControl(''),
    lname: new FormControl(''),
    designation: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    mobile: new FormControl(''),
    role: new FormControl([]),
    status: new FormControl(''),
    temppwd: new FormControl('')
  });

  get e(): any {
    return this.editUserForm.controls;
  }

  ngOnInit(): void {
    this.theme = this.cookieService.get('theme');
  }

  ngAfterViewInit(): void {
    this.musub = this.Adminservice.MU.subscribe(message => {
      if (message === 'true') {
        this.manageUser = true;
        this.newUser = false;
        this.editUser = false;
        this.getAllUsers();
        if (document.getElementById('Manage-Users') !== null) {
          document.getElementById('Manage-Users').setAttribute('class', 'admin-active-background');
          if (this.theme === 'navy') {
            document.getElementById('Manage-Users_img').setAttribute('src', '../../../../assets/admin/selected/Manage-Users.svg');
          } else {
            document.getElementById('Manage-Users_img').setAttribute('src', '../../../../assets/admin/selected-white/Manage-Users.svg');
          }
        }
      } else {
        this.manageUser = false;
        if (document.getElementById('Manage-Users') !== null) {
          if (this.theme === 'navy') {
            document.getElementById('Manage-Users_img').setAttribute('src', '../../../../assets/admin/navy/Manage-Users.svg');
          } else {
            document.getElementById('Manage-Users_img').setAttribute('src', '../../../../assets/admin/Manage-Users.svg');
          }
          document.getElementById('Manage-Users').removeAttribute('class');
        }
      }
      this.itemsPerPage = 8;
    });
  }

  /* Get all users information.
  Method type: Get.
  Request Parameters:
  Expected response: All users details.
  Process: Success- All users details which comes as a response is stored in a variable(allUsers).
            Failure or error- Error message is displayed on the top. */
  getAllUsers(): void {
    const startDate = new Date();
    const functionName = 'Get All users';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllUsers().subscribe((result) => {
      if (result.status === 'success') {
        this.allUsers = result.data1;
        this.allUsersSortedData = this.allUsers.slice();
        const enabledData = [];
        const disabledData = [];
        const pendingData = [];
        this.allUsersSortedData.forEach(ele => {
          if (ele.status === 'd') {
            disabledData.push(ele);
          } else if (ele.status === 'p') {
            pendingData.push(ele);
          } else if (ele.status === 'e') {
            enabledData.push(ele);
          }
        });

        this.enabledSortedData = enabledData.slice();
        this.disabledSortedData = disabledData.slice();
        this.pendingSortedData = pendingData.slice();

        this.totalUserCount = this.allUsersSortedData.length;
        this.enabledCount = this.enabledSortedData.length;
        this.disabledCount = this.disabledSortedData.length;
        this.pendingCount = this.pendingSortedData.length;

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

  // Search for the user in the table.
  getSearchResultForUser(e): void {
    const userdata = this.allUsers.filter(obj => {

      if (obj.fname !== null) {
        const name = obj.fname.toString().toUpperCase();
        if (name.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.userid !== null) {
        const userid = obj.userid.toString().toUpperCase();
        if (userid.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.rolename !== null) {
        const role = obj.rolename.toString().toUpperCase();
        if (role.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.status !== null) {
        const status = obj.status.toString().toUpperCase();
        if (status.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

    });
    this.allUsersSortedData = userdata.slice();
    this.currentPage = 1;
    this.userSearchedCount = this.allUsersSortedData.length;
    this.seachedTextCount = e.length;
    this.totalUserCount = this.allUsersSortedData.length;

    const enabledData = [];
    const disabledData = [];
    const pendingData = [];
    this.allUsersSortedData.forEach(ele => {
      if (ele.status === 'd') {
        disabledData.push(ele);
      } else if (ele.status === 'p') {
        pendingData.push(ele);
      } else if (ele.status === 'e') {
        enabledData.push(ele);
      }
    });
    this.enabledSortedData = enabledData.slice();
    this.disabledSortedData = disabledData.slice();
    this.pendingSortedData = pendingData.slice();
    this.enabledCount = this.enabledSortedData.length;
    this.disabledCount = this.disabledSortedData.length;
    this.pendingCount = this.pendingSortedData.length;
  }

  // Clear Search
  clearSearch(): void {
    this.userNameSearchForm.setValue({ user_search_text: '' });
    this.getSearchResultForUser('');
  }

  // Sort User details
  sortUserData(sort: Sort): any {
    const data = this.allUsers.slice();

    if (!sort.active || sort.direction === '') {
      this.allUsersSortedData = data;
      return;
    }
    this.allUsersSortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        case 'userid':
          return this.compare(a.userid, b.userid, isAsc);
        case 'rolename':
          return this.compare(a.rolename, b.rolename, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });

    this.enabledSortedData = this.enabledSortedData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        case 'userid':
          return this.compare(a.userid, b.userid, isAsc);
        case 'rolename':
          return this.compare(a.rolename, b.rolename, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });

    this.disabledSortedData = this.disabledSortedData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        case 'userid':
          return this.compare(a.userid, b.userid, isAsc);
        case 'rolename':
          return this.compare(a.rolename, b.rolename, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });

    this.pendingSortedData = this.pendingSortedData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        case 'userid':
          return this.compare(a.userid, b.userid, isAsc);
        case 'rolename':
          return this.compare(a.rolename, b.rolename, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
    this.service.checkForUserId(this.addNewUserForm.value.userid).subscribe((result) => {
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
          this.addNewUserForm.controls.userid.setErrors({ duplicate: true });
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
  checkForEmailId(process): void {
    const startDate = new Date();
    const functionName = 'Check for avaiability of emailid in register component';
    this.functionservice.functionCallLogging(functionName);
    let email;
    if (process === 'edit') {
      email = this.editUserForm.value.email;
    } else  if (process === 'add') {
      email = this.addNewUserForm.value.email;
    }
    this.service.checkForEmailId(email).subscribe((result) => {
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
          if (process === 'edit') {
            this.editUserForm.controls.email.setErrors({ duplicate: true });
          } else  if (process === 'add') {
            this.addNewUserForm.controls.email.setErrors({ duplicate: true });
          }
          this.functionservice.errorLogging(functionName, error.error.message, seconds);
        } else {
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      });
  }

  // Open Add new user page.
  openAddNewUser(): void {
    this.newUser = true;
    this.editUser = false;
    this.getAllRoles();
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
        this.allRoles = result.data;
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

  /*  Add new user
      Method type: Post.
      Request Parameters: firstname, lastname, designation, email, mobilenumber, userid, password, roleid
      Expected response: Success message.
      Process: Success- Success message is displayed on the top.
                Failure or error- Error message is displayed on the top. */
  addNewUser(): void {
    this.addnewUserSubmitted = true;
    if (this.addNewUserForm.value.roleid.length === 0) {
      this.addNewUserForm.controls.roleid.setErrors({ required: true });
      return;
    }
    if (this.addNewUserForm.invalid) {
      return;
    }
    const startDate = new Date();
    const functionName = 'Add new user';
    this.functionservice.functionCallLogging(functionName);
    this.service.addNewUser(this.addNewUserForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('New User ' + this.addNewUserForm.value.userid + ' is added', '', {
            timeOut: 3000,
          });
          this.getAllUsers();
          this.backToManageUser();
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

  // Open edit user page.
  openEditUserInfo(s): void {
    this.newUser = false;
    this.editUser = true;
    this.getAllRoles();
    if (s.status === 'e') {
      this.edituserStatus = 'Enabled';
      this.edituserImg = '../../../assets/admin/switch-on.svg';
    } else {
      this.edituserStatus = 'Disabled';
      this.edituserImg = '../../../assets/admin/switch-off.svg';
    }
    this.editUserForm.setValue({
      userid: s.userid, fname: s.fname, lname: s.lname, designation: '', email: s.email, mobile: '',
      role: s.roleid, status: s.status, temppwd: ''
    });
  }

  // Toggle for chnaging user status.
  changeUserStatus(): void {
    if (this.edituserStatus === 'Enabled') {
      this.edituserStatus = 'Disabled';
      this.edituserImg = '../../../assets/admin/switch-off.svg';
      this.editUserForm.setValue({
        userid: this.editUserForm.value.userid, fname: this.editUserForm.value.fname, lname: this.editUserForm.value.lname,
        designation: '', email: this.editUserForm.value.email, mobile: '', role: this.editUserForm.value.role, status: 'd', temppwd: ''
      });
    } else {
      this.edituserStatus = 'Enabled';
      this.edituserImg = '../../../assets/admin/switch-on.svg';
      this.editUserForm.setValue({
        userid: this.editUserForm.value.userid, fname: this.editUserForm.value.fname, lname: this.editUserForm.value.lname,
        designation: '', email: this.editUserForm.value.email, mobile: '', role: this.editUserForm.value.role, status: 'e', temppwd: ''
      });
    }
  }

  /*  Edit User
      Method type: Post.
      Request Parameters: firstname, lastname, designation, email, mobilenumber, userid, roleid
      Expected response: Success message.
      Process: Success- Success message is displayed on the top.
                Failure or error- Error message is displayed on the top. */
  updateUserInfo(): void {
    if (this.editUserForm.value.role.length === 0) {
      this.editUserForm.controls.role.setErrors({ min: true });
      return;
    }

    const startDate = new Date();
    const functionName = 'Edit User';
    this.functionservice.functionCallLogging(functionName);
    this.service.editUser(this.editUserForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('Updated ' + this.addNewUserForm.value.userid, '', {
            timeOut: 3000,
          });
          this.getAllUsers();
          this.backToManageUser();
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

  // Open modelto confirm user deletion.
  deleteUserOpenModel(userid): void {
    document.getElementById('openuserdeleteModel').click();
    this.deletinguser = userid;
  }

  /*  Delete User
    Method type: Get.
    Request Parameters: userid.
    Expected response: Success message.
    Process: Success- Success message is displayed on the top.
              Failure or error- Error message is displayed on the top. */
  deleteUser(): void {
    const startDate = new Date();
    const functionName = 'Delete User';
    this.functionservice.functionCallLogging(functionName);
    this.service.deleteUser(this.deletinguser).subscribe((result) => {
      if (result.status === 'success') {
        this.toastr.success('Deleted user ' + result.data, '', {
          timeOut: 3000,
        });
        document.getElementById('closedeleteusermodel').click();
        this.getAllUsers();
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

  // BAck to main manage user page
  backToManageUser(): void {
    this.newUser = false;
    this.editUser = false;
    this.editUserForm.setValue({
      userid: '', fname: '', lname: '', designation: '', email: '', mobile: '',
      role: '', status: '', temppwd: ''
    });
    this.addNewUserForm.setValue({
      firstname: '', lastname: '', designation: '', email: '', mobilenumber: '',
      userid: '', password: '', roleid: []
    });
  }
}
