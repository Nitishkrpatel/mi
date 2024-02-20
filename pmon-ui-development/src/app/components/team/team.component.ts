import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../shared/service.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  teamListArray: any;
  accountId: any;
  customerID: any;
  submitted = false;
  temasDetails: any;
  addsubmitted = false;
  Role:any;

  constructor(private service: ServiceService , private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.setTitle('Team');
    this.Role = localStorage.getItem('role');
    this.accountId = localStorage.getItem('accountId')
    this.customerID = localStorage.getItem('customerID');
    this.getTeamsList(this.accountId)
    this.addform.setValue({ teamID: '', teamName: '',supervisor:'', createdBy: this.customerID, accountID:this.accountId});

  }

  form = new FormGroup({
    teamID: new FormControl( '',[Validators.required]),
    teamName: new FormControl('', [Validators.required]),
    supervisor:new FormControl('',[Validators.required]),
    updatedBy: new FormControl(''),
    accountID:new FormControl('')
  });

  addform = new FormGroup({
    teamID: new FormControl( '',[Validators.required]),
    teamName: new FormControl('', [Validators.required]),
    supervisor: new FormControl( '',[Validators.required]),
    createdBy: new FormControl(''),
    accountID:new FormControl('')
  });

  get f() {
    return this.form.controls;
  }

  get a() {
    return this.addform.controls;
  }

  getTeamsList(accountId) {
    this.service.getTeams(accountId).subscribe(data => {
      this.teamListArray = data['data']
    })
  }

  activateordeactive(id, status) {
    const data = {activeStatus:status,teamID:id,accountID:this.accountId}
    this.service.activateDeactivateTeam(data).subscribe( data =>{
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

  editUser(id) {
    this.service.getTeamDeatils(this.accountId, id).subscribe(data => {
      this.temasDetails = data['data'][0]
      this.form.setValue({ teamID: this.temasDetails.teamID, teamName: this.temasDetails.teamName,supervisor: this.temasDetails.supervisor, updatedBy: this.temasDetails.createdBy,accountID: this.temasDetails.accountID});
    })
  }

  updateTeams() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    console.log(this.form.value)
    this.service.updateTeams(this.form.value).subscribe(data => {
      if (data['data'] == 'Updated team details') {
        document.getElementById('closeusermodel')?.click();
        this.form.reset();
        this.submitted = false;
        this.ngOnInit();
        this.toastr.success('Updated team details', '', {
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

  addTeam(){
   this.addsubmitted = true
   if(this.addform.invalid){
     return
   }
   this.service.addTeam(this.addform.value).subscribe(data =>{
    if(data['data' ]== 'Team added'){
      document.getElementById('closemodel')?.click();
      this.addform.reset();
      this.addsubmitted = false;
      this.toastr.success('Team added', '', {
        timeOut: 3000,
      });
      this.ngOnInit();
    }
   },error => {
    if (error.status == 'error') {
      console.log(error)
      this.toastr.error(error.message, '', {
        timeOut: 3000,
      });
    }

  })
  }

}
