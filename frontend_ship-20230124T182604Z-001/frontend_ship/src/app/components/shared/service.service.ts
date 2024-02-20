import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  apiServerURL = 'http://20.20.20.124:5000/';
  mapURL = 'http://20.20.20.124:8090/geoserver/';
  // apiServerURL = 'https://navika.demo/';
  // mapURL = 'https://navika.demo/geoserver/';
  // apiServerURL = '/';
  // mapURL = '/geoserver/';
  userEndPoints = this.apiServerURL + 'user/';
  shipEndPoints = this.apiServerURL + 'shipapi/';
  densityEndPoints = this.apiServerURL + 'density/';
  playhistoryEndPoints = this.apiServerURL + 'playhistory/';
  adminEndPoints = this.apiServerURL + 'admin/';
  mlEndPoints = this.apiServerURL + 'models/';
  vfEndPoints = this.apiServerURL + 'vf/';

  constructor(private http: HttpClient, private titleService: Title, private cookieService: CookieService) { }

  // Set tilte in global
  setTitle(newTitle: string): any {
    this.titleService.setTitle('Ship  − ' + newTitle);
  }

  // Forgot Password component
  // Forgot Password- get question for userID
  getSecurityQuestionForUser(userid): any {
    const securityquestionforuserURL = this.userEndPoints + 'userquestion?userid=';
    return this.http.get(securityquestionforuserURL + userid);
  }

  // Send forgotpassword request
  forgotPassword(data): Observable<any> {
    const forgotpasswordURL = this.userEndPoints + 'forgotpwd';
    data = JSON.stringify(data);
    return this.http
      .post<any>(forgotpasswordURL, data)
      .pipe(catchError(this.errorHandler));
  }
  // End Forgot Password component
  // Forgot username component
  getAllSecurityQuestions(): any {
    const securityquestionURL = this.userEndPoints + 'allquestions';
    return this.http.get(securityquestionURL);
  }
  forgotUserName(data): Observable<any> {
    const forgotusernameURL = this.userEndPoints + 'forgotusername';
    data = JSON.stringify(data);
    return this.http
      .post<any>(forgotusernameURL, data)
      .pipe(catchError(this.errorHandler));
  }
  // End Forgot username component
  // Login Component
  // User login
  userLogin(data): Observable<any> {
    const httpoptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: 'Basic ' + btoa(data.userid + ':' + data.password)
      })
    };
    const userLoginURL = this.userEndPoints + 'userlogin';
    data = JSON.stringify(data);
    return this.http
      .post<any>(userLoginURL, data, httpoptions)
      .pipe(catchError(this.errorHandler));
  }

  updateUserDetails(data): Observable<any> {
    const updateUserDetailsURL = this.userEndPoints + 'changepwd';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updateUserDetailsURL, data)
      .pipe(catchError(this.errorHandler));
  }

  // End Login Component
  // User Register component
  checkForUserId(userid): any {
    const checkforuseridURL = this.userEndPoints + 'useridcheck?userid=';
    return this.http.get(checkforuseridURL + userid);
  }

  checkForEmailId(emailid): any {
    const checkforemailidURL = this.userEndPoints + 'emailcheck?email=';
    return this.http.get(checkforemailidURL + emailid);
  }
  // User Register
  userRegister(data): Observable<any> {
    const userregisterURL = this.userEndPoints + 'newaccount';
    data = JSON.stringify(data);
    return this.http
      .post<any>(userregisterURL, data)
      .pipe(catchError(this.errorHandler));
  }
  // End User Register component

  // Dashboard
  getTotalVesselCount(userid, timestamp): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const TotalVesselCountURL = this.userEndPoints + 'vesselcount?userid=';
    return this.http.get(TotalVesselCountURL + userid + '&timestamp=' + timestamp, httpTokenHeader);
  }

  getUserNeighbouringCountries(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const NeighbouringCountriesURL = this.userEndPoints + 'usercountry?userid=';
    return this.http.get(NeighbouringCountriesURL + userid, httpTokenHeader);
  }

  getNeighbouringshipsCount(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const NeighbouringshipsCountURL = this.userEndPoints + 'countbycountry';
    data = JSON.stringify(data);
    return this.http
      .post<any>(NeighbouringshipsCountURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  updateCountryStatus(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const updatestatusURL = this.userEndPoints + 'usercountrycheck';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updatestatusURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getShipTypeDeviation(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const typedeviationURL = this.userEndPoints + 'typedeviation';
    data = JSON.stringify(data);
    return this.http
      .post<any>(typedeviationURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getShipTypeDeviationDetails(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const typedeviationdetailsURL = this.userEndPoints + 'explain';
    data = JSON.stringify(data);
    return this.http
      .post<any>(typedeviationdetailsURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getDestinationDeviation(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const destinationdeviationURL = this.userEndPoints + 'destdeviation';
    data = JSON.stringify(data);
    return this.http
      .post<any>(destinationdeviationURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getAnchorageDeviation(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const anchoragedeviationURL = this.userEndPoints + 'anchdeviation';
    data = JSON.stringify(data);
    return this.http
      .post<any>(anchoragedeviationURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }
  // end dashboard

  // Density map
  getRangeBlock(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getrangeblockURL = this.densityEndPoints + 'colorblock?userid=';
    return this.http.get(getrangeblockURL + userid, httpTokenHeader);
  }

  getTopNPorts(n, userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const gettopnportsURL = this.densityEndPoints + 'nports?top=';
    return this.http.get(gettopnportsURL + n + '&userid=' + userid, httpTokenHeader);
  }

  getDensityMapData(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const densityMapURL = this.densityEndPoints + 'dmap';
    data = JSON.stringify(data);
    return this.http
      .post<any>(densityMapURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getDensityMapShipData(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const densityMaplkpURL = this.densityEndPoints + 'dmaplkp';
    data = JSON.stringify(data);
    return this.http
      .post<any>(densityMaplkpURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }
  // End Density map

  // Main nav bar
  clockStatus(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const clockstatusURL = this.userEndPoints + 'pause';
    data = JSON.stringify(data);
    return this.http
      .post<any>(clockstatusURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getLocalTime(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getlocaltimeURL = this.userEndPoints + 'getuserlocaltime?userid=';
    return this.http.get(getlocaltimeURL + userid, httpTokenHeader);
  }

  updateTheme(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const updatethemeURL = this.userEndPoints + 'updateusertheme';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updatethemeURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  updateSpeed(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const updateclockspeedURL = this.userEndPoints + 'updateclockspeed';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updateclockspeedURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  updateLocalTime(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const updatelocaltimeURL = this.userEndPoints + 'updatelocaltime';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updatelocaltimeURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getSearchHistory(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getsearchhistoryURL = this.userEndPoints + 'recenthistory?userid=';
    return this.http.get(getsearchhistoryURL + userid, httpTokenHeader);
  }

  getSearchOptionsResult(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getsearchoptionsresultURL = this.shipEndPoints + 'search';
    data = JSON.stringify(data);
    return this.http
      .post<any>(getsearchoptionsresultURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getSearchResult(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const searchresultURL = this.shipEndPoints + 'searchresult';
    data = JSON.stringify(data);
    return this.http
      .post<any>(searchresultURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  // End main nav bar


  // Region of interest
  getRoIDetailsForUser(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const roidetailsforuserURL = this.shipEndPoints + 'regionsofinterest?userid=';
    return this.http.get(roidetailsforuserURL + userid, httpTokenHeader);
  }

  getShipDetailsBasedOnRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getshipdetailsbasedonroiURL = this.shipEndPoints + 'roi';
    data = JSON.stringify(data);
    return this.http
      .post<any>(getshipdetailsbasedonroiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getStatInfo(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getstatinfoURL = this.shipEndPoints + 'statsinfo';
    data = JSON.stringify(data);
    return this.http
      .post<any>(getstatinfoURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getTrajDetailsBasedOnRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const gettrajdetailsbasedonroiURL = this.shipEndPoints + 'roitraj';
    data = JSON.stringify(data);
    return this.http
      .post<any>(gettrajdetailsbasedonroiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getAnomalyInfoInRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getAnomalyInfoInRoIURL = this.shipEndPoints + 'roianomaly';
    data = JSON.stringify(data);
    return this.http
      .post<any>(getAnomalyInfoInRoIURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getAllCategories(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getAllCategoryURL = this.shipEndPoints + 'getallcategory?userid=';
    return this.http.get(getAllCategoryURL + userid, httpTokenHeader);
  }

  // End Region of interest

  // Ship of interest
  getSoIDetailsForUser(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const soidetailsforuserURL = this.shipEndPoints + 'shipsofinterest?userid=';
    return this.http.get(soidetailsforuserURL + userid, httpTokenHeader);
  }

  checkOrUncheckSoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const checkorunchecksoiURL = this.shipEndPoints + 'soicheck';
    data = JSON.stringify(data);
    return this.http
      .post<any>(checkorunchecksoiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  soiTrackInfo(trackinfo): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const soitrackinfoURL = this.shipEndPoints + 'soitrackinfo';
    trackinfo = JSON.stringify(trackinfo);
    return this.http
      .post<any>(soitrackinfoURL, trackinfo, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getGoIDetailsForUser(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const goidetailsforuserURL = this.shipEndPoints + 'groupsofinterest?userid=';
    return this.http.get(goidetailsforuserURL + userid, httpTokenHeader);
  }

  getSelectedSoIDetails(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const soigoidetailsURL = this.shipEndPoints + 'soigoiplot';
    data = JSON.stringify(data);
    return this.http
      .post<any>(soigoidetailsURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  goiTrackInfo(trackinfo): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const goitrackinfoURL = this.shipEndPoints + 'goitrackinfo';
    trackinfo = JSON.stringify(trackinfo);
    return this.http
      .post<any>(goitrackinfoURL, trackinfo, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  shipTrack(shiptrackdata): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const shipTrajectoryURL = this.shipEndPoints + 'shiptrack';
    shiptrackdata = JSON.stringify(shiptrackdata);
    return this.http
      .post(shipTrajectoryURL, shiptrackdata, httpTokenHeader)
      .pipe(catchError(this.errorHandler));

  }

  // End Ship of interest

  // Side Nav
  getFeatureForRole(roleid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getfeatureforroleURL = this.userEndPoints + 'getfeatureforrole?roleid=';
    return this.http.get(getfeatureforroleURL + roleid, httpTokenHeader);
  }
  // End Side Nav

  // Live map

  getShips(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const shipURL = this.shipEndPoints + 'ships';
    data = JSON.stringify(data);
    return this.http
      .post<any>(shipURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getShipDetails(mmsi, localtime, userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getshipdetailsURL = this.shipEndPoints + 'mmsidetail?mmsi=';
    return this.http.get(getshipdetailsURL + mmsi + '&localtime=' + localtime + '&userid=' + userid, httpTokenHeader);
  }

  updateMapType(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const updatemaptypeURL = this.userEndPoints + 'updateusermap';
    data = JSON.stringify(data);
    return this.http
      .post<any>(updatemaptypeURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getKnownAnchors(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const knownAnchorsURL = this.shipEndPoints + 'knownanchors?userid=';
    return this.http.get(knownAnchorsURL + userid, httpTokenHeader);
  }

  getPredictedAnchors(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const predictedAnchorsURL = this.shipEndPoints + 'predictedanchors?userid=';
    return this.http.get(predictedAnchorsURL + userid, httpTokenHeader);
  }

  getPorts(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const portsURL = this.shipEndPoints + 'ports?userid=';
    return this.http.get(portsURL + userid, httpTokenHeader);
  }

  addSoI(addSOI): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const addSoiURL = this.shipEndPoints + 'soitodb';
    addSOI = JSON.stringify(addSOI);
    return this.http
      .post<any>(addSoiURL, addSOI, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  deleteSoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const deletesoiURL = this.shipEndPoints + 'soidelete';
    data = JSON.stringify(data);
    return this.http
      .post<any>(deletesoiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  addGoI(groupSoiData): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const groupsofinterestURL = this.shipEndPoints + 'goitodb';
    groupSoiData = JSON.stringify(groupSoiData);
    return this.http
      .post<any>(groupsofinterestURL, groupSoiData, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  addGroupWithoutMMSI(groupSoiData): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const addgroupURL = this.shipEndPoints + 'creategroup';
    groupSoiData = JSON.stringify(groupSoiData);
    return this.http
      .post<any>(addgroupURL, groupSoiData, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  deleteGoI(addGOI): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const deletegoiURL = this.shipEndPoints + 'goidelete';
    addGOI = JSON.stringify(addGOI);
    return this.http
      .post<any>(deletegoiURL, addGOI, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  editGoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const editgoiURL = this.shipEndPoints + 'editgoi';
    data = JSON.stringify(data);
    return this.http
      .post<any>(editgoiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  addRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const addroiURL = this.shipEndPoints + 'addroi';
    data = JSON.stringify(data);
    return this.http
      .post<any>(addroiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  editRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const editroiURL = this.shipEndPoints + 'editroi';
    data = JSON.stringify(data);
    return this.http
      .post<any>(editroiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  deleteRoI(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const deleteroiURL = this.shipEndPoints + 'deleteroi';
    data = JSON.stringify(data);
    return this.http
      .post<any>(deleteroiURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPredictClass(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const predictclassURL = this.mlEndPoints + 'vessel';
    data = JSON.stringify(data);
    return this.http
      .post<any>(predictclassURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPredictedTypeExplain(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const predictclassexplainURL = this.userEndPoints + 'popupexplain';
    data = JSON.stringify(data);
    return this.http
      .post<any>(predictclassexplainURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPredictRoute(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const predictRouteURL = this.mlEndPoints + 'route';
    data = JSON.stringify(data);
    return this.http
      .post<any>(predictRouteURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPredictRouteWithTime(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = 'http://20.20.20.5:5002/prediction';
    data = JSON.stringify(data);
    return this.http
      .post<any>(url, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }


  getPredictDestination(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const predictDestinationURL = this.mlEndPoints + 'destination';
    data = JSON.stringify(data);
    return this.http
      .post<any>(predictDestinationURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPastTrack(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const pastTrackURL = this.shipEndPoints + 'pasttrack';
    data = JSON.stringify(data);
    return this.http
      .post<any>(pastTrackURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  // End Live map


  //  play history
  getSearchResultInPlayHistory(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const searchURL = this.playhistoryEndPoints + 'search';
    data = JSON.stringify(data);
    return this.http
      .post<any>(searchURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getShipsLKP(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const lkpURL = this.playhistoryEndPoints + 'lkp';
    return this.http.get(lkpURL, httpTokenHeader);
  }

  addToList(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const AddToListURL = this.playhistoryEndPoints + 'history';
    data = JSON.stringify(data);
    return this.http
      .post<any>(AddToListURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getHistoryList(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getuserhistoryURL = this.playhistoryEndPoints + 'userhistory?userid=';
    return this.http.get(getuserhistoryURL + userid, httpTokenHeader);
  }

  deleteFromHistoryList(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const deleteFromHistoryListURL = this.playhistoryEndPoints + 'delhistory';
    data = JSON.stringify(data);
    return this.http
      .post<any>(deleteFromHistoryListURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getPlayHistory(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const playHistoryDataURL = this.playhistoryEndPoints + 'playhist';
    data = JSON.stringify(data);
    return this.http
      .post<any>(playHistoryDataURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }
  // end play history

  // Function service
  logout(userid, logout): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const logoutURL = this.userEndPoints + 'logout?userid=';
    return this.http.get(logoutURL + userid + '&logout=' + logout, httpTokenHeader);
  }
  // End Funstion service

  // User Inputs
  userInputs(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const userinputURL = this.userEndPoints + 'userfb';
    data = JSON.stringify(data);
    return this.http
      .post<any>(userinputURL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }
  // End User Inputs

  // App
  getConfigparamters(): any {
    const getconfigparametersURL = this.userEndPoints + 'configparam';
    return this.http.get(getconfigparametersURL);
  }
  // End app

  logging(data): Observable<any> {
    const logs = this.densityEndPoints + 'logs';
    data = JSON.stringify(data);
    return this.http
      .post<any>(logs, data)
      .pipe(catchError(this.errorHandler));
  }

  // Queue requests
  getUserRequests(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'userrequest';
    return this.http.get(url, httpTokenHeader);
  }

  getAllRoles(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const getallrolesURL = this.userEndPoints + 'roles';
    return this.http.get(getallrolesURL, httpTokenHeader);
  }

  newAccountApproveOrDecline(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'acntrequest';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  forgotPasswordApproveOrDecline(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'pwdrequest';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  resetPassword(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'resetpwd';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  updateForgotusername(rid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'namerequest?request_id=';
    return this.http.get(url + rid, httpTokenHeader);
  }


  // End queue requests

  // user requests
  getAllUsers(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'users';
    return this.http.get(url, httpTokenHeader);
  }

  deleteUser(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'deleteuser?userid=';
    return this.http.get(url + userid, httpTokenHeader);
  }

  editUser(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'edituser';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  addNewUser(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'adduser';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  // End User request

  // Roles And Permissions
  getAllRolesDetails(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'roles';
    return this.http.get(url, httpTokenHeader);
  }


  getAllFeatures(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'features';
    return this.http.get(url, httpTokenHeader);
  }

  addNewRole(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'newrole';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  editRole(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.adminEndPoints + 'editrole';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  deleteRole(id): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'deleterole?name=';
    return this.http.get(url + id, httpTokenHeader);
  }
  // End Roles And Permissions

  // Manage Ships
  getAllShips(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.adminEndPoints + 'ships';
    return this.http.get(url, httpTokenHeader);
  }

  // End Manage Ships

  // Edit Profile
  getUserProfileDetails(userid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.userEndPoints + 'profile?userid=';
    return this.http.get(url + userid, httpTokenHeader);
  }

  updateUserProfile(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.userEndPoints + 'editprofile';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  // End Edit Profile

  // Vessel Filter
  getSearchResultInVesselFilter(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'vfsearch';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getSearchedShipsResultInVesselFilter(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'vfsearchresult';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getVesselFilterData(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'vesselfilter';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }


  addToPreset(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'preset';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  getAllPreset(): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.vfEndPoints + 'userpreset';
    return this.http.get(url, httpTokenHeader);
  }


  getPresetResults(pid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.vfEndPoints + 'presetresult?pid=';
    return this.http.get(url + pid, httpTokenHeader);
  }

  editPreset(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'editpreset';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  deletePreset(pid): any {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const url = this.vfEndPoints + 'deletepreset?pid=';
    return this.http.get(url + pid, httpTokenHeader);
  }

  getVFTraj(data): Observable<any> {
    const httpTokenHeader = {
      headers: new HttpHeaders({
        'x-access-token': this.cookieService.get('token')
      })
    };
    const URL = this.vfEndPoints + 'trajectory';
    data = JSON.stringify(data);
    return this.http
      .post<any>(URL, data, httpTokenHeader)
      .pipe(catchError(this.errorHandler));
  }

  // End Vessel Filter

  errorHandler(error: HttpErrorResponse): any {
    return throwError(error.error || 'server error.');
  }

}
