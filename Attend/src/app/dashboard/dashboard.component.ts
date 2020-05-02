import { Component, OnInit , ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import {CourseByWeek} from '../syllabus/syllabus.component';
import {GoogleService} from '../google.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgZone } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    calendarComponent: FullCalendarComponent;
    calendarVisible = true;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    calendarWeekends = true;
    calendarEvents: EventInput[] = [
        { title: 'Exam',  date: '2020-03-20' , rendering: 'background' },
        { title: 'Exam',  date: '2020-03-21' , color : '#FF0000' },
    ];
    loggedUserObj: any;
    displayTopicFlag: string;
    displayFlag: string;
    professor: boolean;
    knowledgeGraphData: any;
    sylArray: SyllabusArray[] = [];
    questionAnswers: RelatedQuestion[] = [];
    relatedTutorials: RelatedTutorials[] = [];
    relatedCertifications: RelatedCertifications[] = [];
    private chart: am4charts.XYChart;
    constructor(private router: Router, private zone: NgZone, private googleService: GoogleService ,
                private formBuilder: FormBuilder , private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.authenticationService.currentUser().subscribe(res => {
            this.loggedUserObj = res;
            if (this.loggedUserObj.typeOfUser === 'Professor') {
                this.professor = true;
            } else {
                this.professor = false;
            }
        }, (err) => {
            console.log(err);
        });
         this.zone.runOutsideAngular(() => {
             let chart = am4core.create("chartdiv", am4charts.XYChart);
             chart.paddingRight = 10;
             let data = [];
             let visits = 10;
             for (let i = 1; i < 366; i++) {
                 visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
                 data.push({date: new Date(2018, 0, i), name: "name" + i, value: visits});
             }

             chart.data = data;

             let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
             dateAxis.renderer.grid.template.location = 0;

             let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
             valueAxis.min = 10;
             valueAxis.max = 100;
             valueAxis.tooltip.disabled = true;
             valueAxis.renderer.minWidth = 35;

             let series = chart.series.push(new am4charts.LineSeries());
             series.dataFields.dateX = "date";
             series.dataFields.valueY = "value";

             series.tooltipText = "{valueY.value}";
             chart.cursor = new am4charts.XYCursor();

             let scrollbarX = new am4charts.XYChartScrollbar();
             scrollbarX.series.push(series);
             chart.scrollbarX = scrollbarX;

             this.chart = chart;
         });
        this.displayFlag = 'false';

    }

    toggleVisible() {
        this.calendarVisible = !this.calendarVisible;
    }

    toggleWeekends() {
        this.calendarWeekends = !this.calendarWeekends;
    }

    gotoPast() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
    }
    dayRender(arg) {
        const today = '3/1/2020';
        console.log(arg.date.toLocaleDateString())
         if (arg.date.toLocaleDateString() === today) {
             arg.el.style.backgroundColor = '#FF0000';
         }
    }
    handleDateClick(arg) {
        if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
            this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
                title: 'New Event',
                start: arg.date,
                allDay: arg.allDay
            })
        }
    }
    getSyllabus() {
        this.displayFlag = 'true';
    }
    getUserSyllabusById(syllabus) {
        this.questionAnswers = [];
        this.relatedTutorials = [];
                this.displayTopicFlag = 'true';
                console.log('topic flag ', this.displayTopicFlag)
                    this.googleService.getDetailsFromKnowledge(syllabus).subscribe(res => {
                        this.knowledgeGraphData = res;
                        console.log('knowledgeGraphData ::  ' , this.knowledgeGraphData);
                            for (let j = 0; j < this.knowledgeGraphData.related_questions.length; j++ ) {
                                let obj = new RelatedQuestion();
                                let s = syllabus;
                                obj.topic = s;
                                obj.question = this.knowledgeGraphData.related_questions[j].question;
                                obj.snippet = this.knowledgeGraphData.related_questions[j].snippet;
                                this.questionAnswers.push(obj);
                            };
                            for (let m = 0; m < this.knowledgeGraphData.organic_results.length; m++ ) {
                                let object = new RelatedTutorials();
                                object.link = this.knowledgeGraphData.organic_results[m].link;
                                object.title = this.knowledgeGraphData.organic_results[m].title;
                                this.relatedTutorials.push(object);
                            }
                        },
                        (err) => {console.log(err);
                        });
                console.log('this.questionAnswers ' , this.questionAnswers);
    }
}
export class SyllabusArray {
    courses: string;
}
export class RelatedQuestion {
    topic: string
    question: string;
    snippet: string;
}

export class RelatedTutorials {
    title: string
    link: string;
}

export class RelatedCertifications {
    title: string
    link: string;
}
