import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../shared/Admin.service';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  auditSub: Subscription;
  auditLogs = false;

  constructor(public Adminservice: AdminService) { }

  ngOnInit(): void {
    this.auditSub = this.Adminservice.Audit.subscribe(message => {
      if (message === 'true') {
        this.auditLogs = true;
      } else {
        this.auditLogs = false;
      }
    });
  }

}
