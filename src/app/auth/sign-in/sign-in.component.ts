import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { AuthStatusCodeEnum } from '../../models/enums/auth-status-code.enum';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit {
  public formGroup: FormGroup;
  public submissionError: string;
  public submitted = false;
  public isUserNotConfirmed = false;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef) {
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
    this.changeDetector.detectChanges();
    this.authService.signIn(this.formGroup.value,
      (err, statusCode) => {
        if (statusCode === AuthStatusCodeEnum.newPasswordRequired) {
          this.router.navigate(['/first-time-password']);
        } else if (statusCode === AuthStatusCodeEnum.signedIn) {
          this.router.navigate(['/']);
          return;
        } else if (statusCode === AuthStatusCodeEnum.noSuchUser) {
          this.submissionError = 'Email or password is not valid.';
        } else if (statusCode === AuthStatusCodeEnum.unknownError) {
          this.submissionError = err.message;
          // @ts-ignore
          this.isUserNotConfirmed = err.code === 'UserNotConfirmedException';
        }
        this.submitted = false;
        this.changeDetector.detectChanges();
      });
  }
}
