import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from '../../shared/Admin.service';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit, OnDestroy, AfterViewInit {
  isAdmin = false;
  loginStatus: string;
  adminConsoleData = [{ name: 'Queue Requests', img: 'Queue-Requests' },
                      { name: 'Manage Users', img: 'Manage-Users' },
                      { name: 'Roles & Permissions', img: 'Roles'},
                      { name: 'Manage Ships', img: 'Manage-Ships'}];
  userId: string;
  userName: string;
  theme: string;
  themesub: Subscription;
  role = '';

  constructor(private cookieService: CookieService, private Adminservice: AdminService, private Dataservice: DataService) { }

  ngOnInit(): void {
    this.themesub = this.Dataservice.theme.subscribe(msg => {
      this.theme = msg;
    });

    this.loginStatus = this.cookieService.get('loginStatus');
    this.role = this.cookieService.get('role');
    const rolearr = this.role.split(',');
    rolearr.forEach(r => {
      if (r === 'Admin') {
        this.isAdmin = true;
      }
    });
    this.userId = this.cookieService.get('userid');
    this.userName = this.cookieService.get('name');
    this.theme = this.cookieService.get('theme');
    this.Adminservice.changedtoQueueRequests('true');
  }

  ngAfterViewInit(): void {
    this.Adminservice.changedtoQueueRequests('true');
  }

  // Switching between features in admin console.
  changeConsole(f): void {
    if (f === 'Queue Requests') {
      this.Adminservice.changedtoQueueRequests('true');
      this.Adminservice.changedtoManageUser('false');
      this.Adminservice.changedtoRolesAndPermissions('false');
      this.Adminservice.changedtoManageShips('false');
      this.Adminservice.changedtoAuditLogs('false');
    } else if (f === 'Manage Users') {
      this.Adminservice.changedtoQueueRequests('false');
      this.Adminservice.changedtoManageUser('true');
      this.Adminservice.changedtoRolesAndPermissions('false');
      this.Adminservice.changedtoManageShips('false');
      this.Adminservice.changedtoAuditLogs('false');
    } else if (f === 'Roles & Permissions') {
      this.Adminservice.changedtoQueueRequests('false');
      this.Adminservice.changedtoManageUser('false');
      this.Adminservice.changedtoRolesAndPermissions('true');
      this.Adminservice.changedtoManageShips('false');
      this.Adminservice.changedtoAuditLogs('false');
    } else if (f === 'Manage Ships') {
      this.Adminservice.changedtoQueueRequests('false');
      this.Adminservice.changedtoManageUser('false');
      this.Adminservice.changedtoRolesAndPermissions('false');
      this.Adminservice.changedtoManageShips('true');
      this.Adminservice.changedtoAuditLogs('false');
    } else if (f === 'Audit Logs') {
      this.Adminservice.changedtoQueueRequests('false');
      this.Adminservice.changedtoManageUser('false');
      this.Adminservice.changedtoRolesAndPermissions('false');
      this.Adminservice.changedtoManageShips('false');
      this.Adminservice.changedtoAuditLogs('true');
    }
  }

  // changing all feature to false.
  ngOnDestroy(): void {
    this.Adminservice.changedtoQueueRequests('false');
    this.Adminservice.changedtoManageUser('false');
    this.Adminservice.changedtoRolesAndPermissions('false');
    this.Adminservice.changedtoManageShips('false');
    this.Adminservice.changedtoAuditLogs('false');
  }

}
