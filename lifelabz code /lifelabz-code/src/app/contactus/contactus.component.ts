import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  submitted = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.China];

  constructor(private service: ServiceService, private toastr: ToastrManager) {
    this.service.setTitle('Contact Us')

  }

  ngOnInit(): void {
  }


  contactusForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    organization: new FormControl(''),
    mobileNumber: new FormControl(''),
    emailID: new FormControl('', [Validators.required, Validators.email]),
    queryDescription: new FormControl('')
  });

  get q() {
    return this.contactusForm.controls;
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  suumit() {
    this.submitted = true;
    if (this.contactusForm.invalid) {
      return;
    }
    if (this.contactusForm.value.mobileNumber) {
      this.contactusForm.setValue({
        name: this.contactusForm.value.name,
        organization: this.contactusForm.value.organization,
        emailID: this.contactusForm.value.emailID,
        mobileNumber: this.contactusForm.value.mobileNumber.e164Number,
        queryDescription: this.contactusForm.value.queryDescription,
      })
      this.queryPost();
    }
    else {
      this.contactusForm.setValue({
        name: this.contactusForm.value.name,
        organization: this.contactusForm.value.organization,
        emailID: this.contactusForm.value.emailID,
        mobileNumber: '',
        queryDescription: this.contactusForm.value.queryDescription,
      })
      this.queryPost();

    }

  }

  queryPost() {
    this.service.quickSupport(this.contactusForm.value).subscribe(data => {
      if (data === 'Quick Support details added') {
        this.toastr.successToastr('Support team will call you shortly', '', {
          position: 'top-center'
        });
        this.contactusForm.reset();
        this.submitted = false;
      }

    });
  }

}
