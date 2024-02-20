import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  private vesselCountSource = new BehaviorSubject(0);
  vesselCount = this.vesselCountSource.asObservable();

  private zoomLevelSource = new BehaviorSubject(0);
  zoomLevel = this.zoomLevelSource.asObservable();

  private htmlSource = new BehaviorSubject('');
  html = this.htmlSource.asObservable();

  private NavbarInROISource = new BehaviorSubject(false);
  NavbarInROI = this.NavbarInROISource.asObservable();

  private navbarInVFSource = new BehaviorSubject(false);
  navbarInVF = this.navbarInVFSource.asObservable();

  private themeSource = new BehaviorSubject('');
  theme = this.themeSource.asObservable();

  private SOISource = new BehaviorSubject('');
  SOI = this.SOISource.asObservable();

  private ROISource = new BehaviorSubject('');
  ROI = this.ROISource.asObservable();

  private updateSOISource = new BehaviorSubject('');
  updatesoi = this.updateSOISource.asObservable();

  private updateGOISource = new BehaviorSubject('');
  updategoi = this.updateGOISource.asObservable();

  private updateROISource = new BehaviorSubject('');
  updateroi = this.updateROISource.asObservable();

  private VFSource = new BehaviorSubject('');
  VF = this.VFSource.asObservable();

  private ExtentSource = new BehaviorSubject('');
  Extent = this.ExtentSource.asObservable();

  private EditExtentSource = new BehaviorSubject('');
  EditExtent = this.EditExtentSource.asObservable();

  private DMSource = new BehaviorSubject('');
  DM = this.DMSource.asObservable();

  private VFUpdateSource = new BehaviorSubject('');
  updatevf = this.VFUpdateSource.asObservable();

  constructor() { }

    // changing vessel count
    changeVesselCount(message): void {
      this.vesselCountSource.next(message);
    }

    changeZoomLevel(message): void {
      this.zoomLevelSource.next(message);
    }

    changeHTMLPage(message): void {
      this.htmlSource.next(message);
    }
    // change time series visible in main nav
    changeNavbarInROI(message): void {
      this.NavbarInROISource.next(message);
    }

    // change time and search visible in nav bar
    changeNavbarInVF(message): void {
      this.navbarInVFSource.next(message);
    }

    // Changing theme
    changetheme(message): void {
      this.themeSource.next(message);
    }

    // Updating soi ships
    changedtoSOI(message): void {
      this.SOISource.next(message);
    }

    // Updating roi ships
    changedtoROI(message): void {
      this.ROISource.next(message);
    }

    // updating soi details
    SOIupdate(msg): void {
      this.updateSOISource.next(msg);
    }

    // updating goi details
    GOIupdate(msg): void {
      this.updateGOISource.next(msg);
    }

    // updating roi details
    ROIupdate(msg): void {
      this.updateROISource.next(msg);
    }

    // Features is change to vessel filter
    changedtoVF(message): void {
      this.VFSource.next(message);
    }

    addExtentInVF(message): void {
      this.ExtentSource.next(message);
    }

    editExtentInVF(message): void {
      this.EditExtentSource.next(message);
    }

    // Features is change to Density Map
    changedtoDM(message): void {
      this.DMSource.next(message);
    }

    VesselFilterListUpdate(message): void {
      this.VFUpdateSource.next(message);
    }
}
