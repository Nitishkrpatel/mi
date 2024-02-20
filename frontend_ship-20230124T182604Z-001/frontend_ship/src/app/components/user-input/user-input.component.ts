import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import { FunctionService } from '../shared/functions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {

  constructor(private cookieService: CookieService, private service: ServiceService,
              private functionservice: FunctionService, private toastr: ToastrService) { }

  theme = '';
  data = {mmsi: '', features: [], prediction: []};
  featureValuesOptions = [];

  changeFeaturesForm = new FormGroup({
    feature: new FormControl()
  });

  getUpdatedFeaturesForm = new FormGroup ({
    cog: new FormControl(''),
    sog: new FormControl(''),
    length: new FormControl(''),
    width: new FormControl(''),
    heading: new FormControl(''),
    Ratio_LW: new FormControl(''),
    Ratio_WL: new FormControl(''),
    Area_LW: new FormControl('')
  });

  ngOnInit(): void {
    this.service.setTitle('User-Inputs');
    this.theme = this.cookieService.get('theme');
    const data = this.cookieService.get('dataObj');
    if (data !== '') {
      this.data = JSON.parse(data);
      this.data.features.forEach(value => {
        this.featureValuesOptions.push(value.ft);
      });
    }
 }

  updateFeatures(): void {
    const startDate = new Date();
    const functionName = 'Get User inputs in user input component';
    this.functionservice.functionCallLogging(functionName);
    const postdata = {userid: this.cookieService.get('userid'), details: this.getUpdatedFeaturesForm.value };
    this.service.userInputs(postdata).subscribe(
      (data) => {
        if (data.status === 'success') {
          this.toastr.success(data.message, '', {
            timeOut: 3000,
          });
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(functionName + ' success', seconds);
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

}
