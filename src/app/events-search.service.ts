import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { SearchTableComponent } from './search-table/search-table.component';
import { SearchInfo } from './search-info';



@Injectable({
  providedIn: 'root'
})
export class EventsSearchService {
  private url;
  // const apiData = ajax('');
  private eventSearchUrl = 'http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/eventsSearch';  // URL to web api

  constructor(private http: HttpClient) { }
  autoCom(input) {
    console.log('input: ', input);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/autoCom/${input}`;
    return this.http.get(this.url);
  }
  getEvents (searchInfo: SearchInfo) {
    console.log('getEvents in service ', searchInfo);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/eventsSearch/?keyword=${searchInfo.keyword}&category=${searchInfo.category}&distanceValue=${searchInfo.distanceValue}&distanceUnit=${searchInfo.distanceUnit}&fromLat=${searchInfo.fromLat}&fromLon=${searchInfo.fromLon}&from=${searchInfo.from}`;
    console.log('URL of getEvents in service: ', this.url);
    return this.http.get(this.url);
  }

  getDetail (id) {
    console.log('getDetails in service ', id);
    // this.url = `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3`;
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/detailSearch/${id}`;
    console.log('URL of getDetail in service: ', this.url);
    return this.http.get(this.url);
  }



  getArtists (keyword, category) {
    console.log('get spotify and images: ', keyword, category);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/getArtists/${keyword}/${category}`;
    console.log('URL of getArtists in service: ', this.url);
    return this.http.get(this.url);
  }
  getSpotify (keyword) {
    console.log('getSpotify in service ', keyword);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/spotifyApiCall/${keyword}`;
    console.log('getSpotify in service: ', this.url);
    return this.http.get(this.url);
  }

  getPhotos (keyword) {
    console.log ('getPhotos in service ', keyword);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/googleCustom/${keyword}`;
    console.log('getPhotos in service: ', this.url);

    return this.http.get(this.url);
  }

  getVenue (venue) {
    console.log ('getVenue in service ', venue);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/getVenue/${venue}`;
    return this.http.get(this.url);
  }

  getUpcoming (venue) {
    console.log ('getUpcoming in service ', venue);
    this.url = `http://hw82-env.ewjrypb3kn.us-east-1.elasticbeanstalk.com/getUpcoming/${venue}`;
    return this.http.get(this.url);
  }
}
