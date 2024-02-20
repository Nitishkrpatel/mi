import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private QRSource = new BehaviorSubject('');
  QR = this.QRSource.asObservable();

  private MUSource = new BehaviorSubject('');
  MU = this.MUSource.asObservable();

  private RolesSource = new BehaviorSubject('');
  Roles = this.RolesSource.asObservable();

  private MSSource = new BehaviorSubject('');
  MS = this.MSSource.asObservable();

  private AuditSource = new BehaviorSubject('');
  Audit = this.AuditSource.asObservable();

  constructor() { }
    changedtoQueueRequests(message): void {
        this.QRSource.next(message);
    }

    changedtoManageUser(message): void {
        this.MUSource.next(message);
    }

    changedtoRolesAndPermissions(message): void {
        this.RolesSource.next(message);
    }

    changedtoManageShips(message): void {
        this.MSSource.next(message);
    }

    changedtoAuditLogs(message): void {
        this.AuditSource.next(message);
    }
}
