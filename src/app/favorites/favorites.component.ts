import { OnChanges } from '@angular/core';
// import { LocalStorage } from '@ngx-pwa/local-storage';
import { LocalStorageService } from './../local-storage.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProgressComponent } from './../progress/progress.component';
import { EventsSearchService } from './../events-search.service';
import { PassDataService } from '../pass-data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})

export class FavoritesComponent implements OnInit {
  @Output() submitDetail = new EventEmitter();
  noResult: boolean;
  date;
  starBorder = false;
  shortName: Array<string>;
  isActive = false;
  activeIndex = [];
  noresult;
  private _data: Array<object> = [];

  storageTest = localStorage;


  constructor(
    private progress: ProgressComponent,
    private eventsSearchService: EventsSearchService,
    public getData: PassDataService,

  ) { }

  ngOnInit() {
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
  delete(key) {
    localStorage.removeItem(key);
  }


  sendEventDetailRequest(id, name, index, sn) {
    this.activeIndex.push(index);
    // this.progress.hiddenProgressBar = false;

    this.eventsSearchService.getDetail(id)
    .subscribe(
      data => {
        console.log('TM detail search sucess!', data, typeof data);
        const detail = JSON.parse('{"shortName":"' + sn + '","name":"' + name + '","detail": ' + JSON.stringify(data) + '}');
        this.submitDetail.emit(detail);
        // this.progress.hiddenProgressBar = true;
        this.isActive = true;
      },
      error => console.log('TM detail search error', error)
    );
  }

  get diagnostic() {
      return JSON.stringify(this._data);

 }

}
