import { Component, OnChanges, Input } from '@angular/core';
import { EventsSearchService } from './../events-search.service';

@Component({
  selector: 'app-artist-or-team',
  templateUrl: './artist-or-team.component.html',
  styleUrls: ['./artist-or-team.component.css']
})
export class ArtistOrTeamComponent implements OnChanges {
  @Input() detailObj: object = {};
  members: object[] = [];
  images: object[] = [];
  res: object[] = [];

  constructor(
    private eventsSearchService: EventsSearchService,
  ) { }

  ngOnChanges() {
    this.res = [];
    console.log('detail at art-team, ', this.detailObj);
// ^(\w\s\|\s)*(music)+(\s\|\s\w)*$
    if (this.detailObj !== undefined) {
      const regex = new RegExp('(Music)+');
      console.log(regex.test(this.detailObj['Category']));

      const artists = this.detailObj['Artist/Team'].split(' | ');
      console.log('art-team, ', artists);
      for (let i = 0; i < artists.length; i++) {
        console.log('art i, ', artists[i]);

        this.eventsSearchService.getArtists(artists[i], this.detailObj['Category'])
        .subscribe(
        data => {
          console.log('getArtists search sucess!', data, typeof data);
          this.res.push(data);
          console.log('getArtists result ', this.res);
          },
          error => console.log('Spotify and google custom search error', error)
        );


        /*
        if (regex.test(this.detailObj['Category'])) {
          this.eventsSearchService.getSpotify(artists[i])
          .subscribe(
          data => {
            console.log('Spotify search sucess!', data, typeof data);
            this.members.push(data);
            console.log('members result ', this.members);
            },
            error => console.log('Spotify search error', error)
          );
        }

        this.eventsSearchService.getPhotos(artists[i])
        .subscribe(
        data => {
          console.log('getPhoto search sucess!', data, typeof data);
          this.images.push(data);
          console.log('images result ', this.images);
          },
          error => console.log('Spotify search error', error)
        );
        */
      }
    }
  }


}
