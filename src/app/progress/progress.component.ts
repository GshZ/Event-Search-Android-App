import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})

export class ProgressComponent implements OnInit {
  hiddenProgressBar;
  private _data;

  constructor(
  ) {}

  ngOnInit() {
    this.hiddenProgressBar = true;
    // console.log('hiddenProgressBar: ', this.hiddenProgressBar, typeof this.hiddenProgressBar)
  }
  start() {
    this.hiddenProgressBar = false;
    // console.log('hiddenProgressBar: ', this.hiddenProgressBar, typeof this.hiddenProgressBar)

  }
  stop() {
    this.hiddenProgressBar = true;
    // console.log('hiddenProgressBar: ', this.hiddenProgressBar, typeof this.hiddenProgressBar)
  }
}
