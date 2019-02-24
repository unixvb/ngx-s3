import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStatusCodeEnum } from '../models/auth-status-code.enum';
import { AuthService } from '../service';
import { SignupForm } from '../types';

@Component({
  selector: 'app-signup',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SignupComponent implements OnInit {

  username: string;
  password: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupForm = {};
  statusMessage: string;
  statusClass: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  signup($event) {
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();

    this.authService.signUp(this.username, this.password,
      (err, statusCode) => {
        this.submitted = false;
        if (err) {
          alert(err.message);
        } else if (statusCode === AuthStatusCodeEnum.newPasswordRequired) {
          this.router.navigate(['/first-time-password']);
        } else if (statusCode === AuthStatusCodeEnum.signedIn) {
          this.router.navigate(['/']);
          return;
        } else if (statusCode === AuthStatusCodeEnum.noSuchUser) {
          this.submissionError = 'Email or password is not valid.';
        } else if (statusCode === AuthStatusCodeEnum.unknownError) {
          this.submissionError = err.message;
        }
      });
  }

  ngOnInit() {
    this.authService.setPreviousAppParams(this.router.routerState.snapshot.root.queryParams);
    this.authService.getCurrentUser((err, currentSignedInUser) => {
      if (currentSignedInUser && currentSignedInUser.signedIn) {
        this.router.navigate(['/']);
      }
    });
  }
}
