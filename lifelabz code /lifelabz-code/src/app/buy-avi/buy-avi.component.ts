import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-buy-avi',
  templateUrl: './buy-avi.component.html',
  styleUrls: ['./buy-avi.component.css']
})
export class BuyAviComponent implements OnInit {

  submitted = false;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom,CountryISO.China];
  above20 = false;
  constructor(private service: ServiceService, private toastr: ToastrManager) {
    this.service.setTitle('Pricing')
  }
  ngOnInit(): void {
  }

  buyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    organization: new FormControl(''),
    mobileNumber: new FormControl(''),
    emailID: new FormControl('', [Validators.required, Validators.email]),
    quantity: new FormControl('', [Validators.required,Validators.min(1),Validators.max(20)]),

  });

  get q() {
    return this.buyForm.controls;
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  submit() {
   
    this.submitted = true;
    if (this.buyForm.invalid) {
      return;
    }
    if(this.buyForm.value.mobileNumber){
      this.buyForm.setValue({
        name: this.buyForm.value.name,
        organization: this.buyForm.value.organization,
        emailID: this.buyForm.value.emailID,
        mobileNumber: this.buyForm.value.mobileNumber.e164Number,
        quantity: this.buyForm.value.quantity,
      })
      this.buyNow();
    }
    else{
      this.buyForm.setValue({
        name: this.buyForm.value.name,
        organization: this.buyForm.value.organization,
        emailID: this.buyForm.value.emailID,
        mobileNumber: '',
        quantity: this.buyForm.value.quantity,
      })
      this.buyNow();
    }
  }

  buyNow(){
 this.service.buyProduct(this.buyForm.value).subscribe(data => {
      if (data === 'Buy AVI details added') {
        this.toastr.successToastr('Thanks for the interest shown in our products, we will contact you shortly', '', {
          position: 'top-center'
        });
        this.buyForm.reset();
        this.submitted = false;
      }

    });
  }
  

  amazone(){
    window.open("https://www.amazon.in/dp/B08Y5NXFMM/ref=cm_sw_r_wa_apa_fabc_5E2F1QSMJ4KRG024ZDMQ");
  }
  amazoneIot(){
    window.open("https://www.amazon.in/dp/B08YRX1FSK/ref=cm_sw_em_r_mt_dp_RJ3M7W645MFN2MJGK07E");
  }

  topPage(){
    window.scrollTo(0,0)
  }
 
}
