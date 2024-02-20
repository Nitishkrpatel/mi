import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiServerURL } from 'src/app/app.component';

@Component({
  selector: 'app-session-layout',
  templateUrl: './session-layout.component.html',
  styleUrls: ['./session-layout.component.scss']
})
export class SessionLayoutComponent implements OnInit {
  currentURL: any;
  Role: any;
  userName: any;
  apiServerURL= apiServerURL

  constructor(private router:Router) { }

  ngOnInit() {
    this.Role = localStorage.getItem('role');
    this.userName = localStorage.getItem('name');
    this.currentURL = this.router.url;
  }

}
