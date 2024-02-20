import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../shared/Admin.service';
import { FunctionService } from '../../shared/functions.service';
import { ServiceService } from '../../shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit, AfterViewInit {
  rolesSub: Subscription;
  roleandpermission = false;
  allRolesDetails = [];
  allRolesSortedData = [];
  itemsPerPage = 0;
  currentPage = 1;
  allFeatures = [];

  newRole = false;
  editRole = false;
  addnewRoleSubmitted = false;

  editroleStatus = '';
  editroleImg = '';

  deletingrole = '';

  totalRolesCount = 0;
  enabledRolesCount = 0;
  enabledRolesSortedData = [];
  disabledRolesCount = 0;
  disabledRolesSortedData = [];

  rolesSearchCount = 0;
  seachedTextCount = 0;
  theme = '';

  constructor(public Adminservice: AdminService, private functionservice: FunctionService,
              private service: ServiceService, private toastr: ToastrService, private cookieService: CookieService) { }

  rolesSearchForm = new FormGroup({
    roles_search_text: new FormControl('')
  });

  addNewRoleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    fid: new FormControl([], [Validators.required])
  });

  get n(): any {
    return this.addNewRoleForm.controls;
  }

  editRoleForm = new FormGroup({
    name: new FormControl(''),
    fid: new FormControl([]),
    status: new FormControl('')
  });

  get e(): any {
    return this.editRoleForm.controls;
  }

  ngOnInit(): void {
    this.theme = this.cookieService.get('theme');
  }

  ngAfterViewInit(): void {
    this.rolesSub = this.Adminservice.Roles.subscribe(message => {
      if (message === 'true') {
        this.roleandpermission = true;
        this.getAllRoles();
        this.itemsPerPage = 8;
        this.newRole = false;
        this.editRole = false;
        if ( document.getElementById('Roles') !== null ) {
          if (this.theme === 'navy') {
            document.getElementById('Roles_img').setAttribute('src', '../../../../assets/admin/selected/Roles.svg');
          } else {
            document.getElementById('Roles_img').setAttribute('src', '../../../../assets/admin/selected-white/Roles.svg');
          }
          document.getElementById('Roles').setAttribute('class', 'admin-active-background');
        }
      } else {
        this.roleandpermission = false;
        if ( document.getElementById('Roles') !== null ) {
          if (this.theme === 'navy') {
            document.getElementById('Roles_img').setAttribute('src', '../../../../assets/admin/navy/Roles.svg');
          } else {
            document.getElementById('Roles_img').setAttribute('src', '../../../../assets/admin/Roles.svg');
          }
          document.getElementById('Roles').removeAttribute('class');
        }
      }
    });
  }

  /* Get all roles information.
  Method type: Get.
  Request Parameters:
  Expected response: All Roles details.
  Process: Success- All roles details which comes as a response is stored in a variable(allRolesDetails).
            Failure or error- Error message is displayed on the top. */
  getAllRoles(): void {
    const startDate = new Date();
    const functionName = 'Get All roles details';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllRolesDetails().subscribe((result) => {
      if (result.status === 'success') {
        this.allRolesDetails = result.data;
        this.allRolesSortedData = this.allRolesDetails.slice();
        const enabledData = [];
        const disabledData = [];
        const pendingData = [];
        this.allRolesSortedData.forEach(ele => {
          if (ele.status === 'd') {
            disabledData.push(ele);
          } else if (ele.status === 'e') {
            enabledData.push(ele);
          }
        });

        this.enabledRolesSortedData = enabledData.slice();
        this.disabledRolesSortedData = disabledData.slice();

        this.totalRolesCount = this.allRolesSortedData.length;
        this.enabledRolesCount = this.enabledRolesSortedData.length;
        this.disabledRolesCount = this.disabledRolesSortedData.length;

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

  // Open new page to add new role
  openAddNewRole(): void {
    this.newRole = true;
    this.editRole = false;
    this.getAllFeatures();
  }

  /* Get all features information.
  Method type: Get.
  Request Parameters:
  Expected response: All features details.
  Process: Success- All features details which comes as a response is stored in a variable(allFeatures).
            Failure or error- Error message is displayed on the top. */
  getAllFeatures(): void {
    const startDate = new Date();
    const functionName = 'Get All features';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllFeatures().subscribe((result) => {
      if (result.status === 'success') {
        this.allFeatures = result.data;
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

  /* Add new role.
  Method type: Post.
  Request Parameters: name, featuresid.
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
            Failure or error- Error message is displayed on the top. */
  addNewRole(): void {
    this.addnewRoleSubmitted = true;
    if ( this.addNewRoleForm.value.fid.length === 0) {
      this.addNewRoleForm.controls.fid.setErrors({ required: true });
      return;
    }
    if (this.addNewRoleForm.invalid) {
      return;
    }
    const startDate = new Date();
    const functionName = 'Add new role';
    this.functionservice.functionCallLogging(functionName);
    this.service.addNewRole(this.addNewRoleForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('New role ' + this.addNewRoleForm.value.name + ' is added', '', {
            timeOut: 3000,
          });
          this.getAllRoles();
          this.backToManageRoles();
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

  // Search for the role in the table.
  getSearchResultForRoles(e): void {
    const data = this.allRolesDetails.filter(obj => {
      if (obj.name !== null) {
        const name = obj.name.toString().toUpperCase();
        if (name.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.fname !== null) {
        const feature = obj.fname.toString().toUpperCase();
        if (feature.indexOf(e.toUpperCase()) >= 0) {
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
    this.allRolesSortedData = data.slice();
    this.currentPage = 1;

    this.rolesSearchCount = this.allRolesSortedData.length;
    this.seachedTextCount = e.length;
    this.totalRolesCount = this.allRolesSortedData.length;

    const enabledData = [];
    const disabledData = [];
    this.allRolesSortedData.forEach(ele => {
      if (ele.status === 'd') {
        disabledData.push(ele);
      } else if (ele.status === 'e') {
        enabledData.push(ele);
      }
    });
    this.enabledRolesSortedData = enabledData.slice();
    this.disabledRolesSortedData = disabledData.slice();
    this.enabledRolesCount = this.enabledRolesSortedData.length;
    this.disabledRolesCount = this.disabledRolesSortedData.length;
  }

  // Clear Search
  clearSearch(): void {
    this.rolesSearchForm.setValue({search_text: ''});
    this.getSearchResultForRoles('');
  }

  // Sort roles data
  sortRolesData(sort: Sort): any {
    const data = this.allRolesDetails.slice();

    if (!sort.active || sort.direction === '') {
      this.allRolesSortedData = data;
      return;
    }
    this.allRolesSortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });

    this.enabledRolesSortedData = this.enabledRolesSortedData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        default:
          return 0;
      }
    });

    this.disabledRolesSortedData = this.disabledRolesSortedData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fname':
          return this.compare(a.fname, b.fname, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Open new page to edit role.
  openEditRolesInfo(r): void {
    this.newRole = false;
    this.editRole = true;
    this.getAllFeatures();
    if (r.status === 'e') {
      this.editroleStatus = 'Enabled';
      this.editroleImg = '../../../assets/admin/switch-on.svg';
    } else {
      this.editroleStatus = 'Disabled';
      this.editroleImg = '../../../assets/admin/switch-off.svg';
    }
    this.editRoleForm.setValue({
      name: r.name, fid: r.fid, status: r.status
    });
  }

  // Switch to change role status
  changeRoleStatus(): void {
    if (this.editroleStatus === 'Enabled') {
      this.editroleStatus = 'Disabled';
      this.editroleImg = '../../../assets/admin/switch-off.svg';
      this.editRoleForm.setValue({
        name: this.editRoleForm.value.name, fid: this.editRoleForm.value.fid, status: 'd'
      });
    } else {
      this.editroleStatus = 'Enabled';
      this.editroleImg = '../../../assets/admin/switch-on.svg';
      this.editRoleForm.setValue({
        name: this.editRoleForm.value.name, fid: this.editRoleForm.value.fid, status: 'e'
      });
    }
  }

  /* Update role info.
  Method type: Post.
  Request Parameters: name, featuresid, status.
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
            Failure or error- Error message is displayed on the top. */
  updateRoleInfo(): void {
    if (this.editRoleForm.value.fid.length === 0) {
      this.editRoleForm.controls.fid.setErrors({ min: true });
      return;
    }
    const startDate = new Date();
    const functionName = 'Edit Role';
    this.functionservice.functionCallLogging(functionName);
    this.service.editRole(this.editRoleForm.value).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success('Updated ' + this.editRoleForm.value.name , '', {
            timeOut: 3000,
          });
          this.getAllRoles();
          this.backToManageRoles();
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

  // Open modelto confirm role deletion.
  deleteRoleOpenModel(id): void {
    document.getElementById('openroledeleteModel').click();
    this.deletingrole = id;
  }

  /* Delete role.
  Method type: Get.
  Request Parameters: name.
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
            Failure or error- Error message is displayed on the top. */
  deleteRole(): void {
    const startDate = new Date();
    const functionName = 'Delete Role';
    this.functionservice.functionCallLogging(functionName);
    this.service.deleteRole(this.deletingrole).subscribe((result) => {
      if (result.status === 'success') {
        this.toastr.success('Deleted role ' + this.deletingrole, '', {
          timeOut: 3000,
        });
        document.getElementById('closedeleterolemodel').click();
        this.getAllRoles();
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

  // Back to main page
  backToManageRoles(): void {
    this.newRole = false;
    this.editRole = false;
    this.editRoleForm.setValue({ name: '', fid: [], status: ''});
    this.addNewRoleForm.setValue({ name: '', fid: []});
    this.addnewRoleSubmitted = false;
  }
}
