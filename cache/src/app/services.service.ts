import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgHttpCachingHeaders } from 'ng-http-caching';
import { Observable } from 'rxjs';
const endpoint = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) {}

  getData(){
    return this.http.get('http://demo7019625.mockable.io',
    // {
    // headers: {
    //   [NgHttpCachingHeaders.DISALLOW_CACHE]: '1',
    // [NgHttpCachingHeaders.LIFETIME]: (1000 * 10).toString() //allowing caching for 10sec.
    // }}
    );
  }

  getAllPosts(): Observable<any> {
    return this.http.get(endpoint);
  }
}
