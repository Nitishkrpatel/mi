import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/account/login/login.component';
import { NavbarComponent } from './components/account/navbar/navbar.component';



import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LiveMapComponent } from './components/live-map/live-map.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
// import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { RegisterComponent } from './components/account/register/register.component';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
// import {HighchartsChartComponent} from 'highcharts-angular';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ForgotUsernameComponent } from './components/account/forgot-username/forgot-username.component';
import { MainNavbarComponent } from './components/home/main-navbar/main-navbar.component';
import { SidenavComponent } from './components/home/sidenav/sidenav.component';
import { ShipOfInterstComponent } from './components/home/ship-of-interst/ship-of-interst.component';
import { RegionOfInterestComponent } from './components/home/region-of-interest/region-of-interest.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VesselFilterComponent } from './components/home/vessel-filter/vessel-filter.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { DensityMapComponent } from './components/home/density-map/density-map.component';
import { PlayHistoryComponent } from './components/play-history/play-history.component';
import { AdminConsoleComponent } from './components/admin/admin-console/admin-console.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { QueueRequestsComponent } from './components/admin/queue-requests/queue-requests.component';
import { RolesPermissionsComponent } from './components/admin/roles-permissions/roles-permissions.component';
import { ManageShipsComponent } from './components/admin/manage-ships/manage-ships.component';
import { AuditLogsComponent } from './components/admin/audit-logs/audit-logs.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    LiveMapComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ForgotUsernameComponent,
    MainNavbarComponent,
    SidenavComponent,
    ShipOfInterstComponent,
    RegionOfInterestComponent,
    DashboardComponent,
    VesselFilterComponent,
    UserInputComponent,
    DensityMapComponent,
    PlayHistoryComponent,
    AdminConsoleComponent,
    ManageUsersComponent,
    QueueRequestsComponent,
    RolesPermissionsComponent,
    ManageShipsComponent,
    AuditLogsComponent,
    ProfileSettingsComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgApexchartsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    AutocompleteLibModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    NgxSliderModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
