import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-events-detail-nav',
  templateUrl: './events-detail-nav.component.html',
  styleUrls: ['./events-detail-nav.component.css'],
  animations: [
    trigger('slideInOutEvent', [
      state('open', style({})),
      state('hidden', style({})),
      transition('hidden => open', [
        style({transform: 'translateX(100%)'}),
        animate('100ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition('open => hidden', [
        animate('100ms ease-in', style({transform: 'translateX(100%)'}))
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
export class EventsDetailNavComponent implements OnChanges {
  @Input() passEventsInfo: object = {};
  @Input() eventsTableHidden: boolean;
  @Input() detailTableHidden: boolean;
  // @Output() passEventsInfo = new EventEmitter();
  disableDetailButton = true;
  // eventsTableHidden = false;
  // detailTableHidden = true;
  TMDetailJSONObj: object;
  eventName: string;
  tweetHerf;
  tweetText;
  tweetUrl;
  sn;
  showBar = false;

  starBorder = false;

  constructor() { }

  // ngOnInit() {
  // }
  // passEventsInfo() {
  //   return this.obj;
  // }
  ngOnChanges() {
    // this.disableDetailButton = false;
    console.log('eventsTableHidden: ', this.eventsTableHidden);
    this.detailTableHidden = true;
    if (this.TMDetailJSONObj) {
      this.tweetText = `Check out ${this.eventName} located at ${this.TMDetailJSONObj['Venue']}. Website:`;
      this.tweetUrl = `${this.TMDetailJSONObj['Buy Ticket At']}`;
      this.tweetHerf = `https://twitter.com/intent/tweet?text=${this.tweetText}&url=${this.tweetUrl}`;
    }
  }

  getTMDetailJSONObj(data: Object) {
    this.detailTableHidden = false;
    // this.eventsTableHidden = true;
    // this.showBar = false;
    this.disableDetailButton = false;
    console.log('event detail data: ', data['detail'], typeof(data['detail']));
    this.eventName = data['name'];
    this.sn = data ['shortName'];
    // console.log("event name: ", this.eventName);
    // this.disableDetailButton = false;

    this.TMDetailJSONObj = data['detail'];
    this.tweetText = `Check out ${this.eventName} located at ${this.TMDetailJSONObj['Venue']}. Website:`;
    this.tweetUrl = `${this.TMDetailJSONObj['Buy Ticket At']}`;
    this.tweetHerf = `https://twitter.com/intent/tweet?text=${this.tweetText}&url=${this.tweetUrl}`;
    return this.TMDetailJSONObj;
  }

  goToDetail() {
    this.detailTableHidden = false;
    // this.eventsTableHidden = true;
  }
  goToLists() {
    // this.disableDetailButton = false;
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
  favoriteDelete() {
    localStorage.removeItem(this.TMDetailJSONObj['id']);
  }

  check() {
    return localStorage.getItem(this.TMDetailJSONObj['id']) !== null;
    return false;
  }


}
