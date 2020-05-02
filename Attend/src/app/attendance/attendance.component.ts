import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import {SyllabusService} from '../syllabus.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { FaceRecognitionService } from '../face-recognition.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  courseData: string;
  schedulerFlag: boolean;
  code: string;
  studentCode: string;
  faceApiResponse: Observable<FaceRecognitionResponse>;
  subscriptionKey: string;
  i: number;
  faceApiVerifyResponse: Observable<FaceVerificationResponse>;
  pipe = new DatePipe('en-US');
  public fromDate: Date;
  public toDate: Date ;
  loggedUserObj: any;
  imageString = '';


  constructor(private syllabusService: SyllabusService ,
              private router: Router , private faceRecognitionService: FaceRecognitionService,
              private authenticationService: AuthenticationService) { }
  ngOnInit() {
    this.authenticationService.currentUser().subscribe(res => {
      this.loggedUserObj = res;
          console.log('logged user' , this.loggedUserObj);
          },
        (err) => {console.log(err);
        });
    this.schedulerFlag = false;
  }

  generateCode() {
    this.code = 'abc7fr';
  }
  capturePhoto () {
    this.router.navigate(['/capture']);
  }
  markAttendance() {
    if (this.studentCode.length === 6) {
      Swal.fire({
        type: 'success',
        title: 'Attendance marked successfully',
        timer: 2000
      });
      this.router.navigate(['/']);
    } else {
      Swal.fire({
        type: 'error',
        title: 'Please check your code',
        timer: 2000
      });
    }
  }
  syllabus() {
    console.log('courses: ', this.courseData);
  }

}
export class CourseByWeek {
  week: number;
  courses: string;
  fromDate: Date;
  toDate: Date;
}
export class SyllabusObj {
  userID: number ;
  syllabusArray: CourseByWeek[] = [] ;
}
export class SyllabusArr {
  courses: string;
}

