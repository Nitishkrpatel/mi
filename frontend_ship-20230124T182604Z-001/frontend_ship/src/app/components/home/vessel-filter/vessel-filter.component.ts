import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/Data.service';
import { Subscription } from 'rxjs';
import { ServiceService } from '../../shared/service.service';
import { FunctionService } from '../../shared/functions.service';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vessel-filter',
  templateUrl: './vessel-filter.component.html',
  styleUrls: ['./vessel-filter.component.scss']
})
export class VesselFilterComponent implements OnInit {

  constructor(private service: ServiceService, private Dataservice: DataService, private toastr: ToastrService,
              private functionservice: FunctionService, private cookieService: CookieService) { }

  vfsub: Subscription;
  featureSelectedVF: string;
  featureSelectedVFSidenav: boolean;

  allCategory = [];
  selectedVFCategory = [];
  selectedvfcat = [];
  selectallvfcat: boolean;
  userId: string;

  extentsub: Subscription;
  extent: any;



  deletingPreset = '';
  selectedPreset = '';

  searchOptions = [
    { name: 'Ship Name', value: 'Ship_name' },
    { name: 'MMSI', value: 'MMSI' },
    { name: 'IMO', value: 'IMO' },
    { name: 'Country Of Origin', value: 'COO' },
    { name: 'End Port', value: 'End_port' }
  ];
  selectallsearch: boolean;
  selectedSearch = [];
  selectedSearchOption = [];
  searchresult = [];
  vesselFilterResultLKP = [];
  vesselFilterTrack = [];
  tracksLength = 0;
  psubmitted = false;
  presetExpanded = false;
  allPreset = [];

  addPresetFlag = false;

  UpdatevfSub: Subscription;

  editPresetFlag = false;
  editingPresetName = '';
  editingPresetID = '';
  selectalleditsearch: boolean;
  editselectedSearchOption = [];
  editselectedSearch = [];

  editselectedVFCategory = [];
  editselectedvfcat = [];
  editselectallvfcat: boolean;
  editFromDate = '';
  editToDate = '';
  editextentsub: Subscription;
  editextent: any;
  edisubmitted = false;


  @Output() VFSelectedEvent = new EventEmitter();
  @Output() VFSelectedMarkEvent = new EventEmitter();
  @Output() markextentEvent = new EventEmitter();
  @Output() editPresetEvent = new EventEmitter();
  @Output() markEditEvent = new EventEmitter();
  @Output() deletePresetEvent = new EventEmitter();
  @Output() editextentEvent = new EventEmitter();

  vesselFilterForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl('')
  });

  SearchForm = new FormGroup({
    Ship_name: new FormControl(''),
    MMSI: new FormControl(''),
    IMO: new FormControl(''),
    COO: new FormControl(''),
    End_port: new FormControl('')
  });

  AddPresetForm = new FormGroup({
    pname: new FormControl('', [Validators.required])
  });

  get p(): any {
    return this.AddPresetForm.controls;
  }


  EditDateTimeForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl('')
  });

  EditSearchForm = new FormGroup({
    Ship_name: new FormControl(''),
    MMSI: new FormControl(''),
    IMO: new FormControl(''),
    COO: new FormControl(''),
    End_port: new FormControl('')
  });

  EditPresetNameForm = new FormGroup({
    pname: new FormControl('', [Validators.required])
  });

  get ep(): any {
    return this.EditPresetNameForm.controls;
  }


  ngOnInit(): void {
    this.extent = [];
    this.userId = this.cookieService.get('userid');
    this.vfsub = this.Dataservice.VF.subscribe(message => {
      if (message === 'true') {
        // this.VFSelectedEvent.emit('Stop Live Map');
        document.getElementById('Vessel Filters').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted active-background');
        if (document.getElementById('Vessel Filters_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Vessel Filters_img').setAttribute('src', '../../../assets/features/selected_features_orange/Vessel-Filters.svg');
          } else {
            document.getElementById('Vessel Filters_img').setAttribute('src', '../../../assets/features/selected_features_white/Vessel-Filters.svg');
          }
        }
        if (document.getElementById('Vessel Filters_name') !== null) {
          document.getElementById('Vessel Filters_name').setAttribute('class', 'active_text');
        }
        if (this.featureSelectedVF === 'true') {
          this.featureSelectedVFSidenav = !this.featureSelectedVFSidenav;
        } else {
          this.featureSelectedVFSidenav = true;
        }
        this.featureSelectedVF = 'true';
        this.getAllCategory();
        this.Dataservice.changeNavbarInVF(true);

        this.UpdatevfSub = this.Dataservice.updatevf.subscribe(msg => {
          if (msg === 'update vessel filter list') {
            this.getAllPresets();
          }
          if (msg === 'update vessel filter Delete') {
            if (this.deletingPreset === this.selectedPreset) {
              this.vesselFilterResultLKP = [];
              this.VFSelectedEvent.emit(this.vesselFilterResultLKP);
              this.VFSelectedEvent.emit('Restart Live Map');
              this.vesselFilterTrack = [];
              this.tracksLength = 0;
              this.VFSelectedMarkEvent.emit('remove');
            }
          }
        });
      } else if (message === 'false') {
        this.Dataservice.changeNavbarInVF(false);
        this.featureSelectedVF = 'false';
        this.featureSelectedVFSidenav = false;

        document.getElementById('Vessel Filters').setAttribute('class', 'mat-list-item mat-focus-indicator mat-tooltip-trigger mat-list-item-avatar mat-list-item-with-avatar ng-star-inserted');
        if (document.getElementById('Vessel Filters_img')) {
          if (this.cookieService.get('theme') === 'navy') {
            document.getElementById('Vessel Filters_img').setAttribute('src', '../../../assets/features/blue_features/Vessel-Filters.svg');
          } else {
            document.getElementById('Vessel Filters_img').setAttribute('src', '../../../assets/features/Vessel-Filters.svg');
          }
        }
        if (document.getElementById('Vessel Filters_name') !== null) {
          document.getElementById('Vessel Filters_name').setAttribute('class', '');
        }
      }
    });
  }

  /* Get all categories
  Method type: Get.
  Request Parameters: userid
  Expected response: List of ship type categories.
  Process: Success- Details which comes has response is stored in variable(allCategory).
           Failure or error- Error message is displayed on the top. */
  getAllCategory(): void {
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get all category in vessel filter';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllCategories(this.userId).subscribe((result) => {
      if (result.status === 'success') {
        this.setVFwaitState(false);
        this.allCategory = result.data;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // click on select all check box for category
  onSelectAll(event): void {
    if (event.target.checked === true) {
      this.allCategory.forEach(cat => {
        this.selectedVFCategory.push(cat.vessel_category);
        this.selectedvfcat[cat.vessel_category] = true;
      });
      this.selectallvfcat = true;
    }
    else {
      this.selectedVFCategory = [];
      this.selectedvfcat = [];
      this.selectallvfcat = false;
    }
  }

  // click on select check box for individual category
  vfShiptypecheckboxchange(e): void {
    if (e.target.checked) {
      this.selectedVFCategory.push(e.target.value);
      this.selectedvfcat[e.target.value] = true;
    }
    else {
      const index = this.selectedVFCategory.indexOf(e.target.value);
      if (index > -1) {
        this.selectedVFCategory.splice(index, 1);
      }
      this.selectedvfcat[e.target.value] = false;
      this.selectallvfcat = false;
    }
  }

  // Toggle Extent
  toggleExtent(): void {
    const toggleswitch = document.getElementById('extent-switch').getAttribute('src');
    if (toggleswitch === '../../../assets/vf/switch-offf.svg') {
      if (this.vesselFilterForm.value.from_date === '' && this.vesselFilterForm.value.to_date === '') {
        this.toastr.warning('From date / to date should be selected, to select a region.', '', {
          timeOut: 3000,
        });
      } else {
        document.getElementById('extent-switch').setAttribute('src', '../../../assets/vf/switch-on.svg');
        this.markextentEvent.emit('yes');
        this.extentsub = this.Dataservice.Extent.subscribe(message => {
          if (message !== '') {
            this.extent = message[0];
            document.getElementById('extent-switch').setAttribute('src', '../../../assets/vf/switch-offf.svg');
          }
        });
      }
    } else {
      document.getElementById('extent-switch').setAttribute('src', '../../../assets/vf/switch-offf.svg');
      this.markextentEvent.emit('no');
    }
  }

  // On Select all search
  onSelectAllSearch(event): void {
    if (event.target.checked === true) {
      this.searchOptions.forEach(option => {
        this.selectedSearchOption.push(option.value);
        this.selectedSearch[option.value] = true;
        document.getElementById(option.value + '_inputdiv').setAttribute('style', 'display: block');
      });
      this.selectallsearch = true;
    }
    else {
      this.selectedSearchOption = [];
      this.selectedSearch = [];
      this.selectallsearch = false;
      this.searchOptions.forEach(option => {
        document.getElementById(option.value + '_inputdiv').setAttribute('style', 'display: none');
        document.getElementById(option.value + '_result').setAttribute('style', 'display: none');
      });
    }
    this.SearchForm.setValue({
      Ship_name: '', MMSI: '', IMO: '',
      COO: '', End_port: ''
    });
  }

  // On select for individual checkbox
  searchCheckBoxChange(e): void {
    if (e.target.checked) {
      this.selectedSearchOption.push(e.target.value);
      this.selectedSearch[e.target.value] = true;
      document.getElementById(e.target.value + '_inputdiv').setAttribute('style', 'display: block');
    }
    else {
      const index = this.selectedSearchOption.indexOf(e.target.value);
      if (index > -1) {
        this.selectedSearchOption.splice(index, 1);
      }
      this.selectedSearch[e.target.value] = false;
      this.selectallsearch = false;
      document.getElementById(e.target.value + '_inputdiv').setAttribute('style', 'display: none');
      document.getElementById(e.target.value + '_result').setAttribute('style', 'display: none');
      this.setSearchFormValues('', e.target.value);
    }

  }

  /* Get search data.
  Method type: Post.
  Request Parameters: searchtext, criteria, fromdate, todate, localtime.
  Expected response: Searched data.
  Process: Success- Searched data which comes has response is stored in variable(searchresult).
           Failure or error- Error message is displayed on the top. */
  onSearchkeyup(id, e): void {
    let fromDate = '';
    let toDate = '';
    if (this.vesselFilterForm.value.from_date !== '') {
      fromDate = formatDate(this.vesselFilterForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.vesselFilterForm.value.to_date !== '') {
      toDate = formatDate(this.vesselFilterForm.value.to_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    const reqData = {
      criteria: id, search_text: e.target.value, from_date: fromDate,
      to_date: toDate, localtime: this.cookieService.get('localtime')
    };
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get search results in vessel filter';
    this.functionservice.functionCallLogging(functionName);
    this.service.getSearchResultInVesselFilter(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.setVFwaitState(false);
          this.searchresult = data.data;
          document.getElementById(id + '_result').setAttribute('style', 'display: block');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // on search input focus
  onSearchFocus(): void {
    this.searchOptions.forEach(option => {
      if (document.getElementById(option.value + '_result') !== null) {
        document.getElementById(option.value + '_result').setAttribute('style', 'display: none');
      }
      if (document.getElementById(option.value + '_editresult') !== null) {
        document.getElementById(option.value + '_editresult').setAttribute('style', 'display: none');
      }
    });
  }

  // selected a searched option
  selectedOption(val, cType): void {
    document.getElementById(cType + '_result').setAttribute('style', 'display: none');
    this.setSearchFormValues(val, cType);
  }

  // setting values for the search form
  setSearchFormValues(val, type): void {
    if (type === 'Ship_name') {
      this.SearchForm.setValue({
        Ship_name: val, MMSI: this.SearchForm.value.MMSI, IMO: this.SearchForm.value.IMO,
        COO: this.SearchForm.value.COO, End_port: this.SearchForm.value.End_port
      });
    }
    if (type === 'MMSI') {
      this.SearchForm.setValue({
        Ship_name: this.SearchForm.value.Ship_name, MMSI: val, IMO: this.SearchForm.value.IMO,
        COO: this.SearchForm.value.COO, End_port: this.SearchForm.value.End_port
      });
    }
    if (type === 'IMO') {
      this.SearchForm.setValue({
        Ship_name: this.SearchForm.value.Ship_name, MMSI: this.SearchForm.value.MMSI, IMO: val,
        COO: this.SearchForm.value.COO, End_port: this.SearchForm.value.End_port
      });
    }
    if (type === 'COO') {
      this.SearchForm.setValue({
        Ship_name: this.SearchForm.value.Ship_name, MMSI: this.SearchForm.value.MMSI,
        IMO: this.SearchForm.value.IMO, COO: val, End_port: this.SearchForm.value.End_port
      });
    }
    if (type === 'End_port') {
      this.SearchForm.setValue({
        Ship_name: this.SearchForm.value.Ship_name, MMSI: this.SearchForm.value.MMSI,
        IMO: this.SearchForm.value.IMO, COO: this.SearchForm.value.COO, End_port: val
      });
    }
  }

  /* Submit Vessel Filter
  Method type: Post.
  Request Parameters: from_date, to_date, search_text, category, top_left_coord, top_right_coord,
                      bottom_right_coord, bottom_left_coord, localtime
  Expected response: Last known positions for the ships and number of track details for seletced filter.
  Process: Success- Details which comes has response is stored in variable(vesselFilterResultLKP, vesselFilterTrack).
           Failure or error- Error message is displayed on the top. */
  submitVF(): void {
    document.getElementById('vf-submit').setAttribute('class', 'btn VF-submit-btn active-btn');
    this.vesselFilterResultLKP = [];
    this.vesselFilterTrack = [];
    this.tracksLength = 0;
    let reqData;
    let fromDate = '';
    let toDate = '';
    if (this.vesselFilterForm.value.from_date !== '') {
      fromDate = formatDate(this.vesselFilterForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.vesselFilterForm.value.to_date !== '') {
      toDate = formatDate(this.vesselFilterForm.value.to_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    if (this.extent.length !== 0) {
      reqData = {
        from_date: fromDate, to_date: toDate, search_text: this.SearchForm.value,
        category: this.selectedVFCategory, top_left_coord: this.extent[3], top_right_coord: this.extent[2],
        bottom_right_coord: this.extent[1], bottom_left_coord: this.extent[0], localtime: this.cookieService.get('localtime')
      };
    } else {
      reqData = {
        from_date: fromDate, to_date: toDate, search_text: this.SearchForm.value,
        category: this.selectedVFCategory, top_left_coord: '', top_right_coord: '',
        bottom_right_coord: '', bottom_left_coord: '', localtime: this.cookieService.get('localtime')
      };
    }
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get vessel filter';
    this.functionservice.functionCallLogging(functionName);
    this.service.getVesselFilterData(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          document.getElementById('vf-submit').setAttribute('class', 'btn VF-submit-btn');
          this.setVFwaitState(false);
          this.vesselFilterResultLKP = data.data;
          this.Dataservice.changeVesselCount(this.vesselFilterResultLKP.length);
          this.vesselFilterResultLKP.forEach(mmsi => {
            mmsi.localtime = data.plottime;
            mmsi.fromdate = data.from_date;
            mmsi.todate = data.to_date;
            mmsi.vfData = true;
          });
          this.vesselFilterTrack = data.tracks;
          this.tracksLength = this.vesselFilterTrack.length;
          this.VFSelectedEvent.emit('Stop Live Map');
          this.VFSelectedEvent.emit(this.vesselFilterResultLKP);
          this.addPresetFlag = true;
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        document.getElementById('vf-submit').setAttribute('class', 'btn VF-submit-btn');
      }
    );
  }

  // Open input box to add preset
  openAddPresetInput(): void {
    if (this.addPresetFlag === true) {
      this.getAllPresets();
      document.getElementById('presetInputform').setAttribute('style', 'display: block');
      this.presetExpanded = true;
    } else {
      this.toastr.warning('Submit Vessel filter before adding to preset', '', {
        timeOut: 3000,
      });
    }

  }

  /* Add Preset
  Method type: Post.
  Request Parameters: from_date, to_date, search_text, category, top_left_coord, top_right_coord,
                      bottom_right_coord, bottom_left_coord, localtime
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
           Failure or error- Error message is displayed on the top. */
  addPreset(): void {
    this.psubmitted = true;
    if (this.AddPresetForm.invalid) {
      return;
    }
    let reqData;
    let fromDate = '';
    let toDate = '';
    if (this.vesselFilterForm.value.from_date !== '') {
      fromDate = formatDate(this.vesselFilterForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.vesselFilterForm.value.to_date !== '') {
      toDate = formatDate(this.vesselFilterForm.value.to_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.extent.length !== 0) {
      reqData = {
        pname: this.AddPresetForm.value.pname, search_text: this.SearchForm.value, from_date: fromDate,
        to_date: toDate, category: this.selectedVFCategory,
        top_left_coord: this.extent[3], top_right_coord: this.extent[2],
        bottom_right_coord: this.extent[1], bottom_left_coord: this.extent[0],
        localtime: this.cookieService.get('localtime'), result: this.vesselFilterResultLKP,
        tracks: this.vesselFilterTrack, userid: this.userId
      };
    } else {
      reqData = {
        pname: this.AddPresetForm.value.pname, search_text: this.SearchForm.value, from_date: fromDate,
        to_date: toDate, category: this.selectedVFCategory,
        top_left_coord: '', top_right_coord: '', bottom_right_coord: '', bottom_left_coord: '',
        localtime: this.cookieService.get('localtime'), result: this.vesselFilterResultLKP,
        tracks: this.vesselFilterTrack, userid: this.userId
      };
    }
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Add to preset';
    this.functionservice.functionCallLogging(functionName);
    this.service.addToPreset(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.getAllPresets();
          document.getElementById('presetInputform').setAttribute('style', 'display: none');
          this.addPresetFlag = false;
          this.vesselFilterForm.setValue({ from_date: '', to_date: '' });
          this.SearchForm.setValue({
            Ship_name: '', MMSI: '', IMO: '',
            COO: '', End_port: ''
          });
          this.AddPresetForm.setValue({ pname: '' });
          this.selectedVFCategory = [];
          this.extent = [];
          this.selectedvfcat = [];
          this.selectedSearch = [];
          this.vesselFilterResultLKP = [];

          this.VFSelectedEvent.emit(this.vesselFilterResultLKP);
          this.VFSelectedEvent.emit('Restart Live Map');
          this.tracksLength = 0;
          this.VFSelectedMarkEvent.emit('remove add');
          this.vesselFilterTrack = [];
          this.searchOptions.forEach(option => {
            document.getElementById(option.value + '_inputdiv').setAttribute('style', 'display: none');
            document.getElementById(option.value + '_result').setAttribute('style', 'display: none');
          });
          this.setVFwaitState(false);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === 'failure') {
          this.AddPresetForm.controls.pname.setErrors({ duplicate: true });
          this.functionservice.errorLogging(functionName, error.message, seconds);
        } else {
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      }
    );

  }


  /* Get all preset.
  Method type: Get.
  Request Parameters:
  Expected response: All preset details.
  Process: Success- All preset details which comes as a response is stored in a variable(allPreset).
            Failure or error- Error message is displayed on the top. */
  getAllPresets(): void {
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get All presets';
    this.functionservice.functionCallLogging(functionName);
    this.service.getAllPreset().subscribe((result) => {
      if (result.status === 'success') {
        this.setVFwaitState(false);
        this.allPreset = result.data;
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  /* Get preset results.
  Method type: Get.
  Request Parameters: pid
  Expected response: Preset LKP and trackdetails.
  Process: Success- Preset LKP and trackdetails which comes as a response is stored in a variable(vesselFilterResultLKP, vesselFilterTrack).
            Failure or error- Error message is displayed on the top. */
  changePresetSelection(pid): void {
    this.setVFwaitState(true);
    this.VFSelectedMarkEvent.emit('remove');
    this.selectedPreset = pid;
    this.vesselFilterResultLKP = [];
    this.vesselFilterTrack = [];
    this.tracksLength = 0;
    const startDate = new Date();
    const functionName = 'Get preset result';
    this.functionservice.functionCallLogging(functionName);
    this.service.getPresetResults(pid).subscribe((result) => {
      if (result.status === 'success') {
        this.vesselFilterResultLKP = result.data[0].result;
        this.Dataservice.changeVesselCount(this.vesselFilterResultLKP.length);
        this.vesselFilterTrack = result.data[0].track;
        this.tracksLength = this.vesselFilterTrack.length;
        this.vesselFilterResultLKP.forEach(mmsi => {
          mmsi.localtime = result.data[0].plottime;
          mmsi.fromdate = result.data[0].from_date;
          mmsi.todate = result.data[0].to_date;
          mmsi.vfData = true;
        });
        this.VFSelectedEvent.emit('Stop Live Map');
        this.VFSelectedEvent.emit(this.vesselFilterResultLKP);
        const extent = [[result.data[0].coords.bottom_left_coord, result.data[0].coords.bottom_right_coord,
        result.data[0].coords.top_right_coord, result.data[0].coords.top_left_coord,
        result.data[0].coords.bottom_left_coord]];
        this.VFSelectedMarkEvent.emit(extent);
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // Edit Preset
  editPreset(id, name): void {
    this.editPresetFlag = true;
    this.editingPresetID = id;
    this.editingPresetName = name;
    this.getEditData(id);
    this.VFSelectedMarkEvent.emit('remove');
    // const data = {pid: id, pname: name};
    // this.editPresetEvent.emit(data);
  }

  /* Get data for Edit Preset
  Method type: Get.
  Request Parameters: pid
  Expected response: Preset LKP and trackdetails.
  Process: Success- Preset LKP and trackdetails which comes as a response is stored in a variable(vesselFilterResultLKP, vesselFilterTrack).
            Failure or error- Error message is displayed on the top. */
  getEditData(pid): void {
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get edit preset data';
    this.functionservice.functionCallLogging(functionName);
    this.service.getPresetResults(pid).subscribe((result) => {
      if (result.status === 'success') {

        this.vesselFilterResultLKP = result.data[0].result;
        this.Dataservice.changeVesselCount(this.vesselFilterResultLKP.length);
        this.vesselFilterTrack = result.data[0].track;
        this.tracksLength = this.vesselFilterTrack.length;
        this.vesselFilterResultLKP.forEach(mmsi => {
          mmsi.localtime = result.data[0].plottime;
          mmsi.fromdate = result.data[0].from_date;
          mmsi.todate = result.data[0].to_date;
          mmsi.vfData = true;
        });
        this.VFSelectedEvent.emit('Stop Live Map');
        this.VFSelectedEvent.emit(this.vesselFilterResultLKP);

        // Setting values.
        this.EditPresetNameForm.setValue({ pname: result.data[0].preset_name });
        result.data[0].category.forEach(cat => {
          this.editselectedVFCategory.push(cat);
          this.editselectedvfcat[cat] = true;
        });
        this.EditSearchForm.setValue({
          Ship_name: result.data[0].search.Ship_name, MMSI: result.data[0].search.MMSI, IMO: result.data[0].search.IMO,
          COO: result.data[0].search.COO, End_port: result.data[0].search.End_port
        });
        const ShipName = 'Ship_name';
        const MMSI = 'MMSI';
        const IMO = 'IMO';
        const COO = 'COO';
        const EndPort = 'End_port';
        if (result.data[0].search.Ship_name !== '') {
          this.editselectedSearchOption.push('Ship_name');
          this.editselectedSearch[ShipName] = true;
          document.getElementById('Ship_name' + '_editinputdiv').setAttribute('style', 'display: block');
        }
        if (result.data[0].search.MMSI !== '') {
          this.editselectedSearchOption.push('MMSI');
          this.editselectedSearch[MMSI] = true;
          document.getElementById('MMSI' + '_editinputdiv').setAttribute('style', 'display: block');
        }
        if (result.data[0].search.IMO !== '') {
          this.editselectedSearchOption.push('IMO');
          this.editselectedSearch[IMO] = true;
          document.getElementById('IMO' + '_editinputdiv').setAttribute('style', 'display: block');
        }
        if (result.data[0].search.COO !== '') {
          this.editselectedSearchOption.push('COO');
          this.editselectedSearch[COO] = true;
          document.getElementById('COO' + '_editinputdiv').setAttribute('style', 'display: block');
        }
        if (result.data[0].search.End_port !== '') {
          this.editselectedSearchOption.push('End_port');
          this.editselectedSearch[EndPort] = true;
          document.getElementById('End_port' + '_editinputdiv').setAttribute('style', 'display: block');
        }

        if ( result.data[0].from_date !== null) {
          this.editFromDate = formatDate(result.data[0].from_date, 'dd-MM-yyyy,hh:mm a', 'en-US');
        }
        if ( result.data[0].to_date !== null) {
          this.editToDate = formatDate(result.data[0].to_date, 'dd-MM-yyyy,hh:mm a', 'en-US');
        }

        this.EditDateTimeForm.setValue({ from_date: this.editFromDate, to_date: this.editToDate });

        const eExtnet = [[result.data[0].coords.bottom_left_coord, result.data[0].coords.bottom_right_coord,
        result.data[0].coords.top_right_coord, result.data[0].coords.top_left_coord,
        result.data[0].coords.bottom_left_coord]];
        this.editextent = eExtnet[0];
        this.markEditEvent.emit(eExtnet);
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.successLogging(functionName + ' success', seconds);
      }
    },
      error => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      });
  }

  // cancel edit
  CancelEdit(): void {
    this.editPresetFlag = false;

    this.editselectedVFCategory = [];
    this.editselectedvfcat = [];
    this.EditSearchForm.setValue({
      Ship_name: '', MMSI: '', IMO: '',
      COO: '', End_port: ''
    });
    this.editselectedSearchOption = [];
    this.editselectedSearch = [];
    this.searchOptions.forEach(option => {
      document.getElementById(option.value + '_editinputdiv').setAttribute('style', 'display: none');
      document.getElementById(option.value + '_editresult').setAttribute('style', 'display: none');
    });
    this.editFromDate = '';
    this.editToDate = '';
    this.EditDateTimeForm.setValue({ from_date: '', to_date: '' });

    this.editextentEvent.emit('clear');

    this.vesselFilterResultLKP = [];
    this.VFSelectedEvent.emit(this.vesselFilterResultLKP);
    this.VFSelectedEvent.emit('Restart Live Map');
    this.vesselFilterTrack = [];
    this.tracksLength = 0;
  }

  // select all search in edit
  onSelectAllEditSearch(event): void {
    if (event.target.checked === true) {
      this.searchOptions.forEach(option => {
        this.editselectedSearchOption.push(option.value);
        this.editselectedSearch[option.value] = true;
        document.getElementById(option.value + '_editinputdiv').setAttribute('style', 'display: block');
      });
      this.selectalleditsearch = true;
    }
    else {
      this.editselectedSearchOption = [];
      this.editselectedSearch = [];
      this.selectalleditsearch = false;
      this.searchOptions.forEach(option => {
        document.getElementById(option.value + '_editinputdiv').setAttribute('style', 'display: none');
        document.getElementById(option.value + '_editresult').setAttribute('style', 'display: none');
      });
    }
    this.EditSearchForm.setValue({
      Ship_name: '', MMSI: '', IMO: '',
      COO: '', End_port: ''
    });
  }

  // select individual seach in edit
  editSearchCheckBoxChange(e): void {
    if (e.target.checked) {
      this.editselectedSearchOption.push(e.target.value);
      this.editselectedSearch[e.target.value] = true;
      document.getElementById(e.target.value + '_editinputdiv').setAttribute('style', 'display: block');
    }
    else {
      const index = this.editselectedSearchOption.indexOf(e.target.value);
      if (index > -1) {
        this.editselectedSearchOption.splice(index, 1);
      }
      this.editselectedSearch[e.target.value] = false;
      this.selectalleditsearch = false;
      document.getElementById(e.target.value + '_editinputdiv').setAttribute('style', 'display: none');
      document.getElementById(e.target.value + '_editresult').setAttribute('style', 'display: none');
      this.setEditSearchFormValues('', e.target.value);
    }

  }

  // select all ship type in edit
  onSelectAllEditVFCat(event): void {
    if (event.target.checked === true) {
      this.allCategory.forEach(cat => {
        this.editselectedVFCategory.push(cat.vessel_category);
        this.editselectedvfcat[cat.vessel_category] = true;
      });
      this.editselectallvfcat = true;
    }
    else {
      this.editselectedVFCategory = [];
      this.editselectedvfcat = [];
      this.editselectallvfcat = false;
    }
  }

  // select individual ship type in edit
  editvfShiptypecheckboxchange(e): void {
    if (e.target.checked) {
      this.editselectedVFCategory.push(e.target.value);
      this.editselectedvfcat[e.target.value] = true;
    }
    else {
      const index = this.editselectedVFCategory.indexOf(e.target.value);
      if (index > -1) {
        this.editselectedVFCategory.splice(index, 1);
      }
      this.editselectedvfcat[e.target.value] = false;
      this.editselectallvfcat = false;
    }
  }

  // set search values in edit
  setEditSearchFormValues(val, type): void {
    if (type === 'Ship_name') {
      this.EditSearchForm.setValue({
        Ship_name: val, MMSI: this.EditSearchForm.value.MMSI, IMO: this.EditSearchForm.value.IMO,
        COO: this.EditSearchForm.value.COO, End_port: this.EditSearchForm.value.End_port
      });
    }
    if (type === 'MMSI') {
      this.EditSearchForm.setValue({
        Ship_name: this.EditSearchForm.value.Ship_name, MMSI: val, IMO: this.EditSearchForm.value.IMO,
        COO: this.EditSearchForm.value.COO, End_port: this.EditSearchForm.value.End_port
      });
    }
    if (type === 'IMO') {
      this.EditSearchForm.setValue({
        Ship_name: this.EditSearchForm.value.Ship_name, MMSI: this.EditSearchForm.value.MMSI, IMO: val,
        COO: this.EditSearchForm.value.COO, End_port: this.EditSearchForm.value.End_port
      });
    }
    if (type === 'COO') {
      this.EditSearchForm.setValue({
        Ship_name: this.EditSearchForm.value.Ship_name, MMSI: this.EditSearchForm.value.MMSI,
        IMO: this.EditSearchForm.value.IMO, COO: val, End_port: this.EditSearchForm.value.End_port
      });
    }
    if (type === 'End_port') {
      this.EditSearchForm.setValue({
        Ship_name: this.EditSearchForm.value.Ship_name, MMSI: this.EditSearchForm.value.MMSI,
        IMO: this.EditSearchForm.value.IMO, COO: this.EditSearchForm.value.COO, End_port: val
      });
    }
  }

  /* Get search data.
 Method type: Post.
 Request Parameters: searchtext, criteria, fromdate, todate, localtime.
 Expected response: Searched data.
 Process: Success- Searched data which comes has response is stored in variable(searchresult).
          Failure or error- Error message is displayed on the top. */
  onEditSearchkeyup(id, e): void {
    let fromDate = '';
    let toDate = '';

    if (this.EditDateTimeForm.value.from_date !== '') {
      fromDate = formatDate(this.EditDateTimeForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.EditDateTimeForm.value.to_date !== '') {
      toDate = formatDate(this.EditDateTimeForm.value.to_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    const reqData = {
      criteria: id, search_text: e.target.value, from_date: fromDate,
      to_date: toDate, localtime: this.cookieService.get('localtime')
    };
    this.setVFwaitState(true);
    const startDate = new Date();
    const functionName = 'Get search results in vessel filter';
    this.functionservice.functionCallLogging(functionName);
    this.service.getSearchResultInVesselFilter(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.setVFwaitState(false);
          this.searchresult = data.data;
          document.getElementById(id + '_editresult').setAttribute('style', 'display: block');
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // select searched option in edit
  EditselectedOption(val, cType): void {
    document.getElementById(cType + '_editresult').setAttribute('style', 'display: none');
    this.setEditSearchFormValues(val, cType);
  }

  // Toggle extent in edit
  toggleEditExtent(): void {
    const toggleswitch = document.getElementById('edit-extent-switch').getAttribute('src');
    if (toggleswitch === '../../../assets/vf/switch-offf.svg') {
      if (this.EditDateTimeForm.value.from_date === '' && this.EditDateTimeForm.value.to_date === '') {
        this.toastr.warning('From date / to date should be selected, to select a region.', '', {
          timeOut: 3000,
        });
      } else {
        document.getElementById('edit-extent-switch').setAttribute('src', '../../../assets/vf/switch-on.svg');
        this.editextentEvent.emit('yes');
        this.editextentsub = this.Dataservice.EditExtent.subscribe(message => {
          if (message !== '') {
            this.editextent = message[0];
            document.getElementById('edit-extent-switch').setAttribute('src', '../../../assets/vf/switch-offf.svg');
          }
        });
      }
    } else {
      document.getElementById('edit-extent-switch').setAttribute('src', '../../../assets/vf/switch-offf.svg');
      this.editextentEvent.emit('no');
    }
  }

  /* Edit Preset
  Method type: Post.
  Request Parameters: from_date, to_date, search_text, category, top_left_coord, top_right_coord,
                      bottom_right_coord, bottom_left_coord, localtime
  Expected response: Success message.
  Process: Success- Success message is displayed on the top.
           Failure or error- Error message is displayed on the top. */
  submitEditPreset(): void {
    this.edisubmitted = true;
    if (this.EditPresetNameForm.invalid) {
      return;
    }
    const startDate = new Date();
    const functionName = 'Edit Preset in Vessel Filter';
    this.functionservice.functionCallLogging(functionName);

    let fromDate = '';
    let toDate = '';
    if (this.EditDateTimeForm.value.from_date !== '') {
      fromDate = formatDate(this.EditDateTimeForm.value.from_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    if (this.EditDateTimeForm.value.to_date !== '') {
      toDate = formatDate(this.EditDateTimeForm.value.to_date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    const reqData = {
      pid: this.editingPresetID, pname: this.EditPresetNameForm.value.pname, search_text: this.EditSearchForm.value, from_date: fromDate,
      to_date: toDate, category: this.editselectedVFCategory,
      top_left_coord: this.editextent[3], top_right_coord: this.editextent[2],
      bottom_right_coord: this.editextent[1], bottom_left_coord: this.editextent[0], userid: this.userId, localtime: this.cookieService.get('localtime')
    };
    this.setVFwaitState(true);

    this.service.editPreset(reqData).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.setVFwaitState(false);
          this.toastr.success('Updated preset', '', {
            timeOut: 3000,
          });
          this.CancelEdit();
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        this.setVFwaitState(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Delete Preset
  deletePreset(id, name): void {
    this.deletingPreset = id;
    const data = { pid: id, pname: name };
    this.deletePresetEvent.emit(data);
  }

  // wait state in vessel filter
  setVFwaitState(data): void {
    if (data === true) {
      if (document.getElementById('addPreset-pannel') !== null) {
        document.getElementById('addPreset-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('editPreset-pannel') !== null) {
        document.getElementById('editPreset-pannel').setAttribute('style', 'cursor:progress;pointer-events:none;');
      }
      if (document.getElementById('VF-Overall') !== null) {
        document.getElementById('VF-Overall').setAttribute('style', 'cursor: wait;');
      }
      if (document.getElementById('map') !== null) {
        document.getElementById('map').setAttribute('style', 'cursor: wait');
      }
    }
    if (data === false) {
      if (document.getElementById('addPreset-pannel') !== null) {
        document.getElementById('addPreset-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('editPreset-pannel') !== null) {
        document.getElementById('editPreset-pannel').setAttribute('style', 'cursor:default;');
      }
      if (document.getElementById('VF-Overall') !== null) {
        document.getElementById('VF-Overall').setAttribute('style', 'cursor: default;');
      }
      if (document.getElementById('map') !== null) {
        document.getElementById('map').setAttribute('style', 'cursor: default');
      }
    }
  }
}
