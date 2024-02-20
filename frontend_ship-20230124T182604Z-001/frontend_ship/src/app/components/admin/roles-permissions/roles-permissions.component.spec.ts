import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesPermissionsComponent } from './roles-permissions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

describe('RolesPermissionsComponent', () => {
  let component: RolesPermissionsComponent;
  let fixture: ComponentFixture<RolesPermissionsComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule, NgxPaginationModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ RolesPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.roleandpermission = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method roles should be displayed for navy', () => {
    component.Adminservice.changedtoRolesAndPermissions('true');
    component.theme = 'navy';
  });


  it('on init method roles should be displayed for grey', () => {
    component.Adminservice.changedtoRolesAndPermissions('true');
    component.theme = 'grey';
  });


  it('on init method roles should not be displayed for navy', () => {
    component.Adminservice.changedtoRolesAndPermissions('false');
    component.theme = 'navy';
  });


  it('on init method roles should not be displayed for grey', () => {
    component.Adminservice.changedtoRolesAndPermissions('false');
    component.theme = 'grey';
  });


  it('onclick should clear Search', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.clearSearch'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should sort table', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.dashboard-table'));
    buttonElement.triggerEventHandler('matSortChange', null);
  });

  it('onclick should open new page to add role', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openaddnewrole'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('open new page to add role', () => {
    component.roleandpermission = true;
    component.newRole = true;
    component.editRole = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.addNewRole'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Search roles', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.getSearchResultForRoles'));
    buttonElement.triggerEventHandler('ngModelChange', null);
  });

  it('open new page to edit roles', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = false;
    component.allRolesSortedData = [{fid: Array(10), fname: Array(10), name: 'Admin', status: 'e'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openEditRolesInfo'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Change role status to disable', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = true;
    component.editroleStatus = 'Enabled';
    component.editroleImg = '../../../assets/admin/switch-on.svg';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeRoleStatus'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Change role status to enable', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = true;
    component.editroleStatus = 'Disabled';
    component.editroleImg = '../../../assets/admin/switch-off.svg';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeRoleStatus'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Update role information', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.updateRoleInfo'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('open new model to delete roles', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = false;
    component.allRolesSortedData = [{fid: Array(10), fname: Array(10), name: 'Admin', status: 'e'}];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteRoleOpenModel'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('delete roles', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = false;
    document.getElementById('openroledeleteModel').click();
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteRole'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('Back To Manage Roles ', () => {
    component.roleandpermission = true;
    component.newRole = false;
    component.editRole = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.backToManageRoles'));
    buttonElement.triggerEventHandler('click', null);
  });
});
