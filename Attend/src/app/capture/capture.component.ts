import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceRecognitionService } from '../face-recognition.service';
import {AuthenticationService} from '../authentication.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  public imageUrl: any;
  public stream: any;
  public videoFlag: boolean;
  public imageFlag: boolean;
  public loggedUserObj: any;
  public studentFaceId: string;
  public faceId2: string;
  public isIdentical: boolean;
  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  constructor(private renderer: Renderer2 , private faceRecognition: FaceRecognitionService,
              private authenticationService: AuthenticationService , private router: Router) {}

  ngOnInit() {
    this.authenticationService.currentUser().subscribe(res => {
      this.loggedUserObj = res;
      this.studentFaceId = this.loggedUserObj.imageId;
    }, (err) => {
      console.log(err);
    });
    this.videoFlag = true;
    this.imageFlag = false;
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    this.stream = stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }
  stopVideo() {
    if (this.stream.stop) {
      this.stream.stop();
    }
    if (this.stream.getAudioTracks) {
      this.stream.getAudioTracks().forEach((track: any) => {
        track.stop();
      });
    }

    if (this.stream.getVideoTracks) {
      this.stream.getVideoTracks().forEach((track: any) => {
        track.stop();
      });
    }
    document.getElementById('video').style.display = 'none';

  }

  capture() {
    document.getElementById('video').style.display = 'block';
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.imageUrl = this.canvas.nativeElement.toDataURL('image/png');
    const mirror = document.getElementById('mirror');
    this.stopVideo();
    this.imageFlag = true;
    this.faceRecognition.scanImage('d0b264a8e58340079c5a21318bd5f9be', this.imageUrl).subscribe(res => {
      console.log( 'faceId2', res[0].faceId)
      this.faceId2 = res[0].faceId;
      if (this.faceId2) {
        Swal.fire({
          type: 'success',
          title: 'Image Recognized successfully',
          timer: 2000
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  markAttendance() {
    console.log('faceId1', this.studentFaceId);
    console.log('faceId2', this.faceId2);

    if (this.faceId2) {
      this.faceRecognition.verify(this.studentFaceId, this.faceId2, 'd0b264a8e58340079c5a21318bd5f9be').subscribe(res => {
        this.isIdentical = res.isIdentical;
        this.loggedUserObj.Ontime += 1;
        this.authenticationService.updateUser(this.loggedUserObj).subscribe(response => {
          if (this.isIdentical) {
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
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

}
