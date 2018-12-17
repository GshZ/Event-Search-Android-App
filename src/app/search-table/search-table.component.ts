import { PassDataService } from './../pass-data.service';
import { ProgressComponent } from './../progress/progress.component';
import { EventsSearchService } from './../events-search.service';
import { IpApiService } from './../ip-api.service';
import { SearchInfo } from './../search-info';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgProgress } from '@ngx-progressbar/core';
// import { NgProgressSivice } from 'ngx-progressbar';
// import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {
  @Output() submitSearch = new EventEmitter();
  @Output() showBar = new EventEmitter();
  @ViewChild(ProgressComponent) progressBar: ProgressComponent;

  powers = [
    'All', 'Music'
  ];

  searchInfo = new SearchInfo('', '', 10, 'miles', 34, -118, '');
  searchFromSpecifyDisabled = true;
  otherOriginInputReuired = false;
  disableSearchButton = false;
  // hiddenProgressBar = true;
  TMEventJSONObj: object;
  events;
  // myControl = new FormControl();
  options = {};
    // filteredStates: Observable<String[]>;
  submitted = false;
  // options:
  keyInput;

  constructor(
    public passData: PassDataService,
    private progress: ProgressComponent,
    private ipApiservice: IpApiService,
    private eventsSearchService: EventsSearchService,
  ) {

  }

  onKeydown(event) {
    // this.keyInput += event.key;
    this.eventsSearchService.autoCom(this.searchInfo.keyword)
      .subscribe(
        data => {
          console.log('autocom data: ', data);
          this.options = data;
        },
        error => console.log('TM events search error', error)
      );


  }

  ngOnInit() {
    this.getLoc();
  }
  getLoc(): void {
    console.log('into get loc function with ip-api');
    this.ipApiservice.getLoc()
      .subscribe(resp => {
        console.log('ip-api resopnse: ', resp);
        this.searchInfo.fromLat = resp['lat'];
        this.searchInfo.fromLon = resp['lon'];
      });

  }

  onClickCurrentLoc(): void {
    this.searchFromSpecifyDisabled = true;
    this.otherOriginInputReuired = false;
    this.searchInfo.from = '';
    this.getLoc();
  }
  onClickOtherOrigin(): void {
    this.searchFromSpecifyDisabled = false;
    this.otherOriginInputReuired = true;
    // this.searchInfo.from = //TODO: api
  }

  onSubmit(): void {
    this.showBar.emit('showBar');
    this.keyInput = '';
    // this.progress.data(true);
    // this.setValue.pregressBarHidden = false;
    this.progress.start();

    if (this.searchInfo.distanceValue == null) {
      this.searchInfo.distanceValue = 10;
    }

    this.submitted = true;

    console.log('onSubmit: ', this.searchInfo);
    this.eventsSearchService.getEvents(this.searchInfo)
      .subscribe(
        data => {
          console.log('TM events search sucess!', data, typeof data);
          if (data.hasOwnProperty('error')) {
            this.events = {0: 'error'};
          } else {
            this.events = (data.hasOwnProperty('_embedded') && data['_embedded'].hasOwnProperty('events'))
            ? data['_embedded']['events'] : {0 : 'No result'};
          }
          this.submitSearch.emit(this.events);
          this.passData.info = JSON.stringify(this.events);

        },
        error => console.log('TM events search error', error)
      );

  }

  clearSearchTable() {
    this.searchInfo.distanceValue = 10;
    this.searchInfo.distanceUnit = 'miles';
    this.searchInfo.category = '';
    this.searchInfo.keyword = '';
    this.searchInfo.from = '';
    this.events = {};
    this.submitSearch.emit(this.events);
  }

}
