import {FormGroup} from '@angular/forms';

export const MatchValidator = (controlName: string, matchingControlName: string) =>
    (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.matchValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({matchValidator: true});
        } else {
            matchingControl.setErrors(null);
        }
    };
