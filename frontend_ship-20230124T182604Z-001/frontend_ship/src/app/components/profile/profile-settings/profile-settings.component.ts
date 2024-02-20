import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../shared/Profile.service';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, AfterViewInit, OnDestroy {

  profileSettingData = [{ name: 'Edit Profile', img: 'Edit-Profile' }];
  loginStatus: string;
  userId: string;
  userName: string;
  theme: string;
  themesub: Subscription;

  constructor(private cookieService: CookieService, private Profileservice: ProfileService, private Dataservice: DataService) { }

  ngOnInit(): void {
    this.loginStatus = this.cookieService.get('loginStatus');
    this.themesub = this.Dataservice.theme.subscribe(msg => {
      this.theme = msg;
    });
    this.userId = this.cookieService.get('userid');
    this.userName = this.cookieService.get('name');
    this.theme = this.cookieService.get('theme');
    this.Profileservice.changedtoEditProfile('true');
  }


  ngAfterViewInit(): void {
    this.Profileservice.changedtoEditProfile('true');
  }

  // Switching between features in profile settings.
  // changeProfile(f): void {
  //   if (f === 'Edit Profile') {
  //     this.Profileservice.changedtoEditProfile('true');
  //   } else {
  //     this.Profileservice.changedtoEditProfile('false');
  //   }
  // }

  // changing all feature to false.
  ngOnDestroy(): void {
    this.Profileservice.changedtoEditProfile('false');
  }

}
