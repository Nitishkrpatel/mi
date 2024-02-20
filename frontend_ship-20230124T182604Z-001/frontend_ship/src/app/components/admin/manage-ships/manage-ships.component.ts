import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../shared/Admin.service';
import { FunctionService } from '../../shared/functions.service';
import { ServiceService } from '../../shared/service.service';
import { CookieService } from 'ngx-cookie-service';
import { Sort } from '@angular/material/sort';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-ships',
  templateUrl: './manage-ships.component.html',
  styleUrls: ['./manage-ships.component.scss']
})
export class ManageShipsComponent implements OnInit, AfterViewInit {
  shipsSub: Subscription;
  manageShips = false;
  allShips = [];
  allShipsSortedData = [];
  itemsPerPage = 10;
  currentPage = 1;
  shipSearchedCount = 0;
  seachedTextCount = 0;
  theme = '';

  constructor(public Adminservice: AdminService, private functionservice: FunctionService,
              private service: ServiceService, private cookieService: CookieService) { }

  shipSearchForm = new FormGroup({
    search_text: new FormControl('')
  });

  ngOnInit(): void {
    this.theme = this.cookieService.get('theme');
  }

  ngAfterViewInit(): void {
    this.shipsSub = this.Adminservice.MS.subscribe(message => {
      if (message === 'true') {
        this.manageShips = true;
        this.getAllShips();
        if (document.getElementById('Manage-Ships') !== null ) {
          if (this.theme === 'navy') {
            document.getElementById('Manage-Ships_img').setAttribute('src', '../../../../assets/admin/selected/Manage-Ships.svg');
          } else {
            document.getElementById('Manage-Ships_img').setAttribute('src', '../../../../assets/admin/selected-white/Manage-Ships.svg');
          }
          document.getElementById('Manage-Ships').setAttribute('class', 'admin-active-background');
        }
      } else {
        this.manageShips = false;
        if (document.getElementById('Manage-Ships') !== null) {
          if (this.theme === 'navy') {
            document.getElementById('Manage-Ships_img').setAttribute('src', '../../../../assets/admin/navy/Manage-Ships.svg');
          } else {
            document.getElementById('Manage-Ships_img').setAttribute('src', '../../../../assets/admin/Manage-Ships.svg');
          }
          document.getElementById('Manage-Ships').removeAttribute('class');
        }
      }
    });
  }

  /* Get all ships information.
    Method type: Get.
    Request Parameters:
    Expected response: All Ships details.
    Process: Success- All ships details which comes as a response is stored in a variable(allShips).
              Failure or error- Error message is displayed on the top. */
  getAllShips(): void {
    const startDate = new Date();
    const functionName = 'Get All ships';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllShips().subscribe((result) => {
      if (result.status === 'success') {
        this.allShips = result.data;
        this.allShipsSortedData = this.allShips.slice();
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Sorting Ship data
  sortShipData(sort: Sort): any {
    const data = this.allShips.slice();

    if (!sort.active || sort.direction === '') {
      this.allShipsSortedData = data;
      return;
    }
    this.allShipsSortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sn':
          return this.compare(a.sn, b.sn, isAsc);
        case 'msi':
          return this.compare(a.msi, b.msi, isAsc);
        case 'im':
          return this.compare(a.im, b.im, isAsc);
        case 'ct':
          return this.compare(a.ct, b.ct, isAsc);
        case 'cls':
          return this.compare(a.cls, b.cls, isAsc);
        case 'co':
          return this.compare(a.co, b.co, isAsc);
        case 'ln':
          return this.compare(a.ln, b.ln, isAsc);
        case 'wd':
          return this.compare(a.wd, b.wd, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Local search for ships
  getSearchResultForShips(e): void {
    const shipsdata = this.allShips.filter(obj => {
      if (obj.sn !== null) {
        const name = obj.sn.toString().toUpperCase();
        if (name.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.msi !== null) {
        const msi = obj.msi.toString().toUpperCase();
        if (msi.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.im !== null) {
        const im = obj.im.toString().toUpperCase();
        if (im.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.ct !== null) {
        const ct = obj.ct.toString().toUpperCase();
        if (ct.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.cls !== null) {
        const cls = obj.cls.toString().toUpperCase();
        if (cls.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.ln !== null) {
        const ln = obj.ln.toString().toUpperCase();
        if (ln.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

      if (obj.wd !== null) {
        const wd = obj.wd.toString().toUpperCase();
        if (wd.indexOf(e.toUpperCase()) >= 0) {
          return obj;
        }
      }

    });
    this.allShipsSortedData = shipsdata.slice();
    this.currentPage = 1;
    this.seachedTextCount = e.length;
    this.shipSearchedCount = this.allShipsSortedData.length;
  }

    // Clear Search
    clearSearch(): void {
      this.shipSearchForm.setValue({search_text: ''});
      this.getSearchResultForShips('');
    }
}
