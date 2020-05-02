import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {CourseByWeek} from './syllabus/syllabus.component';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  apiKey: string;
  results: any;
  videoArray: VideoObject[] = [];
  constructor(private http: HttpClient) { }
/*
  this.apikey = 'AIzaSyDQONZ6SzacEZR6G5mxg3qfKiS5IORtmRo';
*/
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getVideosForChanel(searchedCourse) {
    const url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjXlYw5wy9J2oMCoNvInx85Pm1sm9CZs0&q=' + searchedCourse +
        '&order=viewCount&part=snippet &type=video&maxResults=10';
    debugger;
    return this.http.get(url).pipe(
        map(this.extractData),
        catchError(this.handleError));
    /*subscribe(data => {
      this.results = data;
      this.results.items.forEach(item => {
        const obj = new VideoObject();
        obj.title = item.snippet.title;
        obj.videoId = item.id.videoId;
        this.videoArray.push(obj);
      })
    });
    return this.videoArray;*/
  }
}

export class VideoObject {
  title: any;
  videoId: any;
}
