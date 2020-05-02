import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap, map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public loggedUser: any;
  public registeredCourses: any;
  constructor(private http: HttpClient) { }
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
  addUser(userData) {
    this.http.post('http://localhost:3000/api/register', userData ).subscribe( data => {
      console.log('register data : ' , data);
    });
  }
  getUser(user): Observable<any> {
    const url = 'http://localhost:3000/api/login';
      this.loggedUser = this.http.post(url, user, httpOptions).pipe(
          map(this.extractData),
          catchError(this.handleError));
    return  this.loggedUser;
  }
  saveCode(code) {
    this.http.post('http://localhost:3000/api/saveCode', code ).subscribe( data => {
      console.log('Code : ' , data);
    });
  }
  getUserSyllabus(userId): Observable<any> {
    const url = 'http://localhost:3000/api/getSyllabusByUserId/' + userId;
    this.registeredCourses = this.http.get(url, httpOptions).pipe(
        map(this.extractData),
        catchError(this.handleError));
    return  this.registeredCourses;
  }
  currentUser(): Observable<any> {
    return this.loggedUser;
  }
  logOutUser() {
    this.loggedUser = null;
    return  this.loggedUser;
  }
  updateUser(user): Observable<any>  {
    const url = 'http://localhost:3000/api/updateProfile';
    return this.http.put(url, user ).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
}
