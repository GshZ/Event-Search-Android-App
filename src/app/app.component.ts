import { ProgressComponent } from './progress/progress.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HW8';
  TMEventJSONObj: Object;
  selectedIndex = 0;
  showEventResult;
  showBar = false;
  hideDetail;
  showRDNAV;
  noButton;

  constructor(
    public search: SearchTableComponent,
    private progress: ProgressComponent,

  ) { }
  showProgressBar(s) {
    // this.progress.start();
    this.showBar = true;
  }
  getTMEventJSONObj(data: Object) {

    // if (data[0] === undefined) {
    //   this.noButton = true;
    // }
    this.selectedIndex = 0;
    // this.showProgressBar = true;
    // console.log(this.selectedIndex);
    if (data !== {}) {
      this.showBar = false;
    }
    this.showEventResult = false;
    this.showRDNAV = true;
    // console.log("eventsTableHidden by showEventResult", this.showEventResult)
    this.hideDetail = true;
    return this.TMEventJSONObj = data;
    // this.progress.stop();
  }

  backToEventResult() {
    this.showEventResult = false;
  }
}
