import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-favorites-detail-nav',
  templateUrl: './favorites-detail-nav.component.html',
  styleUrls: ['./favorites-detail-nav.component.css'],
  animations: [
    trigger('slideInOutEvent', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('slideInOutDetail', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class FavoritesDetailNavComponent implements OnChanges {
  @Input() passEventsInfo: object = {};
  // @Output() passEventsInfo = new EventEmitter();
  disableDetailButton = true;
  eventsTableHidden = false;
  detailTableHidden = true;
  TMDetailJSONObj: object;
  eventName: string;
  tweetHerf;
  tweetText;
  tweetUrl;
  sn;
  noFav;
  private _data: Array<object> = [];
  noresult;



  starBorder = false;

  constructor() { }

  // ngOnInit() {
  // }
  // passEventsInfo() {
  //   return this.obj;
  // }
  ngOnChanges() {
    this.detailTableHidden = true;
    this.tweetText = `Check out ${this.eventName} located at ${this.TMDetailJSONObj['Venue']}. Website:`;
    this.tweetUrl = `${this.TMDetailJSONObj['Buy Ticket At']}`;
    this.tweetHerf = `https://twitter.com/intent/tweet?text=${this.tweetText}&url=${this.tweetUrl}`;
  }
  getTMDetailJSONObj(data: Object) {
    console.log('event detail data: ', data['detail'], typeof(data['detail']));
    this.eventName = data['name'];
    // console.log("event name: ", this.eventName);
    this.detailTableHidden = false;
    this.disableDetailButton = false;
    this.sn = data ['shortName'];



    this.TMDetailJSONObj = data['detail'];
    this.tweetText = `Check out ${this.eventName} located at ${this.TMDetailJSONObj['Venue']}. Website:`;
    this.tweetUrl = `${this.TMDetailJSONObj['Buy Ticket At']}`;
    this.tweetHerf = `https://twitter.com/intent/tweet?text=${this.tweetText}&url=${this.tweetUrl}`;
    return this.TMDetailJSONObj;

  }
  get data() {
    this._data = [];
    if (localStorage.length === null) {
      this.noresult = true;
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        this._data.push(this.getValueObj(localStorage.key(i)));
        // console.log('favorite data: ', this._data);
      }
      this.noresult = false;
    }
    return this._data;
  }
  getValueObj(key) {
    const value = localStorage.getItem(key);
    const valueObj = JSON.parse(value);
    return valueObj;
  }
  goToDetail() {
    this.detailTableHidden = false;
    // this.eventsTableHidden = true;
  }
  goToLists() {
    // this.eventsTableHidden = false;
    this.detailTableHidden = true;
  }
  favorite() {
    this.starBorder = true;
    const favoriteTime = new Date().getTime;
    const key = this.TMDetailJSONObj['id'];
    const value: Object = {
      'id': this.TMDetailJSONObj['id'],
      'date': this.TMDetailJSONObj['Date'],
      'shortName': this.sn,
      'name': this.eventName,
      'category': this.TMDetailJSONObj['Category'],
      'venue': this.TMDetailJSONObj['Venue'],
      'favoriteTime': favoriteTime
    };
    const valueStr = JSON.stringify(value);
    localStorage.setItem(key, valueStr);
    console.log(localStorage);
  }

  favoriteDelete(key) {
    localStorage.removeItem(key);
  }

  check(key) {
    return localStorage.getItem(key) !== null;
  }

}
