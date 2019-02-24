import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service';
import { SignupForm } from '../../types';
import { AuthStatusCodeEnum } from '../../models/auth-status-code.enum';

@Component({
  selector: 'app-password',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ForgotPasswordComponent {

  username: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupForm = {};

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
