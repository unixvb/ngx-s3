import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SignupFormInterface } from '../../../models/interfaces/signup-form.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthStatusCodeEnum } from '../../../models/enums/auth-status-code.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotPasswordComponent {

  username: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupFormInterface = {};

  constructor(private authService: AuthService, private router: Router) { }

  forgotPassword($event) {
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();
    this.authService.forgotPassword(this.username,
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthStatusCodeEnum.verificationCodeRequired) {
          this.router.navigate(['/reset-password']);
        } else if (statusCode === AuthStatusCodeEnum.noSuchUser) {
          this.submissionError = 'Email is not valid.';
        } else if (statusCode === AuthStatusCodeEnum.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
