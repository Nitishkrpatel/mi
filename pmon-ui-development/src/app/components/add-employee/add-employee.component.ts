import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../shared/service.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  employeeListArray: any;
  accountId: any;
  customerID: any;
  submitted = false;
  employeeDetails: any;
  addsubmitted = false;
  Role:any;


  constructor(private service: ServiceService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.setTitle('Employee')
    this.Role = localStorage.getItem('role');

    this.accountId = localStorage.getItem('accountId')
    this.customerID = localStorage.getItem('customerID');
    this.getEmployeeList(this.accountId)
    this.addform.setValue({ employeeName: '', employeeID: '', userID: '', mobileNumber: '', address: '', createdBy: this.customerID, accountID: this.accountId });

  }

  form = new FormGroup({
    employeeName: new FormControl('', [Validators.required]),
    employeeID: new FormControl('', [Validators.required]),
    userID: new FormControl(''),
    mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
    Validators.pattern('^[0-9]+')]),
    address: new FormControl('', [Validators.required]),
    accountID: new FormControl(''),
    updatedBy: new FormControl('')
  });

  addform = new FormGroup({
    employeeName: new FormControl('', [Validators.required]),
    employeeID: new FormControl('', [Validators.required]),
    userID: new FormControl(''),
    mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
    Validators.pattern('^[0-9]+')]),
    address: new FormControl('', [Validators.required]),
    createdBy: new FormControl(''),
    accountID: new FormControl('')
  });

  get f() {
    return this.form.controls;
  }

  get a() {
    return this.addform.controls;
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  getEmployeeList(accountId) {
    this.service.getEmployee(accountId).subscribe(data => {
      this.employeeListArray = data['data']
    })
  }


  editUser(id) {
    this.service.getEmployeeDetails(this.accountId, id).subscribe(data => {
      this.employeeDetails = data['data'][0]
      console.log(this.employeeDetails)
      this.form.setValue({
        employeeName: this.employeeDetails.employeeName,
        employeeID: this.employeeDetails.employeeID,
        userID: this.employeeDetails.userID,
        mobileNumber: this.employeeDetails.mobileNumber,
        address: this.employeeDetails.address,
        accountID: this.employeeDetails.accountID,
        updatedBy: this.employeeDetails.createdBy
      });
    })
  }

  activateordeactive(id, status) {
    const data = {activeStatus:status,employeeID:id,accountID:this.accountId}
    this.service.activateDeactivateEmployee(data).subscribe( data =>{
      if (data['status'] == 'success') {
        this.toastr.success(data['data'], '', {
          timeOut: 3000,
        });
        this.ngOnInit();
      }
    }, error => {
      if (error.status == 'error') {
        console.log(error)
        this.toastr.error(error.message, '', {
          timeOut: 3000,
        });
      }
    })
  }

  updateEmployee() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    console.log(this.form.value)

    this.service.updateEmployee(this.form.value).subscribe(data => {
      if (data['data'] == 'Updated Employee details') {
        document.getElementById('closeusermodel')?.click();
        this.form.reset();
        this.submitted = false;
        this.ngOnInit();
        this.toastr.success('Updated Employee Details', '', {
          timeOut: 3000,
        });
      }
    }, error => {
      if (error.status == 'error') {
        console.log(error)
        this.toastr.error(error.message, '', {
          timeOut: 3000,
        });
      }

    })

  }

  addEmployee() {
    this.addsubmitted = true
    if (this.addform.invalid) {
      return
    }
    this.service.addEmployee(this.addform.value).subscribe(data => {
      if (data['data'] == 'Employee added') {
        document.getElementById('closemodel')?.click();
        this.addform.reset();
        this.addsubmitted = false;
        this.toastr.success('Employee added', '', {
          timeOut: 3000,
        });
        this.ngOnInit();
      }
    }, error => {
      if (error.status == 'error') {
        console.log(error)
        this.toastr.error(error.message, '', {
          timeOut: 3000,
        });
      }

    })
  }

}
