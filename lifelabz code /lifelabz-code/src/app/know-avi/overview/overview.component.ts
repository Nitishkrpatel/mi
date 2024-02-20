import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

 
  constructor(private service:ServiceService) { 
    this.service.setTitle("Overview");
  }

  ngOnInit(): void {
  }

}
