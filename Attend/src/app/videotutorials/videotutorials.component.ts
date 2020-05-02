import { Component, OnInit } from '@angular/core';
import {VideoObject, YoutubeService} from '../youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videotutorials',
  templateUrl: './videotutorials.component.html',
  styleUrls: ['./videotutorials.component.scss']
})
export class VideotutorialsComponent implements OnInit {
  videoArray: VideoObject[] = [];
  videoAvailable = false;
  results: any;
  searchedCourse: any;
  options: string[] = ['Angular js', 'Angular', 'Node js', 'Mongo DB', 'Express js' , 'Python code' , 'HTML5', 'CSS' , 'Bootstrap'];
  constructor( private youtubeService: YoutubeService , private sanitizer: DomSanitizer) { }
  ngOnInit() {
  }
  searchCourseVideos() {
    this.videoArray = [];
    this.youtubeService.getVideosForChanel(this.searchedCourse).subscribe(data => {
      console.log('video before', this.videoArray);
      this.results = data;
      this.results.items.forEach(item => {
        const obj = new VideoObject();
        obj.title = item.snippet.title;
        obj.videoId = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + item.id.videoId);
        this.videoArray.push(obj);
        if (this.videoArray.length === 10) {
          this.videoAvailable = true;
        }
        console.log('video bhavya abc ghb', this.videoArray);
      })
    });
  }
}
