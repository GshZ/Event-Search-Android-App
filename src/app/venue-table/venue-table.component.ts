import { Component, OnChanges, Input } from '@angular/core';
import { EventsSearchService } from './../events-search.service';
import { AgmCoreModule } from '@agm/core';




@Component({
  selector: 'app-venue-table',
  templateUrl: './venue-table.component.html',
  styleUrls: ['./venue-table.component.css']
})
export class VenueTableComponent implements OnChanges {
  @Input() detailObj: object = {};
  venueData;
  lat: number;
  lng: number;

  constructor(
    private eventsSearchService: EventsSearchService,
  ) { }

  ngOnChanges() {
    if (this.detailObj !== undefined) {
    const venue = this.detailObj['Venue'];

    this.eventsSearchService.getVenue(venue)
    .subscribe(
      data => {
        console.log('Venue detail search sucess!', data, typeof data);
        this.venueData = data;
        if (this.venueData['location'] && this.venueData['location']['longitude'] && this.venueData['location']['latitude']) {
          this.lat = Number(this.venueData['location']['latitude']);
          this.lng = Number(this.venueData['location']['longitude']);
        }
      },
      error => console.log('Spotify search error', error)
    );



    }

  }



}
