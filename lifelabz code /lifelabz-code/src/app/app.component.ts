import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { ServiceService } from './service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'lifelabz';
  changeCount: any;
  onActivate(event) {
    window.scroll(0, 0);
  }
  visitedForm = new FormGroup({
    visited: new FormControl('1'),
  });
  constructor(private service:ServiceService){}

  ngOnInit() {
    AOS.init();

    // Adding javascript for scrollbar
    document.addEventListener(
      "scroll",
      function () {
        var scrollTop =
          document.documentElement["scrollTop"] || document.body["scrollTop"];
        var scrollBottom =
          (document.documentElement["scrollHeight"] ||
            document.body["scrollHeight"]) - document.documentElement.clientHeight;
        var scrollPercent = scrollTop / scrollBottom * 100 + "%";
        document
          .getElementById("_progress")
          .style.setProperty("--scroll", scrollPercent);
      },
      { passive: true }
    );
this.service.lifelabzCount(this.visitedForm.value).subscribe(data=>{
})

  }

}



export const apiServerURL = 'https://lifelabz.org/api/';









