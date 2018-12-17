import { UpcomingEventComponent } from './upcoming-event/upcoming-event.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  items: Object [] = [];

  constructor() { }

  // sortByName() {
  //   this.items
  //   .sort((a: Object, b: Object) =>{
  //     return a.displayName.valueof() - b.displayName.valueOf();
  //   });
  // }

}
