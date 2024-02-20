import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgHttpCachingHeaders } from 'ng-http-caching';
// import { withCache } from '@ngneat/cashew';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'yesh';
  data:any;
  time: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // This request will never cache.
    // Note: all the "special" headers in NgHttpCachingHeaders are removed before send the request to the backend.
    this.relaod();
    //this.onLoad();

    this.resetTimer();
  }

  relaod(): void {
    // this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
      this.http.get('https://demo7503726.mockable.io/getemp',{
      headers: {
        // [NgHttpCachingHeaders.ALLOW_CACHE]: '1',
         [NgHttpCachingHeaders.LIFETIME]: (2000 * 60).toString(),
      }
    }).subscribe(e =>
      this.data = e

      );
      // console.log(this.data)
  }
  // onLoad() {
  //   this.http
  //     .get('https://demo7503726.mockable.io/getemp', {
  //       context: withCache({
  //         ttl: 4000,
  //       }),
  //     })
  //     .subscribe((e) => (this.data = e));
  //   console.log(this.data);
  // }



  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:wheel')
  
  resetTimer() {
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      alert('Idle for 3 seconds. You can call your api here');
    }, 3000);
  }

}
