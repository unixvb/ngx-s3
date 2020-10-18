import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../services/auth.service';
import {UserModel} from '../models/user.model';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
    public signedInUser: UserModel;

    constructor(public router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.authService.getCurrentUser((err, user: UserModel) => {
            this.signedInUser = user;

            if (!this.signedInUser || !this.signedInUser.signedIn) {
                this.router.navigate(['/signin']);
                return;
            }

            this.changeDetector.detectChanges();
        });
    }
}
