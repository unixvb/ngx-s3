import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-sign-up-confirm',
    templateUrl: './sign-up-confirm.component.html'
})
export class SignUpConfirmComponent implements OnInit {
    public formGroup: FormGroup;
    public submissionError: string;
    public submitted = false;
    public confirmed = false;

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            code: ['', Validators.required],
        });

        this.authService.getCurrentUser((err, currentSignedInUser) => {
            if (currentSignedInUser && currentSignedInUser.signedIn) {
                this.router.navigate(['/']);
            }
        });

        this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.submitted = false);
    }

    onFormSubmit() {
        if (this.formGroup.valid) {
            this.authService.confirmSignUp(this.formGroup.value.code, (err, result) => {
                if (err) {
                    alert(err);
                } else {
                    this.confirmed = true;
                    this.cd.detectChanges();
                }
            });
        }
    }
}
