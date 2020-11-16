import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';

import {AuthService} from '../../services/auth.service';
import {AuthStatusCodeEnum} from '../../models/enums/auth-status-code.enum';
import {MatchValidator} from '../validators/match.validator';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignupComponent implements OnInit {
    public formGroup: FormGroup;
    public submissionError: string;
    public submitted = false;

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirm_password: ['', [Validators.required]]
        }, {
            validator: MatchValidator('password', 'confirm_password')
        });

        this.authService.setPreviousAppParams(this.router.routerState.snapshot.root.queryParams);
        this.authService.getCurrentUser((err, currentSignedInUser) => {
            if (currentSignedInUser && currentSignedInUser.signedIn) {
                this.router.navigate(['/']);
            }
        });

        this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.submitted = false);
    }

    onFormSubmit() {
        this.submitted = true;

        if (this.formGroup.valid) {
            this.authService.signUp(this.formGroup.value,
                (err, statusCode) => {
                    this.submitted = false;
                    if (err) {
                        alert(err.message);
                    } else if (statusCode === AuthStatusCodeEnum.newPasswordRequired) {
                        this.router.navigate(['/first-time-password']);
                    } else if (statusCode === AuthStatusCodeEnum.signedIn) {
                        this.router.navigate(['/signup-confirm']);
                        return;
                    } else if (statusCode === AuthStatusCodeEnum.noSuchUser) {
                        this.submissionError = 'Email or password is not valid.';
                    } else if (statusCode === AuthStatusCodeEnum.unknownError) {
                        this.submissionError = err.message;
                    }
                });
        }
    }
}
