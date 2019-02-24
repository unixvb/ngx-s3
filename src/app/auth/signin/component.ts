import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthStatusCodeEnum } from '../models/auth-status-code.enum';
import { AuthService } from '../service';

@Component({
  selector: 'app-signin',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SigninComponent implements OnInit {
  public formGroup: FormGroup;
  public submissionError: string;
  public submitted = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.authService.setPreviousAppParams(this.router.routerState.snapshot.root.queryParams);
    this.authService.getCurrentUser((err, currentSignedInUser) => {
      if (currentSignedInUser && currentSignedInUser.signedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  onFormSubmit() {
    this.submitted = true;
    this.authService.signIn(this.formGroup.value,
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthStatusCodeEnum.newPasswordRequired) {
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
}
