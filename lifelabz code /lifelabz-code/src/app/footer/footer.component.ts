import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators, } from '@angular/forms'
import { ServiceService } from '../service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']


})
export class FooterComponent {
  submitted = false;
  closeResult = '';
  modalRef: NgbModalRef;
  constructor(private modalService: NgbModal , private service:ServiceService, private toastr:ToastrManager) { }

  open(content) {
    this.modalRef = this.modalService.open(content);
  }

  queriesForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    emailID: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl(''),
    message:new FormControl('')

  });

  get m() {
    return this.queriesForm.controls;
  }

  addqueries
  postdata() {
    this.submitted = true;
    if (this.queriesForm.invalid) {
      return;
    }
    this.service.addqueries(this.queriesForm.value).subscribe(data => {
      if (data === 'Queries details added') {
        this.modalRef.close()
        this.queriesForm.reset();
        this.submitted = false; 
        this.toastr.successToastr('Thank you we will contact you', '', {
          position: 'top-center'
      });
      
      }
      
    });

    console.log(this.queriesForm.value);
      
  }

}
