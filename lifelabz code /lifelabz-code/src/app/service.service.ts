import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { apiServerURL } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private quicksupportURL = apiServerURL + 'quicksupport';
  private queriesURL = apiServerURL + 'queries';
  private buyProductURL = apiServerURL + 'buyavi';
  private lifelabzURL = apiServerURL + 'lifelabz';
  constructor(private titleService: Title, private http: HttpClient) { }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle + ' − LifeLabz');
  }

  quickSupport(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.quicksupportURL, data);
  }

  addqueries(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.queriesURL, data);
  }

  buyProduct(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.buyProductURL, data);
  }

  lifelabzCount(data) {
    data = JSON.stringify(data);
    return this.http.post<any>(this.lifelabzURL, data);
  }

}
