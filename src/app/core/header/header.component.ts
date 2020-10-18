import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {AuthService} from '../../services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
    signedInUserName: string;
    isUserDetailsScreen = false;

    constructor(private router: Router,
                private authService: AuthService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.authService.currentStatus$.pipe(untilDestroyed(this)).subscribe(() => this.updateUserData());

        this.isUserDetailsScreen = this.router.url === '/user-details';
        this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                untilDestroyed(this)
            )
            .subscribe((event: NavigationEnd) => {
                this.isUserDetailsScreen = event.urlAfterRedirects === '/user-details';
            });
    }

    public onSignOut() {
        this.authService.signout();
    }

    private updateUserData() {
        this.authService.getCurrentUser((err, signedInUser) => {
            this.signedInUserName = signedInUser.username;
            this.changeDetector.detectChanges();
        });
    }

    ngOnDestroy(): void {
    }
}
