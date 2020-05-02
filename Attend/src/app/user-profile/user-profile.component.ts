import { Component, OnInit , ElementRef, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import Swal from 'sweetalert2';
import {FaceRecognitionService} from '../face-recognition.service';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  loggedUserObj: any;
  public imageUrl: any;
  public stream: any;
  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  constructor(private router: Router, private renderer: Renderer2 , private faceRecognition: FaceRecognitionService,
              private formBuilder: FormBuilder , private authenticationService: AuthenticationService , public dialog: MatDialog) { }

  ngOnInit() {
    this.authenticationService.currentUser().subscribe(res => {
      this.loggedUserObj = res;
      console.log('logged user' , this.loggedUserObj)
    }, (err) => {
      console.log(err);
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  updateProfile() {
    console.log('update profile')
    this.authenticationService.updateUser(this.loggedUserObj).subscribe(res => {
      Swal.fire({
        type: 'success',
        title: 'User profile updated successfully',
        timer: 2000
      });

      this.router.navigate(['/']);
    }, (err) => {
      console.log(err);
    });
  }
}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleComponent implements OnInit {
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
    this.videoFlag = true;
    this.imageFlag = false;
    this.startCamera();
    this.authenticationService.currentUser().subscribe(res => {
      this.loggedUserObj = res;
      console.log('logged user' , this.loggedUserObj)
    }, (err) => {
      console.log(err);
    });
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
  handleError(error) {
    console.log('Error: ', error);
  }

  cap() {
    document.getElementById('video').style.display = 'block';
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.imageUrl = this.canvas.nativeElement.toDataURL('image/png');
    const mirror = document.getElementById('mirror');
    this.stopVideo();
    this.imageFlag = true;
    this.faceRecognition.scanImage('d0b264a8e58340079c5a21318bd5f9be', this.imageUrl).subscribe(res => {
      this.loggedUserObj.imageId = res[0].faceId;
      this.authenticationService.updateUser(this.loggedUserObj).subscribe(response => {
        Swal.fire({
          type: 'success',
          title: 'Profile Updated successfully',
          timer: 1000
        });
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }


}
