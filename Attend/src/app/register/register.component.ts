import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from '../authentication.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public firstName: '';
  public lastName: '';
  public emailId: '';
  public password: '';
  registerForm: FormGroup;
  submitted = false;
  optionSelected: any;
  private result: any;
  constructor(private router: Router, private formBuilder: FormBuilder , private authService: AuthenticationService) { }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get f() { return this.registerForm.controls; }
  selectedValue(val) {
    this.optionSelected = val;
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const userDetails = {
      'firstName': this.registerForm.value.firstName,
      'lastName': this.registerForm.value.lastName,
      'emailId': this.registerForm.value.email,
      'password': this.registerForm.value.password,
      'typeOfUser': this.optionSelected
    };
    this.authService.addUser(userDetails);
    Swal.fire({
      type: 'success',
      title: 'Registered Successfully',
      timer: 2000
    });
    /*if (window.localStorage) {
      localStorage.setItem(userDetails.emailId, JSON.stringify(userDetails));
      Swal.fire({
        type: 'success',
        title: 'Registered Successfully',
        timer: 2000
      });
    }*/
    this.router.navigate(['/login'])
  }
}
