import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public emailId: '';
  public password;
  public result: any;
  public loggedUser: string;
  constructor( private router: Router, private formBuilder: FormBuilder, private authService: AuthenticationService, private appComponent: AppComponent) { }

  loginForm: FormGroup;
  submitted = false;
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  get f() { return this.loginForm.controls; }
  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const userData = {
      email: this.loginForm.value.email ,
      password: this.loginForm.value.password
    }

    this.authService.getUser(userData)
        .subscribe(res => {
           this.loggedUser = res.firstName;
          this.router.navigate(['/']);
        }, (err) => {
          Swal.fire({
            type: 'error',
            title: 'Error in login.Please Check your details',
            timer: 2000
          });
          console.log(err);
        });


    /*this.result = this.authService.getUser(userData);
    console.log('login user data', this.result);
    if (this.result != null ) {
        this.router.navigate(['/']);
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error in login.Please Check your details',
        timer: 2000
      });
    }*/
  }
}
