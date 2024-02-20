import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private EPSource = new BehaviorSubject('');
  EP = this.EPSource.asObservable();

  constructor() { }
    changedtoEditProfile(message): void {
        this.EPSource.next(message);
    }
}
