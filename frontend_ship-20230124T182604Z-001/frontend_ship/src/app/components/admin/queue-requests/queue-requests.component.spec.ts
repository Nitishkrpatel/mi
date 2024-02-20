import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueRequestsComponent } from './queue-requests.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('QueueRequestsComponent', () => {
  let component: QueueRequestsComponent;
  let fixture: ComponentFixture<QueueRequestsComponent>;
  const toastrService = ToastrService;
  const router = Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        HttpClientModule ],
      providers: [{provide: ToastrService, useValue: toastrService},
          {provide: Router, useValue: router}],
      declarations: [ QueueRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init method queue requests should be displayed for navy', () => {
    component.Adminservice.changedtoQueueRequests('true');
    component.theme = 'navy';
  });


  it('on init method queue requests should be displayed for grey', () => {
    component.Adminservice.changedtoQueueRequests('true');
    component.theme = 'grey';
  });


  it('on init method queue requests should not be displayed for navy', () => {
    component.Adminservice.changedtoQueueRequests('false');
    component.theme = 'navy';
  });


  it('on init method queue requests should not be displayed for grey', () => {
    component.Adminservice.changedtoQueueRequests('false');
    component.theme = 'grey';
  });

  it('onclick should open model to add role', () => {
    component.accountRequestDetails = [{msg: '', nm: 'Ben J', rdt: 42, rid: 30, uid: 'ben123'}];
    component.queueRequests = true;
    component.tempPwd = 'false';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.openRoleModel'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should change roles', () => {
    document.getElementById('openrolemodel').click();
    component.Allroles = [{roleid: 2, rolename: 'Admin'},
                          { roleid: 4, rolename: 'Analyst' },
                          { roleid: 3, rolename: 'L2' },
                          { roleid: 6, rolename: 'test' },
                          { roleid: 7, rolename: 'ViewOnly'} ];
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('.changeroles')).nativeElement;
    select.value = 'Admin';
    select.dispatchEvent(new Event('change'));
  });

  it('onclick should submit role model', () => {
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.submitrolemodel'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should decline New User Request', () => {
    component.accountRequestDetails = [{msg: '', nm: 'Ben J', rdt: 42, rid: 30, uid: 'ben123'}];
    component.queueRequests = true;
    component.tempPwd = 'false';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.declineNewUserRequest'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should approve/decline forgot password Request', () => {
    component.passwordRequestDetails = [{rdt: 44, rid: 21, uid: 'u124'}];
    component.queueRequests = true;
    component.tempPwd = 'false';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.approveOrDeclineForgotPasswordRequest'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should close create temp password page', () => {
    component.queueRequests = true;
    component.tempPwd = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.closeCreateTempPwd'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should update temp password', () => {
    component.queueRequests = true;
    component.tempPwd = 'true';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.updateTempPwd'));
    buttonElement.triggerEventHandler('click', null);
  });

  it('onclick should approve/decline forgot password Request', () => {
    component.usernameRequestDetails = [{em: 'giri@mail.com', nm: 'Girish B', rdt: 45, rid: 16, uid: 'G2711'}];
    component.queueRequests = true;
    component.tempPwd = 'false';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('.declineForgotusernameRequest'));
    buttonElement.triggerEventHandler('click', null);
  });

});
