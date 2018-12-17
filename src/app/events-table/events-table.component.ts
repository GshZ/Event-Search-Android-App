import { LocalStorageService } from './../local-storage.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { stringify } from '@angular/core/src/util';
import { EventsSearchService } from './../events-search.service';
import { ProgressComponent } from './../progress/progress.component';
import { detachEmbeddedView } from '@angular/core/src/view';
import { EventsDetailNavComponent } from '../events-detail-nav/events-detail-nav.component';
import { PassDataService } from '../pass-data.service';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.css']
})

export class EventsTableComponent implements OnChanges {
  @Input() obj: object = {};
  @Output() submitDetail = new EventEmitter();
  @Output() showBar = new EventEmitter();
  // searched: false;
  // eventObj: object = this.getData.info;
  noResult: boolean;
  date;
  starBorder = false;
  shortName: Array<string>;
  isActive = false;
  activeIndex = [];
  favoriteIndex = [];


  constructor(
    public getData: PassDataService,
    // private eventInfo: EventsDetailNavComponent,
    private eventsSearchService: EventsSearchService,
    private progress: ProgressComponent,
    ) { }

  ngOnChanges() {
    this.activeIndex = [];

  }

  // TODO: 鼠标移过去就显示tooltip full name
  sendEventDetailRequest(id, name, index, sn) {
    // this.showBar.emit('showBar');
    this.activeIndex.push(index);
    // this.progress.hiddenProgressBar = false;

    this.eventsSearchService.getDetail(id)
    .subscribe(
      data => {
        console.log('TM detail search sucess!', data, typeof data, sn);
        // TODO: NAME
        // let detail = (data.hasOwnProperty('_embedded') && data['_embedded'].hasOwnProperty('events'))
        // ? data['_embedded']['events'] : {0 : 'No result'};
        const detail = JSON.parse('{"shortName":"' + sn + '","name":"' + name + '","detail": ' + JSON.stringify(data) + ' }');
        this.submitDetail.emit(detail);
        // this.progress.hiddenProgressBar = true;
        this.isActive = true;
      },
      error => console.log('TM detail search error', error)
    );




  }

  favorite(event: Object, sn, index) {
    this.favoriteIndex.push(index);
    this.starBorder = true;
    const favoriteTime = new Date().getTime;
    const key = event['id'];
    const value: Object = {
      'id': event['id'],
      'date': event['dates']['start']['localDate'],
      'shortName': sn,
      'name': event['name'],
      'category': event['classifications'][0]['genre']['name'] + '-' + event['classifications'][0]['segment']['name'],
      'venue': event['_embedded']['venues'][0]['name'],
      'favoriteTime': favoriteTime
    };
    const valueStr = JSON.stringify(value);
    localStorage.setItem(key, valueStr);
    console.log(localStorage);
  }

  favoriteDelete(event, index) {
    this.favoriteIndex.splice(this.favoriteIndex.indexOf(index), 1);
    localStorage.removeItem(event['id']);
  }

  check(key) {
    return localStorage.getItem(key) !== null;
  }

  shortenName(i: number) {
    let newName = '';
      if (this.obj[i]['name'].length > 30) {
          for (let j = 0; j < 30; j++ ) {
            if (this.obj[i]['name'].charAt(29 - j) === ' ') {
              newName = this.obj[i]['name'].substring(0, 30 - j) + '...';
              return newName;
            }
          }
      } else {
        return this.obj[i]['name'];
      }
  }
  get diagnostic() {
    // return typeof(this.obj);
    // if (typeof(this.obj) === string) {
    //   return this.obj;
    // } else {
      return JSON.stringify(this.obj);
    // }
 }
}
