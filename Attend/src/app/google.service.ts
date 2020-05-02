import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(private httpClient: HttpClient) { }

  getDetailsFromKnowledge(search) {
    debugger;
    const url = 'https://cors-anywhere.herokuapp.com/http://ec2-3-14-146-233.us-east-2.compute.amazonaws.com:5000/get-kg?subject=' + search;
    return this.httpClient.get(url);
  }
}
