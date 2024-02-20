import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  constructor( private service:ServiceService) {
    this.service.setTitle('FAQs')
   }

  ngOnInit(): void {
  }

}
