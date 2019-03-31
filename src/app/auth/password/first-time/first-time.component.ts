import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { SignupFormInterface } from '../../../models/interfaces/signup-form.interface';
import { AuthStatusCodeEnum } from '../../../models/enums/auth-status-code.enum';

@Component({
  selector: 'app-first-time',
  templateUrl: './first-time.component.html',
  styleUrls: ['./first-time.component.scss']
})
export class FirstTimePasswordComponent {
  newPassword: string;
  confirmPassword: string;
  submissionError: string;
  submitted = false;
  statusMessage: string;
  statusClass: string;
  formErrors: SignupFormInterface = {};

  constructor(private authService: AuthService, private router: Router) { }

  private validateNewPassword() {
    let isValid = true;
    if (this.confirmPassword !== this.newPassword) {
      isValid = false;
      this.formErrors.confirmPassword = 'Confirm password should match new password.';
    }

    return isValid;
  }

  updatePassword(event) {
    // Disable default submission.
    event.preventDefault();
    if (!this.validateNewPassword()) {
      return;
    }
    this.submitted = true;
    this.formErrors = {};
    this.authService.signIn({
      newPassword: this.newPassword
    },
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthStatusCodeEnum.signedIn) {
          this.statusMessage = 'Password change is successful. You will be redirected to signin page within 5 seconds';
          this.statusClass = 'alert-success';
          setTimeout(() => { this.authService.signout(); }, 4000);
          return;
        } else if (statusCode === AuthStatusCodeEnum.uncompletedSignInData) {
          this.router.navigate(['']);
          return;
        } else if (statusCode === AuthStatusCodeEnum.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
