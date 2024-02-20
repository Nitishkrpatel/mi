import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../shared/service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userListArray: any;
  accountId: any;
  customerID: any;
  users: any;
  submitted = false;
  Role: any;
  usersDetails:any;
  editsubmitted = false;


  constructor(private service: ServiceService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.setTitle('User');
    this.accountId = localStorage.getItem('accountId')
    this.customerID = localStorage.getItem('customerID');
    this.Role = localStorage.getItem('role');
    this.form.setValue({ firstName: '', lastName: '', userID: '', role: '', mobileNumber: '', userLevel: 'SecondaryUser', accountID: this.accountId, createdBy: this.customerID });
    this.getUserList(this.accountId)
  }

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl(''),
    userID: new FormControl('', [Validators.required, Validators.email]),
    mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
    Validators.pattern('^[0-9]+')]),
    role: new FormControl('', [Validators.required]),
    userLevel: new FormControl('SecondaryUser'),
    accountID: new FormControl(''),
    createdBy: new FormControl('')
  });

  editform = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl(''),
    userID: new FormControl('', ),
    mobileNumber: new FormControl(''),
    role: new FormControl('', [Validators.required]),
    accountID: new FormControl(''),
    customerID: new FormControl(''),
    updatedBy:new FormControl('')
  });

  get f() {
    return this.form.controls;
  }

  get u() {
    return this.editform.controls;
  }


  getUserList(accountId) {
    this.service.getUser(accountId).subscribe(data => {
      this.userListArray = data['data'];
    },
      error => {
        if (error.status == 'error') {
          console.log(error)
          this.toastr.error(error.message, '', {
            timeOut: 3000,
          });
        }

      })
  }

  addUser() {

    this.submitted = true
    if (this.form.invalid) {
      return
    }
    this.service.addUser(this.form.value).subscribe(data => {
      if (data['data'] == 'User added') {
        document.getElementById('closeusermodel')?.click();
        this.form.reset();
        this.submitted = false;
        this.toastr.success('User added', '', {
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

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  activateordeactive(id, status) {
    const data = {activeStatus:status,customerID:id,accountID:this.accountId}
    this.service.activateDeactivateUser(data).subscribe( data =>{
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

  editUser(accountID,customerID) {
    console.log(accountID , customerID)
   this.service.userDetails(accountID,customerID).subscribe( data=>{
     this.usersDetails = data['data'][0]
    this.editform.setValue({ 
       firstName: this.usersDetails.firstName,
       lastName: this.usersDetails.lastName,
       userID: this.usersDetails.userID,
       mobileNumber:this.usersDetails.mobileNumber,
       role: this.usersDetails.role,
       customerID: this.usersDetails.customerID,
       accountID: this.usersDetails.accountID,
       updatedBy:this.usersDetails.createdBy,
      });

   })
  }

  updateUser(){
    console.log(this.editform.value)

    this.editsubmitted = true
    if(this.editform.invalid){
      return
    }
    this.service.updateUserDetails(this.editform.value).subscribe(data =>{
      if (data['data'] == 'Updated User details') {
        document.getElementById('editusermodel')?.click();
        this.editform.reset();
        this.editsubmitted = false;
        this.toastr.success('Updated User details', '', {
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
