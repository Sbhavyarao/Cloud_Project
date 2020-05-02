import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { FileService } from '../file.service';
import {saveAs} from 'file-saver';
import Swal from 'sweetalert2';

const uri = 'http://localhost:3000/file/upload';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [FileService]

})
export class CoursesComponent implements OnInit {
  show: boolean;
  uploader: FileUploader = new FileUploader({url:uri});
  attachmentList:any = [];
  constructor( private _fileService: FileService ) {
    this.uploader.onCompleteItem = (item:any, response:any , status:any, headers:any) => {
      this.attachmentList.push(JSON.parse(response));
    }
  }
  ngOnInit() {
    this.show = false;
  }
  /*download(index) {
    var filename = this.attachmentList[index].uploadname;

    this._fileService.downloadFile(filename)
        .subscribe(
            data => saveAs(data, filename),
            error => console.error(error)
        );
  }*/
  upload() {
    Swal.fire({
      type: 'success',
      title: 'Uploaded Successfully',
      timer: 2000
    });
    this.show = true;
    console.log('a');
  }
}
