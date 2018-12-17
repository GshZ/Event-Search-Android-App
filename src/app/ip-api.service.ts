import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpApiService {
  private ipApiUrl = 'http://ip-api.com/json';  // URL to web api

  constructor(private http: HttpClient) { }

  getLoc() {
    console.log('into getloc ip-api in service');
    return this.http.get(this.ipApiUrl);
  }
}
