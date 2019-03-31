import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SignupFormInterface } from '../../../models/interfaces/signup-form.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthStatusCodeEnum } from '../../../models/enums/auth-status-code.enum';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetPasswordComponent {

  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
  submissionError: string;
  submitted = false;
  formErrors: SignupFormInterface = {};
  statusMessage: string;
  statusClass: string;
  isSuccessful = false;

  constructor(private authService: AuthService, private router: Router) { }

  private validateNewPassword() {
    let isValid = true;
    if (this.confirmPassword !== this.newPassword) {
      isValid = false;
      this.formErrors.confirmPassword = 'Confirm password should match new password.';
    }

    return isValid;
  }

  resetPassword($event) {
    if (!this.validateNewPassword()) {
      return;
    }
    this.submitted = true;
    // Disable default submission.
    $event.preventDefault();
    this.authService.confirmPassword(this.verificationCode, this.newPassword,
      (err, statusCode) => {
        this.submitted = false;
        if (statusCode === AuthStatusCodeEnum.uncompletedSignInData) {
          this.router.navigate(['/forot-password']);
        } else if (statusCode === AuthStatusCodeEnum.success) {
          this.statusMessage = 'Password change is successful. You will be redirected to signin page within 5 seconds';
          this.statusClass = 'alert-success';
          setTimeout(() => { this.authService.signout(); }, 4000);
          return;
        } else if (statusCode === AuthStatusCodeEnum.unknownError) {
          this.submissionError = err.message;
        }
      });
  }
}
