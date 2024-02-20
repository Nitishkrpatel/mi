import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUsersComponent } from './manage-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule,
        NgxPaginationModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ ManageUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.manageUser = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method Manage users should be displayed for navy', () => {
    component.Adminservice.changedtoManageUser('true');
    component.theme = 'navy';
  });


  it('on init method Manage users should be displayed for grey', () => {
    component.Adminservice.changedtoManageUser('true');
    component.theme = 'grey';
  });


  it('on init method Manage users should not be displayed for navy', () => {
    component.Adminservice.changedtoManageUser('false');
    component.theme = 'navy';
  });


  it('on init method Manage users should not be displayed for grey', () => {
    component.Adminservice.changedtoManageUser('false');
    component.theme = 'grey';
  });

  it('onclick should open a new page add new user ', () => {
    component.Adminservice.changedtoManageUser('true');
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.adduser-button'));
    buttonElement.triggerEventHandler('click', null);
  });


  it('add new user - Invalid case 1', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    component.addNewUserForm.setValue({ designation: '', email: 'yeshaswini@life9sys.com', firstname: '', lastname: 'K P',
    mobilenumber: '9019749664', password: 'yeshaswini', roleid: [2, 1], userid: '' });
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitaddnewuser-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('add new user - Invalid case 2 ', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    component.addNewUserForm.setValue({ designation: '', email: 'yeshaswini@life9sys.com', firstname: '', lastname: 'K P',
    mobilenumber: '9019749664', password: 'yeshaswini', roleid: [], userid: ''});
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitaddnewuser-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should add new user ', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    component.addNewUserForm.setValue({ designation: '', email: 'yeshaswini@life9sys.com', firstname: 'Yeshaswini', lastname: 'K P',
    mobilenumber: '9019749664', password: 'yeshaswini', roleid: [2, 1], userid: 'yeshaswinikp123'});
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitaddnewuser-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should show / hide password ', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should show / hide password ', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    fixture.detectChanges();
    document.getElementById('password').setAttribute('type', 'text');
    const buttonElement = fixture.debugElement.query(By.css('.showPassword'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should open model to delete user', () => {
    component.newUser = false;
    component.editUser = false;
    component.allUsersSortedData = [{ email: 'alind@email.com', fname: 'Alind', lname: 'Sharma', roleid: [2, 3, 4 ],
        rolename: ['Admin', 'L2', 'Analyst'], status: 'e', userid: 'alind' }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteuseropenmodel-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should open edit user', () => {
    component.newUser = false;
    component.editUser = false;
    component.allUsersSortedData = [{ email: 'alind@email.com', fname: 'Alind', lname: 'Sharma', roleid: [2, 3, 4 ],
        rolename: ['Admin', 'L2', 'Analyst'], status: 'e', userid: 'alind' }];
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openEditUserInfo-button'));
    buttonElement.triggerEventHandler('click', null);
  });


  it('onclick should change user status to disable', () => {
    component.newUser = false;
    component.editUser = true;
    component.edituserStatus = 'Enabled';
    component.edituserImg = '../../../assets/admin/switch-on.svg';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeUserStatus'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change user status to enable', () => {
    component.newUser = false;
    component.editUser = true;
    component.edituserStatus = 'Disabled';
    component.edituserImg = '../../../assets/admin/switch-off.svg';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.changeUserStatus'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change user status to enable', () => {
    component.newUser = false;
    component.editUser = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.updateUserInfo'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should delete user ', () => {
    document.getElementById('openuserdeleteModel').click();
    component.deletinguser = '11111';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.deleteUser-button'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should go back to manage user page ', () => {
    component.Adminservice.changedtoManageUser('true');
    component.newUser = true;
    component.editUser = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.backArrow'));
    buttonElement.triggerEventHandler('click', null);
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


  it('should check for userid', () => {
    component.newUser = true;
    component.editUser = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.checkForUserId-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keyup'));
  });

  it('should check for emailid', () => {
    component.newUser = true;
    component.editUser = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.checkForEmailId-input')).nativeElement;
    buttonElement.dispatchEvent(new Event('keyup'));
  });
});
