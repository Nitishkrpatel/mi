import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { apiServerURL } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private preRegisterURL = apiServerURL + 'preRegistration';
  private validateOTPURL = apiServerURL + 'validateRegistrationOtp';
  private userRegisterURL = apiServerURL + 'userregister';
  private userLoginURL = apiServerURL + 'userlogin';
  private sendForgotPassworOTPURL = apiServerURL + 'sendforgotpasswordotp';
  private validateOTPAndResetPassword = apiServerURL + 'validateOTPAndResetPassword';
  private userURL = apiServerURL + 'users?accountID=';
  private addUserURL = apiServerURL + 'users';
  private userDetailsURL = apiServerURL + 'updateuserdetails?accountID=';
  private updateUserURL = apiServerURL + 'updateuserdetails';
  private activeDeActiveUserURL = apiServerURL + 'activatedeactivateuser';
  private employeeListURL = apiServerURL + 'employees?accountID=';
  private employeeDetailsURL = apiServerURL + 'updateemployeedetails?accountID=';
  private updateEmployeeURL = apiServerURL + 'updateemployeedetails';
  private addEmployeeURL = apiServerURL + 'employees';
  private activeDeActiveEmployeeURL = apiServerURL + 'activatedeactivateemployee';
  private teamListURL = apiServerURL + 'teams?accountID=';
  private addTeamURL = apiServerURL + 'teams';
  private teamDeatilsURL = apiServerURL + 'updateteamdetails?accountID=';
  private updateTeamsURL = apiServerURL + 'updateteamdetails';
  private activeDeActiveTeamURL = apiServerURL + 'activatedeactivateteam';



  constructor(private http: HttpClient, private titleService: Title) { }
// Set tilte in global
  setTitle(newTitle: string) {
    this.titleService.setTitle('PMON  − ' + newTitle);
  }

  // Pre Register And Send OTP
  preregistrationOTP(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.preRegisterURL, data).pipe(catchError(this.errorHandler))
  }

  // Validate OTP 
  validateRegistrationOTP(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.validateOTPURL, data).pipe(catchError(this.errorHandler))
  }

  // Register User
  register(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.userRegisterURL, data).pipe(catchError(this.errorHandler))
  }

  // User login 
  userlogin(data): Observable<any> {
    data = JSON.stringify(data);
    return this.http.post<any>(this.userLoginURL, data)
      .pipe(catchError(this.errorHandler))
  }

  // Forgot Password
  sendForgotPassworOTP(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.sendForgotPassworOTPURL, data).pipe(catchError(this.errorHandler))
  }

  // Validate OTP 
  validateForgotPasswordOTP(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.validateOTPAndResetPassword, data).pipe(catchError(this.errorHandler))
  }

  // Get the user List
  getUser(accountId) {
    return this.http.get(this.userURL + accountId)
  }

  // Add user
  addUser(data) {
    data = JSON.stringify(data)
    return this.http.post(this.addUserURL, data).pipe(catchError(this.errorHandler))
  }

  // Get User Details
  userDetails(accountID, customerID) {
    return this.http.get(this.userDetailsURL + accountID + '&customerID=' + customerID)
  }

  // Update User Details

  updateUserDetails(data) {
    data = JSON.stringify(data);
    return this.http.post(this.updateUserURL, data).pipe(catchError(this.errorHandler))
  }

  // Employee Active and inActive

  activateDeactivateEmployee(data){
    data = JSON.stringify(data);
    return this.http.post(this.activeDeActiveEmployeeURL,data).pipe(catchError(this.errorHandler))
  }

  // Get Employee List

  getEmployee(accountID) {
    return this.http.get(this.employeeListURL + accountID)
  }

  // Get Employee Details
  getEmployeeDetails(accountID, employeeID) {
    return this.http.get(this.employeeDetailsURL + accountID + '&employeeID=' + employeeID)
  }

  // Update Employee 

  updateEmployee(data) {
    data = JSON.stringify(data);
    return this.http.post(this.updateEmployeeURL, data).pipe(catchError(this.errorHandler))
  }

  // Add employee 
  addEmployee(data) {
    data = JSON.stringify(data)
    return this.http.post(this.addEmployeeURL, data).pipe(catchError(this.errorHandler))
  }

  // User Active and inActive

  activateDeactivateUser(data){
    data = JSON.stringify(data);
    return this.http.post(this.activeDeActiveUserURL,data).pipe(catchError(this.errorHandler))
  }

  // Get Teams List
  getTeams(accountId) {
    return this.http.get(this.teamListURL + accountId)
  }

  // add Teams 
  addTeam(data) {
    data = JSON.stringify(data);
    return this.http.post(this.addTeamURL, data).pipe(catchError(this.errorHandler))
  }

  // 
  getTeamDeatils(accountId, id) {
    return this.http.get(this.teamDeatilsURL + accountId + '&teamID=' + id)
  }

  // Update Teams
  updateTeams(data) {
    data = JSON.stringify(data);
    return this.http.post(this.updateTeamsURL, data).pipe(catchError(this.errorHandler))
  }
  // Team Active and inActive

  activateDeactivateTeam(data){
    data = JSON.stringify(data);
    return this.http.post(this.activeDeActiveTeamURL,data).pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.error || "server error.");
  }

}
