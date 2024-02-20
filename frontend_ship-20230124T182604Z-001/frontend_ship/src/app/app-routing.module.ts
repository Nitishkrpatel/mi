import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { LiveMapComponent } from './components/live-map/live-map.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './components/account/forgot-username/forgot-username.component';
// import { QueueRequestComponent } from './components/admin/queue-request/queue-request.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { PlayHistoryComponent } from './components/play-history/play-history.component';
import { AdminConsoleComponent } from './components/admin/admin-console/admin-console.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'Forgot-password', component: ForgotPasswordComponent },
  { path: 'ship-map', component: LiveMapComponent },
  { path: 'Forgot-username', component: ForgotUsernameComponent },
  // { path: 'Queue-request', component: QueueRequestComponent },
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'UserInput', component: UserInputComponent },
  { path: 'Play-History', component: PlayHistoryComponent },
  { path: 'Admin-Console', component: AdminConsoleComponent },
  { path: 'Profile-Settings', component: ProfileSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
