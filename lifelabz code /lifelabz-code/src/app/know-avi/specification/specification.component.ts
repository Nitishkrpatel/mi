import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.css']
})
export class SpecificationComponent implements OnInit {

  constructor( private service:ServiceService) {
    this.service.setTitle('Specification')
   }
  ngOnInit(): void {
  }

}
