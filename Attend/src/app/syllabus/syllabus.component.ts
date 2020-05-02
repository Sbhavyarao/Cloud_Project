import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {DatePipe, formatDate} from '@angular/common';
import {AuthenticationService} from '../authentication.service';
import {SyllabusService} from '../syllabus.service';
import {SyllabusArray} from '../dashboard/dashboard.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {

  courseData: string;
  schedulerFlag: boolean;
  syllabusObj: any;
  courseByWeekArray: CourseByWeek[] = [];
  i: number;
  courseScheduledData: string;
  pipe = new DatePipe('en-US');
  public fromDate: Date;
  public toDate: Date ;
  loggedUserObj: any;
  sylArray: SyllabusArr[] = [];

  constructor(private syllabusService: SyllabusService , private router: Router , private authenticationService: AuthenticationService) { }
  ngOnInit() {

    this.authenticationService.currentUser().subscribe(res => {this.loggedUserObj = res;
          console.log('logged user' , this.loggedUserObj);
          this.authenticationService.getUserSyllabus(this.loggedUserObj._id)
              .subscribe(res => {
                if (res.length === 0) {
                  const obj = new CourseByWeek();
                  obj.week = 1;
                  this.courseByWeekArray.push(obj);
                } else {
                  for (let i = 0; i <= res.length; i++) {
                    this.courseByWeekArray.push(res[i].Syllabus[0]);
                  }
                }
                console.log('this.courseByWeekArray', this.courseByWeekArray);
              }, (err) => {
                console.log(err);
              });
        },
        (err) => {console.log(err);
        });
    this.schedulerFlag = false;
  }

  syllabus() {
  console.log('courses: ', this.courseData);
  }
  courseScheduler() {
    console.log( this.schedulerFlag );
    this.schedulerFlag = !this.schedulerFlag;
  }
  addSchedule() {
    console.log(this.courseByWeekArray);
    const myFormattedDate = this.pipe.transform(this.toDate, 'short');
    console.log(myFormattedDate);

    let obj = new SyllabusObj();
    obj.userID = this.loggedUserObj._id;
    obj.syllabusArray = this.courseByWeekArray
    this.syllabusService.addSyllabus(obj)
        .subscribe(res => {
          console.log(res);
        }, (err) => {
          console.log(err);
        });
    this.router.navigate(['/']);
  }
  addNewCourseByWeek() {
    const obj = new CourseByWeek();
    obj.week  = this.courseByWeekArray.length ? this.courseByWeekArray.length + 1 : 1;
    this.courseByWeekArray.push(obj);
  }
  removeCourseByWeek(index) {
    if (this.courseByWeekArray[index] != null) {
      this.courseByWeekArray.splice(index, 1);
    }
    console.log(this.courseByWeekArray);
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
