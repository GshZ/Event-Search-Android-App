import { Component, Input, OnChanges } from '@angular/core';
import { EventsSearchService } from './../events-search.service';
import {Sort} from '@angular/material';
import { trigger, transition, animate, style, state } from '@angular/animations';


@Component({
  selector: 'app-upcoming-event',
  templateUrl: './upcoming-event.component.html',
  styleUrls: ['./upcoming-event.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0}),
        animate('500ms')
      ]),
      transition('* => void', [
        animate('500ms', style({ opacity: 0})),
      ])
    ])
  ]
})
export class UpcomingEventComponent implements OnChanges {
  @Input() detailObj: object = {};
  upcoming;
  sortCate = '';
  sortdisabled = true;
  sortOrder = 'asc';
  sortedData: Object[];
  firstFive: Object[];
  resultData: Object[];
  showMoreHidden = false;
  passData: Object[];
  fiveOnly;
  noresult;

  constructor(
    private eventsSearchService: EventsSearchService,
  ) {

   }

  ngOnChanges() {
    if (this.detailObj !== undefined) {
    const venue = this.detailObj['Venue'];
    this.fiveOnly = true;

    this.eventsSearchService.getUpcoming(venue)
    .subscribe(
      data => {
        console.log('upcoming search sucess!', data[0], typeof data);
        if (data[0] === undefined) {
          this.noresult = true;
        } else {
          this.noresult = false;
        }
        this.upcoming = data;
        this.sortedData = this.upcoming.slice();
        this.passData = this.sortedData;
        this.firstFive = this.passData.splice(0, 5);
        this.resultData = this.firstFive;
        // console.log("resultData", this.resultData.length);
        this.fiveOnly = true;

      },
      error => console.log('Spotify search error', error)
    );



    }

  }
  showMore() {
    this.resultData = this.resultData.concat(this.sortedData);
    this.showMoreHidden = true;
    this.fiveOnly = false;
  }
  showLess() {
    this.resultData = this.firstFive;
    this.showMoreHidden = false;
    this.fiveOnly = true;
  }

  clickSortCate(sort: Sort) {
    if (this.sortCate === '') {
      this.sortdisabled = true;
    } else {
      this.sortdisabled = false;
    }
  // }

  // sortData(sort: Sort) {
    if (this.upcoming !== []) {
    const data = this.upcoming.slice();
    if (!this.sortCate || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc;
      if (this.sortOrder === 'asc') {
        isAsc = true;
      } else {
        isAsc = false;
      }
      switch (this.sortCate) {
        case 'eventName': return compare(a.displayName, b.displayName, isAsc);
        case 'time': return compare(a.date, b.date, isAsc);
        case 'artist': return compare(a.artist, b.artist, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        default: return 0;
      }
    });
    // console.log("sotredData");
    if (this.showMoreHidden === true) {
      this.resultData = this.sortedData;
    } else {
      this.passData = this.sortedData;
      this.firstFive = this.passData.splice(0, 5);
      this.resultData = this.firstFive;
    }
  }
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}






